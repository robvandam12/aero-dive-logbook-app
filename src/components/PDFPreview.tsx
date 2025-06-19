
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download, Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { PrintableDiveLog } from "./PrintableDiveLog";
import { usePDFGeneratorWithHtml2Canvas } from "@/hooks/usePDFGeneratorWithHtml2Canvas";

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
  const { generatePDFFromElement } = usePDFGeneratorWithHtml2Canvas();

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    let diveLogData = fullDiveLog;
    
    if (!diveLogData) {
      // Load dive log data if not already loaded
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: { diveLogId, preview: true },
      });

      if (error || !data.success) {
        console.error('Error loading dive log for download:', error);
        return;
      }

      diveLogData = data.diveLog;
      setFullDiveLog(diveLogData);
    }

    if (diveLogData && printableRef.current) {
      const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
      
      await generatePDFFromElement(printableRef.current, filename);
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
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <Download className="w-4 h-4 mr-2" />
        Descargar PDF
      </Button>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Previsualización de Bitácora PDF</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="border-ocean-600 text-ocean-300 hover:bg-ocean-800 ml-4"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto bg-white rounded max-h-[80vh]">
            {fullDiveLog && (
              <div ref={printableRef}>
                <PrintableDiveLog 
                  diveLog={fullDiveLog} 
                  hasSignature={hasSignature}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
