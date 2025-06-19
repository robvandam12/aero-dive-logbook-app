
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  if (session) {
    navigate('/dashboard');
    return null;
  }

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
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Logo de Aerocam */}
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
            alt="Aerocam Logo" 
            className="h-16 w-16"
          />
          <div>
            <h1 className="text-3xl font-bold bg-ocean-gradient bg-clip-text text-transparent">
              Aerocam
            </h1>
            <p className="text-ocean-300 text-sm">
              Sistema de Bitácoras de Buceo
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
          <p className="text-ocean-300 text-balance">
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
              className="text-sm text-ocean-400 hover:text-ocean-300 underline-offset-2 hover:underline"
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
  );
};
