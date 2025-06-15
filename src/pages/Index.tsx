
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { DiveLogTable } from "@/components/DiveLogTable";
import { DashboardChart } from "@/components/DashboardChart";
import { FileText, CheckCircle, Send, Users, Clock, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-hero-gradient ocean-pattern">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Bienvenido al Sistema Aerocam
          </h1>
          <p className="text-xl text-ocean-300 max-w-2xl mx-auto">
            Gestiona tus bitácoras de buceo de manera profesional, segura y eficiente
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Bitácoras"
            value="143"
            description="Este mes"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            color="ocean"
          />
          <StatsCard
            title="Firmadas"
            value="128"
            description="89.5% del total"
            icon={CheckCircle}
            trend={{ value: 5, isPositive: true }}
            color="emerald"
          />
          <StatsCard
            title="Enviadas"
            value="115"
            description="80.4% del total"
            icon={Send}
            trend={{ value: 8, isPositive: true }}
            color="gold"
          />
          <StatsCard
            title="Supervisores Activos"
            value="12"
            description="En 4 centros"
            icon={Users}
            color="rose"
          />
        </div>

        {/* Charts Section */}
        <DashboardChart />

        {/* Recent Dive Logs Table */}
        <DiveLogTable />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer ocean-shimmer">
            <div className="flex items-center space-x-4">
              <div className="bg-ocean-gradient p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Nueva Bitácora</h3>
                <p className="text-ocean-300 text-sm">Crear una nueva bitácora de buceo</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer ocean-shimmer">
            <div className="flex items-center space-x-4">
              <div className="bg-gold-gradient p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reportes</h3>
                <p className="text-ocean-300 text-sm">Ver estadísticas y exportar datos</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer ocean-shimmer">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Pendientes</h3>
                <p className="text-ocean-300 text-sm">Bitácoras por firmar y enviar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-ocean-400 text-sm py-8">
          <p>© 2024 Aerocam App - Sistema de Gestión de Bitácoras de Buceo</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
