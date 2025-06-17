
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

      // Para esta implementación temporal, crear un blob con el HTML y descargarlo
      if (data.html) {
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bitacora-${diveLogId}.html`;
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
