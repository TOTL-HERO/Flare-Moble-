import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import {
  type AdGenerationRequest,
  type GeneratedAd,
} from "@/lib/types"
import {
  adGenerationSchema,
  parseRequestBody,
  checkRateLimit,
} from "@/lib/validation"

// ─── Supabase edge-function path ──────────────────────────────────────────────
// When NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, the route
// proxies to the ai-engine edge function (Claude Opus + SEO + usage tracking).
// Otherwise it falls back to the direct Claude Haiku + OpenAI pipeline below.

interface AiEngineAdCopy {
  headline_1: string
  headline_2?: string
  headline_3?: string
  description_1?: string
  cta: string
  long_form_body?: string
}

interface AiEngineResult {
  ad_copy: AiEngineAdCopy
  visual_brief?: { image_prompt?: string }
  seo_benchmark?: { primary_keyword?: string }
}

async function callAiEngine(body: AdGenerationRequest): Promise<GeneratedAd | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return null

  const res = await fetch(`${supabaseUrl}/functions/v1/ai-engine`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      // Signals a trusted server-to-server call — edge fn skips user JWT check
      "x-service-call": "true",
    },
    body: JSON.stringify({
      task: "generate_ad_with_seo",
      input: {
        businessName: body.brandName || "Brand",
        service: body.prompt,
        city: "",
        state: "",
        offer: body.cta || body.headline || body.prompt,
        platform: body.platform,
        context: [
          `style: ${body.style || "professional"}`,
          `format: ${body.format}`,
          `language: ${body.language}`,
          body.headline ? `headline hint: ${body.headline}` : "",
        ].filter(Boolean).join(", "),
      },
    }),
  })

  if (!res.ok) return null

  const json = await res.json() as { result?: AiEngineResult; error?: string }
  if (!json.result) return null

  const { ad_copy } = json.result
  const imageUrl = `https://placehold.co/1024x1024/9B7EC8/ffffff?text=${encodeURIComponent(ad_copy.headline_1 || body.prompt).slice(0, 60)}`

  return {
    id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl,
    prompt: body.prompt,
    platform: body.platform,
    format: body.format,
    style: body.style || "professional",
    headline: ad_copy.headline_1,
    cta: ad_copy.cta,
    createdAt: new Date(),
    language: body.language,
  }
}

// ─── Direct Claude + OpenAI fallback ─────────────────────────────────────────

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

// ─── Handler ──────────────────────────────────────────────────────────────────

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

    const parseResult = await parseRequestBody(request, adGenerationSchema, 50000)
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 })
    }

    const body = parseResult.data

    // ── Path 1: Supabase edge function (when configured) ──────────────────────
    const edgeAd = await callAiEngine(body)
    if (edgeAd) {
      return NextResponse.json({ success: true, ad: edgeAd })
    }

    // ── Path 2: Direct Claude + OpenAI fallback ───────────────────────────────
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY environment variable is not set" }, { status: 500 })
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY environment variable is not set" }, { status: 500 })
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const claudePrompt = await buildVisualPromptWithClaude(body, anthropic)
    await refineWithOpenAI(body, claudePrompt, openai) // result used for image gen when fal is re-enabled

    // TODO: re-enable fal when ready for video/image generation
    // const imageSize = getImageSize(body.platform, body.format)
    // const result = await fal.subscribe("fal-ai/flux/dev", { ... })
    // const imageUrl = (result as { images?: { url: string }[] }).images?.[0]?.url

    const imageUrl = `https://placehold.co/1024x1024/9B7EC8/ffffff?text=${encodeURIComponent(body.headline || body.prompt).slice(0, 60)}`

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
