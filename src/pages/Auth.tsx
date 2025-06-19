
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Anchor } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-900 ocean-pattern p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título mejorado */}
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center">
            <div className="relative bg-gradient-to-br from-ocean-800 to-ocean-900 p-6 rounded-2xl shadow-2xl border border-ocean-700">
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <Anchor className="h-10 w-10 text-gold-400 drop-shadow-lg" />
                  <Waves className="h-5 w-5 text-ocean-300 absolute -bottom-1 -right-1 animate-float" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white leading-tight">Aerocam</h1>
                  <p className="text-ocean-300 text-sm font-medium">Dive Systems</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Sistema de Bitácoras</h2>
            <p className="text-ocean-300 text-sm">Control profesional de operaciones de buceo</p>
          </div>
        </div>

        {/* Tarjeta de autenticación mejorada */}
        <Card className="glass border-ocean-600 shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl text-center text-white font-semibold">
              Acceso al Sistema
            </CardTitle>
            <p className="text-sm text-ocean-300 text-center">
              Ingresa tus credenciales para continuar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <SupabaseAuth
              supabaseClient={supabase}
              view="sign_in"
              showLinks={false}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#D4AF37',
                      brandAccent: '#B8941F',
                      brandButtonText: '#1e293b',
                      defaultButtonBackground: 'transparent',
                      defaultButtonBackgroundHover: 'rgba(212, 175, 55, 0.1)',
                      defaultButtonBorder: '#475569',
                      defaultButtonText: '#e2e8f0',
                      dividerBackground: '#475569',
                      inputBackground: 'rgba(15, 23, 42, 0.7)',
                      inputBorder: '#64748b',
                      inputBorderHover: '#D4AF37',
                      inputBorderFocus: '#D4AF37',
                      inputText: 'white',
                      inputLabelText: '#cbd5e1',
                      inputPlaceholder: '#64748b',
                      messageText: '#e2e8f0',
                      messageTextDanger: '#ef4444',
                      anchorTextColor: '#D4AF37',
                      anchorTextHoverColor: '#F4E4BC',
                    },
                    space: {
                      spaceSmall: '4px',
                      spaceMedium: '8px',
                      spaceLarge: '16px',
                      labelBottomMargin: '10px',
                      anchorBottomMargin: '6px',
                      emailInputSpacing: '6px',
                      socialAuthSpacing: '6px',
                      buttonPadding: '12px 24px',
                      inputPadding: '12px 16px',
                    },
                    fontSizes: {
                      baseBodySize: '14px',
                      baseInputSize: '14px',
                      baseLabelSize: '13px',
                      baseButtonSize: '14px',
                    },
                    fonts: {
                      bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                      labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                    },
                    borderWidths: {
                      buttonBorderWidth: '2px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '8px',
                      buttonBorderRadius: '8px',
                      inputBorderRadius: '8px',
                    },
                  },
                },
                className: {
                  container: 'space-y-6',
                  label: 'text-ocean-200 text-sm font-medium',
                  button: 'w-full bg-gold-gradient hover:opacity-90 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
                  input: 'w-full bg-ocean-950/70 border border-ocean-600 text-white placeholder-ocean-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-200',
                  divider: 'my-6',
                  anchor: 'text-gold-400 hover:text-gold-300 text-sm font-medium underline',
                  message: 'text-sm mt-2',
                },
              }}
              theme="dark"
              redirectTo={`${window.location.origin}/dashboard`}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Correo electrónico',
                    password_label: 'Contraseña',
                    email_input_placeholder: 'Ingresa tu correo electrónico',
                    password_input_placeholder: 'Ingresa tu contraseña',
                    button_label: 'Iniciar Sesión',
                    loading_button_label: 'Iniciando sesión...',
                  },
                  forgotten_password: {
                    email_label: 'Correo electrónico',
                    email_input_placeholder: 'Ingresa tu correo electrónico',
                    button_label: 'Enviar instrucciones',
                    loading_button_label: 'Enviando...',
                    link_text: '¿Olvidaste tu contraseña?',
                    confirmation_text: 'Revisa tu correo para restablecer tu contraseña',
                  },
                  update_password: {
                    password_label: 'Nueva contraseña',
                    password_input_placeholder: 'Ingresa tu nueva contraseña',
                    button_label: 'Actualizar contraseña',
                    loading_button_label: 'Actualizando...',
                    confirmation_text: 'Tu contraseña ha sido actualizada',
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Información de seguridad */}
        <div className="text-center space-y-3">
          <p className="text-ocean-400 text-xs leading-relaxed">
            Sistema certificado para el registro seguro y gestión profesional de bitácoras de buceo
          </p>
          <div className="flex justify-center items-center space-x-6 text-ocean-500 text-xs">
            <div className="flex items-center space-x-1">
              <span>🔒</span>
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🌊</span>
              <span>Certificado</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>📋</span>
              <span>Profesional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
