
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchSystemStats = async () => {
  // Get total dive logs count
  const { count: totalDiveLogs, error: totalDiveLogsError } = await supabase
    .from('dive_logs')
    .select('*', { count: 'exact', head: true });

  if (totalDiveLogsError) throw new Error(totalDiveLogsError.message);

  // Get active users count (users with profiles)
  const { count: activeUsers, error: activeUsersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (activeUsersError) throw new Error(activeUsersError.message);

  // Get centers count
  const { count: centers, error: centersError } = await supabase
    .from('centers')
    .select('*', { count: 'exact', head: true });

  if (centersError) throw new Error(centersError.message);

  // Get pending logs count (draft status)
  const { count: pendingLogs, error: pendingLogsError } = await supabase
    .from('dive_logs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');
    
  if (pendingLogsError) throw new Error(pendingLogsError.message);

  return {
    totalDiveLogs: totalDiveLogs ?? 0,
    activeUsers: activeUsers ?? 0,
    centers: centers ?? 0,
    pendingLogs: pendingLogs ?? 0,
  };
};

export const useSystemStats = () => {
  return useQuery({
    queryKey: ['systemStats'],
    queryFn: fetchSystemStats,
  });
};
