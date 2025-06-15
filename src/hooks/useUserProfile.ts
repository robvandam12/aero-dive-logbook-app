
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

const fetchUserProfile = async (userId: string | undefined) => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    // It's ok if it fails, for example, for a newly created user before profile is created.
    console.log('Could not fetch user profile:', error.message);
    return null;
  }

  return data;
};

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => fetchUserProfile(user?.id),
    enabled: !!user,
  });
};
