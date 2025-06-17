
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diveLogId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obtener datos completos de la bitácora
    const { data: diveLog, error } = await supabase
      .from('dive_logs')
      .select(`
        *,
        centers(name, location),
        dive_sites(name, location),
        boats(name, registration_number),
        profiles(username),
        signature_codes(code)
      `)
      .eq('id', diveLogId)
      .single();

    if (error) throw error;

    // Generar HTML optimizado para PDF (formato tabla compacta)
    const htmlContent = generateCompactPDFHTML(diveLog);

    // Por ahora retornamos el HTML - en producción se usaría una librería PDF real
    const pdfResponse = await generatePDFFromHTML(htmlContent);

    return new Response(pdfResponse, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bitacora-${diveLog.log_date}-${diveLogId.slice(0, 8)}.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateCompactPDFHTML(diveLog: any) {
  const manifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];
  const signatureCode = diveLog.signature_codes?.[0]?.code || 'N/A';

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 0.5cm;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 9px;
          line-height: 1.2;
          margin: 0;
          padding: 0;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .title {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
        }
        .subtitle {
          font-size: 10px;
          margin: 2px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        th, td {
          border: 1px solid #000;
          padding: 3px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
          text-align: center;
        }
        .section-title {
          background-color: #e0e0e0;
          font-weight: bold;
          text-align: center;
          padding: 4px;
        }
        .two-column {
          display: flex;
          gap: 10px;
        }
        .column {
          flex: 1;
        }
        .signature-section {
          margin-top: 10px;
          border: 2px solid #000;
          padding: 5px;
          text-align: center;
        }
        .signature-code {
          font-size: 12px;
          font-weight: bold;
          color: #6555FF;
          margin-top: 5px;
        }
        .compact-cell {
          padding: 2px;
          font-size: 8px;
        }
      </style>
    </head>
    <body>
      <!-- Encabezado -->
      <div class="header">
        <h1 class="title">BITÁCORA DE BUCEO</h1>
        <p class="subtitle">Sistema DiveLogger Pro - Registro Oficial de Operaciones Subacuáticas</p>
        <p class="subtitle">Fecha: ${new Date(diveLog.log_date).toLocaleDateString('es-ES')} | ID: ${diveLog.id.slice(0, 8)}</p>
      </div>

      <!-- Información General -->
      <table>
        <tr>
          <th colspan="6" class="section-title">INFORMACIÓN GENERAL</th>
        </tr>
        <tr>
          <th>Centro de Buceo</th>
          <td colspan="2">${diveLog.centers?.name || 'N/A'}</td>
          <th>Ubicación</th>
          <td colspan="2">${diveLog.centers?.location || 'N/A'}</td>
        </tr>
        <tr>
          <th>Punto de Buceo</th>
          <td colspan="2">${diveLog.dive_sites?.name || 'N/A'}</td>
          <th>Embarcación</th>
          <td colspan="2">${diveLog.boats?.name || 'Sin embarcación'}</td>
        </tr>
        <tr>
          <th>Supervisor</th>
          <td colspan="2">${diveLog.supervisor_name || diveLog.profiles?.username || 'N/A'}</td>
          <th>Horarios</th>
          <td>Salida: ${diveLog.departure_time || 'N/A'}</td>
          <td>Llegada: ${diveLog.arrival_time || 'N/A'}</td>
        </tr>
      </table>

      <!-- Condiciones Meteorológicas -->
      <table>
        <tr>
          <th colspan="4" class="section-title">CONDICIONES METEOROLÓGICAS</th>
        </tr>
        <tr>
          <td colspan="4">${diveLog.weather_conditions || 'No especificadas'}</td>
        </tr>
      </table>

      <!-- Manifiesto de Buzos -->
      <table>
        <tr>
          <th colspan="5" class="section-title">MANIFIESTO DE BUZOS</th>
        </tr>
        <tr>
          <th>N°</th>
          <th>Nombre del Buzo</th>
          <th>Licencia/Certificación</th>
          <th>Rol</th>
          <th>Profundidad de Trabajo (m)</th>
        </tr>
        ${manifest.map((diver: any, index: number) => `
        <tr>
          <td class="compact-cell">${index + 1}</td>
          <td class="compact-cell">${diver.name || 'N/A'}</td>
          <td class="compact-cell">${diver.license || 'N/A'}</td>
          <td class="compact-cell">${diver.role || 'Buzo'}</td>
          <td class="compact-cell">${diver.working_depth || 'N/A'}</td>
        </tr>
        `).join('')}
      </table>

      <!-- Observaciones -->
      <table>
        <tr>
          <th class="section-title">OBSERVACIONES Y TRABAJOS REALIZADOS</th>
        </tr>
        <tr>
          <td style="height: 60px; vertical-align: top;">
            ${diveLog.observations || 'Sin observaciones registradas'}
          </td>
        </tr>
      </table>

      <!-- Sección de Firma -->
      <div class="signature-section">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <strong>FIRMA DIGITAL DEL SUPERVISOR</strong>
            <br>
            ${diveLog.signature_url ? '✓ FIRMADO DIGITALMENTE' : '✗ SIN FIRMAR'}
            <br>
            <span class="signature-code">Código de Validación: ${signatureCode}</span>
          </div>
          <div style="flex: 1; text-align: right; font-size: 8px;">
            Estado: ${diveLog.status === 'signed' ? 'FIRMADA' : 'BORRADOR'}
            <br>
            Generado: ${new Date().toLocaleString('es-ES')}
            <br>
            Sistema: DiveLogger Pro v1.0
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 10px; text-align: center; font-size: 7px; color: #666;">
        Este documento es un registro oficial de operaciones de buceo generado por el sistema DiveLogger Pro.
        <br>
        La validez de este documento puede verificarse ingresando el código de validación en el sistema.
      </div>
    </body>
  </html>
  `;
}

async function generatePDFFromHTML(html: string): Promise<Uint8Array> {
  // En un entorno real, aquí usarías una librería como Puppeteer o similar
  // Por ahora retornamos un PDF básico como placeholder
  
  // Simulamos la generación de PDF retornando el HTML como bytes
  // En producción, esto debería usar una librería real de PDF
  const encoder = new TextEncoder();
  return encoder.encode(html);
}
