
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type DiveLogForTable = Pick<Tables<'dive_logs'>, 'id' | 'log_date' | 'signature_url'> & {
  centers: { name: string } | null;
  dive_sites: { name: string } | null;
  boats: { name: string } | null;
};

interface FetchDiveLogsParams {
  userId?: string;
  page?: number;
  perPage?: number;
  search?: string;
}

const fetchDiveLogs = async ({
  userId,
  page = 1,
  perPage = 10,
  search = '',
}: FetchDiveLogsParams) => {
  if (!userId) {
    return { data: [], count: 0 };
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('dive_logs')
    .select(`
      id,
      log_date,
      signature_url,
      centers (name),
      dive_sites (name),
      boats (name)
    `, { count: 'exact' })
    .eq('supervisor_id', userId)
    .order('log_date', { ascending: false })
    .range(from, to);

  if (search) {
    // Note: A more complex search would require an RPC function.
    // This part can be expanded later.
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data as DiveLogForTable[], count: count ?? 0 };
};

export const useDiveLogs = (params: FetchDiveLogsParams) => {
  return useQuery({
    queryKey: ['diveLogs', params],
    queryFn: () => fetchDiveLogs(params),
    enabled: !!params.userId,
  });
};
