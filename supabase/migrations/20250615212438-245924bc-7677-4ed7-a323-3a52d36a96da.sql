
-- Crear tabla para gestión de usuarios y roles
CREATE TABLE public.user_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'supervisor',
  center_id UUID REFERENCES public.centers(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Habilitar RLS en la tabla de gestión de usuarios
ALTER TABLE public.user_management ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver todos los usuarios
CREATE POLICY "Admins can view all users" 
  ON public.user_management 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Política para que solo admins puedan crear usuarios
CREATE POLICY "Admins can create users" 
  ON public.user_management 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Política para que solo admins puedan actualizar usuarios
CREATE POLICY "Admins can update users" 
  ON public.user_management 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Función para sincronizar usuarios existentes
CREATE OR REPLACE FUNCTION sync_existing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_management (user_id, email, full_name, role, center_id, created_by)
  SELECT 
    p.id,
    au.email,
    p.username,
    p.role,
    p.center_id,
    p.id -- self-created for existing users
  FROM public.profiles p
  JOIN auth.users au ON au.id = p.id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_management um WHERE um.user_id = p.id
  );
END;
$$;

-- Ejecutar la sincronización de usuarios existentes
SELECT sync_existing_users();

-- Trigger para mantener sincronizados los datos de usuario
CREATE OR REPLACE FUNCTION sync_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Actualizar user_management cuando se actualiza profiles
    UPDATE public.user_management 
    SET 
      full_name = NEW.username,
      role = NEW.role,
      center_id = NEW.center_id,
      updated_at = now()
    WHERE user_id = NEW.id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Crear trigger para mantener sincronizados los datos
CREATE TRIGGER sync_user_data_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_data();

-- Añadir columna para trackear quien creó la bitácora (ya existe supervisor_id pero lo renombramos conceptualmente)
COMMENT ON COLUMN public.dive_logs.supervisor_id IS 'ID del usuario supervisor que creó la bitácora';

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_user_management_user_id ON public.user_management(user_id);
CREATE INDEX idx_user_management_role ON public.user_management(role);
CREATE INDEX idx_user_management_center_id ON public.user_management(center_id);
CREATE INDEX idx_dive_logs_supervisor_id ON public.dive_logs(supervisor_id);
