import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, json } from '../_shared/cors.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdWithSeoInput {
  businessName: string;
  service: string;
  city: string;
  state: string;
  offer: string;
  platform: string;
  context?: string;
}

// ─── Claude helper ────────────────────────────────────────────────────────────
async function callClaude(system: string, userMsg: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: userMsg }],
    }),
  });
  if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { content: Array<{ text: string }> };
  return data.content[0]?.text ?? '';
}

// ─── Usage gate ───────────────────────────────────────────────────────────────
async function checkUsage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  action: 'ad' | 'video' | 'seo' | 'brand_wizard'
): Promise<{ allowed: boolean; upgrade_to?: string }> {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  const tier = (profile as { subscription_tier?: string } | null)?.subscription_tier ?? 'free';

  const { data: limits } = await supabase
    .from('plan_limits')
    .select('*')
    .eq('tier', tier)
    .single();

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('ads_generated, videos_generated, seo_packages_generated, brand_wizards_run')
    .eq('user_id', userId)
    .order('period_start', { ascending: false })
    .limit(1)
    .single();

  if (!limits) return { allowed: true };

  const l = limits as { ads_per_month: number; videos_per_month: number };
  const u = (usage as { ads_generated?: number; videos_generated?: number } | null) ?? {};

  const nextTier = tier === 'free' ? 'starter' : tier === 'starter' ? 'pro' : tier === 'pro' ? 'agency' : null;

  if (action === 'ad' && (u.ads_generated ?? 0) >= l.ads_per_month) {
    return { allowed: false, upgrade_to: nextTier ?? 'agency' };
  }
  if (action === 'video' && (u.videos_generated ?? 0) >= l.videos_per_month) {
    return { allowed: false, upgrade_to: nextTier ?? 'agency' };
  }
  return { allowed: true };
}

// ─── Task handlers ────────────────────────────────────────────────────────────
async function generateAdWithSeo(input: AdWithSeoInput): Promise<unknown> {
  const system = `You are a direct-response copywriter and local SEO strategist for home service businesses. You benchmark your own output against real Google Ads data. Always respond with valid JSON only — no markdown, no explanation.`;

  const userMsg = `Generate a complete ad package for this business:
Business: ${input.businessName}
Service: ${input.service}
City: ${input.city}, ${input.state}
Offer: ${input.offer}
Platform: ${input.platform}
${input.context ? `Additional context: ${input.context}` : ''}

Return JSON with this exact structure:
{
  "seo_benchmark": {
    "primary_keyword": string,
    "secondary_keywords": string[],
    "search_intent": "transactional"|"informational"|"navigational",
    "local_modifiers": string[],
    "competition_level": "low"|"medium"|"high",
    "keyword_difficulty_score": number (0-100),
    "benchmark_passed": boolean,
    "benchmark_notes": string
  },
  "ad_copy": {
    "headline_1": string (max 30 chars),
    "headline_2": string (max 30 chars),
    "headline_3": string (max 30 chars),
    "description_1": string (max 90 chars),
    "description_2": string (max 90 chars),
    "long_form_body": string (for Facebook, 3-4 sentences),
    "cta": string
  },
  "visual_brief": {
    "scene_description": string,
    "subject": string,
    "environment": string,
    "emotional_tone": string,
    "text_overlay": string,
    "color_mood": string,
    "avoid": string,
    "image_prompt": string,
    "video_prompt": string
  },
  "accuracy_criteria": {
    "must_show": string[],
    "must_avoid": string[],
    "brand_elements": string[],
    "realism_requirements": string
  }
}`;

  const raw = await callClaude(system, userMsg);
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}

async function benchmarkVisual(imageUrl: string, accuracyCriteria: unknown): Promise<unknown> {
  const system = `You are a visual QA specialist for advertising. Analyze images for ad compliance. Always respond with valid JSON only.`;
  const userMsg = `Analyze this image against these accuracy criteria: ${JSON.stringify(accuracyCriteria)}

Image URL: ${imageUrl}

Return JSON:
{
  "passed": boolean,
  "score": number (0-100),
  "must_show_results": [{ "item": string, "found": boolean, "note": string }],
  "must_avoid_results": [{ "item": string, "found": boolean, "note": string }],
  "overall_assessment": string,
  "recommendation": "approve"|"regenerate"|"use_with_caution"
}`;
  const raw = await callClaude(system, userMsg);
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
}

