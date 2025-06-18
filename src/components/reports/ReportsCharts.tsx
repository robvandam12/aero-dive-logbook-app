import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Calendar, MapPin, Ship } from "lucide-react";
import { useReportsData } from "@/hooks/useReportsData";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface ReportsChartsProps {
  dateRange?: { from?: Date; to?: Date };
  selectedCenter?: string;
}

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

export const ReportsCharts = ({ dateRange, selectedCenter }: ReportsChartsProps) => {
  const { data: reportsData, isLoading, error } = useReportsData({ dateRange, selectedCenter });

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" count={4} />;
  }

  if (error || !reportsData) {
    return (
      <div className="text-center py-8 text-ocean-300">
        Error al cargar los datos de reportes
      </div>
    );
  }

  const { monthlyData, centerData, siteData, statusData } = reportsData;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bitácoras por Mes */}
      <Card className="glass border-slate-800/50 bg-slate-950/50 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6555FF]" />
            Bitácoras por Mes
          </CardTitle>
          <CardDescription className="text-slate-400">
            Tendencia mensual de bitácoras creadas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="w-full h-80">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6555FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6555FF" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94A3B8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94A3B8"
                    fontSize={12}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(101, 85, 255, 0.1)' }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="url(#colorTotal)"
                    radius={[4, 4, 0, 0]}
                    name="Total Bitácoras"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Bitácoras */}
      <Card className="glass border-slate-800/50 bg-slate-950/50 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            Estado de Bitácoras
          </CardTitle>
          <CardDescription className="text-slate-400">
            Distribución por estado de validación
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col">
          <div className="w-full h-64 flex-1">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorSigned" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="colorDraft" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#D97706" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-shrink-0">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-300">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bitácoras por Centro */}
      <Card className="glass border-slate-800/50 bg-slate-950/50 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-500" />
            Bitácoras por Centro
          </CardTitle>
          <CardDescription className="text-slate-400">
            Distribución por centro de cultivo
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="w-full h-80">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={centerData} layout="horizontal" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCenter" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    type="number"
                    stroke="#94A3B8"
                    fontSize={12}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    stroke="#94A3B8"
                    fontSize={12}
                    width={80}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="url(#colorCenter)"
                    radius={[0, 4, 4, 0]}
                    name="Total Bitácoras"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bitácoras por Sitio */}
      <Card className="glass border-slate-800/50 bg-slate-950/50 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-white flex items-center gap-2">
            <Ship className="w-5 h-5 text-indigo-400" />
            Sitios Más Utilizados
          </CardTitle>
          <CardDescription className="text-slate-400">
            Top sitios de buceo por actividad
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="w-full h-80">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={siteData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorSite" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#94A3B8"
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
                    fill="url(#colorSite)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
