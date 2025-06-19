
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateUserData {
  email: string;
  password: string;
  full_name?: string;
  role: 'admin' | 'usuario';
  center_id?: string;
}

interface UpdateUserData {
  id: string;
  data: {
    full_name?: string;
    role?: 'admin' | 'usuario';
    center_id?: string;
    is_active?: boolean;
    allow_multi_center?: boolean;
  };
}

interface SendInvitationRequest {
  email: string;
  fullName: string;
  role: 'admin' | 'usuario';
  centerId?: string;
  message?: string;
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      // Helper function to convert empty strings to null for UUIDs
      const toNullIfEmpty = (value: string | undefined) => {
        return value && value.trim() !== '' && value !== 'none' ? value : null;
      };

      // Use regular signUp method instead of admin endpoint
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.full_name || data.email.split('@')[0]
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // Check if profile already exists to avoid duplicate key error
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      // Only create profile if it doesn't exist
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: data.full_name || data.email.split('@')[0],
            role: data.role,
            center_id: toNullIfEmpty(data.center_id)
          });

        if (profileError) throw profileError;
      }

      // Create user management record
      const { error: userMgmtError } = await supabase
        .from('user_management')
        .insert({
          user_id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          center_id: toNullIfEmpty(data.center_id)
        });

      if (userMgmtError) throw userMgmtError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado correctamente."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear usuario",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserData) => {
      // Helper function to convert empty strings to null for UUIDs
      const toNullIfEmpty = (value: string | undefined) => {
        return value && value.trim() !== '' && value !== 'none' ? value : null;
      };

      // Actualizar user_management
      const { error: userMgmtError } = await supabase
        .from('user_management')
        .update({
          full_name: data.full_name,
          role: data.role,
          center_id: toNullIfEmpty(data.center_id),
          is_active: data.is_active,
          allow_multi_center: data.allow_multi_center,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (userMgmtError) throw userMgmtError;

      // Actualizar profiles (el trigger se encargará de sincronizar)
      const { data: userMgmt } = await supabase
        .from('user_management')
        .select('user_id')
        .eq('id', id)
        .single();

      if (userMgmt) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            username: data.full_name,
            role: data.role,
            center_id: toNullIfEmpty(data.center_id)
          })
          .eq('id', userMgmt.user_id);

        if (profileError) throw profileError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado correctamente."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar usuario",
        description: error.message,
        variant: "destructive"
      });
    }
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

      // Helper function to convert empty strings to null for UUIDs
      const toNullIfEmpty = (value: string | undefined) => {
        return value && value.trim() !== '' && value !== 'none' ? value : null;
      };

      const { data, error } = await supabase.functions.invoke('send-invitation-email', {
        body: {
          email,
          fullName,
          role,
          centerId: toNullIfEmpty(centerId),
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

// Export main hook for compatibility
export const useUserMutations = () => {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const sendInvitationEmail = useSendInvitationEmail();
  
  return {
    createUser,
    updateUser,
    sendInvitationEmail,
  };
};
