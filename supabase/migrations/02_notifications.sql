-- Migration: 02_notifications.sql

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  meta jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
CREATE POLICY "Users can view their own notifications." ON public.notifications 
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own notifications (e.g. mark as read)
DROP POLICY IF EXISTS "Users can update their own notifications." ON public.notifications;
CREATE POLICY "Users can update their own notifications." ON public.notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to insert notifications (e.g., when a candidate applies)
DROP POLICY IF EXISTS "Users can insert notifications." ON public.notifications;
CREATE POLICY "Users can insert notifications." ON public.notifications 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
