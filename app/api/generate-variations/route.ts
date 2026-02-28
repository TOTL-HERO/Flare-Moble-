import { type NextRequest, NextResponse } from "next/server"
import * as fal from "@fal-ai/serverless-client"
import { type AdVariation, stylePrompts, type AdStyle } from "@/lib/types"
import { checkRateLimit } from "@/lib/validation"

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY,
})

interface VariationRequest {
  originalPrompt: string
  variationType: "color" | "layout" | "copy" | "style"
  parentAdId: string
  count?: number
  newStyle?: AdStyle
  newColors?: string[]
}

// Modify prompt based on variation type
function buildVariationPrompt(
  originalPrompt: string, 
  variationType: string,
  options?: { newStyle?: AdStyle; newColors?: string[] }
): string {
  const basePrompt = originalPrompt
  
  switch (variationType) {
    case "color":
      if (options?.newColors && options.newColors.length > 0) {
        return `${basePrompt}, using color palette: ${options.newColors.join(", ")}, vibrant and eye-catching`
      }
      return `${basePrompt}, alternative color scheme, different color palette while maintaining design integrity`
    
    case "layout":
      return `${basePrompt}, alternative composition and layout, different visual arrangement, varied element positioning`
    
    case "copy":
      return `${basePrompt}, different text placement, alternative headline positioning, varied typography layout`
    
    case "style":
      if (options?.newStyle) {
        return `${basePrompt}, ${stylePrompts[options.newStyle]}`
      }
      return `${basePrompt}, alternative artistic style, different visual treatment`
    
    default:
      return basePrompt
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimit = checkRateLimit(`generate-variations:${clientIP}`, 10, 60000)

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

    const body: VariationRequest = await request.json()
    
    if (!body.originalPrompt || !body.parentAdId) {
      return NextResponse.json(
        { error: "Original prompt and parent ad ID are required" },
        { status: 400 }
      )
    }
    
    const count = Math.min(body.count || 3, 4) // Max 4 variations at once
    const variations: AdVariation[] = []
    
    // Generate variations in parallel
    const promises = Array.from({ length: count }, async (_, index) => {
      const variationPrompt = buildVariationPrompt(
        body.originalPrompt, 
        body.variationType,
        { newStyle: body.newStyle, newColors: body.newColors }
      )
      
      // Add variation seed for diversity
      const promptWithVariation = `${variationPrompt}, variation ${index + 1}, unique interpretation`
      
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: promptWithVariation,
          image_size: "square_hd",
          num_inference_steps: 4,
          num_images: 1,
          seed: Date.now() + index * 1000, // Different seed for each variation
        },
      })
      
      // fal.subscribe returns { data: Output, requestId }
      const output = (result as { data?: { images?: { url: string }[] } }).data
      const imageUrl = output?.images?.[0]?.url
      
      if (imageUrl) {
        return {
          id: `var_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
          parentAdId: body.parentAdId,
          imageUrl,
          variationType: body.variationType,
          createdAt: new Date(),
        } as AdVariation
      }
      return null
    })
    
    const results = await Promise.all(promises)
    variations.push(...results.filter((v): v is AdVariation => v !== null))
    
    return NextResponse.json({
      success: true,
      variations,
    })
    
  } catch (error) {
    console.error("Error generating variations:", error)
    return NextResponse.json(
      { error: "Failed to generate variations" },
      { status: 500 }
    )
  }
}
