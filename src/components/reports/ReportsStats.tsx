
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Ship, Users, Clock, Waves } from "lucide-react";

interface ReportsStatsProps {
  dateRange: { from?: Date; to?: Date };
  selectedCenter: string;
}

export const ReportsStats = ({ dateRange, selectedCenter }: ReportsStatsProps) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['reportsStats', dateRange, selectedCenter],
    queryFn: async () => {
      let query = supabase
        .from('dive_logs')
        .select(`
          id,
          log_date,
          divers_manifest,
          departure_time,
          arrival_time,
          center_id,
          centers(name)
        `);

      // Aplicar filtros de fecha
      if (dateRange.from) {
        query = query.gte('log_date', dateRange.from.toISOString().split('T')[0]);
      }
      if (dateRange.to) {
        query = query.lte('log_date', dateRange.to.toISOString().split('T')[0]);
      }

      // Aplicar filtro de centro
      if (selectedCenter !== 'all') {
        query = query.eq('center_id', selectedCenter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calcular estadísticas
      const totalLogs = data?.length || 0;
      const totalDivers = data?.reduce((acc, log) => {
        const manifest = Array.isArray(log.divers_manifest) ? log.divers_manifest : [];
        return acc + manifest.length;
      }, 0) || 0;

      const avgDiversPerLog = totalLogs > 0 ? Math.round(totalDivers / totalLogs) : 0;

      // Calcular tiempo promedio de operación
      const operationsWithTime = data?.filter(log => log.departure_time && log.arrival_time) || [];
      const avgOperationTime = operationsWithTime.length > 0 
        ? operationsWithTime.reduce((acc, log) => {
            const departure = new Date(`2000-01-01T${log.departure_time}`);
            const arrival = new Date(`2000-01-01T${log.arrival_time}`);
            const duration = (arrival.getTime() - departure.getTime()) / (1000 * 60); // en minutos
            return acc + duration;
          }, 0) / operationsWithTime.length
        : 0;

      return {
        totalLogs,
        totalDivers,
        avgDiversPerLog,
        avgOperationTime: Math.round(avgOperationTime)
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Bitácoras",
      value: stats?.totalLogs || 0,
      icon: Ship,
      color: "text-ocean-400"
    },
    {
      title: "Total Buzos",
      value: stats?.totalDivers || 0,
      icon: Users,
      color: "text-emerald-400"
    },
    {
      title: "Promedio Buzos/Bitácora",
      value: stats?.avgDiversPerLog || 0,
      icon: Users,
      color: "text-gold-400"
    },
    {
      title: "Tiempo Promedio (min)",
      value: stats?.avgOperationTime || 0,
      icon: Clock,
      color: "text-rose-400"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ocean-300">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
