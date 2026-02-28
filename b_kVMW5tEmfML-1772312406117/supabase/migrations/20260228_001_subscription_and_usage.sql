-- ─── Extend user_profiles ───────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.user_profiles
  ADD COLUMN IF NOT EXISTS subscription_tier   text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS stripe_customer_id  text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS current_period_start timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS current_period_end   timestamptz DEFAULT (now() + interval '30 days');

-- ─── usage_tracking ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start             timestamptz NOT NULL DEFAULT now(),
  period_end               timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  ads_generated            integer NOT NULL DEFAULT 0,
  videos_generated         integer NOT NULL DEFAULT 0,
  seo_packages_generated   integer NOT NULL DEFAULT 0,
  brand_wizards_run        integer NOT NULL DEFAULT 0,
  estimated_api_cost_cents integer NOT NULL DEFAULT 0,
  updated_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage" ON public.usage_tracking
  USING (true) WITH CHECK (true);

-- ─── plan_limits ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plan_limits (
  tier             text PRIMARY KEY,
  ads_per_month    integer NOT NULL,
  videos_per_month integer NOT NULL,
  ad_accounts      integer NOT NULL,
  video_enabled    boolean NOT NULL DEFAULT false,
  watermark        boolean NOT NULL DEFAULT true
);

INSERT INTO public.plan_limits (tier, ads_per_month, videos_per_month, ad_accounts, video_enabled, watermark) VALUES
  ('free',    3,   0,  1, false, true),
  ('starter', 15,  0,  1, false, false),
  ('pro',     40,  20, 3, true,  false),
  ('agency',  150, 75, 10, true,  false)
ON CONFLICT (tier) DO UPDATE SET
  ads_per_month    = EXCLUDED.ads_per_month,
  videos_per_month = EXCLUDED.videos_per_month,
  ad_accounts      = EXCLUDED.ad_accounts,
  video_enabled    = EXCLUDED.video_enabled,
  watermark        = EXCLUDED.watermark;

ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read plan_limits" ON public.plan_limits FOR SELECT USING (true);

-- ─── increment_usage ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id   uuid,
  p_action    text,   -- 'ad' | 'video' | 'seo' | 'brand_wizard'
  p_cost_cents integer DEFAULT 0
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_period_start timestamptz;
  v_period_end   timestamptz;
BEGIN
  -- Use the user's current billing period if available
  SELECT current_period_start, current_period_end
    INTO v_period_start, v_period_end
    FROM public.user_profiles
   WHERE id = p_user_id;

  v_period_start := COALESCE(v_period_start, date_trunc('month', now()));
  v_period_end   := COALESCE(v_period_end,   date_trunc('month', now()) + interval '1 month');

  INSERT INTO public.usage_tracking (user_id, period_start, period_end)
    VALUES (p_user_id, v_period_start, v_period_end)
    ON CONFLICT DO NOTHING;

  UPDATE public.usage_tracking
     SET ads_generated            = ads_generated            + CASE WHEN p_action = 'ad'           THEN 1 ELSE 0 END,
         videos_generated         = videos_generated         + CASE WHEN p_action = 'video'         THEN 1 ELSE 0 END,
         seo_packages_generated   = seo_packages_generated   + CASE WHEN p_action = 'seo'           THEN 1 ELSE 0 END,
         brand_wizards_run        = brand_wizards_run        + CASE WHEN p_action = 'brand_wizard'  THEN 1 ELSE 0 END,
         estimated_api_cost_cents = estimated_api_cost_cents + p_cost_cents,
         updated_at               = now()
   WHERE user_id = p_user_id
     AND period_start = v_period_start;
END;
$$;

-- ─── reset_monthly_usage ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reset_monthly_usage(
  p_stripe_subscription_id text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
    FROM public.user_profiles
   WHERE stripe_subscription_id = p_stripe_subscription_id
   LIMIT 1;

  IF v_user_id IS NULL THEN RETURN; END IF;

  UPDATE public.usage_tracking
     SET ads_generated            = 0,
         videos_generated         = 0,
         seo_packages_generated   = 0,
         brand_wizards_run        = 0,
         estimated_api_cost_cents = 0,
         period_start             = now(),
         period_end               = now() + interval '30 days',
         updated_at               = now()
   WHERE user_id = v_user_id;
END;
$$;
