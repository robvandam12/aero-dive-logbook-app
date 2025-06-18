
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { ExportActionsExtended } from "@/components/ExportActionsExtended";

const Admin = () => {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();

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

  // Solo admins pueden acceder
  if (userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
      </div>

      <div className="grid gap-6">
        {/* Gestión de Usuarios */}
        <Suspense fallback={<LoadingSkeleton type="table" count={5} />}>
          <UserManagementTable />
        </Suspense>

        {/* Grid de Secciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exportación Global */}
          <ExportActionsExtended showMultipleExport={true} />

          {/* Configuración del Sistema */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Configuración del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="text-ocean-300">
              <p>Configuraciones avanzadas del sistema (próximamente)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
