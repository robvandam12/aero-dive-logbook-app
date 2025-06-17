
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSignatureValidation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validateSignatureCode = useMutation({
    mutationFn: async (code: string) => {
      // Buscar el código en la base de datos
      const { data, error } = await supabase
        .from('signature_codes')
        .select(`
          *,
          dive_logs (
            *,
            centers (name),
            dive_sites (name),
            profiles (username)
          )
        `)
        .eq('code', code.trim().toUpperCase())
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Código válido",
        description: `Código verificado exitosamente para la bitácora del ${data.dive_logs?.log_date}`,
      });
    },
    onError: (error) => {
      console.error('Error validating signature:', error);
      toast({
        title: "Código inválido",
        description: "El código de firma no es válido o ha expirado",
        variant: "destructive",
      });
    },
  });

  const generateSignatureCode = useMutation({
    mutationFn: async ({ diveLogId, userId }: { diveLogId: string; userId: string }) => {
      // Insertar sin incluir el campo 'code' para que el trigger lo genere automáticamente
      const { data, error } = await supabase
        .from('signature_codes')
        .insert({
          dive_log_id: diveLogId,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['signatureCodes'] });
      toast({
        title: "Código generado",
        description: `Nuevo código de firma: ${data.code}`,
      });
    },
    onError: (error) => {
      console.error('Error generating signature code:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el código de firma",
        variant: "destructive",
      });
    },
  });

  const getSignatureHistory = useQuery({
    queryKey: ['signatureHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signature_codes')
        .select(`
          *,
          dive_logs (
            log_date,
            centers (name),
            dive_sites (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  return {
    validateSignatureCode,
    generateSignatureCode,
    getSignatureHistory,
    isValidating: validateSignatureCode.isPending,
    isGenerating: generateSignatureCode.isPending,
  };
};
