
import { LoginForm } from '@/components/login-form';

const Auth = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 ocean-pattern">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
        
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
