import { handleCors, json } from '../_shared/cors.ts';

const RUNWAY_API_KEY = Deno.env.get('RUNWAY_API_KEY') ?? '';

Deno.serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  // Poll endpoint — GET /:taskId
  const url = new URL(req.url);
  const taskId = url.pathname.split('/').pop();

  if (req.method === 'GET' && taskId && taskId !== 'generate-video') {
    const pollRes = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'X-Runway-Version': '2024-11-06',
      },
    });
    const data = await pollRes.json() as { status: string; output?: string[] };
    return json(data);
  }

  try {
    const body = await req.json() as { selectedImageUrl: string; videoPrompt: string };
    const { selectedImageUrl, videoPrompt } = body;

    const runwayRes = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'X-Runway-Version': '2024-11-06',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gen3a_turbo',
        promptImage: selectedImageUrl,
        promptText: videoPrompt,
        duration: 6,
        ratio: '1280:768',
        watermark: false,
      }),
    });

    if (!runwayRes.ok) {
      const err = await runwayRes.text();
      return json({ error: `Runway API error: ${err}` }, 502);
    }

    const data = await runwayRes.json() as { id: string; status: string };
    return json({ taskId: data.id, status: 'processing' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});
