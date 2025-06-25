
import { useCallback, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useToast } from '@/hooks/use-toast';
import { DiveLogWithFullDetails } from './useDiveLog';
import { DiveLogPDFDocument } from '@/components/pdf/DiveLogPDFDocument';

export const useReactPDFGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = useCallback(async (
    diveLog: DiveLogWithFullDetails,
    hasSignature: boolean = false,
    filename?: string
  ) => {
    if (!diveLog) {
      console.error("Missing dive log data for PDF generation");
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la bitácora.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log("Starting React-PDF generation...");
      
      // Generate PDF blob using React-PDF
      const pdfBlob = await pdf(
        <DiveLogPDFDocument diveLog={diveLog} hasSignature={hasSignature} />
      ).toBlob();

      // Create filename if not provided
      const dateStr = diveLog.log_date ? new Date(diveLog.log_date).toISOString().split('T')[0] : 'sin-fecha';
      const centerName = diveLog.centers?.name ? diveLog.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
      const finalFilename = filename || `bitacora-${centerName}-${dateStr}-${diveLog.id?.slice(-6)}.pdf`;

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);

      console.log("React-PDF generated successfully");

      toast({
        title: "PDF generado",
        description: "El archivo PDF se ha descargado correctamente.",
      });

    } catch (error) {
      console.error("Error generating React-PDF:", error);
      toast({
        title: "Error al generar PDF",
        description: "Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const generatePDFBlob = useCallback(async (
    diveLog: DiveLogWithFullDetails,
    hasSignature: boolean = false
  ): Promise<Blob | null> => {
    if (!diveLog) {
      console.error("Missing dive log data for PDF blob generation");
      return null;
    }

    try {
      console.log("Generating React-PDF blob for email...");
      
      // Generate PDF blob using React-PDF
      const pdfBlob = await pdf(
        <DiveLogPDFDocument diveLog={diveLog} hasSignature={hasSignature} />
      ).toBlob();

      console.log("React-PDF blob generated successfully");
      return pdfBlob;

    } catch (error) {
      console.error("Error generating React-PDF blob:", error);
      return null;
    }
  }, []);

  const generatePDFPreview = useCallback(async (
    diveLog: DiveLogWithFullDetails,
    hasSignature: boolean = false
  ) => {
    if (!diveLog) {
      console.error("Missing dive log data for PDF preview");
      return null;
    }

    try {
      console.log("Generating React-PDF preview...");
      
      // Generate PDF blob for preview
      const pdfBlob = await pdf(
        <DiveLogPDFDocument diveLog={diveLog} hasSignature={hasSignature} />
      ).toBlob();

      // Create object URL for preview
      const url = URL.createObjectURL(pdfBlob);
      
      console.log("React-PDF preview generated successfully");
      return url;

    } catch (error) {
      console.error("Error generating React-PDF preview:", error);
      return null;
    }
  }, []);

  return {
    generatePDF,
    generatePDFBlob,
    generatePDFPreview,
    isGenerating
  };
};
