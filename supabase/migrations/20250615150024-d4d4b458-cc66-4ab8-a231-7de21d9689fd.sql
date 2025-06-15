
-- 1. Creamos un tipo de dato personalizado para los roles de usuario.
CREATE TYPE public.user_role AS ENUM ('admin', 'supervisor');

-- 2. Creamos la tabla para los centros de buceo.
CREATE TABLE public.centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Creamos la tabla para las embarcaciones.
CREATE TABLE public.boats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  registration_number TEXT,
  center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Creamos la tabla para los puntos de buceo.
CREATE TABLE public.dive_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Creamos la tabla de perfiles para ampliar la información de los usuarios de Supabase.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'supervisor',
  center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL
);

-- 6. Creamos una función y un disparador (trigger) para que cada vez que un usuario se registre,
--    se cree automáticamente su perfil en nuestra tabla `profiles`.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Creamos la tabla principal: las bitácoras de buceo.
CREATE TABLE public.dive_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supervisor_id UUID NOT NULL REFERENCES public.profiles(id),
  center_id UUID NOT NULL REFERENCES public.centers(id),
  boat_id UUID REFERENCES public.boats(id),
  dive_site_id UUID NOT NULL REFERENCES public.dive_sites(id),
  departure_time TIME,
  arrival_time TIME,
  weather_conditions TEXT,
  observations TEXT,
  divers_manifest JSONB,
  signature_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Activamos la Seguridad a Nivel de Fila (Row Level Security - RLS) para todas nuestras tablas.
--    Esto es crucial para proteger los datos.
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dive_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dive_logs ENABLE ROW LEVEL SECURITY;

-- 9. Creamos una función auxiliar para obtener el rol de un usuario de forma segura.
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- 10. Definimos las políticas de seguridad (quién puede ver y hacer qué).
-- Políticas para Perfiles:
CREATE POLICY "Los usuarios pueden ver todos los perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Los administradores tienen acceso total a los perfiles" ON public.profiles FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Políticas para Catálogos (Centros, Barcos, Puntos de Buceo):
CREATE POLICY "Usuarios autenticados pueden ver los catálogos" ON public.centers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Los administradores tienen acceso total a los centros" ON public.centers FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Usuarios autenticados pueden ver las embarcaciones" ON public.boats FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Los administradores tienen acceso total a las embarcaciones" ON public.boats FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Usuarios autenticados pueden ver los puntos de buceo" ON public.dive_sites FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Los administradores tienen acceso total a los puntos de buceo" ON public.dive_sites FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Políticas para Bitácoras de Buceo:
CREATE POLICY "Los supervisores pueden gestionar sus propias bitácoras" ON public.dive_logs FOR ALL USING (auth.uid() = supervisor_id);
CREATE POLICY "Los administradores tienen acceso total a las bitácoras" ON public.dive_logs FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- 11. Creamos los "buckets" en Supabase Storage para guardar archivos.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('signatures', 'signatures', true),
  ('documents', 'documents', true);

-- 12. Definimos políticas de seguridad para el almacenamiento de archivos.
CREATE POLICY "Usuarios autenticados pueden subir firmas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'signatures');

CREATE POLICY "Usuarios pueden ver sus propias firmas"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'signatures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuarios autenticados pueden leer documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Administradores tienen acceso total a todos los archivos"
ON storage.objects FOR ALL
TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

