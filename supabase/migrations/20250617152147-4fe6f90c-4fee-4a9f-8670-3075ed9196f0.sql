
-- 1. Agregar tabla para códigos únicos de firmas
CREATE TABLE public.signature_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dive_log_id UUID REFERENCES public.dive_logs(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signature_url TEXT,
  user_id UUID NOT NULL
);

-- 2. Agregar columna para permitir multi-centro en user_management
ALTER TABLE public.user_management 
ADD COLUMN allow_multi_center BOOLEAN NOT NULL DEFAULT false;

-- 3. Crear tabla para logs de actividad/trazabilidad
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dive_log_id UUID REFERENCES public.dive_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'signed', 'exported', 'emailed', 'invalidated'
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Agregar columna de estado a dive_logs para invalidación
ALTER TABLE public.dive_logs 
ADD COLUMN status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'signed', 'invalidated'
ADD COLUMN invalidated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN invalidated_by UUID,
ADD COLUMN invalidation_reason TEXT;

-- 5. Crear tabla para tokens de invitación
CREATE TABLE public.invitation_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  user_data JSONB NOT NULL, -- datos del usuario pre-llenados
  created_by UUID NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Habilitar RLS en las nuevas tablas
ALTER TABLE public.signature_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_tokens ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS básicas
CREATE POLICY "Users can view their own signature codes" 
  ON public.signature_codes FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create signature codes" 
  ON public.signature_codes FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view activity logs for their dive logs" 
  ON public.activity_logs FOR SELECT 
  USING (user_id = auth.uid() OR dive_log_id IN (
    SELECT id FROM public.dive_logs WHERE supervisor_id = auth.uid()
  ));

CREATE POLICY "Users can create activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage invitation tokens" 
  ON public.invitation_tokens FOR ALL 
  USING (created_by = auth.uid());
