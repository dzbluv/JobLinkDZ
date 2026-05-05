-- Run this in your Supabase SQL Editor to fix application visibility and actions

-- 1. Allow candidates to insert their own applications
DROP POLICY IF EXISTS "Candidates can create applications." ON public.applications;
CREATE POLICY "Candidates can create applications." ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. Allow recruiters to view all applications
DROP POLICY IF EXISTS "Recruiters can view all applications." ON public.applications;
CREATE POLICY "Recruiters can view all applications." ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- 3. Allow recruiters to update application statuses
DROP POLICY IF EXISTS "Recruiters can update applications." ON public.applications;
CREATE POLICY "Recruiters can update applications." ON public.applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- 4. Allow candidates to upload their resumes to the storage bucket
DROP POLICY IF EXISTS "Candidates can upload resumes" ON storage.objects;
CREATE POLICY "Candidates can upload resumes" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Allow recruiters to view and download resumes from the storage bucket
DROP POLICY IF EXISTS "Recruiters can view resumes" ON storage.objects;
CREATE POLICY "Recruiters can view resumes" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Note: The existing policy "Users can view their own applications." already allows 
-- candidates to see the applications they've submitted, so we don't need to change that.

-- 6. Allow recruiters to view candidate profiles (for joins in application views)
DROP POLICY IF EXISTS "Recruiters can view user profiles." ON public.users;
CREATE POLICY "Recruiters can view user profiles." ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
