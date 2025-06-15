
-- Agregar la columna supervisor_name a la tabla dive_logs
ALTER TABLE public.dive_logs 
ADD COLUMN supervisor_name text;
