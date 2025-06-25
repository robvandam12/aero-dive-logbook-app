
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
      
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find all page containers
      const pageContainers = element.querySelectorAll('.page-container');
      console.log(`Found ${pageContainers.length} pages to render`);
      
      if (pageContainers.length === 0) {
        throw new Error("No page containers found");
      }
      
      // Create PDF with letter size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Process each page
      for (let i = 0; i < pageContainers.length; i++) {
        const pageElement = pageContainers[i] as HTMLElement;
        console.log(`Processing page ${i + 1} of ${pageContainers.length}`);
        
        // If not the first page, add a new page
        if (i > 0) {
          pdf.addPage();
        }
        
        const canvas = await html2canvas(pageElement, {
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
            console.log(`Cloning document for page ${i + 1}`);
            
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
              .page-container {
                font-family: Arial, sans-serif !important;
                color: #000 !important;
                background: white !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
                width: 816px !important;
                height: 1056px !important;
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

        console.log(`Canvas created for page ${i + 1}`, {
          width: canvas.width,
          height: canvas.height
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Add image to PDF with proper sizing
        const margin = 5;
        const availableWidth = pdfPageWidth - (margin * 2);
        const availableHeight = pdfPageHeight - (margin * 2);
        
        pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, availableHeight, undefined, 'FAST');
      }

      pdf.save(filename);
      console.log("Multi-page PDF saved successfully");

      toast({
        title: "PDF generado",
        description: `El archivo PDF se ha descargado correctamente con ${pageContainers.length} página(s).`,
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
