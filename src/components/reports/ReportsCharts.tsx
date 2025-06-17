
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface ReportsChartsProps {
  dateRange: { from?: Date; to?: Date };
  selectedCenter: string;
}

const COLORS = ['#6555FF', '#10b981', '#eab308', '#f43f5e', '#8b5cf6', '#06b6d4', '#f97316'];

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
          water_temperature,
          visibility,
          current_strength,
          center_id,
          status,
          created_at,
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

      const statusDistribution = data?.reduce((acc, log) => {
        const status = log.status || 'draft';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const weatherDistribution = data?.reduce((acc, log) => {
        const weather = log.weather_conditions || 'No especificado';
        acc[weather] = (acc[weather] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Operaciones por hora del día
      const operationsByHour = data?.reduce((acc, log) => {
        const hour = new Date(log.created_at).getHours();
        const hourLabel = `${hour}:00`;
        acc[hourLabel] = (acc[hourLabel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Datos de condiciones ambientales
      const environmentalData = data?.filter(log => log.water_temperature || log.visibility).map(log => ({
        date: new Date(log.log_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        temperatura: log.water_temperature || 0,
        visibilidad: log.visibility || 0,
        corriente: log.current_strength || 0
      })) || [];

      return {
        centerData: Object.entries(logsByCenter).map(([name, value]) => ({ name, value })),
        monthlyData: Object.entries(logsByMonth).map(([name, value]) => ({ name, value })),
        roleData: Object.entries(diversByRole).map(([name, value]) => ({ name, value })),
        statusData: Object.entries(statusDistribution).map(([name, value]) => ({ 
          name: name === 'draft' ? 'Borrador' : name === 'signed' ? 'Firmado' : name, 
          value 
        })),
        weatherData: Object.entries(weatherDistribution).map(([name, value]) => ({ name, value })),
        hourlyData: Object.entries(operationsByHour).map(([name, value]) => ({ name, value })),
        environmentalData
      };
    }
  });

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" count={6} />;
  }

  const customTooltipStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#ffffff'
  };

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
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="value" fill="#6555FF" radius={[4, 4, 0, 0]} />
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
                labelStyle={{ fill: '#ffffff', fontSize: '12px' }}
              >
                {chartData?.roleData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Estado de Bitácoras */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Estado de Bitácoras</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData?.statusData || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelStyle={{ fill: '#ffffff', fontSize: '12px' }}
              >
                {chartData?.statusData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Condiciones Climáticas */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Condiciones Climáticas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData?.weatherData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Operaciones por Hora */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Operaciones por Hora del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData?.hourlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#eab308" 
                fill="#eab308" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendencia Mensual */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Tendencia Mensual de Bitácoras</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6555FF" 
                strokeWidth={3}
                dot={{ fill: '#6555FF', r: 6 }}
                activeDot={{ r: 8, fill: '#6555FF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Condiciones Ambientales */}
      {chartData?.environmentalData && chartData.environmentalData.length > 0 && (
        <Card className="glass md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Condiciones Ambientales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.environmentalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#d1d5db" fontSize={12} />
                <YAxis stroke="#d1d5db" fontSize={12} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  name="Temperatura (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="visibilidad" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Visibilidad (m)"
                />
                <Line 
                  type="monotone" 
                  dataKey="corriente" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Corriente"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
