
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

const generatePDF = (diveLog: any) => {
  const diversList = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest.map((diver: any, index: number) => `
        <tr>
          <td>${index + 1}</td>
          <td>${diver.name || 'N/A'}</td>
          <td>${diver.role || 'buzo'}</td>
          <td>${diver.certification || 'N/A'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="4">No hay buzos registrados</td></tr>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page { size: A4; margin: 20mm; }
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          font-size: 12px;
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          margin-bottom: 20px;
          border-bottom: 2px solid #6555FF;
          padding-bottom: 15px;
        }
        .logo { 
          color: #6555FF; 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 5px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-section {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
        }
        .info-section h3 {
          margin: 0 0 8px 0;
          color: #6555FF;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          padding-bottom: 3px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .label { font-weight: bold; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0;
          font-size: 11px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: left;
        }
        th { 
          background-color: #6555FF; 
          color: white;
          font-weight: bold;
        }
        .signature-section {
          margin-top: 20px;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
          background-color: #f9f9f9;
          font-size: 11px;
        }
        .signature-code {
          background: #6555FF;
          color: white;
          padding: 3px 8px;
          border-radius: 3px;
          font-family: monospace;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🚁 AEROCAM APP</div>
        <div style="font-size: 14px; color: #666;">Sistema de Bitácoras de Buceo</div>
        <div style="margin-top: 8px; font-weight: bold;">BITÁCORA DE BUCEO</div>
      </div>

      <div class="info-grid">
        <div class="info-section">
          <h3>INFORMACIÓN GENERAL</h3>
          <div class="info-row">
            <span class="label">Fecha:</span>
            <span>${diveLog.log_date}</span>
          </div>
          <div class="info-row">
            <span class="label">Centro:</span>
            <span>${diveLog.centers?.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Sitio:</span>
            <span>${diveLog.dive_sites?.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Embarcación:</span>
            <span>${diveLog.boats?.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Supervisor:</span>
            <span>${diveLog.profiles?.username || 'N/A'}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>CONDICIONES</h3>
          <div class="info-row">
            <span class="label">Salida:</span>
            <span>${diveLog.departure_time || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Llegada:</span>
            <span>${diveLog.arrival_time || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Temperatura:</span>
            <span>${diveLog.water_temperature ? diveLog.water_temperature + '°C' : 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Visibilidad:</span>
            <span>${diveLog.visibility ? diveLog.visibility + 'm' : 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Corriente:</span>
            <span>${diveLog.current_strength || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>EQUIPO DE BUCEO</h3>
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Certificación</th>
            </tr>
          </thead>
          <tbody>
            ${diversList}
          </tbody>
        </table>
      </div>

      ${diveLog.observations ? `
        <div class="info-section">
          <h3>OBSERVACIONES</h3>
          <p style="margin: 5px 0;">${diveLog.observations}</p>
        </div>
      ` : ''}

      <div class="signature-section">
        <h3 style="margin-top: 0;">VALIDACIÓN</h3>
        <div class="info-row">
          <span class="label">Estado:</span>
          <span>${diveLog.status === 'signed' ? 'FIRMADO' : diveLog.status === 'draft' ? 'BORRADOR' : 'INVALIDADO'}</span>
        </div>
        ${diveLog.status === 'signed' ? `
          <div class="info-row">
            <span class="label">Código:</span>
            <span class="signature-code">DL-${diveLog.id.slice(0, 8).toUpperCase()}</span>
          </div>
        ` : ''}
      </div>

      <div class="footer">
        <p>© 2025 Aerocam App - Generado el ${new Date().toLocaleString('es-ES')}</p>
      </div>
    </body>
    </html>
  `;
};

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
              <span class="value">${diveLog.profiles?.username || 'N/A'}</span>
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
    console.log("Received email request:", data);

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
      console.error("Error fetching dive log:", error);
      throw new Error("Bitácora no encontrada");
    }

    console.log("Dive log found:", diveLog);

    const emailHtml = getEmailTemplate(diveLog, data.message);
    const subject = `Bitácora de Buceo - ${diveLog.log_date} - ${diveLog.centers?.name || 'Centro'}`;

    const emailPayload: any = {
      from: "noreply@resend.dev",
      to: [data.recipientEmail],
      subject,
      html: emailHtml,
    };

    // Si se solicita PDF, generar y adjuntar
    if (data.includePDF) {
      console.log("Generating PDF attachment");
      const pdfHtml = generatePDF(diveLog);
      // Note: For real PDF generation, you would use a library like puppeteer or similar
      // For now, we'll include it as HTML attachment
      emailPayload.attachments = [
        {
          filename: `bitacora_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.html`,
          content: Buffer.from(pdfHtml).toString('base64'),
          type: 'text/html',
          disposition: 'attachment'
        }
      ];
    }

    console.log("Sending email with payload:", JSON.stringify({...emailPayload, html: '[HTML_CONTENT]'}));

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
    console.log("Email enviado exitosamente:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error en send-dive-log-email:", error);
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