async function buildBrand(input: {
  businessName: string;
  serviceType: string;
  location: string;
  ownerNotes?: string;
}): Promise<unknown> {
  const system = `You are a brand strategist specializing in home service businesses. Create compelling brand identities. Always respond with valid JSON only.`;
  const userMsg = `Create a complete brand identity for:
Business: ${input.businessName}
Service: ${input.serviceType}
Location: ${input.location}
Owner notes: ${input.ownerNotes ?? 'none'}

Return JSON:
{
  "brand_voice": string,
  "tagline_options": string[] (5 options),
  "brand_story": string (2-3 paragraphs),
  "color_palette": { "primary": string (hex), "secondary": string (hex), "accent": string (hex), "neutral": string (hex), "rationale": string },
  "typography": { "heading_font": string, "body_font": string, "rationale": string },
  "logo_concept_description": string
}`;
  const raw = await callClaude(system, userMsg);
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
}

async function scoreLead(leadData: unknown, serviceType: string): Promise<unknown> {
  const system = `You are a lead qualification specialist for home service businesses. Score leads based on their conversion potential. Always respond with valid JSON only.`;
  const userMsg = `Score this lead for a ${serviceType} business:
Lead data: ${JSON.stringify(leadData)}

Return JSON:
{
  "score": number (0-100),
  "tier": "hot"|"warm"|"cold",
  "reason": string,
  "recommended_action": string
}`;
  const raw = await callClaude(system, userMsg);
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
}

// ─── Embed SEO in ad (headline + description + CTA) ────────────────────────────
interface EmbedSeoInput {
  ad_copy: { headline_1: string; description_1: string; cta: string };
  seo_benchmark: {
    primary_keyword: string;
    local_modifiers: string[];
    competition_level: string;
  };
  city?: string;
  service?: string;
}

async function embedSeoInAd(input: EmbedSeoInput): Promise<{ headline_1: string; description_1: string; cta: string }> {
  const system = `You are an ad copy editor. Rewrite the given ad headline, description, and CTA to embed SEO: use the primary keyword naturally in the headline, add location (city/service) to the description, and add urgency to the CTA (e.g. Today, Now, Fast). Keep headline under 30 chars, description under 90 chars. Always respond with valid JSON only — no markdown.`;
  const userMsg = `Current ad copy:
Headline: ${input.ad_copy.headline_1}
Description: ${input.ad_copy.description_1}
CTA: ${input.ad_copy.cta}

SEO: primary keyword "${input.seo_benchmark.primary_keyword}", local modifiers ${JSON.stringify(input.seo_benchmark.local_modifiers)}. ${input.city ? `Location: ${input.city}` : ''} ${input.service ? `Service: ${input.service}` : ''}

Return JSON:
{
  "headline_1": string (max 30 chars, include primary keyword naturally),
  "description_1": string (max 90 chars, include location if provided),
  "cta": string (add one urgency word: Today, Now, Fast, etc.)
}`;
  const raw = await callClaude(system, userMsg);
  return JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) as { headline_1: string; description_1: string; cta: string };
}

// ─── Entry point ──────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authErr || !user) return json({ error: 'Unauthorized' }, 401);

    const body = await req.json() as { task: string; input: Record<string, unknown> };
    const { task, input } = body;

    // Map task → action for usage gating
    const actionMap: Record<string, 'ad' | 'video' | 'seo' | 'brand_wizard'> = {
      generate_ad_with_seo: 'ad',
      benchmark_visual: 'ad',
      embed_seo_in_ad: 'ad',
      build_brand: 'brand_wizard',
      score_lead: 'seo',
    };
    const action = actionMap[task] ?? 'ad';

    // Check limits
    const { allowed, upgrade_to } = await checkUsage(supabase, user.id, action);
    if (!allowed) {
      return json({ error: 'limit_reached', upgrade_to }, 402);
    }

    let result: unknown;
    let costCents = 0;

    switch (task) {
      case 'generate_ad_with_seo':
        result = await generateAdWithSeo(input as AdWithSeoInput);
        costCents = 8; // ~$0.08 per Claude Opus call
        break;
      case 'benchmark_visual':
        result = await benchmarkVisual(input.imageUrl as string, input.accuracyCriteria);
        costCents = 3;
        break;
      case 'build_brand':
        result = await buildBrand(input as Parameters<typeof buildBrand>[0]);
        costCents = 12;
        break;
      case 'score_lead':
        result = await scoreLead(input.leadData, input.serviceType as string);
        costCents = 2;
        break;
      case 'embed_seo_in_ad':
        result = await embedSeoInAd(input as EmbedSeoInput);
        costCents = 2;
        break;
      default:
        return json({ error: `Unknown task: ${task}` }, 400);
    }

    // Record usage
    await supabase.rpc('increment_usage', {
      p_user_id: user.id,
      p_action: action,
      p_cost_cents: costCents,
    });

    return json({ result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});
