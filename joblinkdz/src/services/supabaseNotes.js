/**
 * SUPABASE INTEGRATION NOTES
 * 
 * This file serves as a roadmap for connecting the frontend to a Supabase backend.
 * 
 * 1. Database Schema (SQL):
 * 
 * CREATE TABLE public.profiles (
 *   id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
 *   full_name text,
 *   email text,
 *   role text CHECK (role IN ('candidate', 'admin')),
 *   phone text,
 *   location text,
 *   created_at timestamp with time zone DEFAULT now()
 * );
 * 
 * CREATE TABLE public.job_offers (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   title text NOT NULL,
 *   company text NOT NULL,
 *   location text NOT NULL,
 *   job_type text,
 *   salary_range text,
 *   description text,
 *   requirements text[],
 *   responsibilities text[],
 *   skills text[],
 *   status text DEFAULT 'active',
 *   created_at timestamp with time zone DEFAULT now()
 * );
 * 
 * CREATE TABLE public.applications (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   candidate_id uuid REFERENCES public.profiles(id),
 *   job_offer_id uuid REFERENCES public.job_offers(id),
 *   status text DEFAULT 'pending',
 *   cv_url text,
 *   cover_message text,
 *   created_at timestamp with time zone DEFAULT now()
 * );
 * 
 * 2. Storage:
 * - Create a public bucket named 'cvs'.
 * - Set policies to allow authenticated users to upload their own files.
 * 
 * 3. Frontend logic:
 * - Use @supabase/supabase-js
 * - Implement real-time subscriptions for application status updates.
 */

export const integrationSteps = [
  "Install @supabase/supabase-js",
  "Initialize client with key/url from environment",
  "Replace fake login in AuthContext",
  "Replace mock data with Supabase RPCs or table selects",
  "Update Apply.tsx to use Supabase Storage"
];
