
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  FileText, 
  Plus, 
  BarChart3, 
  Settings, 
  Users, 
  MapPin, 
  Ship,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const isAdmin = userProfile?.role === 'admin';

  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Todas las Bitácoras",
      url: "/dive-logs",
      icon: FileText,
    },
    {
      title: "Nueva Bitácora",
      url: "/dive-logs/new",
      icon: Plus,
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: BarChart3,
    },
  ];

  const adminItems = [
    {
      title: "Administración",
      url: "/admin",
      icon: Users,
    },
    {
      title: "Sitios de Buceo",
      url: "/admin/dive-sites",
      icon: MapPin,
    },
    {
      title: "Embarcaciones",
      url: "/admin/boats",
      icon: Ship,
    },
  ];

  const settingsItems = [
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar variant="floating" className="border-r border-ocean-700/50">
      <SidebarHeader className="border-b border-ocean-700/50 pb-4">
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
                alt="Aerocam Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-r from-[#6555FF] to-purple-700 rounded-lg flex items-center justify-center hidden">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            </div>
          ) : (
            <>
              <img 
                src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
                alt="Aerocam Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-r from-[#6555FF] to-purple-700 rounded-lg flex items-center justify-center hidden">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">Aerocam</span>
                <span className="text-ocean-300 text-xs">Sistema de Bitácoras</span>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4">
        {/* Menú Principal */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel className="text-ocean-300">Menú Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className={`group ${isCollapsed ? 'justify-center px-2' : ''}`}>
                      <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} transition-all`} />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-ocean-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menú Administración (solo para admins) */}
        {isAdmin && (
          <SidebarGroup>
            {!isCollapsed && <SidebarGroupLabel className="text-ocean-300">Administración</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url} className={`group ${isCollapsed ? 'justify-center px-2' : ''}`}>
                        <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} transition-all`} />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-ocean-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {item.title}
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Configuración */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel className="text-ocean-300">Sistema</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className={`group ${isCollapsed ? 'justify-center px-2' : ''}`}>
                      <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} transition-all`} />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-ocean-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-ocean-700/50 pt-4">
        {/* Usuario actual */}
        <div className={`flex items-center gap-3 px-2 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <Avatar className={`${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}`}>
            <AvatarFallback className="bg-gradient-to-r from-[#6555FF] to-purple-700 text-white text-xs">
              {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-medium truncate">
                {userProfile?.username || 'Usuario'}
              </span>
              <span className="text-ocean-300 text-xs capitalize">
                {userProfile?.role || 'Usuario'}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-ocean-700/50 mb-3" />
        
        {/* Botón de cerrar sesión */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className={`group ${isCollapsed ? 'justify-center px-2' : ''}`}>
              <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'} transition-all`} />
              {!isCollapsed && <span className="text-sm">Cerrar Sesión</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-ocean-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Cerrar Sesión
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
