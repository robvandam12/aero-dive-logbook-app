
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
    console.log("Starting cleanup of temporary PDFs...");

    // Get all files in temp-pdfs bucket
    const { data: files, error } = await supabase.storage
      .from('temp-pdfs')
      .list('');

    if (error) {
      throw new Error(`Error listing files: ${error.message}`);
    }

    if (!files || files.length === 0) {
      console.log("No files found in temp-pdfs bucket");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No files to clean up",
        filesDeleted: 0
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${files.length} files in temp-pdfs bucket`);

    // Calculate cutoff time (24 hours ago)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);

    // Filter files older than 24 hours
    const oldFiles = files.filter(file => {
      const fileDate = new Date(file.created_at || 0);
      return fileDate < cutoffTime;
    });

    if (oldFiles.length === 0) {
      console.log("No old files found to delete");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "No old files found",
        filesDeleted: 0
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${oldFiles.length} old files to delete`);

    // Delete old files
    const fileNames = oldFiles.map(file => file.name);
    const { error: deleteError } = await supabase.storage
      .from('temp-pdfs')
      .remove(fileNames);

    if (deleteError) {
      throw new Error(`Error deleting files: ${deleteError.message}`);
    }

    console.log(`Successfully deleted ${fileNames.length} old PDF files`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Deleted ${fileNames.length} old files`,
      filesDeleted: fileNames.length,
      deletedFiles: fileNames
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in cleanup-temp-pdfs:", error);
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
