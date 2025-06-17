
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'supervisor';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900">
        <div className="flex min-h-screen w-full">
          {/* Sidebar skeleton */}
          <div className="w-64 bg-gradient-to-b from-slate-950 to-gray-900 border-r border-slate-800">
            <LoadingSkeleton type="page" count={1} />
          </div>
          {/* Content skeleton */}
          <div className="flex-1 p-8">
            <LoadingSkeleton type="dashboard" count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };
