
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface InvitationData {
  email: string;
  token: string;
  userData: {
    full_name: string;
    role: string;
    center_id?: string;
  };
  message?: string;
}

const getEmailTemplate = (data: InvitationData) => {
  const inviteUrl = `${Deno.env.get("SUPABASE_URL")}/auth/signup?token=${data.token}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitación a Aerocam App</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6555FF, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #6555FF, #8B5CF6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .info-box { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚁 Aerocam App</h1>
          <p>Sistema de Bitácoras de Buceo</p>
        </div>
        
        <div class="content">
          <h2>¡Has sido invitado!</h2>
          <p>Hola <strong>${data.userData.full_name}</strong>,</p>
          
          <p>Has sido invitado a unirte al sistema Aerocam App como <strong>${data.userData.role === 'admin' ? 'Administrador' : 'Supervisor'}</strong>.</p>
          
          ${data.message ? `
            <div class="info-box">
              <h4>Mensaje del administrador:</h4>
              <p>${data.message}</p>
            </div>
          ` : ''}
          
          <p>Para completar tu registro y acceder al sistema, haz clic en el siguiente botón:</p>
          
          <div style="text-align: center;">
            <a href="${inviteUrl}" class="button">Completar Registro</a>
          </div>
          
          <p><small>Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${inviteUrl}">${inviteUrl}</a></small></p>
          
          <div class="info-box">
            <h4>Información de tu cuenta:</h4>
            <ul>
              <li><strong>Email:</strong> ${data.email}</li>
              <li><strong>Rol:</strong> ${data.userData.role === 'admin' ? 'Administrador' : 'Supervisor'}</li>
              <li><strong>Nombre:</strong> ${data.userData.full_name}</li>
            </ul>
          </div>
          
          <p><strong>Nota:</strong> Esta invitación expira en 7 días. Si no puedes acceder, contacta a tu administrador.</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Aerocam App - Sistema profesional de gestión de bitácoras de buceo</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data: InvitationData = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    const emailHtml = getEmailTemplate(data);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Aerocam App <noreply@aerocam.app>",
        to: [data.email],
        subject: "Invitación a Aerocam App - Sistema de Bitácoras",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error de Resend:", error);
      throw new Error(`Error enviando email: ${error}`);
    }

    const result = await response.json();
    console.log("Email enviado exitosamente:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en send-invitation-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
