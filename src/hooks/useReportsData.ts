
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReportsDataFilters {
  dateRange?: { from?: Date; to?: Date };
  selectedCenter?: string;
}

export const useReportsData = ({ dateRange, selectedCenter }: ReportsDataFilters = {}) => {
  return useQuery({
    queryKey: ['reportsData', dateRange, selectedCenter],
    queryFn: async () => {
      let query = supabase
        .from('dive_logs')
        .select(`
          id,
          log_date,
          status,
          signature_url,
          divers_manifest,
          center_id,
          dive_site_id,
          centers(name),
          dive_sites(name)
        `);

      // Apply date filters
      if (dateRange?.from) {
        query = query.gte('log_date', dateRange.from.toISOString().split('T')[0]);
      }
      if (dateRange?.to) {
        query = query.lte('log_date', dateRange.to.toISOString().split('T')[0]);
      }

      // Apply center filter
      if (selectedCenter && selectedCenter !== 'all') {
        query = query.eq('center_id', selectedCenter);
      }

      const { data: diveLogs, error } = await query;
      if (error) throw error;

      // Process data for charts
      const monthlyData = processMonthlyData(diveLogs || []);
      const centerData = processCenterData(diveLogs || []);
      const siteData = processSiteData(diveLogs || []);
      const statusData = processStatusData(diveLogs || []);

      return {
        diveLogs: diveLogs || [],
        monthlyData,
        centerData,
        siteData,
        statusData
      };
    }
  });
};

const processMonthlyData = (diveLogs: any[]) => {
  const monthCounts: Record<string, number> = {};
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  diveLogs.forEach(log => {
    const date = new Date(log.log_date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts)
    .map(([key, count]) => {
      const [year, month] = key.split('-');
      return {
        month: monthNames[parseInt(month)],
        total: count
      };
    })
    .slice(-6); // Last 6 months
};

const processCenterData = (diveLogs: any[]) => {
  const centerCounts: Record<string, number> = {};
  
  diveLogs.forEach(log => {
    const centerName = log.centers?.name || 'Sin centro';
    centerCounts[centerName] = (centerCounts[centerName] || 0) + 1;
  });

  return Object.entries(centerCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);
};

const processSiteData = (diveLogs: any[]) => {
  const siteCounts: Record<string, number> = {};
  
  diveLogs.forEach(log => {
    const siteName = log.dive_sites?.name || 'Sin sitio';
    siteCounts[siteName] = (siteCounts[siteName] || 0) + 1;
  });

  return Object.entries(siteCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);
};

const processStatusData = (diveLogs: any[]) => {
  const statusCounts = diveLogs.reduce((acc, log) => {
    if (log.signature_url) {
      acc.signed = (acc.signed || 0) + 1;
    } else {
      acc.draft = (acc.draft || 0) + 1;
    }
    return acc;
  }, { signed: 0, draft: 0 });

  return [
    { name: 'Firmadas', value: statusCounts.signed, color: '#10B981' },
    { name: 'Borradores', value: statusCounts.draft, color: '#F59E0B' }
  ];
};
