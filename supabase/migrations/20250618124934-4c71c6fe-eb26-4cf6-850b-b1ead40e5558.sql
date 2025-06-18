
-- Add missing columns to dive_logs table
ALTER TABLE public.dive_logs 
ADD COLUMN IF NOT EXISTS work_type TEXT DEFAULT 'MANTENCIÓN',
ADD COLUMN IF NOT EXISTS work_details TEXT;

-- Add missing columns to profiles table for user settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Santiago',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weekly_reports BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';
