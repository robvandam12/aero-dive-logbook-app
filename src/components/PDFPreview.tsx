
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { PrintableDiveLogPage1 } from "./PrintableDiveLogPage1";
import { PrintableDiveLogPage2 } from "./PrintableDiveLogPage2";
import { useAdvancedPDFGenerator } from "@/hooks/useAdvancedPDFGenerator";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [fullDiveLog, setFullDiveLog] = useState<DiveLogWithFullDetails | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const { generateMultiPagePDF, isGenerating } = useAdvancedPDFGenerator();

  // Load dive log data when component mounts or diveLogId changes
  useEffect(() => {
    if (diveLog) {
      setFullDiveLog(diveLog);
      setIsDataReady(true);
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
        setIsDataReady(true);
        return data.diveLog;
      }
    } catch (error) {
      console.error('Error loading dive log:', error);
      return null;
    }
  };

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      const diveLogData = fullDiveLog || await loadDiveLogData();
      if (diveLogData) {
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
    } finally {
      setIsLoadingPreview(false);
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

    // Wait a moment to ensure refs are available after data is loaded
    await new Promise(resolve => setTimeout(resolve, 100));

    if (diveLogData && page1Ref.current && page2Ref.current) {
      const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
      
      console.log("Generating multi-page PDF with filename:", filename);
      await generateMultiPagePDF(page1Ref.current, page2Ref.current, filename);
    } else {
      console.error("Missing dive log data or page refs", {
        diveLogData: !!diveLogData,
        page1Ref: !!page1Ref.current,
        page2Ref: !!page2Ref.current
      });
    }
  };

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
        disabled={isGenerating}
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generando...' : 'Descargar PDF'}
      </Button>

      {/* Hidden components for PDF generation - always render when data is ready */}
      {isDataReady && fullDiveLog && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={page1Ref}>
            <PrintableDiveLogPage1 diveLog={fullDiveLog} />
          </div>
          <div ref={page2Ref}>
            <PrintableDiveLogPage2 diveLog={fullDiveLog} hasSignature={hasSignature} />
          </div>
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Previsualización de Bitácora PDF (2 Páginas)
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-gray-100 rounded max-h-[80vh] p-4">
            {fullDiveLog && (
              <div className="space-y-8">
                {/* Página 1 */}
                <div className="bg-white shadow-lg">
                  <PrintableDiveLogPage1 diveLog={fullDiveLog} />
                </div>
                
                {/* Separador visual */}
                <div className="text-center py-2 bg-gray-200 text-gray-600 text-sm font-semibold">
                  --- SEPARACIÓN DE PÁGINAS ---
                </div>
                
                {/* Página 2 */}
                <div className="bg-white shadow-lg">
                  <PrintableDiveLogPage2 diveLog={fullDiveLog} hasSignature={hasSignature} />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
