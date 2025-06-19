
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
      console.log('Exporting PDF for dive log:', diveLogId);

      const { data, error } = await supabase.functions.invoke('export-dive-log-pdf', {
        body: {
          diveLogId,
          includeSignature,
          generatePDF: true,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data.success) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error || 'Error al generar el PDF');
      }

      console.log('PDF data received:', data);

      // Return success - actual PDF generation is now handled by react-to-print
      return data;
    },
    onSuccess: () => {
      toast({
        title: "PDF preparado",
        description: "La bitácora está lista para exportar.",
      });
    },
    onError: (error: any) => {
      console.error('PDF export error:', error);
      toast({
        title: "Error al preparar PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    exportToPDF,
  };
};
