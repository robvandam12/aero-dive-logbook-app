
-- Add missing fields to dive_logs table for complete PDF support
ALTER TABLE public.dive_logs 
ADD COLUMN IF NOT EXISTS supervisor_license TEXT,
ADD COLUMN IF NOT EXISTS center_manager TEXT,
ADD COLUMN IF NOT EXISTS center_assistant TEXT,
ADD COLUMN IF NOT EXISTS weather_good BOOLEAN,
ADD COLUMN IF NOT EXISTS weather_conditions TEXT DEFAULT 'Buen tiempo',
ADD COLUMN IF NOT EXISTS compressor_1 TEXT,
ADD COLUMN IF NOT EXISTS compressor_2 TEXT,
ADD COLUMN IF NOT EXISTS work_order_number TEXT,
ADD COLUMN IF NOT EXISTS start_time TEXT,
ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Update the profiles table to remove unused notification fields
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS email_notifications,
DROP COLUMN IF EXISTS push_notifications,
DROP COLUMN IF EXISTS weekly_reports,
DROP COLUMN IF EXISTS language;
