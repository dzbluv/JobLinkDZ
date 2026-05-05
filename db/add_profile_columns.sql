-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- This adds the missing columns and reloads the schema cache

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS portfolio_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avatar_initials text,
  ADD COLUMN IF NOT EXISTS avatar_color text;

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Verify columns were added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
