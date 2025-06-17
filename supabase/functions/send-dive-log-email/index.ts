
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

interface EmailData {
  diveLogId: string;
  recipientEmail: string;
  recipientName?: string;
  message?: string;
  includePDF?: boolean;
}

const getEmailTemplate = (diveLog: any, message?: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bitácora de Buceo - Aerocam App</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6555FF, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #6555FF; }
        .label { font-weight: bold; color: #6555FF; display: block; margin-bottom: 5px; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .status-signed { background: #dcfce7; color: #166534; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
        .status-draft { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚁 Aerocam App</h1>
          <p>Bitácora de Buceo</p>
        </div>
        
        <div class="content">
          <h2>Detalles de la Bitácora</h2>
          
          ${message ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0;">Mensaje:</h4>
              <p style="margin: 0;">${message}</p>
            </div>
          ` : ''}
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Fecha</span>
              <span class="value">${diveLog.log_date}</span>
            </div>
            <div class="info-item">
              <span class="label">Centro</span>
              <span class="value">${diveLog.centers?.name || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Sitio de Buceo</span>
              <span class="value">${diveLog.dive_sites?.name || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Embarcación</span>
              <span class="value">${diveLog.boats?.name || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Supervisor</span>
              <span class="value">${diveLog.profiles?.username || diveLog.supervisor_name || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Estado</span>
              <span class="value">
                <span class="${diveLog.status === 'signed' ? 'status-signed' : 'status-draft'}">
                  ${diveLog.status === 'signed' ? 'Firmado' : diveLog.status === 'draft' ? 'Borrador' : 'Invalidado'}
                </span>
              </span>
            </div>
          </div>

          <div class="info-item">
            <span class="label">Condiciones</span>
            <div class="value">
              <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Temperatura: ${diveLog.water_temperature ? diveLog.water_temperature + '°C' : 'N/A'}</li>
                <li>Visibilidad: ${diveLog.visibility ? diveLog.visibility + 'm' : 'N/A'}</li>
                <li>Corriente: ${diveLog.current_strength || 'N/A'}</li>
                <li>Clima: ${diveLog.weather_conditions || 'N/A'}</li>
              </ul>
            </div>
          </div>

          <div class="info-item">
            <span class="label">Horarios</span>
            <div class="value">
              <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Salida: ${diveLog.departure_time || 'N/A'}</li>
                <li>Llegada: ${diveLog.arrival_time || 'N/A'}</li>
              </ul>
            </div>
          </div>

          ${diveLog.divers_manifest && Array.isArray(diveLog.divers_manifest) ? `
            <div class="info-item">
              <span class="label">Equipo de Buceo (${diveLog.divers_manifest.length} personas)</span>
              <div class="value">
                <ul style="margin: 5px 0; padding-left: 20px;">
                  ${diveLog.divers_manifest.map((diver: any) => `
                    <li>${diver.name || 'N/A'} - ${diver.role || 'buzo'}</li>
                  `).join('')}
                </ul>
              </div>
            </div>
          ` : ''}

          ${diveLog.observations ? `
            <div class="info-item">
              <span class="label">Observaciones</span>
              <span class="value">${diveLog.observations}</span>
            </div>
          ` : ''}

          ${diveLog.status === 'signed' ? `
            <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #166534;">✓ Bitácora Firmada Digitalmente</h4>
              <p style="margin: 0; color: #166534;">
                Código de verificación: <strong>DL-${diveLog.id.slice(0, 8).toUpperCase()}</strong>
              </p>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>© 2025 Aerocam App - Sistema profesional de gestión de bitácoras de buceo</p>
          <p>Este documento fue generado automáticamente el ${new Date().toLocaleString('es-ES')}</p>
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
    const data: EmailData = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    // Obtener datos de la bitácora
    const { data: diveLog, error } = await supabase
      .from('dive_logs')
      .select(`
        *,
        centers (name),
        dive_sites (name, location),
        boats (name, registration_number),
        profiles (username)
      `)
      .eq('id', data.diveLogId)
      .single();

    if (error || !diveLog) {
      throw new Error("Bitácora no encontrada");
    }

    const emailHtml = getEmailTemplate(diveLog, data.message);
    const subject = `Bitácora de Buceo - ${diveLog.log_date} - ${diveLog.centers?.name || 'Centro'}`;

    const emailPayload: any = {
      from: "Aerocam App <noreply@aerocam.app>",
      to: [data.recipientEmail],
      subject,
      html: emailHtml,
    };

    // Si se solicita PDF, se podría adjuntar aquí
    if (data.includePDF) {
      console.log("PDF attachment requested - functionality pending full implementation");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error de Resend:", error);
      throw new Error(`Error enviando email: ${error}`);
    }

    const result = await response.json();
    console.log("Email enviado exitosamente:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error en send-dive-log-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
