
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
    console.log("Sending dive log email:", { diveLogId, recipientEmail, includePDF });

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no configurado");
    }

    if (!diveLogId || !recipientEmail) {
      throw new Error("diveLogId y recipientEmail son requeridos");
    }

    // Fetch dive log with complete data
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
      throw new Error("No se pudo obtener la bitácora: " + (diveLogError?.message || 'Bitácora no encontrada'));
    }

    // Generate filename
    const dateStr = diveLog.log_date ? new Date(diveLog.log_date).toISOString().split('T')[0] : 'sin-fecha';
    const centerName = diveLog.centers?.name ? diveLog.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
    const filename = `bitacora-${centerName}-${dateStr}-${diveLog.id.slice(-6)}.pdf`;

    // For email attachment, we'll use a placeholder PDF content for now
    // In a real implementation, you would need to integrate React-PDF server-side rendering
    const pdfContent = generatePDFPlaceholder(diveLog);
    const base64PDF = btoa(pdfContent);

    // Modern iOS-style email content
    const emailBody = generateModernEmailHTML({
      diveLog,
      recipientName,
      message,
      filename
    });

    // Prepare email
    const emailPayload = {
      from: "Aerocam SPA <noreply@resend.dev>",
      to: [recipientEmail],
      subject: `📋 Bitácora de Buceo - ${diveLog.centers?.name || 'Centro'} - ${diveLog.log_date || 'Sin fecha'}`,
      html: emailBody,
      attachments: includePDF ? [{
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
      filename
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

function generateModernEmailHTML({ diveLog, recipientName, message, filename }: any) {
  const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];
  const totalDivers = diversManifest.length;
  
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
            
            <div class="dive-info">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #1a1a1a; margin-bottom: 8px; font-size: 18px;">📋 Detalles de la Bitácora</h3>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🏢 Centro</span>
                    <span class="info-value">${diveLog.centers?.name || 'No especificado'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">📅 Fecha</span>
                    <span class="info-value">${diveLog.log_date ? new Date(diveLog.log_date).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'No especificada'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🏊‍♂️ Supervisor</span>
                    <span class="info-value">${diveLog.supervisor_name || diveLog.profiles?.username || 'No especificado'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🌊 Punto de Buceo</span>
                    <span class="info-value">${diveLog.dive_sites?.name || 'No especificado'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">👥 Buzos</span>
                    <span class="info-value">${totalDivers} buzo${totalDivers !== 1 ? 's' : ''}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">🆔 ID Bitácora</span>
                    <span class="info-value">#${diveLog.id.slice(-8).toUpperCase()}</span>
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

function generatePDFPlaceholder(diveLog: any): string {
  // This is a placeholder. In a production environment, you would need to:
  // 1. Set up React-PDF server-side rendering in the edge function
  // 2. Use the same components (DiveLogPDFDocument) to generate the actual PDF
  // 3. Convert the PDF to base64 for email attachment
  
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 1500
>>
stream
BT
/F1 16 Tf
50 750 Td
(AEROCAM SPA - BITACORA DE BUCEO) Tj
0 -40 Td
/F1 12 Tf
(Centro: ${diveLog.centers?.name || 'N/A'}) Tj
0 -20 Td
(Fecha: ${diveLog.log_date || 'N/A'}) Tj
0 -20 Td
(Supervisor: ${diveLog.supervisor_name || diveLog.profiles?.username || 'N/A'}) Tj
0 -20 Td
(ID: ${diveLog.id?.slice(-8) || 'N/A'}) Tj
0 -30 Td
(Estado: ${diveLog.signature_url ? 'FIRMADA DIGITALMENTE' : 'PENDIENTE DE FIRMA'}) Tj
0 -30 Td
(Punto de Buceo: ${diveLog.dive_sites?.name || 'N/A'}) Tj
0 -30 Td
(Observaciones: ${diveLog.observations || 'Sin observaciones'}) Tj
${diveLog.signature_url ? `
0 -40 Td
(*** DOCUMENTO FIRMADO DIGITALMENTE ***) Tj
0 -20 Td
(Codigo de Verificacion: DL-${diveLog.id?.slice(0, 8)?.toUpperCase() || 'N/A'}) Tj
` : ''}
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000001900 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
2000
%%EOF`;
}
