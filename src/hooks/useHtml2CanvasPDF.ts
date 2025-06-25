
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
      
      // Wait a bit to ensure the element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(element, {
        scale: 2, // Reduced scale for better performance
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure proper styling in cloned document
          const clonedElement = clonedDoc.getElementById('printable-dive-log');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '0';
          }
        }
      });

      console.log("Canvas created successfully", {
        width: canvas.width,
        height: canvas.height
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with letter size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate scaling to fit the page
      const canvasAspectRatio = canvasWidth / canvasHeight;
      const pageAspectRatio = pdfPageWidth / pdfPageHeight;

      let finalImgWidth, finalImgHeight;

      if (canvasAspectRatio > pageAspectRatio) {
        // Canvas is wider, fit to width
        finalImgWidth = pdfPageWidth - 20; // Add margins
        finalImgHeight = (pdfPageWidth - 20) / canvasAspectRatio;
      } else {
        // Canvas is taller, fit to height
        finalImgHeight = pdfPageHeight - 20; // Add margins
        finalImgWidth = (pdfPageHeight - 20) * canvasAspectRatio;
      }
      
      // Center the image on the page
      const x = (pdfPageWidth - finalImgWidth) / 2;
      const y = (pdfPageHeight - finalImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight, undefined, 'FAST');
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
        description: "Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.",
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
