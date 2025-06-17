
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
  fullName: string;
  role: 'admin' | 'supervisor';
  centerId?: string;
  message?: string;
  createdBy: string;
}

const generateInvitationToken = () => {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
};

const getEmailTemplate = (data: InvitationData & { token: string; inviteUrl: string }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitación a Aerocam App</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { 
          background: linear-gradient(135deg, #6555FF, #8B5CF6); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { 
          background: #f8fafc; 
          padding: 40px 30px; 
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .welcome-message { 
          font-size: 24px; 
          font-weight: bold; 
          color: #1e293b; 
          margin-bottom: 20px; 
        }
        .invitation-details {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: bold; color: #6555FF; }
        .detail-value { color: #334155; }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #6555FF, #8B5CF6); 
          color: white; 
          padding: 18px 40px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 30px 0; 
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(101, 85, 255, 0.3);
          transition: transform 0.2s;
        }
        .cta-button:hover { transform: translateY(-2px); }
        .backup-link {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          word-break: break-all;
        }
        .message-box {
          background: #e0f2fe;
          border-left: 4px solid #0284c7;
          padding: 20px;
          margin: 25px 0;
          border-radius: 0 8px 8px 0;
        }
        .message-title { font-weight: bold; color: #0284c7; margin-bottom: 10px; }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          color: #64748b; 
          font-size: 14px;
          line-height: 1.5;
        }
        .security-note {
          background: #fef7cd;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
        }
        .security-title { font-weight: bold; color: #f59e0b; margin-bottom: 8px; }
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
          
          <p>Hola <strong>${data.fullName}</strong>,</p>
          
          <p>Has sido invitado a formar parte del equipo de Aerocam App, el sistema profesional para la gestión de bitácoras de buceo.</p>
          
          <div class="invitation-details">
            <h3 style="margin-top: 0; color: #1e293b;">Detalles de tu invitación:</h3>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${data.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nombre completo:</span>
              <span class="detail-value">${data.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Rol asignado:</span>
              <span class="detail-value">${data.role === 'admin' ? 'Administrador' : 'Supervisor'}</span>
            </div>
            ${data.centerId ? `
              <div class="detail-row">
                <span class="detail-label">Centro asignado:</span>
                <span class="detail-value">Configurado automáticamente</span>
              </div>
            ` : ''}
          </div>
          
          ${data.message ? `
            <div class="message-box">
              <div class="message-title">Mensaje del administrador:</div>
              <p style="margin: 0;">${data.message}</p>
            </div>
          ` : ''}
          
          <p>Para completar tu registro y acceder al sistema, haz clic en el siguiente botón:</p>
          
          <div style="text-align: center;">
            <a href="${data.inviteUrl}" class="cta-button">Completar mi Registro</a>
          </div>
          
          <div class="backup-link">
            <strong>Enlace alternativo:</strong><br>
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${data.inviteUrl}">${data.inviteUrl}</a>
          </div>
          
          <div class="security-note">
            <div class="security-title">⚠️ Nota de seguridad:</div>
            Esta invitación expira en 7 días por motivos de seguridad. Si no puedes acceder o tienes problemas, contacta a tu administrador.
          </div>
          
          <p><strong>¿Qué puedes hacer con Aerocam App?</strong></p>
          <ul style="color: #475569; line-height: 1.7;">
            <li>Crear y gestionar bitácoras de buceo digitales</li>
            <li>Firmar digitalmente tus reportes</li>
            <li>Exportar bitácoras en PDF y Excel</li>
            <li>Enviar reportes por email</li>
            <li>Gestionar equipos de buceo y sitios</li>
            ${data.role === 'admin' ? '<li>Administrar usuarios y configuración del sistema</li>' : ''}
          </ul>
        </div>
        
        <div class="footer">
          <p><strong>© 2025 Aerocam App</strong></p>
          <p>Sistema profesional de gestión de bitácoras de buceo</p>
          <p>Esta invitación fue enviada a ${data.email}</p>
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
    const data: InvitationData = await req.json();
    console.log("Received invitation request:", data);

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
        created_by: data.createdBy,
        user_data: {
          full_name: data.fullName,
          role: data.role,
          center_id: data.centerId
        }
      });

    if (insertError) {
      console.error("Error storing invitation:", insertError);
      throw new Error("Error almacenando invitación");
    }

    // Send invitation email
    const emailHtml = getEmailTemplate({ ...data, token, inviteUrl });

    const emailPayload = {
      from: "noreply@resend.dev",
      to: [data.email],
      subject: `Invitación a Aerocam App - ${data.role === 'admin' ? 'Administrador' : 'Supervisor'}`,
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
