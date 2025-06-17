
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { DiveLogTable } from "@/components/DiveLogTable";
import { DashboardChart } from "@/components/DashboardChart";
import { FileText, CheckCircle, Send, Users, Clock, TrendingUp } from "lucide-react";
import { useIndexStats } from "@/hooks/useIndexStats";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

const Index = () => {
  const { data: stats, isLoading } = useIndexStats();
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleQuickActionClick = (path: string) => {
    if (session) {
      navigate(path);
    } else {
      navigate('/auth');
    }
  };

  const signedPercentage = stats?.totalDiveLogs ? ((stats.signedDiveLogs / stats.totalDiveLogs) * 100).toFixed(1) : "0.0";
  const sentPercentage = "0.0";

  const statsCards = isLoading ? (
    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-full min-h-[124px] rounded-xl glass" />)
  ) : (
    <>
      <StatsCard
        title="Total Bitácoras"
        value={stats?.totalDiveLogs ?? 0}
        icon={FileText}
        color="ocean"
      />
      <StatsCard
        title="Firmadas"
        value={stats?.signedDiveLogs ?? 0}
        description={`${signedPercentage}% del total`}
        icon={CheckCircle}
        color="emerald"
      />
      <StatsCard
        title="Enviadas"
        value={stats?.sentDiveLogs ?? 0}
        description={`${sentPercentage}% del total`}
        icon={Send}
        color="gold"
      />
      <StatsCard
        title="Supervisores Activos"
        value={stats?.activeSupervisors ?? 0}
        icon={Users}
        color="rose"
      />
    </>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 ocean-pattern">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src="/lovable-uploads/acb40eaa-dea4-4b1a-bcf0-2f102558239e.png" 
              alt="Aerocam Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold text-white">
              Bienvenido a AerocamApp
            </h1>
          </div>
          <p className="text-xl text-ocean-300 max-w-2xl mx-auto">
            Gestiona tus bitácoras de buceo de manera profesional, segura y eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards}
        </div>

        <DashboardChart />

        <DiveLogTable />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => handleQuickActionClick('/new-dive-log')} className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer ocean-shimmer">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Nueva Bitácora</h3>
                <p className="text-ocean-300 text-sm">Crear una nueva bitácora de buceo</p>
              </div>
            </div>
          </div>

          <div onClick={() => handleQuickActionClick('/dashboard')} className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer ocean-shimmer">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reportes</h3>
                <p className="text-ocean-300 text-sm">Ver estadísticas y exportar datos</p>
              </div>
            </div>
          </div>

          <div onClick={() => handleQuickActionClick('/dashboard')} className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer ocean-shimmer">
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

        <footer className="text-center text-ocean-400 text-sm py-8">
          <p>© 2024 AerocamApp - Sistema de Gestión de Bitácoras de Buceo</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
