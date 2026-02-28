import { handleCors, json } from '../_shared/cors.ts';

const FAL_API_KEY = Deno.env.get('FAL_API_KEY') ?? '';

interface VisualBrief {
  image_prompt: string;
  environment: string;
  color_mood: string;
  avoid: string;
}

interface AccuracyCriteria {
  must_show: string[];
  must_avoid: string[];
}

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const body = await req.json() as { visualBrief: VisualBrief; accuracyCriteria?: AccuracyCriteria };
    const { visualBrief, accuracyCriteria } = body;

    const positivePrompt = [
      visualBrief.image_prompt,
      'photorealistic, professional photography, 8k resolution, commercial advertising quality',
      'shot on Canon EOS R5, natural lighting, sharp focus',
      visualBrief.environment,
      visualBrief.color_mood,
    ].filter(Boolean).join(', ');

    const negativePrompt = [
      'cartoon, illustration, clipart, watermark, text overlay, logo, amateur, blurry',
      'distorted, deformed, low quality, jpeg artifacts, oversaturated',
      ...(accuracyCriteria?.must_avoid ?? []),
      visualBrief.avoid,
    ].filter(Boolean).join(', ');

    const falRes = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: positivePrompt,
        negative_prompt: negativePrompt,
        image_size: 'landscape_16_9',
        num_images: 4,
        guidance_scale: 8,
        num_inference_steps: 40,
        enable_safety_checker: true,
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return json({ error: `FAL API error: ${err}` }, 502);
    }

    const falData = await falRes.json() as { images: Array<{ url: string }> };

    return json({
      images: falData.images.map((img) => img.url),
      prompt_used: positivePrompt,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});
