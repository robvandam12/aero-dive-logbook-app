
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type DiveLogWithDetails = Tables<'dive_logs'> & {
  centers: { name: string } | null;
  dive_sites: { name: string } | null;
  boats: { name: string } | null;
};

const fetchRecentDiveLogs = async (userId: string | undefined) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('dive_logs')
    .select(`
      *,
      centers (name),
      dive_sites (name),
      boats (name)
    `)
    .eq('supervisor_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  return data as DiveLogWithDetails[];
};

export const useRecentDiveLogs = (userId: string | undefined) => {
  return useQuery<DiveLogWithDetails[], Error>({
    queryKey: ['recentDiveLogs', userId],
    queryFn: () => fetchRecentDiveLogs(userId),
    enabled: !!userId,
  });
};
