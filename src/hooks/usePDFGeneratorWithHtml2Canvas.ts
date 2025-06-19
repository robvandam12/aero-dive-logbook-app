
import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDFGeneratorWithHtml2Canvas = () => {
  const generatePDFFromElement = useCallback(async (element: HTMLElement, filename: string) => {
    try {
      // Crear el canvas con configuración optimizada
      const canvas = await html2canvas(element, {
        scale: 3, // Alta resolución
        useCORS: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Crear PDF en formato carta
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calcular dimensiones manteniendo proporción
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
      
      // Centrar la imagen en la página
      const x = (pdfPageWidth - finalImgWidth) / 2;
      const y = (pdfPageHeight - finalImgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      pdf.save(filename);

    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw new Error("Error al generar el PDF");
    }
  }, []);

  return { generatePDFFromElement };
};
