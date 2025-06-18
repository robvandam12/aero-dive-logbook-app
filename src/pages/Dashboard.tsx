
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { SupervisorDashboard } from "@/components/dashboard/SupervisorDashboard";

const Dashboard = () => {
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

  // Renderizar dashboard según el rol del usuario
  if (userProfile?.role === 'admin') {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
              Dashboard Administrativo
            </h2>
            <p className="text-ocean-300">Panel de control y gestión del sistema</p>
          </div>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
            Dashboard Usuario
          </h2>
          <p className="text-ocean-300">Gestión de bitácoras y operaciones de buceo</p>
        </div>
      </div>
      <SupervisorDashboard />
    </div>
  );
};

export default Dashboard;
