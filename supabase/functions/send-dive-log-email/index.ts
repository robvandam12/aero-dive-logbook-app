
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

// Helper function to safely get data
function safeGet(obj: any, path: string, fallback: string = 'N/A'): string {
  try {
    const value = path.split('.').reduce((current, key) => current?.[key], obj);
    return value?.toString() || fallback;
  } catch {
    return fallback;
  }
}

// Helper function to safely format date
function safeFormatDate(date: string | null): string {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('es-ES');
  } catch {
    return 'N/A';
  }
}

// Generate PDF using Puppeteer-compatible HTML
async function generatePDFFromHTML(diveLog: any, hasSignature: boolean): Promise<Uint8Array> {
  console.log("Generating PDF from HTML...");
  
  const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bitácora de Buceo</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        body { 
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
        }
        .logo-section {
            display: flex;
            align-items: center;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        .company-subtitle {
            font-size: 10px;
            color: #666;
            margin-bottom: 2px;
        }
        .date-box {
            background: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            min-width: 120px;
            text-align: center;
        }
        .date-label {
            font-size: 10px;
            color: #666;
            margin-bottom: 5px;
        }
        .date-value {
            font-size: 14px;
            font-weight: bold;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .center-info {
            background: #dbeafe;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            font-weight: bold;
            color: #1e40af;
        }
        .section {
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            overflow: hidden;
        }
        .section-title {
            background: #2563eb;
            color: white;
            padding: 10px 15px;
            font-weight: bold;
            font-size: 14px;
        }
        .section-content {
            padding: 15px;
        }
        .field-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .field {
            margin-bottom: 10px;
        }
        .field-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }
        .field-value {
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 3px;
            font-size: 12px;
            min-height: 20px;
        }
        .weather-section {
            background: #f9fafb;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .weather-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }
        .weather-options {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .checkbox {
            width: 12px;
            height: 12px;
            border: 1px solid #666;
            display: inline-block;
            margin-right: 5px;
            text-align: center;
            font-size: 10px;
            line-height: 10px;
        }
        .checkbox-checked {
            background: #10b981;
            color: white;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .table th,
        .table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: center;
            font-size: 10px;
        }
        .table th {
            background: #2563eb;
            color: white;
            font-weight: bold;
        }
        .table-row-even {
            background: #f9fafb;
        }
        .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 40px;
        }
        .signature-box {
            text-align: center;
        }
        .signature-area {
            border: 2px solid #d1d5db;
            height: 80px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
        }
        .signature-line {
            border-top: 2px solid #333;
            padding-top: 5px;
        }
        .signature-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .signature-name {
            font-weight: bold;
        }
        .digital-signature {
            background: #dcfce7;
            border: 1px solid #bbf7d0;
            padding: 5px;
            border-radius: 3px;
            margin-top: 5px;
        }
        .digital-signature-text {
            font-size: 9px;
            color: #16a34a;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 9px;
            color: #666;
            text-align: center;
            font-style: italic;
        }
        .page-break {
            page-break-before: always;
        }
        .work-detail {
            margin-bottom: 15px;
        }
        .work-detail-title {
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        .work-detail-content {
            border: 1px solid #d1d5db;
            padding: 10px;
            min-height: 60px;
            background: #f9fafb;
        }
        .observations-box {
            border: 1px solid #d1d5db;
            padding: 15px;
            min-height: 80px;
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
        }
    </style>
</head>
<body>
    <!-- Page 1 -->
    <div class="header">
        <div>
            <div class="company-name">aerocam</div>
            <div class="company-subtitle">SOCIEDAD DE SERVICIOS AEROCAM SPA</div>
            <div class="company-subtitle">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</div>
            <div class="company-subtitle">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</div>
        </div>
        <div class="date-box">
            <div class="date-label">Fecha</div>
            <div class="date-value">${safeFormatDate(diveLog.log_date)}</div>
            <div class="date-label">Nº</div>
            <div class="date-value" style="color: #2563eb;">${diveLog.id?.slice(-6) || ''}</div>
        </div>
    </div>

    <div class="title">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</div>

    <div class="center-info">
        Centro de Cultivo: ${safeGet(diveLog, 'centers.name', 'N/A')}
    </div>

    <div class="section">
        <div class="section-title">DATOS GENERALES</div>
        <div class="section-content">
            <div class="field-grid">
                <div class="field">
                    <div class="field-label">Supervisor</div>
                    <div class="field-value">${safeGet(diveLog, 'profiles.username', 'N/A')}</div>
                </div>
                <div class="field">
                    <div class="field-label">Jefe de Centro</div>
                    <div class="field-value">${diveLog.center_manager || 'N/A'}</div>
                </div>
            </div>
            
            <div class="field-grid">
                <div class="field">
                    <div class="field-label">N° Matrícula</div>
                    <div class="field-value">${diveLog.supervisor_license || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Asistente de Centro</div>
                    <div class="field-value">${diveLog.center_assistant || 'N/A'}</div>
                </div>
            </div>

            <div class="weather-section">
                <div class="weather-title">CONDICIÓN TIEMPO VARIABLES</div>
                <div class="weather-options">
                    <div>
                        <span class="checkbox ${diveLog.weather_good === true ? 'checkbox-checked' : ''}">
                            ${diveLog.weather_good === true ? '✓' : ''}
                        </span>
                        Favorable
                    </div>
                    <div>
                        <span class="checkbox ${diveLog.weather_good === false ? 'checkbox-checked' : ''}">
                            ${diveLog.weather_good === false ? '✓' : ''}
                        </span>
                        Desfavorable
                    </div>
                    <div style="flex: 1; margin-left: 20px;">
                        <div class="field-label">Observaciones</div>
                        <div class="field-value">${diveLog.weather_conditions || 'Buen tiempo'}</div>
                    </div>
                </div>
            </div>

            <div class="field-grid">
                <div class="field">
                    <div class="field-label">Compresor 1</div>
                    <div class="field-value">${diveLog.compressor_1 || ''}</div>
                </div>
                <div class="field">
                    <div class="field-label">Compresor 2</div>
                    <div class="field-value">${diveLog.compressor_2 || ''}</div>
                </div>
            </div>

            <div class="field-grid">
                <div class="field">
                    <div class="field-label">Hora de Inicio</div>
                    <div class="field-value">${diveLog.start_time || diveLog.departure_time || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Hora de Término</div>
                    <div class="field-value">${diveLog.end_time || diveLog.arrival_time || 'N/A'}</div>
                </div>
            </div>

            <div class="field">
                <div class="field-label">N° Solicitud de Faena</div>
                <div class="field-value">${diveLog.work_order_number || 'N/A'}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">TEAM DE BUCEO</div>
        <div class="section-content">
            <div style="text-align: center; font-weight: bold; margin-bottom: 15px;">
                Composición de Equipo Buzos y Asistentes
            </div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 8%;">#</th>
                        <th style="width: 25%;">IDENTIFICACIÓN</th>
                        <th style="width: 15%;">MATRÍCULA</th>
                        <th style="width: 12%;">CARGO</th>
                        <th style="width: 15%;">ESTÁNDAR<br/>(≤20m)</th>
                        <th style="width: 8%;">PROF.</th>
                        <th style="width: 8%;">INICIO</th>
                        <th style="width: 8%;">TÉRMINO</th>
                        <th style="width: 8%;">TIEMPO</th>
                    </tr>
                </thead>
                <tbody>
                    ${[1, 2, 3, 4].map((buzoNum, index) => {
                      const diver = diversManifest[buzoNum - 1];
                      const isEven = index % 2 === 0;
                      return `
                        <tr class="${isEven ? 'table-row-even' : ''}">
                            <td style="font-weight: bold; color: #2563eb;">${buzoNum}</td>
                            <td style="text-align: left;">${diver?.name || ''}</td>
                            <td>${diver?.license || ''}</td>
                            <td>${diver?.role || ''}</td>
                            <td>
                                <span class="checkbox ${diver?.standard_depth === true ? 'checkbox-checked' : ''}" style="font-size: 8px;">
                                    ${diver?.standard_depth === true ? '✓' : ''}
                                </span> Sí
                                <span class="checkbox ${diver?.standard_depth === false ? 'checkbox-checked' : ''}" style="font-size: 8px; margin-left: 5px;">
                                    ${diver?.standard_depth === false ? '✓' : ''}
                                </span> No
                            </td>
                            <td>${diver?.working_depth || ''}</td>
                            <td>${diver?.start_time || ''}</td>
                            <td>${diver?.end_time || ''}</td>
                            <td>${diver?.dive_time || ''}</td>
                        </tr>
                      `;
                    }).join('')}
                </tbody>
            </table>
            <div style="font-size: 9px; color: #666; margin-top: 5px; text-align: center;">
                * Capacidad máxima permitida: 20 metros de profundidad
            </div>
        </div>
    </div>

    <!-- Page Break -->
    <div class="page-break"></div>

    <!-- Page 2 -->
    <div class="header">
        <div>
            <div class="company-name">aerocam</div>
            <div class="company-subtitle">Bitácora de Buceo - Página 2</div>
        </div>
        <div class="date-box">
            <div class="date-label">Nº</div>
            <div class="date-value" style="color: #2563eb;">${diveLog.id?.slice(-6) || ''}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">DETALLE DE TRABAJO REALIZADO POR BUZO</div>
        <div class="section-content">
            ${[1, 2, 3, 4].map(buzoNum => {
              const diver = diversManifest[buzoNum - 1];
              return `
                <div class="work-detail">
                    <div class="work-detail-title">
                        BUZO ${buzoNum}${diver?.name ? ` - ${diver.name}` : ''}
                    </div>
                    <div class="work-detail-content">
                        ${diver?.work_description || diver?.work_performed || ''}
                    </div>
                </div>
              `;
            }).join('')}
        </div>
    </div>

    <div class="section">
        <div class="section-title">OBSERVACIONES GENERALES</div>
        <div class="section-content">
            <div class="observations-box">
                ${diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
            </div>
        </div>
    </div>

    <div class="signatures">
        <div class="signature-box">
            <div class="signature-area">
                <!-- Firma Encargado de Centro -->
            </div>
            <div class="signature-line">
                <div class="signature-label">Nombre y Cargo</div>
                <div class="signature-name">ENCARGADO DE CENTRO</div>
            </div>
        </div>
        
        <div class="signature-box">
            <div class="signature-area">
                ${hasSignature && diveLog.signature_url ? 
                  `<img src="${diveLog.signature_url}" style="max-height: 70px; max-width: 150px;" alt="Firma Digital"/>` : 
                  '<!-- Firma y Timbre -->'
                }
            </div>
            <div class="signature-line">
                <div class="signature-label">Nombre y Cargo</div>
                <div class="signature-name">SUPERVISOR DE BUCEO</div>
                ${hasSignature ? `
                    <div class="digital-signature">
                        <div class="digital-signature-text">✓ FIRMADO DIGITALMENTE</div>
                        <div style="font-size: 8px; color: #15803d;">Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    </div>

    <div class="footer">
        Este documento contiene información confidencial de Aerocam SPA. 
        Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
    </div>
</body>
</html>`;

  // Use Puppeteer to convert HTML to PDF
  try {
    const response = await fetch('https://api.htmlcsstoimage.com/v1/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Deno.env.get('HTMLCSS_API_KEY') || ''
      },
      body: JSON.stringify({
        html: htmlContent,
        css: '',
        google_fonts: 'Arial',
        format: 'pdf',
        width: 794,
        height: 1123,
        device_scale: 2
      })
    });

    if (!response.ok) {
      throw new Error(`PDF generation service error: ${response.status}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    return new Uint8Array(pdfBuffer);
  } catch (error) {
    console.error('Error with external PDF service, trying alternative approach:', error);
    
    // Fallback: Use simple HTML to PDF conversion
    // For now, we'll create a basic PDF structure manually
    // This is a simplified approach - in production you might want to use a different PDF library
    throw new Error('PDF generation failed: ' + error.message);
  }
}

serve(async (req) => {
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
    const { diveLogId, recipientEmail, recipientName, message, includePDF = true } = await req.json();
    console.log("Starting email send process:", { diveLogId, recipientEmail, includePDF });

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    if (!diveLogId || !recipientEmail) {
      throw new Error("diveLogId y recipientEmail son requeridos");
    }

    // Fetch dive log with complete data
    console.log("Fetching dive log data...");
    const { data: diveLog, error: diveLogError } = await supabase
      .from('dive_logs')
      .select(`
        *,
        profiles!inner(username),
        centers(name),
        dive_sites(name),
        boats(name)
      `)
      .eq('id', diveLogId)
      .single();

    if (diveLogError || !diveLog) {
      console.error("Error fetching dive log:", diveLogError);
      throw new Error("No se pudo obtener la bitácora: " + (diveLogError?.message || 'Bitácora no encontrada'));
    }

    console.log("Dive log data fetched successfully");

    // Generate filename
    const dateStr = diveLog.log_date ? new Date(diveLog.log_date).toISOString().split('T')[0] : 'sin-fecha';
    const centerName = safeGet(diveLog, 'centers.name', 'sin-centro').replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `bitacora-${centerName}-${dateStr}-${diveLog.id?.slice(-6) || 'unknown'}.pdf`;

    let attachments = [];
    let pdfError = null;

    // Try to generate PDF if requested
    if (includePDF) {
      try {
        console.log("Attempting to generate PDF...");
        const hasSignature = !(!diveLog.signature_url);
        const pdfBuffer = await generatePDFFromHTML(diveLog, hasSignature);
        
        // Convert Uint8Array to base64 for email attachment
        const base64PDF = btoa(String.fromCharCode(...pdfBuffer));
        
        attachments = [{
          filename: filename,
          content: base64PDF,
          content_type: 'application/pdf'
        }];
        
        console.log("PDF generated successfully");
      } catch (error) {
        console.error("Error generating PDF:", error);
        pdfError = `Error al generar PDF: ${error.message}`;
      }
    }
    
    // Generate email content
    console.log("Generating email content...");
    const emailBody = generateModernEmailHTML({
      diveLog,
      recipientName,
      message,
      filename,
      pdfError: pdfError || (attachments.length === 0 && includePDF ? "No se pudo generar el PDF. Puedes descargarlo desde la plataforma web." : null)
    });

    // Prepare email payload
    const emailPayload = {
      from: "Aerocam SPA <noreply@resend.dev>",
      to: [recipientEmail],
      subject: `📋 Bitácora de Buceo - ${safeGet(diveLog, 'centers.name', 'Centro')} - ${safeFormatDate(diveLog.log_date)}`,
      html: emailBody,
      attachments: attachments
    };

    console.log("Sending email with Resend...", { hasAttachments: attachments.length > 0 });
    
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
      throw new Error(`Error enviando email: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ 
      success: true, 
      result,
      diveLogId,
      filename,
      pdfGenerated: attachments.length > 0,
      pdfError: pdfError
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in send-dive-log-email:", error);
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

function generateModernEmailHTML({ diveLog, recipientName, message, filename, pdfError }: any) {
  const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];
  const totalDivers = diversManifest.length;
  
  const pdfWarning = pdfError ? `
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin: 16px 0;">
      <p style="color: #dc2626; margin: 0; font-size: 14px;">
        ⚠️ ${pdfError}
      </p>
      <p style="color: #7f1d1d; margin: 8px 0 0 0; font-size: 12px;">
        Puedes descargar el PDF desde la plataforma web visitando la bitácora directamente.
      </p>
    </div>
  ` : '';
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bitácora de Buceo - Aerocam</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f5f5f7;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #007AFF, #5856D6);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        .message-box {
            background: #f8f9ff;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
            border-left: 4px solid #007AFF;
        }
        .dive-info {
            background: #ffffff;
            border: 1px solid #e5e5ea;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f2f2f7;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #8e8e93;
            font-size: 14px;
        }
        .info-value {
            font-weight: 500;
            color: #1a1a1a;
            text-align: right;
            flex: 1;
            margin-left: 16px;
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-signed {
            background: #d1f2eb;
            color: #00875a;
        }
        .status-draft {
            background: #fff3cd;
            color: #856404;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e5ea;
        }
        .footer-text {
            font-size: 13px;
            color: #8e8e93;
            line-height: 1.4;
        }
        .brand-link {
            color: #007AFF;
            text-decoration: none;
            font-weight: 600;
        }
        @media (max-width: 600px) {
            .container { margin: 0; border-radius: 0; }
            .content, .header, .footer { padding: 20px; }
            .info-row { flex-direction: column; align-items: flex-start; }
            .info-value { margin-left: 0; margin-top: 4px; text-align: left; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚁 aerocam</div>
            <div class="subtitle">Sistema Profesional de Bitácoras</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hola${recipientName ? ` ${recipientName}` : ''},
            </div>
            
            <p style="color: #8e8e93; margin-bottom: 24px;">
                Te compartimos los detalles de la bitácora de buceo ${pdfError ? 'solicitada' : 'con el PDF adjunto'}.
            </p>
            
            ${message ? `
                <div class="message-box">
                    <p style="color: #1a1a1a; margin: 0; font-size: 15px;">${message}</p>
                </div>
            ` : ''}
            
            ${pdfWarning}
            
            <div class="dive-info">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #1a1a1a; margin-bottom: 8px; font-size: 18px;">📋 Detalles de la Bitácora</h3>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🏢 Centro</span>
                    <span class="info-value">${safeGet(diveLog, 'centers.name', 'No especificado')}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">📅 Fecha</span>
                    <span class="info-value">${safeFormatDate(diveLog.log_date) !== 'N/A' ? new Date(diveLog.log_date).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'No especificada'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🏊‍♂️ Supervisor</span>
                    <span class="info-value">${safeGet(diveLog, 'supervisor_name', 'No especificado') || safeGet(diveLog, 'profiles.username', 'No especificado')}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🌊 Punto de Buceo</span>
                    <span class="info-value">${safeGet(diveLog, 'dive_sites.name', 'No especificado')}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">👥 Buzos</span>
                    <span class="info-value">${totalDivers} buzo${totalDivers !== 1 ? 's' : ''}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🆔 ID Bitácora</span>
                    <span class="info-value">#${diveLog.id?.slice(-8)?.toUpperCase() || 'N/A'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">✅ Estado</span>
                    <span class="info-value">
                        <span class="status-badge ${diveLog.signature_url ? 'status-signed' : 'status-draft'}">
                            ${diveLog.signature_url ? '✓ Firmada Digitalmente' : '⏳ Pendiente de Firma'}
                        </span>
                    </span>
                </div>
            </div>
            
            ${!pdfError ? `
                <p style="color: #8e8e93; font-size: 14px; text-align: center; margin: 24px 0;">
                    📎 El PDF de la bitácora está adjunto a este correo.
                </p>
            ` : ''}
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © ${new Date().getFullYear()} <a href="#" class="brand-link">Aerocam SPA</a><br>
                Sistema Profesional de Bitácoras de Buceo<br>
                <small>Este correo fue generado automáticamente. Por favor, no respondas a este mensaje.</small>
            </p>
        </div>
    </div>
</body>
</html>`;
}
