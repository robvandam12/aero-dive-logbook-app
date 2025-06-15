
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchIndexStats = async () => {
  const { count: totalDiveLogs, error: totalDiveLogsError } = await supabase
    .from('dive_logs')
    .select('*', { count: 'exact', head: true });

  if (totalDiveLogsError) throw new Error(totalDiveLogsError.message);
  
  const { count: signedDiveLogs, error: signedDiveLogsError } = await supabase
    .from('dive_logs')
    .select('*', { count: 'exact', head: true })
    .not('signature_url', 'is', null);

  if (signedDiveLogsError) throw new Error(signedDiveLogsError.message);

  const sentDiveLogs = 0; // No data for this yet

  const { count: activeSupervisors, error: activeSupervisorsError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'supervisor');

  if (activeSupervisorsError) throw new Error(activeSupervisorsError.message);

  return {
    totalDiveLogs: totalDiveLogs ?? 0,
    signedDiveLogs: signedDiveLogs ?? 0,
    sentDiveLogs: sentDiveLogs,
    activeSupervisors: activeSupervisors ?? 0,
  };
};

export const useIndexStats = () => {
  return useQuery({
    queryKey: ['indexStats'],
    queryFn: fetchIndexStats,
  });
};
