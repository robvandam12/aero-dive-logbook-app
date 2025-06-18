
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Calendar, MapPin, Ship } from "lucide-react";

interface ReportsChartsProps {
  monthlyData: any[];
  centerData: any[];
  siteData: any[];
  totalLogs: number;
  signedLogs: number;
  draftLogs: number;
}

const COLORS = ['#6555FF', '#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE'];

const chartConfig = {
  total: {
    label: "Total Bitácoras",
    color: "#6555FF",
  },
  signed: {
    label: "Firmadas",
    color: "#10B981",
  },
  draft: {
    label: "Borradores",
    color: "#F59E0B",
  },
} satisfies any;

export const ReportsCharts = ({ 
  monthlyData, 
  centerData, 
  siteData, 
  totalLogs, 
  signedLogs, 
  draftLogs 
}: ReportsChartsProps) => {
  const statusData = [
    { name: 'Firmadas', value: signedLogs, color: '#10B981' },
    { name: 'Borradores', value: draftLogs, color: '#F59E0B' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bitácoras por Mes */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Bitácoras por Mes
          </CardTitle>
          <CardDescription className="text-ocean-300">
            Tendencia mensual de bitácoras creadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(101, 85, 255, 0.1)' }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#6555FF" 
                  radius={[4, 4, 0, 0]}
                  name="Total Bitácoras"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Estado de Bitácoras */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Estado de Bitácoras
          </CardTitle>
          <CardDescription className="text-ocean-300">
            Distribución por estado de validación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-ocean-200">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bitácoras por Centro */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Bitácoras por Centro
          </CardTitle>
          <CardDescription className="text-ocean-300">
            Distribución por centro de cultivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centerData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  width={100}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(101, 85, 255, 0.1)' }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#8B5CF6" 
                  radius={[0, 4, 4, 0]}
                  name="Total Bitácoras"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bitácoras por Sitio */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Ship className="w-5 h-5" />
            Sitios Más Utilizados
          </CardTitle>
          <CardDescription className="text-ocean-300">
            Top sitios de buceo por actividad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={siteData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#A855F7" 
                  strokeWidth={3}
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#6555FF' }}
                  name="Total Bitácoras"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
