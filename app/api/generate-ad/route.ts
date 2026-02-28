import { type NextRequest, NextResponse } from "next/server"
import * as fal from "@fal-ai/serverless-client"
import {
  type AdGenerationRequest,
  type GeneratedAd,
  platformDimensions,
  stylePrompts
} from "@/lib/types"
import { 
  adGenerationSchema, 
  parseRequestBody, 
  checkRateLimit 
} from "@/lib/validation"

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY,
})

// Map format to fal image size
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

// Build enhanced prompt for ad generation
function buildAdPrompt(request: AdGenerationRequest): string {
  const parts: string[] = []
  
  // Base prompt
  parts.push(`Professional advertisement image: ${request.prompt}`)
  
  // Add brand context
  if (request.brandName) {
    parts.push(`for brand "${request.brandName}"`)
  }
  
  // Add style
  const styleDescription = stylePrompts[request.style || "professional"]
  parts.push(styleDescription)
  
  // Add platform-specific optimizations
  const platformHints: Record<string, string> = {
    instagram: "Instagram-optimized, visually stunning, scroll-stopping",
    facebook: "Facebook ad style, engaging, shareable",
    google: "Google Display ad, clear messaging, high contrast",
    tiktok: "TikTok style, trendy, youthful, dynamic",
    twitter: "Twitter ad format, concise, impactful",
    linkedin: "LinkedIn professional ad, business-focused, credible",
  }
  parts.push(platformHints[request.platform] || "")
  
  // Add text overlay instructions if needed
  if (request.includeText && request.headline) {
    parts.push(`featuring headline text: "${request.headline}"`)
  }
  if (request.cta) {
    parts.push(`with call-to-action: "${request.cta}"`)
  }
  
  // Add brand colors if provided
  if (request.brandColors && request.brandColors.length > 0) {
    parts.push(`using brand colors: ${request.brandColors.join(", ")}`)
  }
  
  // Add language context
  if (request.language !== "en") {
    const languageNames: Record<string, string> = {
      es: "Spanish",
      fr: "French",
      de: "German",
      pt: "Portuguese",
    }
    parts.push(`text in ${languageNames[request.language] || request.language}`)
  }
  
  // Quality boosters
  parts.push("high quality, professional photography, commercial advertisement, 8k resolution")
  
  return parts.filter(Boolean).join(", ")
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - use IP or a user identifier
    const clientIP = request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimit = checkRateLimit(`generate-ad:${clientIP}`, 20, 60000) // 20 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetIn / 1000)),
          }
        }
      )
    }
    
    // Validate and sanitize request body
    const parseResult = await parseRequestBody(request, adGenerationSchema, 50000)
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error },
        { status: 400 }
      )
    }
    
    const body = parseResult.data
    
    // Build enhanced prompt
    const enhancedPrompt = buildAdPrompt(body)
    
    // Get appropriate image size
    const imageSize = getImageSize(body.platform, body.format)
    
    // Generate image using fal
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: enhancedPrompt,
        image_size: imageSize,
        num_inference_steps: 4,
        num_images: 1,
      },
    })
    
    // Extract image URL
    const imageUrl = (result as { images?: { url: string }[] }).images?.[0]?.url
    
    if (!imageUrl) {
      throw new Error("No image generated")
    }
    
    // Create ad object
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
    
    return NextResponse.json({ 
      success: true, 
      ad: generatedAd 
    })
    
  } catch (error) {
    console.error("Error generating ad:", error)
    return NextResponse.json(
      { error: "Failed to generate ad" },
      { status: 500 }
    )
  }
}
