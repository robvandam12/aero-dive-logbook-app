
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignatureCodes = () => {
  return useQuery({
    queryKey: ['signatureCodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signature_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};

export const useCreateSignatureCode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ diveLogId, signatureUrl, userId }: {
      diveLogId: string;
      signatureUrl: string;
      userId: string;
    }) => {
      // Generar código único: UUID corto + timestamp
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomId = Math.random().toString(36).substr(2, 6).toUpperCase();
      const code = `DL-${timestamp}-${randomId}`;

      const { data, error } = await supabase
        .from('signature_codes')
        .insert({
          dive_log_id: diveLogId,
          code,
          signature_url: signatureUrl,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signatureCodes'] });
    },
    onError: (error) => {
      toast({
        title: "Error al generar código de firma",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useVerifySignatureCode = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase
        .from('signature_codes')
        .select(`
          *,
          dive_logs(*)
        `)
        .eq('code', code)
        .single();

      if (error) throw error;
      return data;
    }
  });
};
