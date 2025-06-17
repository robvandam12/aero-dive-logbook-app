
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExportToPDFRequest {
  diveLogId: string;
  includeSignature?: boolean;
}

export const usePDFExport = () => {
  const { toast } = useToast();

  const exportToPDF = useMutation({
    mutationFn: async ({ diveLogId, includeSignature = true }: ExportToPDFRequest) => {
      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: {
          diveLogId,
          includeSignature,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al generar el PDF');
      }

      // Download the PDF
      if (data.pdfUrl) {
        const link = document.createElement('a');
        link.href = data.pdfUrl;
        link.download = `bitacora-${diveLogId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "PDF generado",
        description: "La bitácora ha sido exportada a PDF exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al exportar PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    exportToPDF,
  };
};
