-- Flare Studio: save/load canvas projects
CREATE TABLE IF NOT EXISTS public.studio_projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id   uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  name          text NOT NULL DEFAULT 'Untitled Ad',
  platform      text NOT NULL,
  elements      jsonb NOT NULL DEFAULT '[]',
  ad_copy       jsonb,
  seo_data      jsonb,
  thumbnail_url text,
  status        text NOT NULL DEFAULT 'draft',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own studio projects"
  ON public.studio_projects FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own studio projects"
  ON public.studio_projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own studio projects"
  ON public.studio_projects FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own studio projects"
  ON public.studio_projects FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_studio_projects_user_id ON public.studio_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_projects_updated_at ON public.studio_projects(updated_at DESC);
