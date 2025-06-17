
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateUserData {
  email: string;
  password: string;
  full_name?: string;
  role: 'admin' | 'supervisor';
  center_id?: string;
}

interface UpdateUserData {
  id: string;
  data: {
    full_name?: string;
    role?: 'admin' | 'supervisor';
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
      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          username: data.full_name || data.email.split('@')[0]
        }
      });

      if (authError) throw authError;

      // Crear perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: data.full_name || data.email.split('@')[0],
          role: data.role,
          center_id: data.center_id || null
        });

      if (profileError) throw profileError;

      // Crear registro en user_management
      const { error: userMgmtError } = await supabase
        .from('user_management')
        .insert({
          user_id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          center_id: data.center_id || null
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
      // Actualizar user_management
      const { error: userMgmtError } = await supabase
        .from('user_management')
        .update({
          full_name: data.full_name,
          role: data.role,
          center_id: data.center_id,
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
            center_id: data.center_id
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

// Export main hook for compatibility
export const useUserMutations = () => {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  
  return {
    createUser,
    updateUser,
  };
};
