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

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      // Helper function to convert empty strings to null for UUIDs
      const toNullIfEmpty = (value: string | undefined) => {
        return value && value.trim() !== '' && value !== 'none' ? value : null;
      };

      // Create user directly as confirmed (no email verification needed)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.full_name || data.email.split('@')[0]
          },
          emailRedirectTo: undefined // No email verification needed
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // Set user as confirmed immediately using admin API
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        authData.user.id,
        { email_confirm: true }
      );

      if (confirmError) {
        console.warn('Could not auto-confirm user, continuing anyway:', confirmError);
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

      // Create user management record with active status
      const { error: userMgmtError } = await supabase
        .from('user_management')
        .insert({
          user_id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          center_id: toNullIfEmpty(data.center_id),
          is_active: true // User is immediately active
        });

      if (userMgmtError) throw userMgmtError;

      // Send welcome email with credentials
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: data.email,
            fullName: data.full_name || data.email.split('@')[0],
            password: data.password,
            role: data.role,
            centerId: toNullIfEmpty(data.center_id)
          }
        });
      } catch (emailError) {
        console.warn('Failed to send welcome email:', emailError);
        // Don't fail user creation if email fails
      }

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
      toast({
        title: "Usuario creado exitosamente",
        description: "El usuario ha sido creado y puede acceder inmediatamente. Se ha enviado un email de bienvenida con las credenciales."
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
    mutationFn: async ({ email, fullName, role, centerId, message }: any) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) {
        throw new Error('Usuario no encontrado');
      }

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
