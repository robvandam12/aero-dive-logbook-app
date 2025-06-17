
import { Loader2 } from "lucide-react";

const NavigationLoader = () => {
  return (
    <div className="navigation-loader">
      <div className="flex flex-col items-center justify-center space-y-4">
        <img 
          src="/lovable-uploads/5038e2b4-cc24-47a9-8840-3147bbda23b9.png"
          alt="Aerocam Logo"
          className="w-16 h-16 object-contain"
        />
        <Loader2 className="w-8 h-8 animate-spin text-ocean-300" />
        <p className="text-ocean-300 text-sm">Cargando...</p>
      </div>
    </div>
  );
};

export default NavigationLoader;
