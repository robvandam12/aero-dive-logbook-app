
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
      <div className="w-full h-full">
        <div className="flex items-center gap-4 mb-6 px-8 pt-8">
          <SidebarTrigger />
          <LoadingSkeleton type="page" count={1} />
        </div>
        <div className="px-8 pb-8">
          <LoadingSkeleton type="dashboard" count={4} />
        </div>
      </div>
    );
  }

  // Renderizar dashboard según el rol del usuario
  if (userProfile?.role === 'admin') {
    return (
      <div className="w-full h-full">
        <div className="flex items-center gap-4 mb-6 px-8 pt-8">
          <SidebarTrigger />
        </div>
        <div className="px-8 pb-8">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-4 mb-6 px-8 pt-8">
        <SidebarTrigger />
      </div>
      <div className="px-8 pb-8">
        <SupervisorDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
