
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportsChartsProps {
  dateRange: { from?: Date; to?: Date };
  selectedCenter: string;
}

const COLORS = ['#6555FF', '#10b981', '#eab308', '#f43f5e', '#8b5cf6', '#06b6d4'];

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
          departure_time,
          arrival_time,
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
        const diversCount = Array.isArray(log.divers_manifest) ? log.divers_manifest.length : 0;
        
        if (!acc[centerName]) {
          acc[centerName] = { logs: 0, divers: 0 };
        }
        acc[centerName].logs += 1;
        acc[centerName].divers += diversCount;
        return acc;
      }, {} as Record<string, { logs: number; divers: number }>) || {};

      const logsByMonth = data?.reduce((acc, log) => {
        const date = new Date(log.log_date);
        const month = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        const diversCount = Array.isArray(log.divers_manifest) ? log.divers_manifest.length : 0;
        
        if (!acc[month]) {
          acc[month] = { logs: 0, divers: 0 };
        }
        acc[month].logs += 1;
        acc[month].divers += diversCount;
        return acc;
      }, {} as Record<string, { logs: number; divers: number }>) || {};

      const diversByRole = data?.reduce((acc, log) => {
        const manifest = Array.isArray(log.divers_manifest) ? log.divers_manifest : [];
        manifest.forEach((diver: any) => {
          const role = diver.role || 'buzo';
          acc[role] = (acc[role] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>) || {};

      const operationsByHour = data?.reduce((acc, log) => {
        if (log.departure_time) {
          const hour = parseInt(log.departure_time.split(':')[0]);
          const hourLabel = `${hour}:00`;
          acc[hourLabel] = (acc[hourLabel] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      const weatherStats = data?.reduce((acc, log) => {
        const weather = log.weather_conditions || 'No especificado';
        acc[weather] = (acc[weather] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        centerData: Object.entries(logsByCenter).map(([name, value]) => ({ 
          name, 
          bitacoras: value.logs,
          buzos: value.divers 
        })),
        monthlyData: Object.entries(logsByMonth)
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .map(([name, value]) => ({ 
            name, 
            bitacoras: value.logs,
            buzos: value.divers 
          })),
        roleData: Object.entries(diversByRole).map(([name, value]) => ({ name, value })),
        hourlyData: Object.entries(operationsByHour)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([name, value]) => ({ name, operaciones: value })),
        weatherData: Object.entries(weatherStats).map(([name, value]) => ({ name, value }))
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white text-sm">
              <span style={{ color: entry.color }}>{entry.dataKey}: </span>
              <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6">
      {/* Bitácoras y Buzos por Centro */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Bitácoras y Buzos por Centro</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.centerData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#e5e7eb" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#e5e7eb" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bitacoras" fill="#6555FF" name="Bitácoras" />
                <Bar dataKey="buzos" fill="#10b981" name="Buzos" />
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
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia Mensual */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Tendencia Mensual de Operaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#e5e7eb" fontSize={12} />
              <YAxis stroke="#e5e7eb" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="bitacoras" 
                stackId="1"
                stroke="#6555FF" 
                fill="#6555FF"
                fillOpacity={0.6}
                name="Bitácoras"
              />
              <Area 
                type="monotone" 
                dataKey="buzos" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.6}
                name="Buzos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Operaciones por Hora y Condiciones Climáticas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Operaciones por Hora del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.hourlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#e5e7eb" fontSize={12} />
                <YAxis stroke="#e5e7eb" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="operaciones" 
                  stroke="#eab308" 
                  strokeWidth={3}
                  dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                  name="Operaciones"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Condiciones Climáticas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.weatherData || []} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#e5e7eb" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#e5e7eb" 
                  fontSize={12}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#f43f5e" name="Operaciones" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
