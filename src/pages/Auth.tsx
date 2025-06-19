
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from '@/components/login-form';

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 ocean-pattern p-4">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden p-0 glass border-ocean-700">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Formulario de Login */}
            <div className="p-6 md:p-8">
              <LoginForm />
            </div>

            {/* Imagen lateral */}
            <div className="bg-gradient-to-br from-ocean-900 to-ocean-950 relative hidden md:block">
              <div className="absolute inset-0 bg-ocean-pattern opacity-30"></div>
              <img
                src="/lovable-uploads/506c8ef5-d3ad-40c5-b579-ef8d1186e181.png"
                alt="Tecnología marina profesional"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Tecnología Avanzada</h3>
                <p className="text-ocean-200 text-sm">
                  Sistemas digitales profesionales para la gestión integral de operaciones de buceo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer con términos */}
        <div className="text-center text-xs text-ocean-500 mt-6 space-y-2">
          <p>
            Al continuar, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
