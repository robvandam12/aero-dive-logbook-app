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

// Helper function to find PDF in storage
async function findPDFInStorage(diveLogId: string): Promise<string | null> {
  try {
    console.log(`Looking for PDF files for dive log: ${diveLogId}`);
    
    const { data: files, error } = await supabase.storage
      .from('temp-pdfs')
      .list('', {
        search: `dive-log-${diveLogId}`
      });

    if (error) {
      console.error('Error listing files from storage:', error);
      return null;
    }

    if (!files || files.length === 0) {
      console.log('No PDF files found in storage for this dive log');
      return null;
    }

    // Sort by created date and get the most recent
    const sortedFiles = files.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    const latestFile = sortedFiles[0];
    console.log(`Found PDF file: ${latestFile.name}`);
    return latestFile.name;
  } catch (error) {
    console.error('Error in findPDFInStorage:', error);
    return null;
  }
}

// Helper function to download PDF from storage
async function downloadPDFFromStorage(fileName: string): Promise<string | null> {
  try {
    console.log(`Downloading PDF from storage: ${fileName}`);
    
    const { data, error } = await supabase.storage
      .from('temp-pdfs')
      .download(fileName);

    if (error) {
      console.error('Error downloading PDF from storage:', error);
      return null;
    }

    // Convert blob to base64
    const arrayBuffer = await data.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 string
    const decoder = new TextDecoder('latin1');
    const binaryString = decoder.decode(uint8Array);
    const base64PDF = btoa(binaryString);
    
    console.log('PDF downloaded and converted to base64 successfully');
    return base64PDF;
  } catch (error) {
    console.error('Error in downloadPDFFromStorage:', error);
    return null;
  }
}

// Helper function to clean up old PDFs (optional cleanup)
async function cleanupOldPDFs(diveLogId: string, keepLatest: boolean = true): Promise<void> {
  try {
    const { data: files, error } = await supabase.storage
      .from('temp-pdfs')
      .list('', {
        search: `dive-log-${diveLogId}`
      });

    if (error || !files || files.length <= 1) return;

    // Sort by created date
    const sortedFiles = files.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    // Keep the latest file, delete the rest
    const filesToDelete = keepLatest ? sortedFiles.slice(1) : sortedFiles;
    
    if (filesToDelete.length > 0) {
      const fileNames = filesToDelete.map(f => f.name);
      await supabase.storage
        .from('temp-pdfs')
        .remove(fileNames);
      
      console.log(`Cleaned up ${fileNames.length} old PDF files`);
    }
  } catch (error) {
    console.warn('Error cleaning up old PDFs:', error);
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

    let base64PDF = '';
    let pdfError = null;
    
    if (includePDF) {
      try {
        console.log("Looking for existing PDF in storage...");
        
        // Try to find existing PDF in storage
        const pdfFileName = await findPDFInStorage(diveLogId);
        
        if (pdfFileName) {
          // Download PDF from storage
          base64PDF = await downloadPDFFromStorage(pdfFileName) || '';
          
          if (base64PDF) {
            console.log("PDF retrieved from storage successfully");
            
            // Clean up old PDFs for this dive log (keep only the latest)
            await cleanupOldPDFs(diveLogId, true);
          } else {
            console.log("Failed to download PDF from storage");
            pdfError = "No se pudo descargar el PDF desde el almacenamiento";
          }
        } else {
          console.log("No PDF found in storage");
          pdfError = "PDF no encontrado. Por favor, descarga el PDF primero desde la web para poder enviarlo por email.";
        }
      } catch (error) {
        console.error("Error handling PDF from storage:", error);
        pdfError = error.message;
      }
    }

    // Generate email content
    console.log("Generating email content...");
    const emailBody = generateModernEmailHTML({
      diveLog,
      recipientName,
      message,
      filename,
      pdfError
    });

    // Prepare email payload
    const emailPayload = {
      from: "Aerocam SPA <noreply@resend.dev>",
      to: [recipientEmail],
      subject: `📋 Bitácora de Buceo - ${safeGet(diveLog, 'centers.name', 'Centro')} - ${safeFormatDate(diveLog.log_date)}`,
      html: emailBody,
      attachments: (includePDF && base64PDF) ? [{
        filename: filename,
        content: base64PDF,
        content_type: "application/pdf"
      }] : []
    };

    console.log("Sending email with Resend...");
    
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
      pdfGenerated: !!base64PDF,
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
        Para enviar el PDF por email, primero descárgalo desde la plataforma web y luego intenta enviar el email nuevamente.
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
        .attachment-info {
            background: #f8f9ff;
            border-radius: 16px;
            padding: 20px;
            margin: 24px 0;
            text-align: center;
        }
        .attachment-icon {
            font-size: 32px;
            margin-bottom: 12px;
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
                Te compartimos la bitácora de buceo solicitada. Encuentra todos los detalles importantes a continuación.
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
                <div class="attachment-info">
                    <div class="attachment-icon">📎</div>
                    <p style="color: #1a1a1a; font-weight: 600; margin-bottom: 8px;">
                        Archivo Adjunto
                    </p>
                    <p style="color: #8e8e93; font-size: 14px; margin: 0;">
                        ${filename}<br>
                        <small>Bitácora completa en formato PDF</small>
                    </p>
                </div>
            ` : ''}
            
            <p style="color: #8e8e93; font-size: 14px; text-align: center; margin: 24px 0;">
                Este documento contiene información profesional certificada por Aerocam SPA.
            </p>
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
