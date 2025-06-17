import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ReportsCharts } from "@/components/reports/ReportsCharts";
import { ReportsFilters } from "@/components/reports/ReportsFilters";
import { ReportsStats } from "@/components/reports/ReportsStats";
import { ExportActionsExtended } from "@/components/ExportActionsExtended";
import { useState, Suspense } from "react";

const Reports = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedCenter, setSelectedCenter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <LoadingSkeleton type="dashboard" count={4} />
      </div>
    );
  }

  // Solo admins pueden ver reportes
  if (userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Reportes Operativos
          </h2>
          <p className="text-ocean-300">Análisis detallado de operaciones de buceo</p>
        </div>
      </div>

      {/* Filtros */}
      <ReportsFilters 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedCenter={selectedCenter}
        onCenterChange={setSelectedCenter}
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Estadísticas - 3 columnas */}
        <div className="xl:col-span-3">
          <Suspense fallback={<LoadingSkeleton type="dashboard" count={4} />}>
            <ReportsStats 
              dateRange={dateRange}
              selectedCenter={selectedCenter}
            />
          </Suspense>
        </div>

        {/* Exportación - 1 columna */}
        <div>
          <ExportActionsExtended 
            showMultipleExport={true} 
            dateRange={dateRange}
          />
        </div>
      </div>

      {/* Gráficos y Análisis */}
      <Suspense fallback={<LoadingSkeleton type="dashboard" count={6} />}>
        <ReportsCharts 
          dateRange={dateRange}
          selectedCenter={selectedCenter}
        />
      </Suspense>
    </div>
  );
};

export default Reports;
