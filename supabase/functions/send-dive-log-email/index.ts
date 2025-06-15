
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  diveLogId: string;
  recipientEmail: string;
  recipientName?: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const generateDiveLogHTML = (diveLog: any) => {
  const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bitácora de Buceo</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0066cc; padding-bottom: 20px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #0066cc; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .info-item { background: #f8f9fa; padding: 10px; border-radius: 5px; }
        .info-label { font-weight: bold; color: #666; font-size: 12px; }
        .info-value { margin-top: 5px; }
        .divers-table { width: 100%; border-collapse: collapse; }
        .divers-table th, .divers-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .divers-table th { background-color: #f2f2f2; }
        .signature-section { margin-top: 30px; text-align: center; }
        .signature-img { max-width: 300px; border: 1px solid #ddd; padding: 10px; }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; }
        .status-signed { background-color: #d4edda; color: #155724; }
        .status-draft { background-color: #fff3cd; color: #856404; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Bitácora de Buceo</h1>
        <p><strong>Fecha:</strong> ${new Date(diveLog.log_date).toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <span class="status-badge ${diveLog.signature_url ? 'status-signed' : 'status-draft'}">
          ${diveLog.signature_url ? 'Firmada' : 'Borrador'}
        </span>
      </div>

      <div class="section">
        <h3>Información General</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Centro de Buceo</div>
            <div class="info-value">${diveLog.centers?.name || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Supervisor</div>
            <div class="info-value">${diveLog.profiles?.username || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Punto de Buceo</div>
            <div class="info-value">${diveLog.dive_sites?.name || 'N/A'}</div>
          </div>
          ${diveLog.boats ? `
          <div class="info-item">
            <div class="info-label">Embarcación</div>
            <div class="info-value">${diveLog.boats.name}<br><small>${diveLog.boats.registration_number}</small></div>
          </div>
          ` : ''}
        </div>
        
        ${diveLog.departure_time || diveLog.arrival_time ? `
        <div class="info-grid">
          ${diveLog.departure_time ? `
          <div class="info-item">
            <div class="info-label">Hora de Salida</div>
            <div class="info-value">${diveLog.departure_time}</div>
          </div>
          ` : ''}
          ${diveLog.arrival_time ? `
          <div class="info-item">
            <div class="info-label">Hora de Llegada</div>
            <div class="info-value">${diveLog.arrival_time}</div>
          </div>
          ` : ''}
        </div>
        ` : ''}
      </div>

      ${diveLog.weather_conditions ? `
      <div class="section">
        <h3>Condiciones Ambientales</h3>
        <p>${diveLog.weather_conditions}</p>
      </div>
      ` : ''}

      ${diversManifest.length > 0 ? `
      <div class="section">
        <h3>Equipo de Buceo</h3>
        <table class="divers-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Puesto</th>
              <th>Prof. Máxima (m)</th>
            </tr>
          </thead>
          <tbody>
            ${diversManifest.map((diver: any) => `
              <tr>
                <td>${diver.name || 'N/A'}</td>
                <td>${diver.license || 'N/A'}</td>
                <td>${
                  diver.role === 'buzo' ? 'Buzo' : 
                  diver.role === 'buzo-emergencia' ? 'Buzo de Emergencia' : 
                  diver.role === 'supervisor' ? 'Supervisor' : 'N/A'
                }</td>
                <td>${diver.working_depth || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${diveLog.observations ? `
      <div class="section">
        <h3>Observaciones</h3>
        <p style="white-space: pre-wrap;">${diveLog.observations}</p>
      </div>
      ` : ''}

      ${diveLog.signature_url ? `
      <div class="signature-section">
        <h3>Firma del Supervisor</h3>
        <img src="${diveLog.signature_url}" alt="Firma del supervisor" class="signature-img">
      </div>
      ` : ''}
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diveLogId, recipientEmail, recipientName }: SendEmailRequest = await req.json();

    if (!diveLogId || !recipientEmail) {
      throw new Error("ID de bitácora y email del destinatario son requeridos");
    }

    // Obtener la bitácora con todos los detalles
    const { data: diveLog, error: fetchError } = await supabase
      .from('dive_logs')
      .select(`
        *,
        centers (name),
        dive_sites (name, location),
        boats (name, registration_number),
        profiles (username)
      `)
      .eq('id', diveLogId)
      .single();

    if (fetchError || !diveLog) {
      throw new Error("Bitácora no encontrada");
    }

    // Verificar que la bitácora esté firmada
    if (!diveLog.signature_url) {
      throw new Error("La bitácora debe estar firmada antes de enviarla por correo");
    }

    const htmlContent = generateDiveLogHTML(diveLog);
    const subject = `Bitácora de Buceo - ${new Date(diveLog.log_date).toLocaleDateString('es-ES')} - ${diveLog.centers?.name || 'Centro'}`;

    const emailResponse = await resend.emails.send({
      from: "Sistema de Bitácoras <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email enviado exitosamente:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Bitácora enviada por correo exitosamente",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error enviando correo:", error);
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
