
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface WelcomeEmailData {
  email: string;
  fullName: string;
  password: string;
  role: 'admin' | 'usuario';
  centerId?: string;
}

const getWelcomeEmailTemplate = (data: WelcomeEmailData) => {
  const roleText = data.role === 'admin' ? 'Administrador' : 'Usuario';
  const loginUrl = `${Deno.env.get("SUPABASE_URL")?.replace('/rest/v1', '')}/auth/signin`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Aerocam App</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #334155; 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          margin: 0; 
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .header { 
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .logo { 
          font-size: 32px; 
          font-weight: 800; 
          margin-bottom: 8px;
          background: linear-gradient(45deg, #ffffff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle { 
          font-size: 16px; 
          opacity: 0.9; 
          font-weight: 500;
        }
        .content { 
          padding: 40px 30px; 
        }
        .welcome-message { 
          font-size: 28px; 
          font-weight: 700; 
          color: #0f172a; 
          margin-bottom: 20px; 
          text-align: center;
        }
        .intro-text {
          font-size: 16px;
          color: #475569;
          text-align: center;
          margin-bottom: 30px;
        }
        .credentials-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin: 25px 0;
        }
        .credentials-title {
          font-size: 18px;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 16px;
          text-align: center;
        }
        .credential-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .credential-row:last-child { border-bottom: none; }
        .credential-label { 
          font-weight: 600; 
          color: #6366f1; 
          font-size: 14px;
        }
        .credential-value { 
          color: #334155; 
          font-weight: 500;
          font-family: monospace;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .cta-section {
          text-align: center;
          margin: 40px 0;
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
          color: white; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 12px; 
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
          transition: all 0.2s ease;
          border: none;
        }
        .cta-button:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.5);
        }
        .security-note {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          font-size: 14px;
        }
        .security-title { 
          font-weight: 600; 
          color: #d97706; 
          margin-bottom: 8px; 
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin: 30px 0;
        }
        .feature-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .feature-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: white;
          font-weight: bold;
        }
        .footer { 
          background: #0f172a;
          color: #94a3b8;
          text-align: center; 
          padding: 30px;
          font-size: 14px;
          line-height: 1.6;
        }
        .footer-logo {
          color: #6366f1;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 12px; }
          .content { padding: 30px 20px; }
          .header { padding: 30px 20px; }
          .features-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚁 Aerocam App</div>
          <div class="subtitle">Sistema Profesional de Bitácoras de Buceo</div>
        </div>
        
        <div class="content">
          <div class="welcome-message">¡Bienvenido al equipo!</div>
          <div class="intro-text">
            Hola <strong>${data.fullName}</strong>, tu cuenta ha sido creada exitosamente y ya puedes acceder al sistema de Aerocam App.
          </div>
          
          <div class="credentials-card">
            <div class="credentials-title">🔑 Tus credenciales de acceso</div>
            <div class="credential-row">
              <span class="credential-label">📧 Email:</span>
              <span class="credential-value">${data.email}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">🔒 Contraseña:</span>
              <span class="credential-value">${data.password}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">👤 Rol:</span>
              <span class="credential-value">${roleText}</span>
            </div>
            ${data.centerId ? `
              <div class="credential-row">
                <span class="credential-label">🏢 Centro:</span>
                <span class="credential-value">Asignado automáticamente</span>
              </div>
            ` : ''}
          </div>
          
          <div class="cta-section">
            <p style="margin-bottom: 20px; color: #475569;">Tu cuenta está lista para usar. Inicia sesión ahora:</p>
            <a href="${loginUrl}" class="cta-button">🚀 Acceder al Sistema</a>
          </div>
          
          <div class="security-note">
            <div class="security-title">
              🔐 Recomendación de seguridad
            </div>
            <p>Te recomendamos cambiar tu contraseña después del primer inicio de sesión. Puedes hacerlo desde la sección de configuración de usuario.</p>
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #0f172a; margin-bottom: 20px; text-align: center;">🚀 ¿Qué puedes hacer con Aerocam App?</h3>
            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <strong style="color: #0f172a;">Bitácoras Digitales</strong>
                <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">Crear y gestionar bitácoras de buceo de forma digital</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">✍️</div>
                <strong style="color: #0f172a;">Firmas Digitales</strong>
                <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">Firmar digitalmente tus reportes de manera segura</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <strong style="color: #0f172a;">Exportar Reportes</strong>
                <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">Generar PDFs y Excel de tus bitácoras</p>
              </div>
              <div class="feature-item">
                <div class="feature-icon">👥</div>
                <strong style="color: #0f172a;">Gestión de Equipos</strong>
                <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">Administrar equipos de buceo y sitios</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">🚁 Aerocam App</div>
          <p>Sistema profesional de gestión de bitácoras de buceo</p>
          <p style="margin-top: 16px; font-size: 12px;">Credenciales enviadas a ${data.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const requestData = await req.json();
    console.log("Received welcome email request:", requestData);

    const data: WelcomeEmailData = {
      email: requestData.email,
      fullName: requestData.fullName,
      password: requestData.password,
      role: requestData.role,
      centerId: requestData.centerId
    };

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    // Send welcome email
    const emailHtml = getWelcomeEmailTemplate(data);

    const emailPayload = {
      from: "Aerocam App <noreply@resend.dev>",
      to: [data.email],
      subject: `🚁 Bienvenido a Aerocam App - ${data.role === 'admin' ? 'Administrador' : 'Usuario'}`,
      html: emailHtml,
    };

    console.log("Sending welcome email to:", data.email);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await response.text();
    console.log("Resend response:", response.status, responseText);

    if (!response.ok) {
      console.error("Error de Resend:", responseText);
      throw new Error(`Error enviando email: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log("Welcome email sent successfully:", result);

    return new Response(JSON.stringify({ 
      success: true, 
      result 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error en send-welcome-email:", error);
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
});
