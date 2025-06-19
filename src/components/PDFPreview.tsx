
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { PrintableDiveLog } from "./PrintableDiveLog";
import { useReactToPrint } from "react-to-print";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [fullDiveLog, setFullDiveLog] = useState<DiveLogWithFullDetails | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `bitacora-${fullDiveLog?.centers?.name || 'centro'}-${fullDiveLog?.log_date || 'fecha'}-${fullDiveLog?.id?.slice(-6) || 'id'}`,
    pageStyle: `
      @page {
        size: letter;
        margin: 20mm;
      }
      @media print {
        .printable-page {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 10px !important;
        }
      }
    `,
  });

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.diveLog) {
        setFullDiveLog(data.diveLog);
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error previewing PDF:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    if (!fullDiveLog) {
      // Load dive log data if not already loaded
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error || !data.success) {
        console.error('Error loading dive log for download:', error);
        return;
      }

      setFullDiveLog(data.diveLog);
    }

    // Trigger print after data is loaded
    setTimeout(() => {
      if (printRef.current) {
        handlePrint();
      }
    }, 100);
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
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        Descargar PDF
      </Button>

      {/* Hidden component for printing */}
      <div style={{ display: 'none' }}>
        {fullDiveLog && (
          <PrintableDiveLog 
            ref={printRef}
            diveLog={fullDiveLog} 
            hasSignature={hasSignature}
          />
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Previsualización de Bitácora PDF</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded max-h-[80vh]">
            {fullDiveLog && (
              <PrintableDiveLog 
                diveLog={fullDiveLog} 
                hasSignature={hasSignature}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
