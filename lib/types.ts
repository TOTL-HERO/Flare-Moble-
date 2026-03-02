// Ad Generation Types
export type AdPlatform = "instagram" | "facebook" | "google" | "tiktok" | "twitter" | "linkedin"
export type AdFormat = "square" | "story" | "landscape" | "portrait"
export type AdStyle = "minimal" | "bold" | "elegant" | "playful" | "professional" | "vintage"
export type AdStatus = "draft" | "active" | "paused" | "completed"

export interface AdGenerationRequest {
  prompt: string
  brandName?: string
  brandColors?: string[]
  style?: AdStyle
  platform: AdPlatform
  format: AdFormat
  language: string
  includeText?: boolean
  headline?: string
  cta?: string
}

export interface GeneratedAd {
  id: string
  imageUrl: string
  prompt: string
  platform: AdPlatform
  format: AdFormat
  style: AdStyle
  headline?: string
  cta?: string
  createdAt: Date
  language: string
}

export interface AdVariation {
  id: string
  parentAdId: string
  imageUrl: string
  variationType: "color" | "layout" | "copy" | "style"
  createdAt: Date
}

export interface Campaign {
  id: string
  name: string
  description?: string
  ads: GeneratedAd[]
  platforms: AdPlatform[]
  status: AdStatus
  budget?: number
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Platform-specific dimensions
export const platformDimensions: Record<AdPlatform, Record<AdFormat, { width: number; height: number }>> = {
  instagram: {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    landscape: { width: 1080, height: 566 },
    portrait: { width: 1080, height: 1350 },
  },
  facebook: {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    landscape: { width: 1200, height: 628 },
    portrait: { width: 1080, height: 1350 },
  },
  google: {
    square: { width: 1200, height: 1200 },
    story: { width: 300, height: 600 },
    landscape: { width: 1200, height: 628 },
    portrait: { width: 300, height: 250 },
  },
  tiktok: {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 },
  },
  twitter: {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    landscape: { width: 1600, height: 900 },
    portrait: { width: 1080, height: 1350 },
  },
  linkedin: {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    landscape: { width: 1200, height: 627 },
    portrait: { width: 1080, height: 1350 },
  },
}

// Style prompts for different ad styles
export const stylePrompts: Record<AdStyle, string> = {
  minimal: "clean, minimalist design, lots of white space, simple typography, modern aesthetic",
  bold: "vibrant colors, bold typography, high contrast, eye-catching, dynamic composition",
  elegant: "sophisticated, luxury feel, refined typography, subtle gradients, premium aesthetic",
  playful: "fun, colorful, whimsical, creative illustrations, friendly and approachable",
  professional: "corporate, trustworthy, clean lines, business-appropriate, authoritative",
  vintage: "retro aesthetic, nostalgic, classic typography, muted colors, timeless appeal",
}
