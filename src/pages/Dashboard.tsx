
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
      <div className="w-full h-full p-8">
        <div className="flex items-center gap-4 mb-6">
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
      <div className="w-full h-full p-8">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
      </div>
      <SupervisorDashboard />
    </div>
  );
};

export default Dashboard;
