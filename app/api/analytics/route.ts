import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/validation"

// Analytics data types
interface TimeSeriesData {
  date: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
}

interface PlatformMetrics {
  platform: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
}

interface CampaignMetrics {
  id: string
  name: string
  status: "active" | "paused" | "completed"
  spend: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  conversionRate: number
  change: number
}

interface AnalyticsResponse {
  summary: {
    totalSpend: number
    totalImpressions: number
    totalClicks: number
    totalConversions: number
    avgCTR: number
    avgCPC: number
    avgConversionRate: number
    roas: number
    spendChange: number
    impressionsChange: number
    clicksChange: number
    conversionsChange: number
  }
  timeSeries: TimeSeriesData[]
  byPlatform: PlatformMetrics[]
  topCampaigns: CampaignMetrics[]
}

// Generate mock time series data
function generateTimeSeriesData(days: number): TimeSeriesData[] {
  const data: TimeSeriesData[] = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Add some variance to make data realistic
    const baseSpend = 150 + Math.random() * 100
    const baseImpressions = 5000 + Math.random() * 3000
    const ctr = 0.025 + Math.random() * 0.015
    const conversionRate = 0.08 + Math.random() * 0.06
    
    data.push({
      date: date.toISOString().split("T")[0],
      spend: Math.round(baseSpend * 100) / 100,
      impressions: Math.round(baseImpressions),
      clicks: Math.round(baseImpressions * ctr),
      conversions: Math.round(baseImpressions * ctr * conversionRate),
    })
  }
  
  return data
}

// Generate platform breakdown data
function generatePlatformData(): PlatformMetrics[] {
  return [
    {
      platform: "instagram",
      spend: 1250.50,
      impressions: 42000,
      clicks: 1260,
      conversions: 98,
      ctr: 3.0,
      cpc: 0.99,
      roas: 3.2,
    },
    {
      platform: "facebook",
      spend: 980.25,
      impressions: 35000,
      clicks: 945,
      conversions: 72,
      ctr: 2.7,
      cpc: 1.04,
      roas: 2.8,
    },
    {
      platform: "google",
      spend: 720.00,
      impressions: 18000,
      clicks: 540,
      conversions: 45,
      ctr: 3.0,
      cpc: 1.33,
      roas: 2.5,
    },
    {
      platform: "tiktok",
      spend: 450.75,
      impressions: 28000,
      clicks: 980,
      conversions: 35,
      ctr: 3.5,
      cpc: 0.46,
      roas: 2.1,
    },
  ]
}

// Generate top campaigns data
function generateTopCampaigns(): CampaignMetrics[] {
  return [
    {
      id: "camp_1",
      name: "Summer Sale 2024",
      status: "active",
      spend: 2150,
      impressions: 125000,
      clicks: 4500,
      conversions: 320,
      ctr: 3.6,
      conversionRate: 7.1,
      change: 15.2,
    },
    {
      id: "camp_2",
      name: "Product Launch - Pro",
      status: "active",
      spend: 3800,
      impressions: 89000,
      clicks: 3200,
      conversions: 180,
      ctr: 3.6,
      conversionRate: 5.6,
      change: 8.4,
    },
    {
      id: "camp_3",
      name: "Brand Awareness Q3",
      status: "paused",
      spend: 1100,
      impressions: 45000,
      clicks: 1200,
      conversions: 45,
      ctr: 2.7,
      conversionRate: 3.75,
      change: -2.1,
    },
    {
      id: "camp_4",
      name: "Retargeting - Cart",
      status: "active",
      spend: 890,
      impressions: 32000,
      clicks: 1800,
      conversions: 156,
      ctr: 5.6,
      conversionRate: 8.7,
      change: 22.5,
    },
  ]
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting for analytics
    const clientIP = request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimit = checkRateLimit(`analytics:${clientIP}`, 60, 60000) // 60 per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "7d"
    const campaignId = searchParams.get("campaignId")
    
    // Validate range parameter
    const validRanges = ["24h", "7d", "30d", "90d"]
    if (!validRanges.includes(range)) {
      return NextResponse.json(
        { error: "Invalid range parameter" },
        { status: 400 }
      )
    }
    
    // Validate campaignId format if provided
    if (campaignId && !/^camp_\d+_[a-z0-9]+$/.test(campaignId)) {
      return NextResponse.json(
        { error: "Invalid campaign ID format" },
        { status: 400 }
      )
    }
    
    // Determine days from range
    const daysMap: Record<string, number> = {
      "24h": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }
    const days = daysMap[range] || 7
    
    // Generate data
    const timeSeries = generateTimeSeriesData(days)
    const byPlatform = generatePlatformData()
    const topCampaigns = generateTopCampaigns()
    
    // Calculate summary from time series
    const totalSpend = timeSeries.reduce((sum, d) => sum + d.spend, 0)
    const totalImpressions = timeSeries.reduce((sum, d) => sum + d.impressions, 0)
    const totalClicks = timeSeries.reduce((sum, d) => sum + d.clicks, 0)
    const totalConversions = timeSeries.reduce((sum, d) => sum + d.conversions, 0)
    
    const response: AnalyticsResponse = {
      summary: {
        totalSpend: Math.round(totalSpend * 100) / 100,
        totalImpressions,
        totalClicks,
        totalConversions,
        avgCTR: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
        avgCPC: totalClicks > 0 ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0,
        avgConversionRate: totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 10000) / 100 : 0,
        roas: 3.2, // Would calculate from actual revenue data
        spendChange: 12.5,
        impressionsChange: 24.3,
        clicksChange: 18.2,
        conversionsChange: 32.1,
      },
      timeSeries,
      byPlatform,
      topCampaigns: campaignId 
        ? topCampaigns.filter(c => c.id === campaignId)
        : topCampaigns,
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

// A/B Test performance endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, testId } = body
    
    if (action === "compare") {
      // Compare A/B test variants
      const comparison = {
        testId,
        variants: [
          {
            id: "variant_a",
            name: "Original",
            impressions: 15000,
            clicks: 450,
            conversions: 38,
            ctr: 3.0,
            conversionRate: 8.4,
            confidence: 0.92,
          },
          {
            id: "variant_b",
            name: "New Headline",
            impressions: 15200,
            clicks: 520,
            conversions: 48,
            ctr: 3.4,
            conversionRate: 9.2,
            confidence: 0.88,
          },
        ],
        winner: "variant_b",
        improvement: 13.3,
        statisticalSignificance: true,
      }
      
      return NextResponse.json(comparison)
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    
  } catch (error) {
    console.error("Error processing analytics request:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
