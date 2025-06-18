
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NotificationCenter } from "./NotificationCenter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export const Header = () => {
  const { data: userProfile } = useUserProfile();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="h-16 border-b border-ocean-700/50 bg-gradient-to-r from-ocean-900/95 to-ocean-800/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
            alt="Aerocam Logo" 
            className="h-8 w-auto"
            onError={(e) => {
              // Fallback si la imagen no carga
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="h-8 w-8 bg-gradient-to-r from-[#6555FF] to-purple-700 rounded-lg flex items-center justify-center hidden">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Aerocam</h1>
            <span className="text-ocean-300 text-xs -mt-1">Sistema de Bitácoras de Buceo</span>
          </div>
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center gap-4">
          <NotificationCenter />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-[#6555FF] to-purple-700 text-white">
                    {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-ocean-900 border-ocean-700" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none text-white">
                  {userProfile?.username || 'Usuario'}
                </p>
                <p className="text-xs leading-none text-ocean-300 capitalize">
                  {userProfile?.role || 'Usuario'}
                </p>
              </div>
              <DropdownMenuItem onClick={handleSettings} className="text-white hover:bg-ocean-800">
                <User className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-ocean-800">
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
