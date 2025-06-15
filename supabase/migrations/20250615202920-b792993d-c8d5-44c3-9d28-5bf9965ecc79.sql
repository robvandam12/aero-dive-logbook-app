
-- Crear tabla de notificaciones
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dive_log_id UUID REFERENCES public.dive_logs(id) ON DELETE SET NULL
);

-- Habilitar Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propias notificaciones
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear notificaciones
CREATE POLICY "Users can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus notificaciones
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar sus notificaciones
CREATE POLICY "Users can delete their own notifications" 
  ON public.notifications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Crear índice para mejorar rendimiento
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
