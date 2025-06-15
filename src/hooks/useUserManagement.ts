
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type UserManagement = Tables<'user_management'> & {
  centers: { name: string } | null;
};

const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('user_management')
    .select(`
      *,
      centers (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as UserManagement[];
};

export const useUserManagement = () => {
  return useQuery({
    queryKey: ['userManagement'],
    queryFn: fetchUsers,
  });
};
