
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { useReactPDFGenerator } from "@/hooks/useReactPDFGenerator";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [fullDiveLog, setFullDiveLog] = useState<DiveLogWithFullDetails | null>(null);
  
  const { generatePDF: generateReactPDF, isGenerating } = useReactPDFGenerator();

  // Load dive log data when component mounts or diveLogId changes
  useEffect(() => {
    if (diveLog) {
      setFullDiveLog(diveLog);
    }
  }, [diveLog]);

  const loadDiveLogData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.diveLog) {
        setFullDiveLog(data.diveLog);
        return data.diveLog;
      }
    } catch (error) {
      console.error('Error loading dive log:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    console.log("Download button clicked");
    
    let diveLogData = fullDiveLog;
    
    // Load data if not already available
    if (!diveLogData) {
      console.log("Loading dive log data for download...");
      diveLogData = await loadDiveLogData();
      
      if (!diveLogData) {
        console.error('Failed to load dive log data');
        return;
      }
    }

    // Use React-PDF for generation - this will automatically upload to Storage
    await generateReactPDF(diveLogData, hasSignature);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        disabled={isGenerating}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generando...' : 'Descargar PDF'}
      </Button>
    </div>
  );
};
