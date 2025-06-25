
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Navigate } from "react-router-dom";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'usuario';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  console.log("ProtectedRoute - Auth state:", { 
    user: !!user, 
    authLoading, 
    profileLoading,
    profile: profile?.role 
  });

  const loading = authLoading || profileLoading;

  if (loading) {
    console.log("ProtectedRoute - Loading state, showing skeleton");
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
    console.log("ProtectedRoute - No user, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    console.log("ProtectedRoute - Insufficient role, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("ProtectedRoute - Auth success, rendering children");
  return <>{children}</>;
};

export { ProtectedRoute };
