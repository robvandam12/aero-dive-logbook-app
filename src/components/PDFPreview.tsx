import React, { useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
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

    // If preview is open, use the preview element directly
    if (previewOpen && printableRef.current) {
      console.log("Using preview element for PDF generation");
      const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
      
      await generatePDF(printableRef.current, filename);
      return;
    }

    // Create a temporary container with proper React rendering
    console.log("Creating temporary React component for PDF generation");
    
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-pdf-container';
    tempContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 816px;
      height: 1056px;
      background: white;
      z-index: 9999;
      opacity: 1;
      visibility: visible;
      overflow: visible;
      transform: none;
      pointer-events: none;
    `;
    
    document.body.appendChild(tempContainer);
    
    try {
      // Create React root and render the component
      const root = createRoot(tempContainer);
      
      // Wait for the component to render
      await new Promise<void>((resolve, reject) => {
        root.render(
          <div style={{ 
            width: '816px', 
            height: '1056px', 
            background: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.2',
            color: '#000'
          }}>
            <PrintableDiveLog 
              diveLog={diveLogData} 
              hasSignature={hasSignature}
              isTemporary={true}
            />
          </div>
        );
        
        // Wait for React to render
        setTimeout(() => {
          const content = tempContainer.textContent || '';
          if (content.trim().length > 100) {
            console.log("React component rendered successfully, content length:", content.length);
            resolve();
          } else {
            reject(new Error("React component not properly rendered"));
          }
        }, 2000);
      });

      // Generate filename
      const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
      
      console.log("Generating PDF with filename:", filename);
      await generatePDF(tempContainer.firstElementChild as HTMLElement, filename);
      
      // Clean up React root
      root.unmount();
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      // Clean up
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
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
