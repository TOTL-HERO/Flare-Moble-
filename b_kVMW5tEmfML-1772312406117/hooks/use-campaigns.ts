"use client"

import { useState, useCallback } from "react"

// Types
export type AdPlatform = "instagram" | "facebook" | "google" | "tiktok" | "twitter" | "linkedin"
export type AdFormat = "square" | "story" | "landscape" | "portrait"
export type AdStyle = "minimal" | "bold" | "elegant" | "playful" | "professional" | "vintage"
export type AdStatus = "draft" | "active" | "paused" | "completed"

export interface Ad {
  id: string
  name: string
  imageUrl: string
  prompt: string
  platform: AdPlatform
  format: AdFormat
  style: AdStyle
  headline?: string
  cta?: string
  language: string
  createdAt: Date
  status: AdStatus
}

export interface Campaign {
  id: string
  name: string
  description?: string
  ads: Ad[]
  platforms: AdPlatform[]
  status: AdStatus
  budget?: number
  dailyBudget?: number
  startDate?: Date
  endDate?: Date
  targetAudience?: {
    ageMin?: number
    ageMax?: number
    locations?: string[]
    interests?: string[]
  }
  createdAt: Date
  updatedAt: Date
  // Analytics
  impressions: number
  clicks: number
  conversions: number
  spend: number
}

// Sample data
const sampleCampaigns: Campaign[] = [
  {
    id: "camp_1",
    name: "Summer Sale 2024",
    description: "Promote summer collection with 30% discount",
    ads: [],
    platforms: ["instagram", "facebook"],
    status: "active",
    budget: 5000,
    dailyBudget: 250,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    targetAudience: {
      ageMin: 18,
      ageMax: 45,
      locations: ["US", "CA", "UK"],
      interests: ["Fashion", "Shopping", "Lifestyle"],
    },
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date(),
    impressions: 125000,
    clicks: 4500,
    conversions: 320,
    spend: 2150,
  },
  {
    id: "camp_2",
    name: "Product Launch - Pro Series",
    description: "New product line launch campaign",
    ads: [],
    platforms: ["instagram", "tiktok", "google"],
    status: "active",
    budget: 10000,
    dailyBudget: 500,
    startDate: new Date("2024-07-01"),
    targetAudience: {
      ageMin: 25,
      ageMax: 55,
      locations: ["US"],
      interests: ["Technology", "Innovation", "Business"],
    },
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date(),
    impressions: 89000,
    clicks: 3200,
    conversions: 180,
    spend: 3800,
  },
  {
    id: "camp_3",
    name: "Brand Awareness Q3",
    description: "Quarterly brand awareness push",
    ads: [],
    platforms: ["facebook", "linkedin"],
    status: "paused",
    budget: 3000,
    dailyBudget: 150,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date(),
    impressions: 45000,
    clicks: 1200,
    conversions: 45,
    spend: 1100,
  },
]

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const createCampaign = useCallback((campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt" | "impressions" | "clicks" | "conversions" | "spend">) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: `camp_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
    }
    setCampaigns(prev => [newCampaign, ...prev])
    return newCampaign
  }, [])

  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
    ))
  }, [])

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }, [])

  const addAdToCampaign = useCallback((campaignId: string, ad: Ad) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, ads: [...c.ads, ad], updatedAt: new Date() }
        : c
    ))
  }, [])

  const removeAdFromCampaign = useCallback((campaignId: string, adId: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, ads: c.ads.filter(a => a.id !== adId), updatedAt: new Date() }
        : c
    ))
  }, [])

  const pauseCampaign = useCallback((id: string) => {
    updateCampaign(id, { status: "paused" })
  }, [updateCampaign])

  const activateCampaign = useCallback((id: string) => {
    updateCampaign(id, { status: "active" })
  }, [updateCampaign])

  const getCampaignStats = useCallback(() => {
    const active = campaigns.filter(c => c.status === "active").length
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0)
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0)
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
    
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: active,
      totalBudget,
      totalSpend,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCTR: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0",
      avgConversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0",
    }
  }, [campaigns])

  return {
    campaigns,
    selectedCampaign,
    setSelectedCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    addAdToCampaign,
    removeAdFromCampaign,
    pauseCampaign,
    activateCampaign,
    getCampaignStats,
  }
}
