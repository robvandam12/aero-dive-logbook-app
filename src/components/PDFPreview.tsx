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

    // If preview is open, use the preview element directly
    if (previewOpen && printableRef.current) {
      console.log("Using preview element for PDF generation");
      const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
      
      await generatePDF(printableRef.current, filename);
      return;
    }

    // Create a temporary container that's visible but positioned off-screen
    console.log("Creating temporary visible element for PDF generation");
    
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = `
      <div id="temp-printable-dive-log" style="
        position: fixed;
        top: 0;
        left: -9999px;
        width: 816px;
        height: 1056px;
        background: white;
        z-index: -1000;
        opacity: 1;
        visibility: visible;
        overflow: visible;
        transform: none;
      ">
        <div class="printable-page bg-white p-6 font-sans text-gray-800 text-xs min-h-[11in] w-[8.5in] mx-auto" style="
          font-family: Arial, sans-serif !important;
          line-height: 1.2 !important;
          color: #000 !important;
          background: white !important;
          position: relative !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 816px !important;
          min-height: 1056px !important;
          padding: 24px !important;
          margin: 0 auto !important;
        ">
          ${generatePrintableHTML(diveLogData, hasSignature)}
        </div>
      </div>
    `;
    
    document.body.appendChild(tempContainer);
    
    try {
      // Wait longer for content to be properly rendered
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const printableElement = document.getElementById('temp-printable-dive-log');
      if (!printableElement) {
        throw new Error("Temporary element not found");
      }
      
      // Verify content has been rendered
      const hasTextContent = printableElement.textContent && printableElement.textContent.trim().length > 0;
      if (!hasTextContent) {
        throw new Error("Content not properly rendered - no text content found");
      }
      
      console.log("Temporary element rendered successfully, content length:", printableElement.textContent.length);
      
      // Generate filename
      const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const filename = `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
      
      console.log("Generating PDF with filename:", filename);
      await generatePDF(printableElement, filename);
      
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

// Helper function to generate static HTML content
function generatePrintableHTML(diveLog: DiveLogWithFullDetails, hasSignature: boolean): string {
  const diversManifest = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest as any[]
    : [];

  return `
    <!-- Header Section -->
    <header style="margin-bottom: 16px; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex-shrink: 0;">
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <img 
              src="/lovable-uploads/d1c62fdb-bdb7-4af0-b045-961a93bfb9bb.png" 
              alt="Aerocam Logo" 
              style="height: 40px; width: 40px; object-fit: contain; margin-right: 4px;"
            />
            <span style="font-size: 20px; font-weight: 600; color: #2563eb;">aerocam</span>
          </div>
          <p style="font-size: 10px; margin-top: 4px; font-weight: bold;">SOCIEDAD DE SERVICIOS AEROCAM SPA</p>
          <p style="font-size: 10px;">Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</p>
          <p style="font-size: 10px;">(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</p>
        </div>
        <div style="text-align: right; flex-shrink: 0;">
          <div style="display: flex; justify-content: flex-end; align-items: center; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 600; color: #4b5563; padding-right: 4px;">Fecha:</span>
            <div style="border: 1px solid #9ca3af; padding: 4px 8px; color: #374151; font-size: 12px; min-height: 24px; width: 112px; display: flex; align-items: center;">
              ${diveLog.log_date || ''}
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 4px;">
            <span style="font-weight: 600; font-size: 12px; margin-right: 4px;">Nº:</span>
            <div style="border: 1px solid #9ca3af; padding: 4px 8px; color: #16a34a; font-weight: bold; font-size: 12px; min-height: 24px; width: 112px; display: flex; align-items: center;">
              ${diveLog.id?.slice(-6) || ''}
            </div>
          </div>
        </div>
      </div>
      <h1 style="font-size: 18px; font-weight: bold; text-align: center; margin: 12px 0; text-transform: uppercase;">BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</h1>
      <div style="display: flex; align-items: center; font-size: 12px; margin-bottom: 4px;">
        <span style="font-weight: 600; color: #4b5563; padding-right: 4px; font-weight: bold;">CENTRO DE CULTIVO:</span>
        <div style="border: 1px solid #9ca3af; padding: 4px 8px; color: #374151; font-size: 12px; min-height: 24px; flex-grow: 1; display: flex; align-items: center;">
          ${diveLog.centers?.name || 'N/A'}
        </div>
      </div>
    </header>

    <!-- General Data Section -->
    <section style="margin-bottom: 16px; padding: 8px; border: 1px solid #9ca3af;">
      <h2 style="font-weight: bold; font-size: 14px; margin-bottom: 8px; text-align: center; background: #e5e7eb; padding: 4px; margin: -8px -8px 8px -8px;">DATOS GENERALES</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 600; color: #4b5563; padding-right: 4px;">SUPERVISOR:</span>
            <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; height: 24px; flex-grow: 1;">
              ${diveLog.profiles?.username || 'N/A'}
            </div>
          </div>
          <div style="display: flex; align-items: center; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 600; color: #4b5563; padding-right: 4px;">N° MATRICULA:</span>
            <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; height: 24px; flex-grow: 1;">
              ${diveLog.supervisor_license || 'N/A'}
            </div>
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: center; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 600; color: #4b5563; padding-right: 4px;">JEFE DE CENTRO:</span>
            <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; height: 24px; flex-grow: 1;">
              ${diveLog.center_manager || 'N/A'}
            </div>
          </div>
          <div style="display: flex; align-items: center; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 600; color: #4b5563; padding-right: 4px;">ASISTENTE DE CENTRO:</span>
            <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; height: 24px; flex-grow: 1;">
              ${diveLog.center_assistant || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Observations Section -->
    <section style="margin-bottom: 16px; padding: 8px; border: 1px solid #9ca3af;">
      <div style="display: flex; flex-direction: column; font-size: 12px;">
        <span style="font-weight: 600; color: #4b5563;">OBSERVACIONES:</span>
        <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; min-height: 60px; width: 100%;">
          ${diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
        </div>
      </div>
    </section>

    <!-- Signatures Section -->
    <section style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #9ca3af;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
        <div style="text-align: center;">
          <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; height: 64px; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
            (Firma)
          </div>
          <p style="border-top: 1px solid #000; padding-top: 4px; font-size: 12px;">NOMBRE Y CARGO</p>
          <p style="font-weight: 600; font-size: 12px;">FIRMA ENCARGADO DE CENTRO</p>
        </div>
        <div style="text-align: center;">
          <div style="border: 1px solid #9ca3af; padding: 2px 4px; color: #374141; font-size: 12px; height: 64px; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
            ${hasSignature && diveLog.signature_url ? 
              `<img src="${diveLog.signature_url}" alt="Firma" style="max-height: 56px; max-width: 100%; object-fit: contain;" />` : 
              '(Firma y Timbre)'
            }
          </div>
          <p style="border-top: 1px solid #000; padding-top: 4px; font-size: 12px;">NOMBRE Y CARGO</p>
          <p style="font-weight: 600; font-size: 12px;">FIRMA Y TIMBRE SUPERVISOR DE BUCEO</p>
          ${hasSignature ? 
            `<p style="font-size: 10px; color: #16a34a; font-weight: bold; margin-top: 4px;">
              FIRMADO DIGITALMENTE - Código: DL-${diveLog.id?.slice(0, 8).toUpperCase()}
            </p>` : ''
          }
        </div>
      </div>
      <p style="font-size: 9px; margin-top: 24px; text-align: center; color: #6b7280;">
        Queda prohibido cualquier tipo de explotación y, en particular, la reproducción, distribución, comunicación pública y/o transformación, total o parcial, por cualquier medio, de este documento sin el previo consentimiento expreso y por escrito de Aerocam SPA.
      </p>
    </section>
  `;
}
