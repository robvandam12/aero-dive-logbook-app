
import { Skeleton } from "@/components/ui/skeleton";
import { Anchor } from "lucide-react";

export const NavigationLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-900 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#6555FF]/20 border-t-[#6555FF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-l-purple-700 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="text-center space-y-2">
          <div className="flex items-center space-x-2">
            <Anchor className="w-5 h-5 text-[#6555FF]" />
            <span className="text-white font-medium">Aerocam</span>
          </div>
          <p className="text-ocean-300 text-sm">Cargando...</p>
        </div>
      </div>
    </div>
  );
};
