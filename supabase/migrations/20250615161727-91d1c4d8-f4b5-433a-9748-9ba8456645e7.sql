
-- Enable RLS for management tables
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dive_sites ENABLE ROW LEVEL SECURITY;

-- Policies for 'centers' table
CREATE POLICY "Allow authenticated users to read centers" ON public.centers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage centers" ON public.centers
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Policies for 'boats' table
CREATE POLICY "Allow authenticated users to read boats" ON public.boats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage boats" ON public.boats
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Policies for 'dive_sites' table
CREATE POLICY "Allow authenticated users to read dive sites" ON public.dive_sites
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage dive sites" ON public.dive_sites
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');
