
import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

export const useHtml2CanvasPDF = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = useCallback(async (element: HTMLElement, filename: string = 'bitacora-buceo.pdf') => {
    if (!element) {
      console.error("No element provided to generate PDF.");
      toast({
        title: "Error",
        description: "No hay contenido para exportar a PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      console.log("Starting PDF generation...");
      console.log("Element dimensions:", {
        width: element.scrollWidth,
        height: element.scrollHeight,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight
      });
      
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if element has content
      const hasContent = element.textContent && element.textContent.trim().length > 0;
      if (!hasContent) {
        throw new Error("Element appears to be empty");
      }
      
      console.log("Element content preview:", element.textContent?.substring(0, 200));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 30000,
        width: 816,
        height: 1056,
        windowWidth: 1920,
        windowHeight: 1080,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc, clonedElement) => {
          console.log("Cloning document for html2canvas");
          
          // Apply styles directly to cloned element
          const styles = `
            * {
              font-family: Arial, sans-serif !important;
              color: #000 !important;
              background: transparent !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              background: white !important;
            }
            .printable-page, .printable-page-temp {
              font-family: Arial, sans-serif !important;
              color: #000 !important;
              background: white !important;
              font-size: 12px !important;
              line-height: 1.2 !important;
              width: 816px !important;
              min-height: 1056px !important;
              padding: 24px !important;
              margin: 0 !important;
              box-sizing: border-box !important;
            }
          `;
          
          const styleSheet = clonedDoc.createElement('style');
          styleSheet.textContent = styles;
          clonedDoc.head.appendChild(styleSheet);
          
          // Ensure visibility
          clonedElement.style.visibility = 'visible';
          clonedElement.style.opacity = '1';
          clonedElement.style.position = 'relative';
          clonedElement.style.left = '0';
          clonedElement.style.top = '0';
          clonedElement.style.transform = 'none';
        }
      });

      console.log("Canvas created successfully", {
        width: canvas.width,
        height: canvas.height
      });

      // Verify canvas is not blank by checking pixel data
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      const imageData = ctx.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
      const pixels = imageData.data;
      
      // Check if we have non-white pixels (indicating content)
      let hasNonWhitePixels = false;
      for (let i = 0; i < pixels.length; i += 4) {
        const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
        if (r < 250 || g < 250 || b < 250) {
          hasNonWhitePixels = true;
          break;
        }
      }
      
      if (!hasNonWhitePixels) {
        console.warn("Canvas appears to be mostly white, but proceeding with PDF generation");
      }

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with letter size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Add some margin
      const margin = 10;
      const availableWidth = pdfPageWidth - (margin * 2);
      const availableHeight = pdfPageHeight - (margin * 2);
      
      pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, availableHeight, undefined, 'FAST');
      pdf.save(filename);

      console.log("PDF saved successfully");

      toast({
        title: "PDF generado",
        description: "El archivo PDF se ha descargado correctamente.",
      });

    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Error al generar PDF",
        description: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast]);

  return {
    generatePDF,
    isExporting
  };
};
