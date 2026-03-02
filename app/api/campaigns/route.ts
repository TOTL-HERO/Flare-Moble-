import { type NextRequest, NextResponse } from "next/server"
import { campaignSchema, parseRequestBody, checkRateLimit, sanitizeString } from "@/lib/validation"

// In-memory store (would be replaced with database in production)
const campaigns = new Map()

export async function GET() {
  try {
    const allCampaigns = Array.from(campaigns.values())
    return NextResponse.json({ campaigns: allCampaigns })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimit = checkRateLimit(`campaigns-create:${clientIP}`, 30, 60000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      )
    }
    
    // Validate request body
    const parseResult = await parseRequestBody(request, campaignSchema, 10000)
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error },
        { status: 400 }
      )
    }
    
    const body = parseResult.data
    
    const campaign = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
    }
    
    campaigns.set(campaign.id, campaign)
    
    return NextResponse.json({ 
      success: true, 
      campaign 
    })
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id || !campaigns.has(id)) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }
    
    const existing = campaigns.get(id)
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    campaigns.set(id, updated)
    
    return NextResponse.json({ 
      success: true, 
      campaign: updated 
    })
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id || !campaigns.has(id)) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }
    
    campaigns.delete(id)
    
    return NextResponse.json({ 
      success: true,
      message: "Campaign deleted" 
    })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    )
  }
}
