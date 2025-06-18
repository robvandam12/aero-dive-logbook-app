
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generatePDFHtml = (diveLog: any) => {
  const diversManifest = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest
    : [];

  // Generate diver rows for the table (up to 4 divers)
  const diverRows = [1, 2, 3, 4].map(buzoNum => {
    const diver = diversManifest[buzoNum - 1];
    return `
      <tr>
        <td style="border: 1px solid #666; padding: 4px; text-align: center; font-size: 10px;">${buzoNum}</td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.name || ''}</td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.license || ''}</td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.role || ''}</td>
        <td style="border: 1px solid #666; padding: 4px; text-align: center; font-size: 10px;">
          ${diver?.standard_depth === true ? '☑' : '☐'} SÍ ${diver?.standard_depth === false ? '☑' : '☐'} NO
        </td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.working_depth || ''}</td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.start_time || ''}</td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.end_time || ''}</td>
        <td style="border: 1px solid #666; padding: 4px; font-size: 10px;">${diver?.dive_time || ''}</td>
      </tr>
    `;
  }).join('');

  // Generate work details for each diver
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
          gap: 8px;
          margin-bottom: 8px;
        }
        .logo-section img {
          height: 35px;
          width: auto;
          object-fit: contain;
        }
        .logo-text {
          font-size: 18px;
          font-weight: bold;
          color: #6555FF;
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
        .subsection {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #ccc;
        }
        .subsection-title {
          font-weight: bold;
          text-align: center;
          margin-bottom: 5px;
          font-size: 10px;
        }
        .condition-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }
        .checkbox {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .checkbox-box {
          width: 12px;
          height: 12px;
          border: 1px solid #000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
        }
        .compressor-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
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
            <img src="https://ujtuzthydhfckpxommcv.supabase.co/storage/v1/object/public/dive-log-images/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" alt="Aerocam Logo" style="height: 35px; width: auto; object-fit: contain;">
            <span class="logo-text">aerocam</span>
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

        <div class="subsection">
          <div class="subsection-title">CONDICIÓN TIEMPO VARIABLES</div>
          <div class="condition-row">
            <div class="checkbox">
              <div class="checkbox-box">${diveLog.weather_good === true ? 'X' : ''}</div>
              <span>SÍ</span>
            </div>
            <div class="checkbox">
              <div class="checkbox-box">${diveLog.weather_good === false ? 'X' : ''}</div>
              <span>NO</span>
            </div>
            <div class="field" style="flex: 1; margin-left: 15px;">
              <span class="field-label">OBSERVACIONES:</span>
              <div class="field-value">${diveLog.weather_conditions || 'Buen tiempo'}</div>
            </div>
          </div>
        </div>

        <div class="subsection">
          <div class="subsection-title">REGISTRO DE COMPRESORES</div>
          <div class="compressor-row">
            <span class="field-label">COMPRESOR 1:</span>
            <div class="field-value" style="width: 80px;">${diveLog.compressor_1 || ''}</div>
            <span class="field-label" style="margin-left: 15px;">COMPRESOR 2:</span>
            <div class="field-value" style="width: 80px;">${diveLog.compressor_2 || ''}</div>
          </div>
          <div class="field">
            <span class="field-label">Nº SOLICITUD DE FAENA:</span>
            <div class="field-value">${diveLog.work_order_number || 'N/A'}</div>
          </div>
          <div class="field">
            <span class="field-label">FECHA Y HORA DE INICIO:</span>
            <div class="field-value">${diveLog.start_time || diveLog.departure_time || 'N/A'}</div>
          </div>
          <div class="field">
            <span class="field-label">FECHA Y HORA DE TÉRMINO:</span>
            <div class="field-value">${diveLog.end_time || diveLog.arrival_time || 'N/A'}</div>
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
        <div style="text-align: center; font-size: 8px; margin-top: 5px;">
          Nota: Capacidad máxima permitida de 20 metros.
        </div>
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
    const { diveLogId, preview = false, generatePDF = false } = await req.json();

    if (!diveLogId) {
      return new Response(JSON.stringify({ error: "Dive log ID is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
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
      .eq('id', diveLogId)
      .single();

    if (error || !diveLog) {
      return new Response(JSON.stringify({ error: "Dive log not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Generar HTML para PDF
    const htmlContent = generatePDFHtml(diveLog);

    return new Response(JSON.stringify({
      success: true,
      html: htmlContent,
      diveLog: diveLog, // Incluir datos estructurados para jsPDF
      filename: `bitacora_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.pdf`
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
