
import { LoadingSkeleton } from "./LoadingSkeleton";
import { useLoading } from "@/contexts/LoadingProvider";

const NavigationLoader = () => {
  const { isInitialLoad } = useLoading();

  if (isInitialLoad) {
    // Primera carga - mostrar skeleton con sidebar
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900">
        <div className="flex min-h-screen w-full">
          {/* Sidebar skeleton */}
          <div className="w-64 bg-gradient-to-b from-slate-950 to-gray-900 border-r border-slate-800 p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6555FF]/20 to-purple-700/20 rounded-lg animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-800/50 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          {/* Content skeleton */}
          <div className="flex-1 p-0">
            <LoadingSkeleton type="dashboard" count={3} />
          </div>
        </div>
      </div>
    );
  }

  // Navegación posterior - solo skeleton del contenido
  return (
    <div className="w-full h-full p-8">
      <LoadingSkeleton type="dashboard" count={3} />
    </div>
  );
};

export default NavigationLoader;
