
import React, { useState, useRef } from "react";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { useHtml2CanvasPDF } from "@/hooks/useHtml2CanvasPDF";
import { usePDFPreview } from "@/hooks/usePDFPreview";
import { PDFActionButtons } from "./pdf/PDFActionButtons";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { PDFTemplateSelector } from "./pdf/PDFTemplateSelector";
import { 
  createTempPDFContainer, 
  renderPDFComponent, 
  generatePDFFilename, 
  cleanupTempContainer 
} from "@/utils/pdfUtils";

interface PDFPreviewProps {
  diveLogId: string;
  hasSignature: boolean;
  diveLog?: DiveLogWithFullDetails;
}

export const PDFPreview = ({ diveLogId, hasSignature, diveLog }: PDFPreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'basic' | 'professional'>('professional');
  const printableRef = useRef<HTMLDivElement>(null);
  const { generatePDF, isExporting } = useHtml2CanvasPDF();
  const { isLoadingPreview, fullDiveLog, handlePreview } = usePDFPreview(diveLog);

  const handlePreviewClick = async () => {
    await handlePreview(diveLogId);
    setPreviewOpen(true);
  };

  const handleDownload = async () => {
    console.log("Download button clicked with template:", selectedTemplate);
    
    // Use the current preview data or the provided dive log
    const diveLogData = fullDiveLog || diveLog;
    
    if (!diveLogData) {
      console.log("No dive log data available for download");
      return;
    }

    // If preview is open, use the preview element directly
    if (previewOpen && printableRef.current) {
      console.log("Using preview element for PDF generation");
      const filename = generatePDFFilename(diveLogData);
      await generatePDF(printableRef.current, filename);
      return;
    }

    // Create a temporary container with proper React rendering
    console.log("Creating temporary React component for PDF generation");
    
    const tempContainer = createTempPDFContainer(diveLogData, hasSignature, selectedTemplate);
    
    try {
      // Render the React component with selected template
      await renderPDFComponent(tempContainer, diveLogData, hasSignature, selectedTemplate);

      // Generate PDF
      const filename = generatePDFFilename(diveLogData);
      console.log("Generating PDF with filename:", filename);
      await generatePDF(tempContainer.firstElementChild as HTMLElement, filename);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      // Clean up
      cleanupTempContainer(tempContainer);
    }
  };

  // Check if we have valid data to enable the download button
  const hasValidData = !!(diveLog || fullDiveLog);

  return (
    <>
      <div className="space-y-3">
        <PDFTemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
        
        <PDFActionButtons
          onPreview={handlePreviewClick}
          onDownload={handleDownload}
          isLoadingPreview={isLoadingPreview}
          isExporting={isExporting}
          hasValidData={hasValidData}
        />
      </div>

      <PDFPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        diveLog={fullDiveLog || diveLog || null}
        hasSignature={hasSignature}
        printableRef={printableRef}
        selectedTemplate={selectedTemplate}
      />
    </>
  );
};
