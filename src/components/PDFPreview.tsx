
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { PrintableDiveLog } from "./PrintableDiveLog";
import { useHtml2CanvasPDF } from "@/hooks/useHtml2CanvasPDF";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [fullDiveLog, setFullDiveLog] = useState<DiveLogWithFullDetails | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);
  const { generatePDF, isExporting } = useHtml2CanvasPDF();

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      // If we already have the dive log data, use it directly
      if (diveLog) {
        setFullDiveLog(diveLog);
        setPreviewOpen(true);
        return;
      }

      // Otherwise, try to fetch from the edge function (fallback)
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error) {
        console.log("Edge function not available, using existing dive log data");
        // Fallback to using existing data if available
        if (diveLog) {
          setFullDiveLog(diveLog);
          setPreviewOpen(true);
        }
        return;
      }

      if (data.success && data.diveLog) {
        setFullDiveLog(data.diveLog);
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
      // Fallback to using existing data
      if (diveLog) {
        setFullDiveLog(diveLog);
        setPreviewOpen(true);
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    console.log("Download button clicked");
    
    // Use the current preview data or the provided dive log
    const diveLogData = fullDiveLog || diveLog;
    
    if (!diveLogData) {
      console.log("No dive log data available for download");
      return;
    }

    // Generate filename
    const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
    const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
    const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
    
    if (printableRef.current) {
      console.log("Generating PDF with filename:", filename);
      await generatePDF(printableRef.current, filename);
    } else {
      console.error("Printable ref not available");
    }
  };

  // Check if we have valid data to enable the download button
  const hasValidData = !!(diveLog || fullDiveLog);

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePreview}
        disabled={isLoadingPreview}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Eye className="w-4 h-4 mr-2" />
        {isLoadingPreview ? 'Cargando...' : 'Previsualizar PDF'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        disabled={isExporting || !hasValidData}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Generando...' : 'Descargar PDF'}
      </Button>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Previsualización de Bitácora PDF
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded max-h-[80vh] p-4">
            <div ref={printableRef} id="printable-dive-log">
              {(fullDiveLog || diveLog) && (
                <PrintableDiveLog 
                  diveLog={fullDiveLog || diveLog!} 
                  hasSignature={hasSignature}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
