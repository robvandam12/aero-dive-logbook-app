
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { deleteSignatureFromStorage } from '@/utils/signatureStorage';

export const useDeleteDiveLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, signatureUrl }: { id: string, signatureUrl?: string | null }) => {
      // Delete signature from storage if it exists
      if (signatureUrl) {
        await deleteSignatureFromStorage(signatureUrl);
      }

      const { error } = await supabase
        .from('dive_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diveLogs'] });
      queryClient.invalidateQueries({ queryKey: ['recentDiveLogs'] });
      toast({
        title: "Bitácora eliminada",
        description: "La bitácora ha sido eliminada correctamente."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
