import { type NextRequest, NextResponse } from "next/server"
import * as fal from "@fal-ai/serverless-client"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import {
  type AdGenerationRequest,
  type GeneratedAd,
  platformDimensions,
} from "@/lib/types"
import {
  adGenerationSchema,
  parseRequestBody,
  checkRateLimit,
} from "@/lib/validation"

// Clients are initialized lazily inside POST after env-var guards run

function getImageSize(platform: string, format: string): string {
  const platformConfig = platformDimensions[platform as keyof typeof platformDimensions]
  if (!platformConfig) return "square_hd"
  const dims = platformConfig[format as keyof typeof platformConfig]
  if (!dims) return "square_hd"
  const ratio = dims.width / dims.height
  if (ratio > 1.2) return "landscape_16_9"
  if (ratio < 0.8) return "portrait_16_9"
  return "square_hd"
}

const platformContext: Record<string, string> = {
  instagram: "Instagram feed — thumb-stopping scroll, high aesthetic quality, lifestyle-focused",
  facebook: "Facebook ad — trustworthy, clear value proposition, broad audience appeal",
  google: "Google Display — high contrast, clean background, text-readable at small sizes",
  tiktok: "TikTok — bold, energetic, Gen-Z appeal, vibrant and dynamic",
  twitter: "Twitter/X card — punchy, direct, impactful single image",
  linkedin: "LinkedIn — professional, polished, corporate credibility",
}

const formatContext: Record<string, string> = {
  square: "1:1 square, balanced centered composition",
  story: "9:16 vertical full-bleed, subject in upper 2/3, clear space at bottom for text overlay",
  landscape: "16:9 horizontal, wide cinematic composition, subject on left or right third",
  portrait: "4:5 portrait, product or subject centered, slightly compressed vertical frame",
}

// Claude generates the photorealistic visual blueprint
async function buildVisualPromptWithClaude(body: AdGenerationRequest, anthropic: Anthropic): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 450,
    messages: [
      {
        role: "user",
        content: `You are a world-class advertising creative director and AI image prompt engineer.
Create a highly detailed, photorealistic image generation prompt for this advertisement:

Product/Service: ${body.prompt}
Brand: ${body.brandName || "premium brand"}
Platform: ${body.platform} (${platformContext[body.platform] || ""})
Format: ${body.format} (${formatContext[body.format] || ""})
Visual style: ${body.style || "professional"}
${body.headline ? `Headline: "${body.headline}"` : ""}
${body.cta ? `CTA: "${body.cta}"` : ""}
${body.brandColors?.length ? `Brand colors: ${body.brandColors.join(", ")}` : ""}

Write a single photorealistic image generation prompt (150–220 words). Specify:
- Camera setup (lens mm, aperture, e.g. "shot on 85mm f/1.8")
- Lighting (e.g. "golden hour rim lighting", "studio three-point softbox")
- Environment and background
- Composition and depth of field
- Color grading and mood
- Material textures and surface details
- How the product/subject is presented

Make it commercial-grade and photorealistic — like a professional advertising photograph, not an illustration.
Return ONLY the prompt. No preamble, no explanation.`,
      },
    ],
  })
  return msg.content[0].type === "text" ? msg.content[0].text.trim() : body.prompt
}

// OpenAI cross-references and adds commercial impact layers
async function refineWithOpenAI(body: AdGenerationRequest, claudePrompt: string, openai: OpenAI): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 400,
    messages: [
      {
        role: "system",
        content:
          "You are a senior visual advertising strategist who refines AI image prompts. " +
          "Your job: take an existing photorealistic ad prompt and improve it by adding any missing " +
          "commercial impact details — brand atmosphere, emotional tone, visual storytelling, " +
          "audience connection, and platform-specific visual best practices. " +
          "Output ONLY the improved prompt. Do not explain or add preamble.",
      },
      {
        role: "user",
        content: `Refine this ${body.platform} (${body.format}) ad image prompt to maximize photorealism and commercial impact:

"${claudePrompt}"

Cross-reference best practices for ${body.platform} advertising. Add:
- Any missing emotional storytelling cues for the target audience
- Specific photorealistic texture and surface detail descriptors
- Atmosphere and mood reinforcement matching "${body.style || "professional"}" style
- Platform-optimized composition notes for ${body.format} format

Keep it as a single flowing prompt under 280 words. Return ONLY the refined prompt.`,
      },
    ],
  })
  return completion.choices[0]?.message?.content?.trim() || claudePrompt
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimit = checkRateLimit(`generate-ad:${clientIP}`, 20, 60000)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetIn / 1000)),
          },
        }
      )
    }

    // Fail fast with clear messages if keys are missing
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY environment variable is not set" }, { status: 500 })
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY environment variable is not set" }, { status: 500 })
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY environment variable is not set" }, { status: 500 })
    }

    // Initialize clients here, after env-var guards, to avoid build-time errors
    fal.config({ credentials: process.env.FAL_KEY })
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const parseResult = await parseRequestBody(request, adGenerationSchema, 50000)
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 })
    }

    const body = parseResult.data

    // Step 1: Claude builds the photorealistic visual blueprint
    const claudePrompt = await buildVisualPromptWithClaude(body, anthropic)

    // Step 2: OpenAI cross-references and refines for commercial impact
    const finalPrompt = await refineWithOpenAI(body, claudePrompt, openai)

    // Step 3: FLUX.1 Dev — photorealistic image generation
    const imageSize = getImageSize(body.platform, body.format)
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: finalPrompt,
        image_size: imageSize,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      },
    })

    // fal.subscribe returns the raw JSON body directly (no wrapper)
    const imageUrl = (result as { images?: { url: string }[] }).images?.[0]?.url

    if (!imageUrl) {
      throw new Error("No image generated")
    }

    const generatedAd: GeneratedAd = {
      id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageUrl,
      prompt: body.prompt,
      platform: body.platform,
      format: body.format,
      style: body.style || "professional",
      headline: body.headline,
      cta: body.cta,
      createdAt: new Date(),
      language: body.language,
    }

    return NextResponse.json({ success: true, ad: generatedAd })
  } catch (error) {
    console.error("Error generating ad:", error)
    return NextResponse.json({ error: "Failed to generate ad" }, { status: 500 })
  }
}
