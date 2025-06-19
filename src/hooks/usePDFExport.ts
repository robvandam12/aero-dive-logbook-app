
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ExportToPDFRequest {
  diveLogId: string;
  includeSignature?: boolean;
}

export const usePDFExport = () => {
  const { toast } = useToast();

  const exportToPDF = useMutation({
    mutationFn: async ({ diveLogId, includeSignature = true }: ExportToPDFRequest) => {
      console.log('Legacy PDF export triggered. Please use PDFPreview component with react-to-print instead.');
      
      // This is now a legacy method - the new approach uses react-to-print
      // which is implemented in the PDFPreview component
      toast({
        title: "Función deprecada",
        description: "Por favor usa el botón 'Descargar PDF' en la previsualización para mejor calidad.",
        variant: "destructive",
      });

      return { deprecated: true };
    },
    onSuccess: () => {
      // Legacy success handler
    },
    onError: (error: any) => {
      console.error('Legacy PDF export error:', error);
      toast({
        title: "Error en exportación legacy",
        description: "Usa el nuevo sistema de PDF con react-to-print para mejor calidad.",
        variant: "destructive",
      });
    },
  });

  return {
    exportToPDF,
  };
};
