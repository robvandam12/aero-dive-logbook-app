
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

// Función para generar PDF usando el mismo formato que el preview
const generateUnifiedPDFContent = (diveLog: any) => {
  const diversManifest = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest 
    : [];

  // Generar filas de buzos (hasta 4)
  const diverRows = [1, 2, 3, 4].map(buzoNum => {
    const diver = diversManifest[buzoNum - 1];
    return `
      <tr>
        <td>${buzoNum}</td>
        <td>${diver?.name || ''}</td>
        <td>${diver?.license || ''}</td>
        <td>${diver?.role || ''}</td>
        <td>${diver?.standard_depth === true ? '☑ SÍ ☐ NO' : 
                diver?.standard_depth === false ? '☐ SÍ ☑ NO' : '☐ SÍ ☐ NO'}</td>
        <td>${diver?.working_depth || ''}</td>
        <td>${diver?.start_time || ''}</td>
        <td>${diver?.end_time || ''}</td>
        <td>${diver?.dive_time || ''}</td>
      </tr>
    `;
  }).join('');

  // Detalles de trabajo por buzo
  const workDetails = [1, 2, 3, 4].map(buzoNum => {
    const diver = diversManifest[buzoNum - 1];
    return `
      <div style="margin-bottom: 10px;">
        <strong>BUZO ${buzoNum}:</strong>
        <div style="border: 1px solid #999; min-height: 40px; padding: 5px; margin-top: 3px; font-size: 10px;">
          ${diver?.work_description || ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page { 
          size: A4; 
          margin: 15mm; 
        }
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          font-size: 10px;
          line-height: 1.2;
          color: black;
        }
        .header { 
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        .company-section {
          flex: 1;
        }
        .company-info {
          font-size: 8px;
          line-height: 1.3;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 8px;
        }
        .logo-section img {
          height: 30px;
          width: auto;
        }
        .date-section {
          text-align: right;
          flex-shrink: 0;
        }
        .date-box, .number-box {
          border: 1px solid #000;
          padding: 3px 8px;
          margin: 2px 0;
          display: inline-block;
          min-width: 80px;
        }
        .number-box {
          color: green;
          font-weight: bold;
        }
        .title {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          margin: 15px 0 10px 0;
        }
        .section {
          border: 1px solid #000;
          margin-bottom: 10px;
          padding: 8px;
        }
        .section-title {
          background-color: #ddd;
          font-weight: bold;
          text-align: center;
          padding: 4px;
          margin: -8px -8px 8px -8px;
          font-size: 11px;
        }
        .data-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 10px;
        }
        .field {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          font-size: 9px;
        }
        .field-label {
          font-weight: bold;
          margin-right: 5px;
          min-width: 80px;
        }
        .field-value {
          border: 1px solid #999;
          padding: 2px 4px;
          flex: 1;
          min-height: 16px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 10px 0;
        }
        th, td { 
          border: 1px solid #666; 
          padding: 4px; 
          text-align: center;
          font-size: 8px;
          vertical-align: middle;
        }
        th { 
          background-color: #f0f0f0; 
          font-weight: bold;
          font-size: 9px;
        }
        .observations-section {
          border: 1px solid #000;
          padding: 8px;
          margin-bottom: 10px;
        }
        .observations-title {
          background-color: #ddd;
          font-weight: bold;
          text-align: center;
          padding: 4px;
          margin: -8px -8px 8px -8px;
          font-size: 11px;
        }
        .observations-box {
          border: 1px solid #999;
          min-height: 60px;
          padding: 5px;
          font-size: 10px;
        }
        .signature-section { 
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .signature-box { 
          text-align: center;
        }
        .signature-frame {
          border: 1px solid #000;
          height: 60px;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #666;
        }
        .signature-label {
          border-top: 1px solid #000;
          padding-top: 3px;
          font-size: 9px;
        }
        .signature-title {
          font-weight: bold;
          font-size: 10px;
        }
        .footer-text {
          font-size: 7px;
          text-align: center;
          margin-top: 15px;
          color: #666;
          border-top: 1px solid #ccc;
          padding-top: 8px;
        }
      </style>
    </head>
    <body>
      <!-- Header Section -->
      <div class="header">
        <div class="company-section">
          <div class="logo-section">
            <img src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" alt="Aerocam Logo">
            <span style="font-size: 16px; font-weight: bold;">aerocam</span>
          </div>
          <div class="company-info">
            <div><strong>SOCIEDAD DE SERVICIOS AEROCAM SPA</strong></div>
            <div>Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</div>
            <div>(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</div>
          </div>
        </div>
        <div class="date-section">
          <div class="field">
            <span class="field-label">Fecha:</span>
            <div class="date-box">${diveLog.log_date || ''}</div>
          </div>
          <div class="field">
            <span class="field-label">Nº:</span>
            <div class="number-box">${diveLog.id?.slice(-6) || ''}</div>
          </div>
        </div>
      </div>

      <div class="title">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</div>
      
      <div class="field" style="margin-bottom: 15px;">
        <span class="field-label" style="font-weight: bold;">CENTRO DE CULTIVO:</span>
        <div class="field-value">${diveLog.centers?.name || 'N/A'}</div>
      </div>

      <!-- Datos Generales Section -->
      <div class="section">
        <div class="section-title">DATOS GENERALES</div>
        <div class="data-grid">
          <div>
            <div class="field">
              <span class="field-label">SUPERVISOR:</span>
              <div class="field-value">${diveLog.profiles?.username || 'N/A'}</div>
            </div>
            <div class="field">
              <span class="field-label">N° MATRICULA:</span>
              <div class="field-value">${diveLog.supervisor_license || 'N/A'}</div>
            </div>
          </div>
          <div>
            <div class="field">
              <span class="field-label">JEFE DE CENTRO:</span>
              <div class="field-value">${diveLog.center_manager || 'N/A'}</div>
            </div>
            <div class="field">
              <span class="field-label">ASISTENTE DE CENTRO:</span>
              <div class="field-value">${diveLog.center_assistant || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #ccc;">
          <div style="font-weight: bold; text-align: center; margin-bottom: 5px; font-size: 10px;">CONDICIÓN TIEMPO VARIABLES</div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
            <div style="display: inline-flex; align-items: center; gap: 3px;">
              <div style="width: 12px; height: 12px; border: 1px solid #000; display: inline-flex; align-items: center; justify-content: center; font-size: 8px;">
                ${diveLog.weather_good === true ? 'X' : ''}
              </div>
              <span>SÍ</span>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 3px;">
              <div style="width: 12px; height: 12px; border: 1px solid #000; display: inline-flex; align-items: center; justify-content: center; font-size: 8px;">
                ${diveLog.weather_good === false ? 'X' : ''}
              </div>
              <span>NO</span>
            </div>
            <div class="field" style="flex: 1; margin-left: 15px;">
              <span class="field-label">OBSERVACIONES:</span>
              <div class="field-value">${diveLog.weather_conditions || 'Buen tiempo'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team de Buceo Section -->
      <div class="section">
        <div class="section-title">TEAM DE BUCEO</div>
        <div style="text-align: center; font-weight: bold; margin-bottom: 8px; font-size: 10px;">
          COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES
        </div>
        <table>
          <thead>
            <tr>
              <th>BUZO</th>
              <th>IDENTIFICACIÓN</th>
              <th>Nº MATRICULA</th>
              <th>CARGO</th>
              <th>BUCEO ESTANDAR<br/>PROFUNDIDAD<br/>20 MTS MAXIMO<br/>(SÍ / NO)</th>
              <th>PROFUNDIDAD<br/>DE TRABAJO<br/>REALIZADO<br/>(Metros)</th>
              <th>INICIO DE<br/>BUCEO</th>
              <th>TÉRMINO<br/>DE BUCEO</th>
              <th>TIEMPO<br/>DE BUCEO<br/>(min)</th>
            </tr>
          </thead>
          <tbody>
            ${diverRows}
          </tbody>
        </table>
      </div>

      <!-- Detalle de Trabajo Section -->
      <div class="section">
        <div class="section-title">DETALLE DE TRABAJO REALIZADO POR BUZO</div>
        ${workDetails}
      </div>

      <!-- Observaciones Generales Section -->
      <div class="observations-section">
        <div class="observations-title">OBSERVACIONES</div>
        <div class="observations-box">
          ${diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
        </div>
      </div>

      <!-- Firmas Section -->
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-frame">(Firma)</div>
          <div class="signature-label">NOMBRE Y CARGO</div>
          <div class="signature-title">FIRMA ENCARGADO DE CENTRO</div>
        </div>
        <div class="signature-box">
          <div class="signature-frame">
            ${diveLog.signature_url ? `<img src="${diveLog.signature_url}" alt="Firma" style="max-height: 50px; max-width: 180px;">` : '(Firma y Timbre)'}
          </div>
          <div class="signature-label">NOMBRE Y CARGO</div>
          <div class="signature-title">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</div>
          ${diveLog.signature_url ? `<div style="margin-top: 5px; font-size: 8px; color: green; font-weight: bold;">FIRMADO DIGITALMENTE<br/>Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}</div>` : ''}
        </div>
      </div>

      <div class="footer-text">
        Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento sin el previo consentimiento expreso y por escrito de Aerocam SPA.
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
        .header { 
          background: linear-gradient(135deg, #6555FF, #8B5CF6); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }
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
          <div class="logo-section">
            <img src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" alt="Logo" style="height: 30px; width: auto;">
            <h1 style="margin: 0;">Aerocam App</h1>
          </div>
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
      from: "Aerocam App <noreply@resend.dev>",
      to: [data.recipientEmail],
      subject,
      html: emailHtml,
    };

    // Si se solicita PDF, generar usando el formato unificado
    if (data.includePDF) {
      console.log("Generating unified PDF attachment");
      const pdfHtml = generateUnifiedPDFContent(diveLog);
      
      // Convertir HTML a base64 para adjunto
      const htmlBuffer = new TextEncoder().encode(pdfHtml);
      const base64Html = btoa(String.fromCharCode(...htmlBuffer));
      
      emailPayload.attachments = [
        {
          filename: `bitacora_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.html`,
          content: base64Html,
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
