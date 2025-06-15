
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyData = [
  { mes: 'Ene', bitacoras: 12, firmadas: 10 },
  { mes: 'Feb', bitacoras: 15, firmadas: 14 },
  { mes: 'Mar', bitacoras: 18, firmadas: 16 },
  { mes: 'Abr', bitacoras: 22, firmadas: 20 },
  { mes: 'May', bitacoras: 25, firmadas: 23 },
  { mes: 'Jun', bitacoras: 28, firmadas: 26 }
];

const centerData = [
  { centro: 'Valparaíso', bitacoras: 45 },
  { centro: 'San Antonio', bitacoras: 38 },
  { centro: 'Talcahuano', bitacoras: 32 },
  { centro: 'Antofagasta', bitacoras: 28 }
];

export const DashboardChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Bitácoras por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0c4a6e" />
              <XAxis 
                dataKey="mes" 
                stroke="#7dd3fc"
                fontSize={12}
              />
              <YAxis 
                stroke="#7dd3fc"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0c4a6e',
                  border: '1px solid #0369a1',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bitacoras" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                name="Total Bitácoras"
              />
              <Line 
                type="monotone" 
                dataKey="firmadas" 
                stroke="#fbbf24" 
                strokeWidth={3}
                dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                name="Firmadas"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">Bitácoras por Centro</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={centerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0c4a6e" />
              <XAxis 
                dataKey="centro" 
                stroke="#7dd3fc"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#7dd3fc"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0c4a6e',
                  border: '1px solid #0369a1',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar 
                dataKey="bitacoras" 
                fill="url(#oceanGradient)"
                radius={[4, 4, 0, 0]}
                name="Bitácoras"
              />
              <defs>
                <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#0369a1" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
