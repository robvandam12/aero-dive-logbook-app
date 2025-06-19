
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
  password: string;
  role: 'admin' | 'usuario';
  centerId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Welcome email function called');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, password, role, centerId }: WelcomeEmailRequest = await req.json();

    console.log('Sending welcome email to:', email);

    const loginUrl = `${req.headers.get('origin') || 'https://aerocam.lovable.app'}/auth`;
    
    const roleText = role === 'admin' ? 'Administrador' : 'Usuario';

    const emailResponse = await resend.emails.send({
      from: "Aerocam <onboarding@resend.dev>",
      to: [email],
      subject: "¡Bienvenido a Aerocam - Tu cuenta está lista!",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a Aerocam</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .logo-section {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
            }
            .logo-text {
              font-size: 32px;
              font-weight: bold;
              margin-left: 15px;
            }
            .content {
              padding: 30px;
            }
            .credentials-box {
              background: #f8fafc;
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .credentials-title {
              font-weight: bold;
              color: #475569;
              margin-bottom: 15px;
              font-size: 16px;
            }
            .credential-item {
              margin: 10px 0;
              padding: 8px 12px;
              background: white;
              border-radius: 4px;
              border-left: 4px solid #6366f1;
            }
            .credential-label {
              font-weight: 600;
              color: #64748b;
              font-size: 14px;
            }
            .credential-value {
              font-family: 'Courier New', monospace;
              color: #1e293b;
              font-size: 16px;
              font-weight: bold;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              text-align: center;
            }
            .features {
              margin: 30px 0;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin: 12px 0;
              color: #475569;
            }
            .feature-icon {
              margin-right: 10px;
              font-size: 18px;
            }
            .footer {
              background: #f1f5f9;
              padding: 20px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .security-note {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-section">
                <div class="logo-text">🌊 aerocam</div>
              </div>
              <h1>¡Bienvenido al Sistema de Bitácoras de Buceo!</h1>
              <p>Tu cuenta ha sido creada exitosamente</p>
            </div>
            
            <div class="content">
              <p>Hola <strong>${fullName}</strong>,</p>
              
              <p>Tu cuenta en el Sistema de Bitácoras de Buceo de Aerocam ha sido creada y está lista para usar. Como <strong>${roleText}</strong>, tendrás acceso a todas las funcionalidades necesarias para gestionar las operaciones de buceo de manera eficiente.</p>
              
              <div class="credentials-box">
                <div class="credentials-title">🔐 Tus credenciales de acceso:</div>
                <div class="credential-item">
                  <div class="credential-label">Email:</div>
                  <div class="credential-value">${email}</div>
                </div>
                <div class="credential-item">
                  <div class="credential-label">Contraseña temporal:</div>
                  <div class="credential-value">${password}</div>
                </div>
              </div>

              <div class="security-note">
                <strong>⚠️ Importante:</strong> Por motivos de seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.
              </div>

              <center>
                <a href="${loginUrl}" class="button">
                  🚀 Acceder al Sistema
                </a>
              </center>

              <div class="features">
                <h3>🎯 Lo que puedes hacer con tu cuenta:</h3>
                <div class="feature-item">
                  <span class="feature-icon">📋</span>
                  Crear y gestionar bitácoras de buceo digitales
                </div>
                <div class="feature-item">
                  <span class="feature-icon">✍️</span>
                  Firmar digitalmente las bitácoras
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  Generar reportes operativos detallados
                </div>
                <div class="feature-item">
                  <span class="feature-icon">👥</span>
                  Gestionar equipos de buceo y supervisores
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🔒</span>
                  Acceso seguro con trazabilidad completa
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📱</span>
                  Exportar PDFs profesionales
                </div>
              </div>

              <h3>🚀 Próximos pasos:</h3>
              <ol>
                <li><strong>Inicia sesión</strong> con las credenciales proporcionadas</li>
                <li><strong>Cambia tu contraseña</strong> en la sección de configuración</li>
                <li><strong>Explora el sistema</strong> y familiarízate con las funcionalidades</li>
                <li><strong>Comienza a crear</strong> tus primeras bitácoras de buceo</li>
              </ol>

              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al administrador del sistema.</p>
              
              <p><strong>¡Bienvenido al equipo de Aerocam!</strong> 🌊</p>
            </div>
            
            <div class="footer">
              <p><strong>Aerocam SPA</strong> - Sistema de Bitácoras de Buceo</p>
              <p>Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
              <p>(65) 2 353 322 • contacto@aerocamchile.cl</p>
              <p style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
                Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
