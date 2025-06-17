
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { 
  FileText, 
  Plus, 
  BarChart3, 
  Settings, 
  Users, 
  LogOut,
  Building2,
  MapPin,
  Ship,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AppSidebar = () => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      show: true
    },
    {
      title: "Nueva Bitácora",
      url: "/dive-logs/new",
      icon: Plus,
      show: true
    },
    {
      title: "Bitácoras",
      url: "/dive-logs",
      icon: FileText,
      show: true
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: BarChart3,
      show: profile?.role === 'admin'
    },
    {
      title: "Validar Firma",
      url: "/validate-signature",
      icon: Shield,
      show: true
    }
  ];

  const adminItems = [
    {
      title: "Administración",
      url: "/admin",
      icon: Settings,
      show: profile?.role === 'admin'
    },
    {
      title: "Usuarios",
      url: "/admin/users",
      icon: Users,
      show: profile?.role === 'admin'
    },
    {
      title: "Centros",
      url: "/admin/centers",
      icon: Building2,
      show: profile?.role === 'admin'
    },
    {
      title: "Sitios de Buceo",
      url: "/admin/dive-sites",
      icon: MapPin,
      show: profile?.role === 'admin'
    },
    {
      title: "Embarcaciones",
      url: "/admin/boats",
      icon: Ship,
      show: profile?.role === 'admin'
    }
  ];

  return (
    <Sidebar className="glass border-r border-ocean-700">
      <SidebarHeader className="p-6 border-b border-ocean-700">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/5038e2b4-cc24-47a9-8840-3147bbda23b9.png"
            alt="Aerocam Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-xl font-bold text-white">Aerocam</h2>
            <p className="text-sm text-ocean-300">Sistema de Bitácoras</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.filter(item => item.show).map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                onClick={() => navigate(item.url)}
                className={`w-full justify-start text-ocean-300 hover:text-white hover:bg-ocean-800 ${
                  isActive(item.url) ? 'bg-ocean-800 text-white' : ''
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {profile?.role === 'admin' && (
          <>
            <div className="mt-8 mb-4">
              <h3 className="text-sm font-semibold text-ocean-400 uppercase tracking-wider px-3">
                Administración
              </h3>
            </div>
            <SidebarMenu>
              {adminItems.filter(item => item.show).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.url)}
                    className={`w-full justify-start text-ocean-300 hover:text-white hover:bg-ocean-800 ${
                      isActive(item.url) ? 'bg-ocean-800 text-white' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-ocean-700">
        <div className="mb-4">
          <p className="text-sm text-ocean-300">
            {profile?.username || user?.email}
          </p>
          <p className="text-xs text-ocean-400 capitalize">
            {profile?.role || 'Usuario'}
          </p>
        </div>
        <SidebarMenuButton 
          onClick={handleSignOut}
          className="w-full justify-start text-ocean-300 hover:text-white hover:bg-red-800"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar Sesión
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export { AppSidebar };
