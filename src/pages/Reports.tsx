
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportsCharts } from "@/components/reports/ReportsCharts";
import { ReportsFilters } from "@/components/reports/ReportsFilters";
import { ReportsStats } from "@/components/reports/ReportsStats";
import { useState } from "react";

const Reports = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedCenter, setSelectedCenter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
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
          <h2 className="text-3xl font-bold tracking-tight text-white">Reportes Operativos</h2>
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

      {/* Estadísticas Principales */}
      <ReportsStats 
        dateRange={dateRange}
        selectedCenter={selectedCenter}
      />

      {/* Gráficos y Análisis */}
      <ReportsCharts 
        dateRange={dateRange}
        selectedCenter={selectedCenter}
      />
    </div>
  );
};

export default Reports;
