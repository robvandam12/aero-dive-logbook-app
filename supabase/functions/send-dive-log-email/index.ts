
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import React from "https://esm.sh/react@18.2.0";
import { pdf } from "https://esm.sh/@react-pdf/renderer@4.3.0";
import { Document, Page, Text, View, StyleSheet, Image } from "https://esm.sh/@react-pdf/renderer@4.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    color: '#374151',
  },
  value: {
    width: '70%',
    color: '#111827',
  },
  table: {
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: 1,
    borderColor: '#d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottom: 0.5,
    borderColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  signatureSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  signatureImage: {
    width: 200,
    height: 100,
    objectFit: 'contain',
    backgroundColor: '#ffffff',
  },
  signatureText: {
    marginTop: 10,
    fontSize: 10,
    color: '#64748b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
  },
});

// React-PDF Document Component
const DiveLogPDFDocument = ({ diveLog, hasSignature }: any) => {
  const diversManifest = Array.isArray(diveLog.divers_manifest) ? diveLog.divers_manifest : [];

  return React.createElement(Document, {
    title: `Bitácora de Buceo - ${diveLog.centers?.name || 'Centro'} - ${diveLog.log_date || 'Sin fecha'}`,
    author: "Aerocam SPA",
    subject: "Bitácora de Buceo",
    creator: "Sistema de Bitácoras Aerocam",
    producer: "React-PDF"
  }, [
    // Page 1
    React.createElement(Page, { key: 'page1', size: 'A4', style: pdfStyles.page }, [
      React.createElement(View, { key: 'header', style: pdfStyles.header }, [
        React.createElement(View, { key: 'headerContent' }, [
          React.createElement(Text, { key: 'title', style: pdfStyles.title }, 'AEROCAM SPA'),
          React.createElement(Text, { key: 'subtitle', style: pdfStyles.subtitle }, 'BITÁCORA DE BUCEO PROFESIONAL')
        ])
      ]),

      React.createElement(View, { key: 'generalInfo', style: pdfStyles.section }, [
        React.createElement(Text, { key: 'sectionTitle', style: pdfStyles.sectionTitle }, 'INFORMACIÓN GENERAL'),
        React.createElement(View, { key: 'row1', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label1', style: pdfStyles.label }, 'Centro:'),
          React.createElement(Text, { key: 'value1', style: pdfStyles.value }, diveLog.centers?.name || 'N/A')
        ]),
        React.createElement(View, { key: 'row2', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label2', style: pdfStyles.label }, 'Fecha:'),
          React.createElement(Text, { key: 'value2', style: pdfStyles.value }, diveLog.log_date ? new Date(diveLog.log_date).toLocaleDateString('es-ES') : 'N/A')
        ]),
        React.createElement(View, { key: 'row3', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label3', style: pdfStyles.label }, 'Supervisor:'),
          React.createElement(Text, { key: 'value3', style: pdfStyles.value }, diveLog.supervisor_name || diveLog.profiles?.username || 'N/A')
        ]),
        React.createElement(View, { key: 'row4', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label4', style: pdfStyles.label }, 'Punto de Buceo:'),
          React.createElement(Text, { key: 'value4', style: pdfStyles.value }, diveLog.dive_sites?.name || 'N/A')
        ]),
        React.createElement(View, { key: 'row5', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label5', style: pdfStyles.label }, 'Embarcación:'),
          React.createElement(Text, { key: 'value5', style: pdfStyles.value }, diveLog.boats?.name || 'N/A')
        ])
      ]),

      React.createElement(View, { key: 'timesInfo', style: pdfStyles.section }, [
        React.createElement(Text, { key: 'sectionTitle2', style: pdfStyles.sectionTitle }, 'HORARIOS'),
        React.createElement(View, { key: 'row6', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label6', style: pdfStyles.label }, 'Hora Salida:'),
          React.createElement(Text, { key: 'value6', style: pdfStyles.value }, diveLog.departure_time || 'N/A')
        ]),
        React.createElement(View, { key: 'row7', style: pdfStyles.row }, [
          React.createElement(Text, { key: 'label7', style: pdfStyles.label }, 'Hora Llegada:'),
          React.createElement(Text, { key: 'value7', style: pdfStyles.value }, diveLog.arrival_time || 'N/A')
        ])
      ]),

      React.createElement(View, { key: 'diversTable', style: pdfStyles.table }, [
        React.createElement(Text, { key: 'diversTitle', style: pdfStyles.sectionTitle }, 'MANIFIESTO DE BUZOS'),
        React.createElement(View, { key: 'tableHeader', style: pdfStyles.tableHeader }, [
          React.createElement(Text, { key: 'th1', style: pdfStyles.tableCell }, 'Nombre'),
          React.createElement(Text, { key: 'th2', style: pdfStyles.tableCell }, 'Rol'),
          React.createElement(Text, { key: 'th3', style: pdfStyles.tableCell }, 'Licencia'),
          React.createElement(Text, { key: 'th4', style: pdfStyles.tableCell }, 'Profundidad')
        ]),
        ...diversManifest.map((diver: any, index: number) => 
          React.createElement(View, { key: `diver-${index}`, style: pdfStyles.tableRow }, [
            React.createElement(Text, { key: `name-${index}`, style: pdfStyles.tableCell }, diver.name || 'N/A'),
            React.createElement(Text, { key: `role-${index}`, style: pdfStyles.tableCell }, diver.role || 'N/A'),
            React.createElement(Text, { key: `license-${index}`, style: pdfStyles.tableCell }, diver.license || 'N/A'),
            React.createElement(Text, { key: `depth-${index}`, style: pdfStyles.tableCell }, diver.working_depth ? `${diver.working_depth}m` : 'N/A')
          ])
        )
      ]),

      React.createElement(View, { key: 'observations', style: pdfStyles.section }, [
        React.createElement(Text, { key: 'obsTitle', style: pdfStyles.sectionTitle }, 'OBSERVACIONES'),
        React.createElement(Text, { key: 'obsText', style: { fontSize: 10, color: '#374151' } }, diveLog.observations || 'Sin observaciones registradas')
      ]),

      React.createElement(Text, { key: 'footer', style: pdfStyles.footer }, `Documento generado por Aerocam SPA - ID: ${diveLog.id?.slice(-8)?.toUpperCase() || 'N/A'}`)
    ]),

    // Page 2 - Signature
    React.createElement(Page, { key: 'page2', size: 'A4', style: pdfStyles.page }, [
      React.createElement(View, { key: 'signatureSection', style: pdfStyles.signatureSection }, [
        React.createElement(Text, { key: 'signatureTitle', style: pdfStyles.sectionTitle }, 'FIRMA DIGITAL DEL SUPERVISOR'),
        
        hasSignature && diveLog.signature_url ? 
          React.createElement(View, { key: 'signatureContainer' }, [
            React.createElement(Image, { 
              key: 'signatureImg', 
              style: pdfStyles.signatureImage, 
              src: diveLog.signature_url 
            }),
            React.createElement(Text, { key: 'signedText', style: pdfStyles.signatureText }, 
              `Firmado digitalmente el ${new Date().toLocaleDateString('es-ES')} por ${diveLog.supervisor_name || diveLog.profiles?.username || 'Supervisor'}`
            ),
            React.createElement(Text, { key: 'verificationCode', style: pdfStyles.signatureText }, 
              `Código de verificación: DL-${diveLog.id?.slice(0, 8)?.toUpperCase() || 'N/A'}`
            )
          ]) :
          React.createElement(View, { key: 'noSignature', style: { height: 100, width: 200, backgroundColor: '#ffffff', border: 1, borderColor: '#d1d5db' } }, [
            React.createElement(Text, { key: 'pendingText', style: { textAlign: 'center', paddingTop: 40, color: '#9ca3af' } }, 'Pendiente de firma')
          ])
      ])
    ])
  ]);
};

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

    let base64PDF = '';
    
    if (includePDF) {
      try {
        console.log("Generating React-PDF for email attachment...");
        
        // Generate PDF using React-PDF with pdf().toBlob() for Deno compatibility
        const pdfDocument = React.createElement(DiveLogPDFDocument, { 
          diveLog, 
          hasSignature: !!diveLog.signature_url 
        });
        
        // Use pdf().toBlob() instead of renderToStream for Deno compatibility
        const pdfBlob = await pdf(pdfDocument).toBlob();
        
        // Convert blob to base64
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert to base64 string
        const decoder = new TextDecoder('latin1');
        const binaryString = decoder.decode(uint8Array);
        base64PDF = btoa(binaryString);
        
        console.log("React-PDF generated successfully for email");
      } catch (pdfError) {
        console.error("Error generating React-PDF:", pdfError);
        throw new Error("Error generando PDF: " + pdfError.message);
      }
    }

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
      attachments: includePDF && base64PDF ? [{
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
