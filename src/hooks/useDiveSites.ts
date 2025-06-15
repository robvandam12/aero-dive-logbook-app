
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const fetchDiveSites = async () => {
  const { data, error } = await supabase
    .from('dive_sites')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useDiveSites = () => {
  return useQuery<Tables<'dive_sites'>[], Error>({
    queryKey: ['dive_sites'],
    queryFn: fetchDiveSites,
  });
};
