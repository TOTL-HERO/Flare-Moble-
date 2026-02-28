-- ─── user_profiles: onboarding + personal fields ──────────────────────────────
ALTER TABLE IF EXISTS public.user_profiles
  ADD COLUMN IF NOT EXISTS full_name             text,
  ADD COLUMN IF NOT EXISTS phone                 text,
  ADD COLUMN IF NOT EXISTS primary_goal          text,
  ADD COLUMN IF NOT EXISTS referral_source       text,
  ADD COLUMN IF NOT EXISTS onboarding_complete   boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_started_at  timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- ─── businesses: extra fields ─────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.businesses
  ADD COLUMN IF NOT EXISTS industry          text,
  ADD COLUMN IF NOT EXISTS team_size         text,
  ADD COLUMN IF NOT EXISTS years_in_business text;

-- ─── activity_log: ensure table exists ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
