
-- Add missing environmental condition columns to dive_logs table
ALTER TABLE public.dive_logs 
ADD COLUMN water_temperature numeric,
ADD COLUMN visibility numeric,
ADD COLUMN current_strength numeric;

-- Add comments for clarity
COMMENT ON COLUMN public.dive_logs.water_temperature IS 'Water temperature in Celsius';
COMMENT ON COLUMN public.dive_logs.visibility IS 'Underwater visibility in meters';
COMMENT ON COLUMN public.dive_logs.current_strength IS 'Current strength scale (0-5)';
