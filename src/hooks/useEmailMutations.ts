
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SendEmailRequest {
  diveLogId: string;
  recipientEmail: string;
  recipientName?: string;
  message?: string;
  includePDF?: boolean;
}

export const useSendDiveLogEmail = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ diveLogId, recipientEmail, recipientName, message, includePDF }: SendEmailRequest) => {
      const { data, error } = await supabase.functions.invoke('send-dive-log-email', {
        body: {
          diveLogId,
          recipientEmail,
          recipientName,
          message,
          includePDF,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al enviar el correo');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Correo enviado",
        description: "La bitácora ha sido enviada por correo exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al enviar correo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Export hook with proper name for compatibility
export const useEmailMutations = () => {
  const sendDiveLogEmail = useSendDiveLogEmail();
  
  return {
    sendDiveLogEmail,
  };
};
