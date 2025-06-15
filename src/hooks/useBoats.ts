
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const fetchBoats = async (centerId: string | undefined) => {
  if (!centerId) return [];
  
  const { data, error } = await supabase
    .from('boats')
    .select('*')
    .eq('center_id', centerId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useBoats = (centerId: string | undefined) => {
  return useQuery<Tables<'boats'>[], Error>({
    queryKey: ['boats', centerId],
    queryFn: () => fetchBoats(centerId),
    enabled: !!centerId,
  });
};
