
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { diveLogId, preview = false, includeSignature = true, generatePDF = false } = await req.json();
    console.log("Received request for dive log:", diveLogId, "Preview:", preview);

    if (!diveLogId) {
      throw new Error("diveLogId es requerido");
    }

    // Fetch dive log with related data using proper join syntax
    const { data: diveLog, error } = await supabase
      .from('dive_logs')
      .select(`
        *,
        profiles!inner(username),
        centers(name)
      `)
      .eq('id', diveLogId)
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error("Bitácora no encontrada: " + error.message);
    }

    if (!diveLog) {
      throw new Error("Bitácora no encontrada");
    }

    console.log("Dive log data retrieved:", diveLog);

    // Generate filename
    const dateStr = diveLog.log_date ? new Date(diveLog.log_date).toISOString().split('T')[0] : 'sin-fecha';
    const centerName = diveLog.centers?.name ? diveLog.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
    const filename = `bitacora-${centerName}-${dateStr}-${diveLog.id.slice(-6)}.pdf`;

    // If preview mode, return data for frontend to generate HTML
    if (preview) {
      return new Response(JSON.stringify({
        success: true,
        diveLog,
        filename
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // For PDF generation, return the data with additional metadata
    const response = {
      success: true,
      diveLog,
      filename,
      logoUrl: "https://ujtuzthydhfckpxommcv.supabase.co/storage/v1/object/public/dive-log-images/logo.png",
      includeSignature,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
        format: "aerocam-standard"
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in export-dive-log-pdf:", error);
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
