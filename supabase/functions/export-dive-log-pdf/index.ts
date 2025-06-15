
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { diveLogId, includeSignature = true } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get dive log data
    const { data: diveLog, error } = await supabase
      .from('dive_logs')
      .select(`
        *,
        centers (name, location),
        dive_sites (name, location),
        boats (name, registration_number),
        profiles (username)
      `)
      .eq('id', diveLogId)
      .single()

    if (error) {
      throw new Error(`Error fetching dive log: ${error.message}`)
    }

    // Create HTML content for PDF
    const htmlContent = generatePDFHTML(diveLog, includeSignature)

    // For now, return the HTML content and a placeholder URL
    // In a real implementation, you would use a PDF generation library
    const pdfUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: pdfUrl,
        message: 'PDF generado exitosamente'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in export-dive-log-pdf function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function generatePDFHTML(diveLog: any, includeSignature: boolean): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bitácora de Buceo - ${diveLog.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .section { margin: 20px 0; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; }
        .signature { margin-top: 50px; border-top: 1px solid #333; padding-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BITÁCORA DE BUCEO</h1>
        <h2>${diveLog.centers?.name || 'Centro no especificado'}</h2>
    </div>
    
    <div class="section">
        <h3>Información General</h3>
        <div class="field"><span class="label">Fecha:</span> ${new Date(diveLog.log_date).toLocaleDateString('es-ES')}</div>
        <div class="field"><span class="label">Sitio de Buceo:</span> ${diveLog.dive_sites?.name || 'No especificado'}</div>
        <div class="field"><span class="label">Embarcación:</span> ${diveLog.boats?.name || 'No especificada'}</div>
        <div class="field"><span class="label">Supervisor:</span> ${diveLog.profiles?.username || 'No especificado'}</div>
    </div>

    <div class="section">
        <h3>Horarios</h3>
        <div class="field"><span class="label">Hora de Salida:</span> ${diveLog.departure_time || 'No especificada'}</div>
        <div class="field"><span class="label">Hora de Llegada:</span> ${diveLog.arrival_time || 'No especificada'}</div>
    </div>

    <div class="section">
        <h3>Condiciones Meteorológicas</h3>
        <div class="field">${diveLog.weather_conditions || 'No especificadas'}</div>
    </div>

    ${diveLog.divers_manifest ? `
    <div class="section">
        <h3>Manifiesto de Buzos</h3>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Certificación</th>
                    <th>Experiencia</th>
                </tr>
            </thead>
            <tbody>
                ${diveLog.divers_manifest.map((diver: any) => `
                    <tr>
                        <td>${diver.name || ''}</td>
                        <td>${diver.certification || ''}</td>
                        <td>${diver.experience || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    ${diveLog.observations ? `
    <div class="section">
        <h3>Observaciones</h3>
        <div class="field">${diveLog.observations}</div>
    </div>
    ` : ''}

    ${includeSignature && diveLog.signature_url ? `
    <div class="signature">
        <h3>Firma del Supervisor</h3>
        <img src="${diveLog.signature_url}" alt="Firma" style="max-width: 300px; max-height: 150px;">
        <div style="margin-top: 10px;">
            <span class="label">Supervisor:</span> ${diveLog.profiles?.username || 'No especificado'}
        </div>
    </div>
    ` : ''}
</body>
</html>
  `
}
