
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
      
      // Wait a bit more to ensure the element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if element has content
      const hasContent = element.textContent && element.textContent.trim().length > 0;
      if (!hasContent) {
        throw new Error("Element appears to be empty");
      }
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: '#ffffff',
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 30000,
        width: Math.max(element.scrollWidth, 816), // 8.5 inches * 96 DPI
        height: Math.max(element.scrollHeight, 1056), // 11 inches * 96 DPI
        windowWidth: Math.max(element.scrollWidth, 816),
        windowHeight: Math.max(element.scrollHeight, 1056),
        onclone: (clonedDoc) => {
          console.log("Cloning document for html2canvas");
          // Ensure proper styling in cloned document
          const clonedElement = clonedDoc.getElementById('printable-dive-log') || 
                               clonedDoc.getElementById('temp-printable-dive-log') ||
                               clonedDoc.querySelector('.printable-page');
          
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '0';
            clonedElement.style.position = 'relative';
            clonedElement.style.left = '0';
            clonedElement.style.top = '0';
            clonedElement.style.opacity = '1';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.display = 'block';
            
            // Ensure all child elements are visible
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.opacity = '1';
              htmlEl.style.visibility = 'visible';
            });
          }
          
          // Apply print styles
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .printable-page {
              font-family: Arial, sans-serif !important;
              color: #000 !important;
              background: white !important;
              font-size: 12px !important;
              line-height: 1.2 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      console.log("Canvas created successfully", {
        width: canvas.width,
        height: canvas.height
      });

      // Verify canvas is not blank
      const ctx = canvas.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const isBlank = imageData?.data.every((pixel, index) => 
        index % 4 === 3 ? true : pixel === 255 // Check if all pixels are white (255,255,255)
      );
      
      if (isBlank) {
        throw new Error("Generated canvas is blank - content may not have rendered properly");
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
