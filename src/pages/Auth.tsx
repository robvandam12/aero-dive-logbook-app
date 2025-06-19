
import { supabase } from '@/integrations/supabase/client';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Ship, Anchor } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background ocean-pattern p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo y título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <div className="relative">
              <Ship className="h-8 w-8 text-ocean-400 animate-float" />
              <Waves className="h-4 w-4 text-ocean-300 absolute -bottom-1 -right-1" />
            </div>
            <Anchor className="h-6 w-6 text-gold-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Aerocam</h1>
            <p className="text-ocean-300 text-sm mt-1">Sistema de Bitácoras de Buceo</p>
          </div>
        </div>

        {/* Tarjeta de autenticación */}
        <Card className="glass border-ocean-700">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-white">
              Iniciar Sesión
            </CardTitle>
            <p className="text-sm text-ocean-300 text-center">
              Accede a tu cuenta para gestionar bitácoras
            </p>
          </CardHeader>
          <CardContent>
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#0ea5e9',
                      brandAccent: '#0284c7',
                      brandButtonText: 'white',
                      defaultButtonBackground: 'transparent',
                      defaultButtonBackgroundHover: 'rgba(14, 165, 233, 0.1)',
                      defaultButtonBorder: '#334155',
                      defaultButtonText: '#e2e8f0',
                      dividerBackground: '#334155',
                      inputBackground: 'rgba(15, 23, 42, 0.5)',
                      inputBorder: '#475569',
                      inputBorderHover: '#0ea5e9',
                      inputBorderFocus: '#0ea5e9',
                      inputText: 'white',
                      inputLabelText: '#cbd5e1',
                      inputPlaceholder: '#64748b',
                      messageText: '#e2e8f0',
                      messageTextDanger: '#ef4444',
                      anchorTextColor: '#0ea5e9',
                      anchorTextHoverColor: '#38bdf8',
                    },
                    space: {
                      spaceSmall: '4px',
                      spaceMedium: '8px',
                      spaceLarge: '16px',
                      labelBottomMargin: '8px',
                      anchorBottomMargin: '4px',
                      emailInputSpacing: '4px',
                      socialAuthSpacing: '4px',
                      buttonPadding: '10px 15px',
                      inputPadding: '10px 15px',
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
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '6px',
                      buttonBorderRadius: '6px',
                      inputBorderRadius: '6px',
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  label: 'text-ocean-200 text-sm font-medium',
                  button: 'w-full bg-ocean-gradient hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200',
                  input: 'w-full bg-ocean-950/50 border border-ocean-600 text-white placeholder-ocean-400 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent',
                  divider: 'my-4',
                  anchor: 'text-ocean-400 hover:text-ocean-300 text-sm underline',
                  message: 'text-sm',
                },
              }}
              theme="dark"
              providers={['google', 'github']}
              redirectTo={`${window.location.origin}/dashboard`}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Correo electrónico',
                    password_label: 'Contraseña',
                    email_input_placeholder: 'Tu correo electrónico',
                    password_input_placeholder: 'Tu contraseña',
                    button_label: 'Iniciar sesión',
                    loading_button_label: 'Iniciando sesión...',
                    social_provider_text: 'Continuar con {{provider}}',
                    link_text: '¿Ya tienes una cuenta? Inicia sesión',
                  },
                  sign_up: {
                    email_label: 'Correo electrónico',
                    password_label: 'Contraseña',
                    email_input_placeholder: 'Tu correo electrónico',
                    password_input_placeholder: 'Tu contraseña',
                    button_label: 'Registrarse',
                    loading_button_label: 'Registrándose...',
                    social_provider_text: 'Continuar con {{provider}}',
                    link_text: '¿No tienes una cuenta? Regístrate',
                    confirmation_text: 'Revisa tu correo para confirmar tu cuenta',
                  },
                  magic_link: {
                    email_input_label: 'Correo electrónico',
                    email_input_placeholder: 'Tu correo electrónico',
                    button_label: 'Enviar enlace mágico',
                    loading_button_label: 'Enviando enlace mágico...',
                    link_text: 'Enviar un enlace mágico por correo',
                    confirmation_text: 'Revisa tu correo para acceder con el enlace mágico',
                  },
                  forgotten_password: {
                    email_label: 'Correo electrónico',
                    password_label: 'Contraseña',
                    email_input_placeholder: 'Tu correo electrónico',
                    button_label: 'Enviar instrucciones',
                    loading_button_label: 'Enviando instrucciones...',
                    link_text: '¿Olvidaste tu contraseña?',
                    confirmation_text: 'Revisa tu correo para restablecer tu contraseña',
                  },
                  update_password: {
                    password_label: 'Nueva contraseña',
                    password_input_placeholder: 'Tu nueva contraseña',
                    button_label: 'Actualizar contraseña',
                    loading_button_label: 'Actualizando contraseña...',
                    confirmation_text: 'Tu contraseña ha sido actualizada',
                  },
                  verify_otp: {
                    email_input_label: 'Correo electrónico',
                    email_input_placeholder: 'Tu correo electrónico',
                    phone_input_label: 'Número de teléfono',
                    phone_input_placeholder: 'Tu número de teléfono',
                    token_input_label: 'Token',
                    token_input_placeholder: 'Tu token OTP',
                    button_label: 'Verificar token',
                    loading_button_label: 'Verificando...',
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="text-center space-y-2">
          <p className="text-ocean-400 text-xs">
            Sistema seguro para el registro y gestión de bitácoras de buceo
          </p>
          <div className="flex justify-center items-center space-x-4 text-ocean-500 text-xs">
            <span>🔒 Datos seguros</span>
            <span>🌊 Para profesionales</span>
            <span>📋 Certificado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
