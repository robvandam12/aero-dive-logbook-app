
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportsChartsProps {
  dateRange: { from?: Date; to?: Date };
  selectedCenter: string;
}

const COLORS = ['#6555FF', '#10b981', '#eab308', '#f43f5e', '#8b5cf6'];

export const ReportsCharts = ({ dateRange, selectedCenter }: ReportsChartsProps) => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['reportsCharts', dateRange, selectedCenter],
    queryFn: async () => {
      let query = supabase
        .from('dive_logs')
        .select(`
          id,
          log_date,
          divers_manifest,
          weather_conditions,
          center_id,
          centers(name),
          dive_sites(name)
        `);

      // Aplicar filtros
      if (dateRange.from) {
        query = query.gte('log_date', dateRange.from.toISOString().split('T')[0]);
      }
      if (dateRange.to) {
        query = query.lte('log_date', dateRange.to.toISOString().split('T')[0]);
      }
      if (selectedCenter !== 'all') {
        query = query.eq('center_id', selectedCenter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Procesar datos para gráficos
      const logsByCenter = data?.reduce((acc, log) => {
        const centerName = log.centers?.name || 'Sin Centro';
        acc[centerName] = (acc[centerName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const logsByMonth = data?.reduce((acc, log) => {
        const month = new Date(log.log_date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const diversByRole = data?.reduce((acc, log) => {
        const manifest = Array.isArray(log.divers_manifest) ? log.divers_manifest : [];
        manifest.forEach((diver: any) => {
          const role = diver.role || 'buzo';
          acc[role] = (acc[role] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        centerData: Object.entries(logsByCenter).map(([name, value]) => ({ name, value })),
        monthlyData: Object.entries(logsByMonth).map(([name, value]) => ({ name, value })),
        roleData: Object.entries(diversByRole).map(([name, value]) => ({ name, value }))
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bitácoras por Centro */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Bitácoras por Centro</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData?.centerData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#6555FF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribución por Roles */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Distribución de Buzos por Rol</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData?.roleData || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData?.roleData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendencia Mensual */}
      <Card className="glass md:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Tendencia Mensual de Bitácoras</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6555FF" 
                strokeWidth={2}
                dot={{ fill: '#6555FF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
