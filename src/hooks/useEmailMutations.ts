import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReactPDFGenerator } from '@/hooks/useReactPDFGenerator';
import { useDiveLog } from '@/hooks/useDiveLog';

interface SendEmailRequest {
  diveLogId: string;
  recipientEmail: string;
  recipientName?: string;
  message?: string;
  includePDF?: boolean;
}

interface SendInvitationRequest {
  email: string;
  fullName: string;
  role: 'admin' | 'supervisor';
  centerId?: string;
  message?: string;
}

export const useSendDiveLogEmail = () => {
  const { toast } = useToast();
  const { generatePDFBlob } = useReactPDFGenerator();

  return useMutation({
    mutationFn: async ({ diveLogId, recipientEmail, recipientName, message, includePDF }: SendEmailRequest) => {
      console.log('Sending dive log email:', { diveLogId, recipientEmail, includePDF });
      
      // If PDF is requested, generate it first
      if (includePDF) {
        console.log('Generating PDF before sending email...');
        
        // First, fetch the dive log data
        const { data: diveLog, error: diveLogError } = await supabase
          .from('dive_logs')
          .select(`
            *,
            profiles!inner(username),
            centers(name),
            dive_sites(name),
            boats(name)
          `)
          .eq('id', diveLogId)
          .single();

        if (diveLogError || !diveLog) {
          throw new Error('No se pudo cargar la bitácora para generar el PDF');
        }

        // Generate and upload PDF
        const pdfBlob = await generatePDFBlob(diveLog, !!diveLog.signature_url);
        
        if (!pdfBlob) {
          throw new Error('No se pudo generar el PDF. Inténtalo de nuevo.');
        }

        console.log('PDF generated successfully, proceeding with email...');
      }
      
      // Now send the email
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
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data?.success) {
        console.error('Function returned error:', data?.error);
        
        // If PDF not found, provide helpful error message
        if (data?.error?.includes('PDF no encontrado')) {
          throw new Error('PDF no encontrado. Se intentó generar automáticamente. Por favor, intenta enviar el email nuevamente.');
        }
        
        throw new Error(data?.error || 'Error al enviar el correo');
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.pdfError) {
        toast({
          title: "⚠️ Correo enviado con advertencia",
          description: "El correo se envió pero sin el PDF adjunto. " + data.pdfError,
          variant: "destructive",
        });
      } else {
        toast({
          title: "📧 Correo enviado",
          description: "La bitácora ha sido enviada por correo exitosamente con el PDF adjunto.",
        });
      }
    },
    onError: (error: any) => {
      console.error('Email mutation error:', error);
      toast({
        title: "❌ Error al enviar correo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSendInvitationEmail = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, fullName, role, centerId, message }: SendInvitationRequest) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) {
        throw new Error('Usuario no encontrado');
      }

      const { data, error } = await supabase.functions.invoke('send-invitation-email', {
        body: {
          email,
          fullName,
          role,
          centerId,
          message,
          createdBy: profile.id,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Error al enviar la invitación');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Invitación enviada",
        description: "La invitación ha sido enviada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al enviar invitación",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Export hook with proper name for compatibility
export const useEmailMutations = () => {
  const sendDiveLogEmail = useSendDiveLogEmail();
  const sendInvitationEmail = useSendInvitationEmail();
  
  return {
    sendDiveLogEmail,
    sendInvitationEmail,
  };
};
