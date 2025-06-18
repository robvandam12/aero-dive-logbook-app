
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
  status?: 'draft' | 'signed' | 'all';
  centerName?: string;
  dateRange?: { from?: Date; to?: Date };
}

interface DiveLogsResponse {
  data: DiveLogForTable[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const fetchDiveLogs = async ({
  userId,
  page = 1,
  perPage = 20,
  search = '',
  status = 'all',
  centerName = 'all',
  dateRange,
}: FetchDiveLogsParams): Promise<DiveLogsResponse> => {
  if (!userId) {
    return { 
      data: [], 
      count: 0, 
      totalPages: 0, 
      currentPage: 1, 
      hasNextPage: false, 
      hasPreviousPage: false 
    };
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

  // Apply center filter
  if (centerName && centerName !== 'all') {
    query = query.eq('centers.name', centerName);
  }

  // Apply date range filter
  if (dateRange?.from) {
    query = query.gte('log_date', dateRange.from.toISOString().split('T')[0]);
  }
  if (dateRange?.to) {
    query = query.lte('log_date', dateRange.to.toISOString().split('T')[0]);
  }

  // Apply search filter - search across multiple fields
  if (search.trim()) {
    query = query.or(`centers.name.ilike.%${search}%,dive_sites.name.ilike.%${search}%,boats.name.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Add status and apply status filter
  let dataWithStatus = data?.map(log => ({
    ...log,
    status: log.signature_url ? 'signed' as const : 'draft' as const
  })) || [];

  // Apply status filter after status determination
  if (status && status !== 'all') {
    dataWithStatus = dataWithStatus.filter(log => log.status === status);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return { 
    data: dataWithStatus as DiveLogForTable[], 
    count: totalCount,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPreviousPage
  };
};

export const useDiveLogs = (params: FetchDiveLogsParams) => {
  return useQuery({
    queryKey: ['diveLogs', params],
    queryFn: () => fetchDiveLogs(params),
    enabled: !!params.userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
