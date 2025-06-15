
-- Insertar datos iniciales en la tabla 'centers'
INSERT INTO public.centers (id, name, location) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Puerto Valparaíso', 'Valparaíso, Chile'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Puerto San Antonio', 'San Antonio, Chile'),
('c3d4e5f6-a7b8-9012-3456-7890abcdefaa', 'Puerto Talcahuano', 'Talcahuano, Chile');

-- Insertar datos iniciales en la tabla 'boats'
INSERT INTO public.boats (name, registration_number, center_id) VALUES
('Pelicano', 'ABC-123', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('Albatros', 'DEF-456', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('Neptuno', 'GHI-789', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0');

-- Insertar datos iniciales en la tabla 'dive_sites'
INSERT INTO public.dive_sites (id, name, location) VALUES
('d1e2f3a4-b5c6-7890-1234-567890abcdef', 'Muelle Prat', 'Valparaíso'),
('e2f3a4b5-c6d7-8901-2345-67890abcdef0', 'Roca Abanico', 'Valparaíso'),
('f3a4b5c6-d7e8-9012-3456-7890abcdefbb', 'Isla Quiriquina', 'Talcahuano');
