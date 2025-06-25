
import { useCallback, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

export const useAdvancedPDFGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMultiPagePDF = useCallback(async (
    page1Element: HTMLElement, 
    page2Element: HTMLElement, 
    filename: string = 'bitacora-buceo.pdf'
  ) => {
    if (!page1Element || !page2Element) {
      console.error("Missing page elements for PDF generation");
      toast({
        title: "Error",
        description: "No se pudieron encontrar los elementos para generar el PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log("Starting multi-page PDF generation...");
      
      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Generate canvas for page 1
      console.log("Generating canvas for page 1...");
      const canvas1 = await html2canvas(page1Element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: page1Element.scrollWidth,
        height: page1Element.scrollHeight,
      });

      const imgData1 = canvas1.toDataURL('image/png');
      const imgWidth1 = pdfWidth - 20; // 10mm margin on each side
      const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;

      // Add first page
      pdf.addImage(imgData1, 'PNG', 10, 10, imgWidth1, Math.min(imgHeight1, pdfHeight - 20));

      // Add second page
      pdf.addPage();

      // Generate canvas for page 2
      console.log("Generating canvas for page 2...");
      const canvas2 = await html2canvas(page2Element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: page2Element.scrollWidth,
        height: page2Element.scrollHeight,
      });

      const imgData2 = canvas2.toDataURL('image/png');
      const imgWidth2 = pdfWidth - 20;
      const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;

      pdf.addImage(imgData2, 'PNG', 10, 10, imgWidth2, Math.min(imgHeight2, pdfHeight - 20));

      // Save PDF
      pdf.save(filename);

      console.log("Multi-page PDF generated successfully");

      toast({
        title: "PDF generado",
        description: "El archivo PDF de 2 páginas se ha descargado correctamente.",
      });

    } catch (error) {
      console.error("Error generating multi-page PDF:", error);
      toast({
        title: "Error al generar PDF",
        description: "Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  return {
    generateMultiPagePDF,
    isGenerating
  };
};
