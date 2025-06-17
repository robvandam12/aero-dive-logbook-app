
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { Ship, Users, Anchor, Waves, AlertTriangle, FileText, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSystemStats } from "@/hooks/useSystemStats";
import { useDiveLogs } from "@/hooks/useDiveLogs";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDiveLogsTable } from "./AdminDiveLogsTable";
import { ActivityLogsWidget } from "./ActivityLogsWidget";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { data: diveLogsData, isLoading: logsLoading } = useDiveLogs({ 
    userId: undefined, // Admin ve todas las bitácoras
    page: 1,
    perPage: 10 
  });

  const recentLogs = diveLogsData?.data || [];

  if (statsLoading && logsLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Panel de Administración</h2>
          <p className="text-ocean-300">Vista global del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/reports')} variant="outline" className="border-ocean-700 text-ocean-300">
            <FileText className="w-4 h-4 mr-2" />
            Reportes
          </Button>
          <Button onClick={() => navigate('/new-dive-log')} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nueva Bitácora
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[126px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Bitácoras Totales"
            value={stats?.totalDiveLogs ?? 0}
            icon={Ship}
            color="ocean"
          />
          <StatsCard
            title="Usuarios Activos"
            value={stats?.activeUsers ?? 0}
            icon={Users}
            color="emerald"
          />
          <StatsCard
            title="Centros de Buceo"
            value={stats?.centers ?? 0}
            icon={Anchor}
            color="gold"
          />
          <StatsCard
            title="Bitácoras Pendientes"
            value={stats?.pendingLogs ?? 0}
            icon={AlertTriangle}
            color="rose"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Dive Logs */}
        <div className="lg:col-span-2">
          <AdminDiveLogsTable logs={recentLogs} isLoading={logsLoading} />
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityLogsWidget />
        </div>
      </div>
    </div>
  );
};
