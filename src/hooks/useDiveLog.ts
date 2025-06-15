
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type DiveLogWithFullDetails = Tables<'dive_logs'> & {
  centers: { name: string } | null;
  dive_sites: { name: string; location?: string } | null;
  boats: { name: string; registration_number: string } | null;
};

const fetchDiveLog = async (id: string) => {
  const { data, error } = await supabase
    .from('dive_logs')
    .select(`
      *,
      centers (name),
      dive_sites (name, location),
      boats (name, registration_number)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DiveLogWithFullDetails;
};

export const useDiveLog = (id: string | undefined) => {
  return useQuery({
    queryKey: ['diveLog', id],
    queryFn: () => fetchDiveLog(id!),
    enabled: !!id,
  });
};
