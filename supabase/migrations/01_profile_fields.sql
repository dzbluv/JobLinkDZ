-- Add profile enhancement fields to the users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS portfolio_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avatar_initials text,
  ADD COLUMN IF NOT EXISTS avatar_color text;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
