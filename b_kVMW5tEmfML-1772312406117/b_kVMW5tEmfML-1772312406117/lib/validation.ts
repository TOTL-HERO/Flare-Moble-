import { z } from "zod"

// Sanitize string to prevent XSS
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim()
}

// Validate and sanitize prompt input
export function sanitizePrompt(prompt: string): string {
  // Remove any potential injection patterns
  let clean = prompt
    .replace(/[<>{}]/g, "") // Remove special chars
    .replace(/\\/g, "") // Remove backslashes
    .slice(0, 1000) // Limit length
    .trim()
  
  return clean
}

// Platform validation
export const validPlatforms = ["instagram", "facebook", "google", "tiktok", "twitter", "linkedin"] as const
export const validFormats = ["square", "story", "landscape", "portrait"] as const
export const validStyles = ["minimal", "bold", "elegant", "playful", "professional", "vintage"] as const
export const validLanguages = ["en", "es", "fr", "de", "pt"] as const

// Zod schemas for API validation
export const adGenerationSchema = z.object({
  prompt: z.string()
    .min(3, "Prompt must be at least 3 characters")
    .max(1000, "Prompt must be less than 1000 characters")
    .transform(sanitizePrompt),
  brandName: z.string()
    .max(100, "Brand name must be less than 100 characters")
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  brandColors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"))
    .max(5, "Maximum 5 brand colors allowed")
    .optional(),
  style: z.enum(validStyles).optional().default("professional"),
  platform: z.enum(validPlatforms),
  format: z.enum(validFormats),
  language: z.enum(validLanguages).default("en"),
  includeText: z.boolean().optional(),
  headline: z.string()
    .max(150, "Headline must be less than 150 characters")
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  cta: z.string()
    .max(50, "CTA must be less than 50 characters")
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
})

export const variationRequestSchema = z.object({
  originalPrompt: z.string()
    .min(3)
    .max(1000)
    .transform(sanitizePrompt),
  variationType: z.enum(["color", "layout", "copy", "style"]),
  parentAdId: z.string()
    .regex(/^ad_\d+_[a-z0-9]+$/, "Invalid ad ID format"),
  count: z.number()
    .int()
    .min(1)
    .max(5, "Maximum 5 variations allowed"),
})

export const campaignSchema = z.object({
  name: z.string()
    .min(1, "Campaign name is required")
    .max(100, "Campaign name must be less than 100 characters")
    .transform(sanitizeString),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  platforms: z.array(z.enum(validPlatforms))
    .min(1, "At least one platform is required")
    .max(6),
  budget: z.number()
    .min(0, "Budget cannot be negative")
    .max(1000000, "Budget cannot exceed 1,000,000")
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export const publishRequestSchema = z.object({
  adId: z.string()
    .regex(/^ad_\d+_[a-z0-9]+$/, "Invalid ad ID format"),
  campaignId: z.string()
    .regex(/^camp_\d+_[a-z0-9]+$/, "Invalid campaign ID format")
    .optional(),
  platforms: z.array(z.enum(validPlatforms))
    .min(1, "At least one platform is required")
    .max(6),
  imageUrl: z.string().url("Invalid image URL"),
  headline: z.string()
    .max(150)
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  description: z.string()
    .max(500)
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  cta: z.string()
    .max(50)
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined),
  targetAudience: z.object({
    ageMin: z.number().int().min(13).max(65).optional(),
    ageMax: z.number().int().min(13).max(65).optional(),
    locations: z.array(z.string().max(100)).max(50).optional(),
    interests: z.array(z.string().max(100)).max(50).optional(),
  }).optional(),
  budget: z.object({
    daily: z.number().min(1).max(100000).optional(),
    total: z.number().min(1).max(1000000).optional(),
  }).optional(),
  schedule: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).optional(),
})

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetIn: windowMs }
  }
  
  if (record.count >= limit) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: record.resetTime - now 
    }
  }
  
  record.count++
  return { 
    allowed: true, 
    remaining: limit - record.count, 
    resetIn: record.resetTime - now 
  }
}

// Validate content type
export function validateContentType(contentType: string | null): boolean {
  return contentType?.includes("application/json") ?? false
}

// Parse and validate request body with size limit
export async function parseRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>,
  maxSize: number = 10000 // 10KB default
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    // Check content type
    if (!validateContentType(request.headers.get("content-type"))) {
      return { success: false, error: "Invalid content type" }
    }
    
    // Check content length
    const contentLength = request.headers.get("content-length")
    if (contentLength && parseInt(contentLength) > maxSize) {
      return { success: false, error: "Request body too large" }
    }
    
    const body = await request.json()
    const result = schema.safeParse(body)
    
    if (!result.success) {
      const errorMessage = result.error.errors
        .map(e => `${e.path.join(".")}: ${e.message}`)
        .join(", ")
      return { success: false, error: errorMessage }
    }
    
    return { success: true, data: result.data }
  } catch {
    return { success: false, error: "Invalid JSON body" }
  }
}
