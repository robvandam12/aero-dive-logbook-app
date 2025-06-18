
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIndexStats = () => {
  return useQuery({
    queryKey: ['index-stats'],
    queryFn: async () => {
      // Obtener estadísticas de bitácoras
      const { data: diveLogs, error: diveLogsError } = await supabase
        .from('dive_logs')
        .select('id, status, log_date');

      if (diveLogsError) throw diveLogsError;

      // Obtener estadísticas de usuarios
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, role');

      if (usersError) throw usersError;

      // Obtener estadísticas de centros
      const { data: centers, error: centersError } = await supabase
        .from('centers')
        .select('id');

      if (centersError) throw centersError;

      // Calcular estadísticas
      const totalDiveLogs = diveLogs?.length || 0;
      const totalUsers = users?.length || 0;
      const totalCenters = centers?.length || 0;
      const adminUsers = users?.filter(user => user.role === 'admin').length || 0;
      const regularUsers = users?.filter(user => user.role === 'usuario').length || 0;

      // Bitácoras del mes actual
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const thisMonthLogs = diveLogs?.filter(log => {
        const logDate = new Date(log.log_date);
        return logDate >= startOfMonth;
      }).length || 0;

      return {
        totalDiveLogs,
        totalUsers,
        totalCenters,
        thisMonthLogs,
        adminUsers,
        regularUsers,
      };
    },
  });
};
