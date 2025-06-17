
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { Ship, FileCheck, Clock, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiveLogs } from "@/hooks/useDiveLogs";
import { useAuth } from "@/contexts/AuthProvider";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { RecentDiveLogsTable } from "@/components/RecentDiveLogsTable";

export const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: diveLogsData, isLoading } = useDiveLogs({ 
    userId: user?.id,
    page: 1,
    perPage: 5 
  });

  const diveLogs = diveLogsData?.data || [];
  const totalLogs = diveLogsData?.count || 0;
  const signedLogs = diveLogs.filter(log => log.status === 'signed').length;
  const draftLogs = diveLogs.filter(log => log.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Mi Dashboard
          </h2>
          <p className="text-ocean-300">Resumen de mis bitácoras de buceo</p>
        </div>
        <Button onClick={() => navigate('/new-dive-log')} className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90">
          <PlusCircle className="w-4 h-4 mr-2" />
          Nueva Bitácora
        </Button>
      </div>

      {/* Personal Stats */}
      {isLoading ? (
        <LoadingSkeleton type="dashboard" count={3} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Mis Bitácoras"
            value={totalLogs}
            icon={Ship}
            color="ocean"
          />
          <StatsCard
            title="Firmadas"
            value={signedLogs}
            icon={FileCheck}
            color="emerald"
          />
          <StatsCard
            title="Borradores"
            value={draftLogs}
            icon={Clock}
            color="gold"
          />
        </div>
      )}

      {/* Recent Dive Logs */}
      <RecentDiveLogsTable />
    </div>
  );
};
