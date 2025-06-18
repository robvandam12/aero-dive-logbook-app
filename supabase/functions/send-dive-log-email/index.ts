
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

    // Prepare recipients array
    const recipients = [recipientEmail];

    // Fetch dive log data from export function
    const exportResponse = await fetch(`${supabaseUrl}/functions/v1/export-dive-log-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        diveLogId,
        includeSignature: true,
        generatePDF: true
      }),
    });

    if (!exportResponse.ok) {
      throw new Error(`Error al obtener datos del PDF: ${exportResponse.statusText}`);
    }

    const exportData = await exportResponse.json();
    
    if (!exportData.success) {
      throw new Error(exportData.error || 'Error al generar datos del PDF');
    }

    const { diveLog, filename } = exportData;

    // Generate simplified PDF content for email attachment
    const pdfContent = generateSimplePDFContent(diveLog, true);
    
    // Convert to base64 for attachment
    const pdfBuffer = new TextEncoder().encode(pdfContent);
    const base64PDF = btoa(String.fromCharCode(...pdfBuffer));

    // Prepare email content
    const emailSubject = `Bitácora de Buceo - ${diveLog.centers?.name || 'Sin Centro'} - ${diveLog.log_date || 'Sin Fecha'}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6555FF, #8B5CF6); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚁 Aerocam App</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Sistema de Bitácoras de Buceo</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-top: 0;">Bitácora de Buceo</h2>
          
          ${message ? `
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #0c4a6e;">${message}</p>
            </div>
          ` : ''}
          
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6555FF;">Detalles de la Bitácora</h3>
            <p><strong>Centro:</strong> ${diveLog.centers?.name || 'N/A'}</p>
            <p><strong>Fecha:</strong> ${diveLog.log_date || 'N/A'}</p>
            <p><strong>Supervisor:</strong> ${diveLog.supervisor_name || 'N/A'}</p>
            <p><strong>ID:</strong> ${diveLog.id?.slice(-8).toUpperCase() || 'N/A'}</p>
            ${diveLog.signature_url ? '<p><strong>Estado:</strong> ✅ Firmada digitalmente</p>' : ''}
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            La bitácora completa se encuentra adjunta en formato PDF.
          </p>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2025 Aerocam App - Sistema Profesional de Bitácoras</p>
        </div>
      </div>
    `;

    // Send email using Resend
    const emailPayload = {
      from: "Aerocam App <noreply@resend.dev>",
      to: recipients,
      subject: emailSubject,
      html: emailBody,
      attachments: [
        {
          filename: filename,
          content: base64PDF,
          content_type: "application/pdf"
        }
      ]
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

function generateSimplePDFContent(diveLog: any, includeSignature: boolean): string {
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
/Length 2000
>>
stream
BT
/F1 12 Tf
50 750 Td
(AEROCAM - BITACORA DE BUCEO) Tj
0 -30 Td
(Centro: ${diveLog.centers?.name || 'N/A'}) Tj
0 -20 Td
(Fecha: ${diveLog.log_date || 'N/A'}) Tj
0 -20 Td
(Supervisor: ${diveLog.supervisor_name || 'N/A'}) Tj
0 -20 Td
(ID: ${diveLog.id?.slice(-8) || 'N/A'}) Tj
${includeSignature && diveLog.signature_url ? `
0 -30 Td
(Estado: FIRMADA DIGITALMENTE) Tj
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
0000002400 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
2500
%%EOF`;
}
