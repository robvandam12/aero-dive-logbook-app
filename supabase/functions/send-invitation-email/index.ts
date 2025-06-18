
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

interface InvitationRequest {
  email: string;
  token: string;
  userData: {
    full_name: string;
    role: 'admin' | 'supervisor';
    center_id?: string;
  };
  message?: string;
}

const getEmailTemplate = (data: InvitationRequest & { inviteUrl: string }) => {
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
        .content { 
          background: #f8fafc; 
          padding: 40px 30px; 
          border-radius: 0 0 10px 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, #6555FF, #8B5CF6); 
          color: white; 
          padding: 18px 40px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 30px 0; 
          font-weight: bold;
        }
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚁 Aerocam App</div>
          <div>Sistema Profesional de Bitácoras de Buceo</div>
        </div>
        
        <div class="content">
          <h2>¡Has sido invitado!</h2>
          
          <p>Hola <strong>${data.userData.full_name}</strong>,</p>
          
          <p>Has sido invitado a formar parte del equipo de Aerocam App como <strong>${data.userData.role === 'admin' ? 'Administrador' : 'Supervisor'}</strong>.</p>
          
          ${data.message ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 20px; margin: 25px 0;">
              <strong>Mensaje del administrador:</strong><br>
              ${data.message}
            </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${data.inviteUrl}" class="cta-button">Completar mi Registro</a>
          </div>
          
          <p style="font-size: 12px; color: #666;">
            <strong>Enlace alternativo:</strong><br>
            ${data.inviteUrl}
          </p>
        </div>
        
        <div class="footer">
          <p><strong>© 2025 Aerocam App</strong></p>
          <p>Esta invitación expira en 7 días por seguridad.</p>
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
    const data: InvitationRequest = await req.json();
    console.log("Received invitation request:", data);

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    // Crear URL de invitación
    const inviteUrl = `${supabaseUrl.replace('/rest/v1', '')}/auth/signup?token=${data.token}&email=${encodeURIComponent(data.email)}`;

    // Enviar email de invitación
    const emailHtml = getEmailTemplate({ ...data, inviteUrl });

    const emailPayload = {
      from: "Aerocam App <noreply@resend.dev>",
      to: [data.email],
      subject: `Invitación a Aerocam App - ${data.userData.role === 'admin' ? 'Administrador' : 'Supervisor'}`,
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
