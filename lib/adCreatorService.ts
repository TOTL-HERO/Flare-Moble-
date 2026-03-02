/**
 * adCreatorService.ts
 * All AI calls for the Ad Creator. Keys are never exposed to the client.
 * In production: replace fetch() calls with supabase.functions.invoke()
 * and store ANTHROPIC_API_KEY / FAL_KEY as Supabase secrets.
 */

export interface AdCopy {
  headline: string;
  subheadline: string;
  body: string;
  cta: string;
  trust_signal: string;
  image_prompt: string;
}

export interface GenerateCopyParams {
  industry: string;
  style: string;
  platform: string;
  brandName: string;
  offer?: string;
}

export interface GenerateImageParams {
  imagePrompt: string;
  format: string;
}

export const INDUSTRIES: Record<string, {
  label: string;
  badge: string;
  palette: { bg: string; accent: string; shimmer: string };
  imageStyle: string;
  urgency: string;
  seasonal: string;
  keywords: string[];
  statLine: string;
}> = {
  plumbing: {
    label: 'Plumbing',
    badge: '💧',
    palette: { bg: '#0d1f35', accent: '#3b9ede', shimmer: '#1a3a5c' },
    imageStyle: 'close-up of licensed plumber repairing copper pipes under a kitchen sink, water droplets glistening, professional uniform, dramatic workshop lighting, photorealistic',
    urgency: 'A small leak can become a $10,000 disaster.',
    seasonal: 'Winter pipes freezing? Act before they burst.',
    keywords: ['leaks', 'drains', 'water heater', 'pipe burst', 'emergency service'],
    statLine: 'Available 24/7 for emergencies',
  },
  hvac: {
    label: 'HVAC',
    badge: '❄️',
    palette: { bg: '#0a1a2e', accent: '#00b4d8', shimmer: '#023e8a' },
    imageStyle: 'HVAC technician on rooftop installing air conditioning unit, blue sky, professional uniform, technical tools and ductwork visible, commercial photography quality',
    urgency: "Don't sweat another summer without working AC.",
    seasonal: 'Get your furnace tuned before the first freeze hits.',
    keywords: ['AC repair', 'furnace tune-up', 'air quality', 'heating system', 'cooling'],
    statLine: 'Same-day AC repair available',
  },
  roofing: {
    label: 'Roofing',
    badge: '🏠',
    palette: { bg: '#1a0a00', accent: '#e07b39', shimmer: '#3d1a00' },
    imageStyle: 'roofing crew installing new shingles on residential home, aerial drone shot, clear blue sky, professional safety equipment, neighborhood below',
    urgency: 'One bad storm can cost you everything overhead.',
    seasonal: 'Spring storm season is here — is your roof ready?',
    keywords: ['storm damage', 'roof leak', 'shingle replacement', 'free inspection', 'gutters'],
    statLine: 'Free storm damage inspection',
  },
  electrical: {
    label: 'Electrical',
    badge: '⚡',
    palette: { bg: '#111118', accent: '#ffd60a', shimmer: '#1a1a2e' },
    imageStyle: 'licensed electrician working on residential panel upgrade, professional tools, safety gear, warm interior lighting, photorealistic commercial photography',
    urgency: 'Faulty wiring is the #1 cause of house fires.',
    seasonal: 'Older home? An inspection could save your family.',
    keywords: ['panel upgrade', 'wiring safety', 'EV charger install', 'breaker issues', 'code compliance'],
    statLine: 'Licensed & insured, all work guaranteed',
  },
  landscaping: {
    label: 'Landscaping',
    badge: '🌿',
    palette: { bg: '#0a1f0a', accent: '#7ab648', shimmer: '#1a3d1a' },
    imageStyle: 'lush perfectly manicured residential lawn with symmetrical garden beds, irrigation running, golden hour light, wide angle, professional landscaping portfolio quality',
    urgency: 'Your yard is your first impression — make it count.',
    seasonal: 'Spring cleanup slots are filling fast — book now.',
    keywords: ['lawn care', 'landscape design', 'irrigation', 'mulching', 'seasonal cleanup'],
    statLine: 'Instant online quotes available',
  },
  pest: {
    label: 'Pest Control',
    badge: '🛡️',
    palette: { bg: '#1a1000', accent: '#d4a017', shimmer: '#2e1f00' },
    imageStyle: 'professional pest control technician in uniform treating home foundation perimeter, protective gear, residential neighborhood, daylight, trustworthy appearance',
    urgency: 'Termites cause $5B in damage every year.',
    seasonal: 'Spring = pest season. Protect before they move in.',
    keywords: ['termite treatment', 'rodent control', 'quarterly plan', 'free inspection', 'prevention'],
    statLine: 'Quarterly protection plans available',
  },
};

