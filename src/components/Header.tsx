
import { Waves, Bell, User, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="glass border-b border-ocean-700/30 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-ocean-gradient rounded-xl blur opacity-60"></div>
              <div className="relative bg-ocean-gradient p-2 rounded-xl">
                <Waves className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Aerocam</h1>
              <p className="text-ocean-300 text-xs">Sistema de Bitácoras</p>
            </div>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-ocean-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/dive-logs" className="text-ocean-300 hover:text-white transition-colors">
                Bitácoras
              </Link>
              <a href="#" className="text-ocean-300 hover:text-white transition-colors opacity-50 cursor-not-allowed">
                Reportes
              </a>
              {userProfile?.role === 'admin' && (
                 <Link to="/admin" className="text-gold-300 hover:text-white transition-colors font-semibold flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Administración
                </Link>
              )}
            </nav>
          )}

          {/* User Actions */}
          {user && (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-ocean-300 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-ocean-600 text-white">
                        {user.email?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Supervisor de Buceo
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-white">
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
