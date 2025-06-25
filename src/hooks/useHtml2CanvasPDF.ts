
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
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      console.log("Canvas created successfully");

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const canvasAspectRatio = canvasWidth / canvasHeight;
      const pageAspectRatio = pdfPageWidth / pdfPageHeight;

      let finalImgWidth, finalImgHeight;

      if (canvasAspectRatio > pageAspectRatio) {
        finalImgWidth = pdfPageWidth;
        finalImgHeight = pdfPageWidth / canvasAspectRatio;
      } else {
        finalImgHeight = pdfPageHeight;
        finalImgWidth = pdfPageHeight * canvasAspectRatio;
      }
      
      const x = (pdfPageWidth - finalImgWidth) / 2;
      const y = (pdfPageHeight - finalImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
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
