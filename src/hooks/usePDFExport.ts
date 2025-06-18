
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
          generatePDF: true,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al generar el PDF');
      }

      // El PDF ya está generado en el edge function, solo necesitamos descargarlo
      if (data.pdfBlob) {
        const blob = new Blob([new Uint8Array(data.pdfBlob)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename || `bitacora-${diveLogId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "PDF generado",
        description: "La bitácora ha sido exportada exitosamente.",
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
