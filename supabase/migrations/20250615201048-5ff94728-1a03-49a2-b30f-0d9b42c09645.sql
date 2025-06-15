
-- Habilitar RLS en la tabla dive_logs (si no está habilitada)
ALTER TABLE public.dive_logs ENABLE ROW LEVEL SECURITY;

-- Política para que supervisores solo vean sus propias bitácoras
CREATE POLICY "Supervisores pueden ver sus propias bitácoras" ON public.dive_logs
  FOR SELECT TO authenticated 
  USING (supervisor_id = auth.uid());

-- Política para que supervisores solo puedan crear bitácoras para sí mismos
CREATE POLICY "Supervisores pueden crear sus propias bitácoras" ON public.dive_logs
  FOR INSERT TO authenticated 
  WITH CHECK (supervisor_id = auth.uid());

-- Política para que supervisores solo puedan actualizar sus propias bitácoras
CREATE POLICY "Supervisores pueden actualizar sus propias bitácoras" ON public.dive_logs
  FOR UPDATE TO authenticated 
  USING (supervisor_id = auth.uid())
  WITH CHECK (supervisor_id = auth.uid());

-- Política para que supervisores solo puedan eliminar sus propias bitácoras
CREATE POLICY "Supervisores pueden eliminar sus propias bitácoras" ON public.dive_logs
  FOR DELETE TO authenticated 
  USING (supervisor_id = auth.uid());

-- Políticas para administradores (acceso total a bitácoras)
CREATE POLICY "Administradores tienen acceso total a bitácoras" ON public.dive_logs
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Habilitar RLS en la tabla profiles (si no está habilitada)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios puedan ver todos los perfiles (necesario para mostrar supervisores)
CREATE POLICY "Usuarios autenticados pueden ver perfiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Política para que usuarios solo puedan actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles
  FOR UPDATE TO authenticated 
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Política para que administradores tengan acceso total a perfiles
CREATE POLICY "Administradores tienen acceso total a perfiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Actualizar políticas existentes para centers, boats y dive_sites para ser más específicas

-- Eliminar políticas existentes que podrían estar duplicadas
DROP POLICY IF EXISTS "Allow authenticated users to read centers" ON public.centers;
DROP POLICY IF EXISTS "Allow admins to manage centers" ON public.centers;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver los catálogos" ON public.centers;
DROP POLICY IF EXISTS "Los administradores tienen acceso total a los centros" ON public.centers;

-- Nuevas políticas más claras para centers
CREATE POLICY "Usuarios autenticados pueden leer centros" ON public.centers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Solo administradores pueden gestionar centros" ON public.centers
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Eliminar políticas existentes para boats
DROP POLICY IF EXISTS "Allow authenticated users to read boats" ON public.boats;
DROP POLICY IF EXISTS "Allow admins to manage boats" ON public.boats;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver las embarcaciones" ON public.boats;
DROP POLICY IF EXISTS "Los administradores tienen acceso total a las embarcaciones" ON public.boats;

-- Nuevas políticas para boats
CREATE POLICY "Usuarios autenticados pueden leer embarcaciones" ON public.boats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Solo administradores pueden gestionar embarcaciones" ON public.boats
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Eliminar políticas existentes para dive_sites
DROP POLICY IF EXISTS "Allow authenticated users to read dive sites" ON public.dive_sites;
DROP POLICY IF EXISTS "Allow admins to manage dive sites" ON public.dive_sites;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver los puntos de buceo" ON public.dive_sites;
DROP POLICY IF EXISTS "Los administradores tienen acceso total a los puntos de buceo" ON public.dive_sites;

-- Nuevas políticas para dive_sites
CREATE POLICY "Usuarios autenticados pueden leer puntos de buceo" ON public.dive_sites
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Solo administradores pueden gestionar puntos de buceo" ON public.dive_sites
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Eliminar políticas duplicadas existentes para perfiles si existen
DROP POLICY IF EXISTS "Los usuarios pueden ver todos los perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los administradores tienen acceso total a los perfiles" ON public.profiles;

-- Eliminar políticas duplicadas para dive_logs si existen
DROP POLICY IF EXISTS "Los supervisores pueden gestionar sus propias bitácoras" ON public.dive_logs;
DROP POLICY IF EXISTS "Los administradores tienen acceso total a las bitácoras" ON public.dive_logs;
