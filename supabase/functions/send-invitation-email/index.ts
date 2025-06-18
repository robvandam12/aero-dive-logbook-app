
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface InvitationData {
  email: string;
  full_name: string;
  role: 'admin' | 'usuario';
  center_id?: string;
  message?: string;
  created_by: string;
}

const generateInvitationToken = () => {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
};

const getEmailTemplate = (data: InvitationData & { token: string; inviteUrl: string }) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitación a Aerocam App</title>
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
        .invitation-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin: 25px 0;
        }
        .invitation-title {
          font-size: 18px;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 16px;
          text-align: center;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { 
          font-weight: 600; 
          color: #6366f1; 
          font-size: 14px;
        }
        .detail-value { 
          color: #334155; 
          font-weight: 500;
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
        .backup-link {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          font-size: 13px;
          color: #64748b;
        }
        .backup-link a {
          color: #6366f1;
          word-break: break-all;
          text-decoration: none;
        }
        .message-box {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          border-left: 4px solid #3b82f6;
          padding: 20px;
          margin: 25px 0;
          border-radius: 0 8px 8px 0;
        }
        .message-title { 
          font-weight: 600; 
          color: #1e40af; 
          margin-bottom: 10px; 
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
          <div class="welcome-message">¡Has sido invitado!</div>
          <div class="intro-text">
            Hola <strong>${data.full_name}</strong>, has sido invitado a formar parte del equipo de Aerocam App.
          </div>
          
          <div class="invitation-card">
            <div class="invitation-title">📋 Detalles de tu invitación</div>
            <div class="detail-row">
              <span class="detail-label">📧 Email:</span>
              <span class="detail-value">${data.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👤 Nombre:</span>
              <span class="detail-value">${data.full_name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🔑 Rol:</span>
              <span class="detail-value">${data.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
            </div>
            ${data.center_id ? `
              <div class="detail-row">
                <span class="detail-label">🏢 Centro:</span>
                <span class="detail-value">Configurado automáticamente</span>
              </div>
            ` : ''}
          </div>
          
          ${data.message ? `
            <div class="message-box">
              <div class="message-title">💬 Mensaje del administrador:</div>
              <p style="margin: 0; color: #1e40af;">${data.message}</p>
            </div>
          ` : ''}
          
          <div class="cta-section">
            <p style="margin-bottom: 20px; color: #475569;">Para completar tu registro y acceder al sistema:</p>
            <a href="${data.inviteUrl}" class="cta-button">✨ Completar mi Registro</a>
          </div>
          
          <div class="backup-link">
            <strong>🔗 Enlace alternativo:</strong><br>
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${data.inviteUrl}">${data.inviteUrl}</a>
          </div>
          
          <div class="security-note">
            <div class="security-title">
              ⚠️ Nota de seguridad
            </div>
            Esta invitación expira en 7 días por motivos de seguridad. Si tienes problemas, contacta a tu administrador.
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
          <p style="margin-top: 16px; font-size: 12px;">Esta invitación fue enviada a ${data.email}</p>
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
    console.log("Received invitation request:", requestData);

    // Mapear los datos correctamente según lo que envía el frontend
    const data: InvitationData = {
      email: requestData.email,
      full_name: requestData.fullName || requestData.full_name,
      role: requestData.role,
      center_id: requestData.centerId || requestData.center_id,
      message: requestData.message,
      created_by: requestData.createdBy || requestData.created_by
    };

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    // Generate invitation token
    const token = generateInvitationToken();
    const inviteUrl = `${supabaseUrl}/auth/signup?token=${token}&email=${encodeURIComponent(data.email)}`;

    // Store invitation in database
    const { error: insertError } = await supabase
      .from('invitation_tokens')
      .insert({
        email: data.email,
        token,
        created_by: data.created_by,
        user_data: {
          full_name: data.full_name,
          role: data.role,
          center_id: data.center_id
        }
      });

    if (insertError) {
      console.error("Error storing invitation:", insertError);
      throw new Error("Error almacenando invitación: " + insertError.message);
    }

    // Send invitation email
    const emailHtml = getEmailTemplate({ ...data, token, inviteUrl });

    const emailPayload = {
      from: "Aerocam App <noreply@resend.dev>",
      to: [data.email],
      subject: `🚁 Invitación a Aerocam App - ${data.role === 'admin' ? 'Administrador' : 'Usuario'}`,
      html: emailHtml,
    };

    console.log("Sending invitation email to:", data.email);

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
    console.log("Invitation email sent successfully:", result);

    return new Response(JSON.stringify({ 
      success: true, 
      result,
      token,
      inviteUrl 
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error en send-invitation-email:", error);
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
