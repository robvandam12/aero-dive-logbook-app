
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchSystemStats = async () => {
  const { count: centersCount, error: centersError } = await supabase
    .from('centers')
    .select('*', { count: 'exact', head: true });

  if (centersError) throw new Error(centersError.message);

  const { count: boatsCount, error: boatsError } = await supabase
    .from('boats')
    .select('*', { count: 'exact', head: true });

  if (boatsError) throw new Error(boatsError.message);

  const today = new Date().toISOString().slice(0, 10);
  const { count: diveLogsTodayCount, error: diveLogsTodayError } = await supabase
    .from('dive_logs')
    .select('*', { count: 'exact', head: true })
    .eq('log_date', today);
    
  if (diveLogsTodayError) throw new Error(diveLogsTodayError.message);

  return {
    centers: centersCount ?? 0,
    boats: boatsCount ?? 0,
    diveLogsToday: diveLogsTodayCount ?? 0,
  };
};

export const useSystemStats = () => {
  return useQuery({
    queryKey: ['systemStats'],
    queryFn: fetchSystemStats,
  });
};
