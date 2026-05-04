-- Initial Supabase Schema for theSIproject

-- Clean up existing tables safely to prevent column mismatch errors from older schemas
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Create the `users` profile table
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'candidate',
  phone text,
  location text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.users;
CREATE POLICY "Users can view their own profile." ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile." ON public.users;
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. Create the `jobs` table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  salary text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL,
  posted_at text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Jobs are public." ON public.jobs;
CREATE POLICY "Jobs are public." ON public.jobs FOR SELECT USING (true);

-- 3. Create the `applications` table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  resume_url text,
  cover_letter text,
  applied_at text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own applications." ON public.applications;
CREATE POLICY "Users can view their own applications." ON public.applications FOR SELECT USING (auth.uid() = user_id);

-- 4. Create the `companies` table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  open_jobs integer DEFAULT 0,
  logo text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Companies are public." ON public.companies;
CREATE POLICY "Companies are public." ON public.companies FOR SELECT USING (true);

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

