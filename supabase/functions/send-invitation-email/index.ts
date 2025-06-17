
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userData, invitationUrl } = await req.json();

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación a DiveLogger Pro</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #6555FF 0%, #5A4AE5 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-text {
            font-size: 18px;
            margin-bottom: 30px;
            color: #1f2937;
          }
          .info-box {
            background-color: #f1f5f9;
            border-left: 4px solid #6555FF;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .info-box h3 {
            margin: 0 0 15px;
            color: #1f2937;
            font-size: 16px;
          }
          .info-item {
            margin: 8px 0;
            font-size: 14px;
            color: #64748b;
          }
          .info-item strong {
            color: #1f2937;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #6555FF 0%, #5A4AE5 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(101, 85, 255, 0.2);
          }
          .features {
            margin: 30px 0;
          }
          .feature {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 6px;
          }
          .feature-icon {
            width: 24px;
            height: 24px;
            margin-right: 15px;
            color: #6555FF;
          }
          .feature-text {
            font-size: 14px;
            color: #475569;
          }
          .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #64748b;
          }
          .footer a {
            color: #6555FF;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚢 DiveLogger Pro</h1>
            <p>Sistema Profesional de Bitácoras de Buceo</p>
          </div>
          
          <div class="content">
            <p class="welcome-text">
              ¡Hola! Has sido invitado a formar parte de <strong>DiveLogger Pro</strong>, 
              el sistema más avanzado para la gestión de bitácoras de buceo.
            </p>

            <div class="info-box">
              <h3>📋 Información de tu cuenta:</h3>
              <div class="info-item"><strong>Email:</strong> ${email}</div>
              <div class="info-item"><strong>Nombre:</strong> ${userData.full_name || 'Por definir'}</div>
              <div class="info-item"><strong>Rol:</strong> ${userData.role === 'admin' ? 'Administrador' : 'Supervisor'}</div>
              <div class="info-item"><strong>Centro:</strong> ${userData.center_name || 'Por asignar'}</div>
            </div>

            <div style="text-align: center;">
              <a href="${invitationUrl}" class="cta-button">
                ✨ Crear mi cuenta ahora
              </a>
            </div>

            <div class="features">
              <h3>🎯 ¿Qué puedes hacer con DiveLogger Pro?</h3>
              
              <div class="feature">
                <div class="feature-icon">📝</div>
                <div class="feature-text">
                  <strong>Bitácoras Digitales:</strong> Crea y gestiona bitácoras de buceo de forma digital con firmas electrónicas seguras.
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">🔒</div>
                <div class="feature-text">
                  <strong>Seguridad Garantizada:</strong> Cada firma tiene un código único de validación para máxima seguridad.
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">📊</div>
                <div class="feature-text">
                  <strong>Reportes Operativos:</strong> Accede a análisis detallados de rendimiento y operaciones.
                </div>
              </div>

              <div class="feature">
                <div class="feature-icon">👥</div>
                <div class="feature-text">
                  <strong>Gestión de Equipos:</strong> Control completo de supervisores, buzos y centros de buceo.
                </div>
              </div>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
              <strong>Nota importante:</strong> Esta invitación es válida por 7 días. 
              Si no puedes acceder al enlace, copia y pega la siguiente URL en tu navegador:
            </p>
            <p style="font-size: 12px; color: #94a3b8; word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 4px;">
              ${invitationUrl}
            </p>
          </div>

          <div class="footer">
            <p><strong>DiveLogger Pro</strong></p>
            <p>Sistema profesional de gestión de bitácoras de buceo</p>
            <p style="margin-top: 20px;">
              Si necesitas ayuda, contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </body>
    </html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'DiveLogger Pro <noreply@divelogger.pro>',
        to: [email],
        subject: '🚢 Invitación a DiveLogger Pro - Sistema de Bitácoras de Buceo',
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend API error:', error);
      throw new Error(`Error al enviar email: ${error}`);
    }

    const data = await res.json();
    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
