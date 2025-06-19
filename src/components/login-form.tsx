
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para restablecer la contraseña",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Revisa tu email para restablecer tu contraseña",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <Card className="overflow-hidden border-ocean-700 bg-slate-900/95 backdrop-blur-sm">
      <CardContent className="grid p-0 md:grid-cols-2">
        {/* Formulario de Login */}
        <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Logo de Aerocam */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/bdab85e8-7bf5-4770-9b78-a524545baeee.png" 
                alt="Aerocam Logo" 
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-2xl font-bold bg-ocean-gradient bg-clip-text text-transparent">
                  Aerocam
                </h1>
                <p className="text-ocean-300 text-xs">
                  Sistema de Bitácoras de Buceo
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Bienvenido</h2>
              <p className="text-ocean-300 text-sm">
                Accede a tu cuenta para gestionar bitácoras
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ocean-200">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="bg-ocean-950/50 border-ocean-600 text-white placeholder-ocean-400 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-ocean-200">Contraseña</Label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="text-xs text-ocean-400 hover:text-ocean-300 underline-offset-2 hover:underline"
                >
                  {isResettingPassword ? "Enviando..." : "¿Olvidaste tu contraseña?"}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                className="bg-ocean-950/50 border-ocean-600 text-white placeholder-ocean-400 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-ocean-gradient hover:opacity-90 text-white font-medium py-2.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center space-x-4 text-ocean-400 text-xs">
              <span>🔒 Datos seguros</span>
              <span>🌊 Para profesionales</span>
              <span>📋 Certificado</span>
            </div>
            <p className="text-ocean-500 text-xs">
              Sistema seguro para el registro y gestión de bitácoras de buceo
            </p>
          </div>
        </form>

        {/* Imagen lateral */}
        <div className="bg-gradient-to-br from-ocean-900 to-ocean-950 relative hidden md:block">
          <div className="absolute inset-0 bg-ocean-pattern opacity-30"></div>
          <img
            src="/lovable-uploads/fa9f20fb-eb9a-43dd-9e79-070cb9437c55.png"
            alt="Operaciones de buceo"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-xl font-bold mb-2">Gestión Profesional</h3>
            <p className="text-ocean-200 text-sm">
              Registra y controla todas tus operaciones de buceo con precisión y seguridad.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
