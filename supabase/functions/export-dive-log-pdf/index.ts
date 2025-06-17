
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
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          font-size: 12px;
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
          border-bottom: 2px solid #6555FF;
          padding-bottom: 15px;
        }
        .logo { 
          color: #6555FF; 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 5px;
        }
        .subtitle { 
          color: #666; 
          font-size: 14px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-section {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
        }
        .info-section h3 {
          margin: 0 0 10px 0;
          color: #6555FF;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .label { font-weight: bold; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left;
        }
        th { 
          background-color: #6555FF; 
          color: white;
          font-weight: bold;
        }
        .signature-section {
          margin-top: 40px;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .signature-code {
          background: #6555FF;
          color: white;
          padding: 5px 10px;
          border-radius: 3px;
          font-family: monospace;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        @media print {
          body { margin: 10px; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🚁 AEROCAM APP</div>
        <div class="subtitle">Sistema de Bitácoras de Buceo Profesional</div>
        <div style="margin-top: 10px; font-weight: bold;">BITÁCORA DE BUCEO</div>
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
            <span class="label">Sitio de Buceo:</span>
            <span>${diveLog.dive_sites?.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Embarcación:</span>
            <span>${diveLog.boats?.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Supervisor:</span>
            <span>${diveLog.profiles?.username || diveLog.supervisor_name || 'N/A'}</span>
          </div>
        </div>

        <div class="info-section">
          <h3>CONDICIONES</h3>
          <div class="info-row">
            <span class="label">Hora Salida:</span>
            <span>${diveLog.departure_time || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Hora Llegada:</span>
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
          <div class="info-row">
            <span class="label">Clima:</span>
            <span>${diveLog.weather_conditions || 'N/A'}</span>
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
          <p>${diveLog.observations}</p>
        </div>
      ` : ''}

      <div class="signature-section">
        <h3 style="margin-top: 0;">VALIDACIÓN Y FIRMA DIGITAL</h3>
        <div class="info-row">
          <span class="label">Estado:</span>
          <span>${diveLog.status === 'signed' ? 'FIRMADO DIGITALMENTE' : diveLog.status === 'draft' ? 'BORRADOR' : 'INVALIDADO'}</span>
        </div>
        ${diveLog.signature_url ? `
          <div class="info-row">
            <span class="label">Código de Validación:</span>
            <span class="signature-code">DL-${diveLog.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div style="margin-top: 10px;">
            <img src="${diveLog.signature_url}" alt="Firma Digital" style="max-width: 200px; border: 1px solid #ddd;">
          </div>
        ` : ''}
      </div>

      <div class="footer">
        <p>Documento generado el ${new Date().toLocaleString('es-ES')} por Aerocam App</p>
        <p>© 2025 Aerocam - Sistema profesional de gestión de bitácoras de buceo</p>
        ${diveLog.status === 'signed' ? `<p><strong>Código de verificación: DL-${diveLog.id.slice(0, 8).toUpperCase()}</strong></p>` : ''}
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
    const { diveLogId } = await req.json();

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
      filename: `bitacora_${diveLog.log_date}_${diveLog.id.slice(0, 8)}.html`
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