export const PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',   abbr: 'FB', color: '#1877F2', lightBg: '#dbeafe', tip: 'Best for homeowners 35–60' },
  { id: 'google',    label: 'Google Ads', abbr: 'G',  color: '#4285F4', lightBg: '#e0e7ff', tip: 'High-intent search traffic' },
  { id: 'instagram', label: 'Instagram',  abbr: 'IG', color: '#E1306C', lightBg: '#fce7f3', tip: 'Visual-first, before/after' },
  { id: 'nextdoor',  label: 'Nextdoor',   abbr: 'ND', color: '#00b246', lightBg: '#dcfce7', tip: 'Hyper-local neighbors' },
];

export const FORMATS = [
  { id: 'square',    label: 'Square',    ratio: '1:1',  falSize: 'square_hd',      tw: 1,    th: 1,    desc: 'Highest feed engagement' },
  { id: 'story',     label: 'Story',     ratio: '9:16', falSize: 'portrait_16_9',  tw: 0.56, th: 1,    desc: 'Full-screen immersion' },
  { id: 'landscape', label: 'Landscape', ratio: '16:9', falSize: 'landscape_16_9', tw: 1,    th: 0.56, desc: 'Banner & cover placements' },
  { id: 'portrait',  label: 'Portrait',  ratio: '4:5',  falSize: 'portrait_4_3',   tw: 0.8,  th: 1,    desc: 'High scroll-stop rate' },
];

export const STYLES = [
  { id: 'bold',         label: 'Bold',        emoji: '⚡', desc: 'High contrast — stops the scroll' },
  { id: 'professional', label: 'Professional', emoji: '🏆', desc: 'Trust-building — drives call-ins' },
  { id: 'urgent',       label: 'Urgent',       emoji: '🔥', desc: 'Problem-driven — creates urgency to act' },
  { id: 'friendly',     label: 'Friendly',     emoji: '👋', desc: 'Neighborly tone — community feel' },
];

export async function flareGenerateCopy(params: GenerateCopyParams): Promise<AdCopy | null> {
  const { industry, style, platform, brandName, offer } = params;
  const ind = INDUSTRIES[industry];
  if (!ind) return null;

  const systemPrompt = `You are a direct-response ad copywriter for blue-collar home service businesses.
You write ads that get real homeowners to call or click immediately.
STRICT INDUSTRY RULES — never cross industry lines:
- HVAC: only AC, furnace, heating, cooling, air quality, temperature comfort
- Plumbing: only pipes, leaks, drains, water heater, clogs, water pressure
- Roofing: only shingles, storm damage, gutters, flashing, roof inspection
- Electrical: only wiring, panels, breakers, outlets, EV chargers, fire safety
- Landscaping: only lawn, mulch, irrigation, trimming, design, curb appeal
- Pest Control: only termites, rodents, bugs, treatment plans, inspections
Return ONLY valid compact JSON. No markdown, no explanation, no code fences.`;

  const userPrompt = `Write an ad:
Business: ${brandName || ind.label + ' Pro'}
Industry: ${ind.label}
Keywords pool: ${ind.keywords.join(', ')}
Platform: ${platform}
Ad style: ${style}
Urgency hook: "${ind.urgency}"
Seasonal hook: "${ind.seasonal}"
Offer: ${offer || 'none specified'}
Return exactly: {"headline":"max 8 words naming a ${ind.label.toLowerCase()} service","subheadline":"max 14 words specific benefit","body":"1-2 sentences mentioning ${ind.keywords[0]} or ${ind.keywords[1]}","cta":"3-5 word button text","trust_signal":"license years rating or guarantee","image_prompt":"detailed photorealistic image generation prompt showing: ${ind.imageStyle}. Tone: ${style}. No text no logos no watermarks."}`;

  try {
    // PRODUCTION: replace with supabase.functions.invoke('generate-ad-copy', { body: { systemPrompt, userPrompt } })
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
    if (!resp.ok) throw new Error(`Claude API ${resp.status}`);
    const data = await resp.json();
    const raw = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '{}';
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as AdCopy;
  } catch (err) {
    console.error('[Flare] Copy generation failed:', err);
    return null;
  }
}

export async function flareGenerateImage(params: GenerateImageParams): Promise<string | null> {
  const { imagePrompt, format } = params;
  const dimMap: Record<string, { w: number; h: number }> = {
    square:    { w: 800, h: 800 },
    story:     { w: 450, h: 800 },
    landscape: { w: 800, h: 450 },
    portrait:  { w: 640, h: 800 },
  };
  const { w, h } = dimMap[format] ?? dimMap.square;
  try {
    // PRODUCTION: replace with supabase.functions.invoke('generate-ad-image', { body: { prompt: imagePrompt, width: w, height: h } })
    // DEV FALLBACK: Unsplash Source (no key, industry-matched photography)
    const query = encodeURIComponent(imagePrompt.split(' ').slice(0, 4).join(' '));
    return `https://source.unsplash.com/${w}x${h}/?${query}&sig=${Date.now()}`;
  } catch (err) {
    console.error('[Flare] Image generation failed:', err);
    return null;
  }
}
