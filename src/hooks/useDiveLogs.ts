
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type DiveLogForTable = Pick<Tables<'dive_logs'>, 'id' | 'log_date' | 'signature_url' | 'created_at'> & {
  centers: { name: string } | null;
  dive_sites: { name: string } | null;
  boats: { name: string } | null;
  profiles: { username: string } | null;
  status: 'draft' | 'signed';
};

interface FetchDiveLogsParams {
  userId?: string;
  page?: number;
  perPage?: number;
  search?: string;
  status?: 'draft' | 'signed';
  centerId?: string;
}

const fetchDiveLogs = async ({
  userId,
  page = 1,
  perPage = 10,
  search = '',
  status,
  centerId,
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
      created_at,
      centers (name),
      dive_sites (name),
      boats (name),
      profiles (username)
    `, { count: 'exact' })
    .eq('supervisor_id', userId)
    .order('log_date', { ascending: false })
    .range(from, to);

  // Aplicar filtros adicionales
  if (centerId) {
    query = query.eq('center_id', centerId);
  }

  if (search) {
    // Búsqueda básica por nombres - en el futuro se puede expandir con RPC
    query = query.or(`centers.name.ilike.%${search}%,dive_sites.name.ilike.%${search}%,boats.name.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Add status based on signature and apply status filter
  let dataWithStatus = data?.map(log => ({
    ...log,
    status: log.signature_url ? 'signed' as const : 'draft' as const
  })) || [];

  // Apply status filter after status determination
  if (status) {
    dataWithStatus = dataWithStatus.filter(log => log.status === status);
  }

  return { data: dataWithStatus as DiveLogForTable[], count: count ?? 0 };
};

export const useDiveLogs = (params: FetchDiveLogsParams) => {
  return useQuery({
    queryKey: ['diveLogs', params],
    queryFn: () => fetchDiveLogs(params),
    enabled: !!params.userId,
  });
};
