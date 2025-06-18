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
  const diversList = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest.map((diver: any, index: number) => `
        <tr>
          <td style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 10px;">${index + 1}</td>
          <td style="border: 1px solid #000; padding: 4px; font-size: 10px;">${diver.name || 'N/A'}</td>
          <td style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 10px;">${diver.license || 'N/A'}</td>
          <td style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 10px;">${diver.role || 'BUZO'}</td>
          <td style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 10px;">SI</td>
          <td style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 10px;">NO</td>
          <td style="border: 1px solid #000; padding: 4px; font-size: 10px;">${diver.working_depth || 'N/A'}</td>
          <td style="border: 1px solid #000; padding: 4px; font-size: 10px;"></td>
          <td style="border: 1px solid #000; padding: 4px; font-size: 10px;"></td>
          <td style="border: 1px solid #000; padding: 4px; font-size: 10px;"></td>
        </tr>
      `).join('')
    : '<tr><td colspan="10" style="border: 1px solid #000; padding: 4px; text-align: center;">No hay buzos registrados</td></tr>';

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
          text-align: center; 
          margin-bottom: 15px;
          border: 2px solid #000;
          padding: 8px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .logo-section img {
          height: 40px;
          width: auto;
        }
        .company-info {
          font-size: 8px;
          margin-bottom: 5px;
          color: black;
        }
        .title-section {
          text-align: center;
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 10px;
          color: black;
        }
        .form-number {
          float: right;
          border: 1px solid #000;
          padding: 5px;
          font-size: 10px;
          color: black;
        }
        .clear { clear: both; }
        .section {
          border: 1px solid #000;
          margin-bottom: 8px;
          padding: 5px;
        }
        .section-title {
          background-color: #ddd;
          font-weight: bold;
          text-align: center;
          padding: 3px;
          margin: -5px -5px 5px -5px;
          font-size: 10px;
          color: black;
        }
        .signature-section {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          border: 1px solid #000;
          width: 150px;
          height: 80px;
          text-align: center;
          padding: 5px;
          position: relative;
        }
        .signature-image {
          max-width: 140px;
          max-height: 50px;
          margin-top: 5px;
        }
        .form-row {
          display: flex;
          margin-bottom: 3px;
        }
        .form-field {
          border: 1px solid #000;
          padding: 2px 4px;
          margin-right: 5px;
          font-size: 9px;
        }
        .form-field label {
          font-weight: bold;
          display: block;
          font-size: 8px;
        }
        .form-field.flex-1 { flex: 1; }
        .form-field.flex-2 { flex: 2; }
        .table-section {
          margin: 8px 0;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
        }
        th, td { 
          border: 1px solid #000; 
          padding: 2px; 
          text-align: center;
          font-size: 8px;
        }
        th { 
          background-color: #ddd; 
          font-weight: bold;
        }
        .work-detail {
          min-height: 120px;
          border: 1px solid #000;
          padding: 5px;
          margin: 8px 0;
        }
        .work-detail-title {
          background-color: #ddd;
          font-weight: bold;
          text-align: center;
          padding: 3px;
          margin: -5px -5px 8px -5px;
          font-size: 10px;
        }
        .checkbox {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1px solid #000;
          margin: 0 3px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          SOCIEDAD DE SERVICIOS AEROCAM SPA<br>
          Ignacio Carrera Pinto N° 2001, Quellón - Chiloé<br>
          RUT: 76.355.932-4 - Contacto: contacto@aerocam.cl
        </div>
        <div class="logo-section">
          <img src="https://ujtuzthydhfckpxommcv.supabase.co/storage/v1/object/public/dive-log-images/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" alt="Aerocam Logo">
          <strong style="font-size: 16px; color: #6555FF;">AEROCAM APP</strong>
        </div>
        <div class="form-number">
          <strong>N° ${diveLog.id.slice(0, 6).toUpperCase()}</strong>
        </div>
        <div class="title-section">
          BITÁCORA BUCEO<br>
          E INFORME DE TRABAJO REALIZADO<br>
          <small>CENTRO DE CULTIVO: ${diveLog.centers?.name || 'N/A'}</small>
        </div>
        <div class="clear"></div>
        <div style="text-align: right; font-size: 8px; color: black;">
          Fecha: ${diveLog.log_date}
        </div>
      </div>

      <div class="section">
        <div class="section-title">DATOS GENERALES</div>
        <div class="form-row">
          <div class="form-field flex-1">
            <label>JEFE DE CENTRO:</label>
            ${diveLog.centers?.name || 'N/A'}
          </div>
          <div class="form-field flex-1">
            <label>ASISTENTE DE CENTRO:</label>
            ${diveLog.profiles?.username || 'N/A'}
          </div>
        </div>
        <div class="form-row">
          <div class="form-field flex-1">
            <label>N° MATRÍCULA:</label>
            ${diveLog.boats?.registration_number || 'N/A'}
          </div>
          <div class="form-field flex-2">
            <label>REGISTRO DE COMPRESORES:</label>
            ___________________
          </div>
        </div>
        <div class="form-row">
          <div class="form-field flex-2">
            <label>CONDICIÓN TIEMPO VARIABLES:</label>
            <div>
              COMPRESOR 1: <span class="checkbox"></span> SI <span class="checkbox"></span> NO
              COMPRESOR 2: <span class="checkbox"></span> SI <span class="checkbox"></span> NO
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-field flex-1">
            <label>OBSERVACIONES:</label>
            ${diveLog.weather_conditions || 'Buen tiempo'}
          </div>
          <div class="form-field flex-1">
            <label>KG SOLICITUD DE FAENA:</label>
            ___________________
          </div>
        </div>
        <div class="form-row">
          <div class="form-field flex-1">
            <label>FECHA Y HORA DE INICIO:</label>
            ${diveLog.departure_time || 'N/A'}
          </div>
          <div class="form-field flex-1">
            <label>FECHA Y HORA DE TÉRMINO:</label>
            ${diveLog.arrival_time || 'N/A'}
          </div>
        </div>
      </div>

      <div class="table-section">
        <div class="section-title">TEAM DE BUCEO</div>
        <table>
          <thead>
            <tr>
              <th rowspan="2">N°</th>
              <th rowspan="2">COMPOSICIÓN DE EQUIPO BUZOS Y ASISTENTES</th>
              <th rowspan="2">N° MATRÍCULA</th>
              <th rowspan="2">CARGO</th>
              <th colspan="2">BUCEO ESTÁNDAR</th>
              <th rowspan="2">PROFUNDIDAD MÁXIMA REALIZADA</th>
              <th rowspan="2">ÁREA DE TRABAJO</th>
              <th rowspan="2">TIEMPO FONDO</th>
              <th rowspan="2">TIEMPO TOTAL</th>
            </tr>
            <tr>
              <th>SI</th>
              <th>NO</th>
            </tr>
          </thead>
          <tbody>
            ${diversList}
          </tbody>
        </table>
      </div>

      <div class="work-detail">
        <div class="work-detail-title">DETALLE DE TRABAJO REALIZADO POR BUZO</div>
        <div style="font-size: 9px; line-height: 1.4;">
          ${diveLog.observations || 'Trabajo realizado normal. Buceo sin novedad.'}
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div style="font-size: 8px; font-weight: bold; color: black;">NOMBRE Y FIRMA</div>
          <div style="font-size: 8px; color: black;">JEFE ENCARGADO DE CENTRO</div>
        </div>
        <div class="signature-box">
          <div style="font-size: 8px; font-weight: bold; color: black;">FIRMA Y TIMBRE</div>
          <div style="font-size: 8px; color: black;">SUPERVISOR DE BUCEO</div>
          ${diveLog.signature_url ? `
            <img src="${diveLog.signature_url}" alt="Firma" class="signature-image">
            <div style="margin-top: 5px; font-size: 8px; color: black;">
              <strong>Código: DL-${diveLog.id.slice(0, 8).toUpperCase()}</strong>
            </div>
          ` : ''}
        </div>
      </div>

      <div style="font-size: 7px; text-align: center; margin-top: 10px; border-top: 1px solid #000; padding-top: 5px; color: black;">
        Queda estrictamente prohibido el uso de exploración y en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, método o sistema, del presente documento.<br>
        Su uso se encuentra reservado al personal de Aerocam SpA.
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
