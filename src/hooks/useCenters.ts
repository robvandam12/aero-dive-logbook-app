
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const fetchCenters = async () => {
  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useCenters = () => {
  return useQuery<Tables<'centers'>[], Error>({
    queryKey: ['centers'],
    queryFn: fetchCenters,
  });
};
