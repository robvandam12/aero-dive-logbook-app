
import { useAuth } from "@/contexts/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, PlusCircle, BookOpen, UserCog, LogOut, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

export const AppSidebar = () => {
    const { user } = useAuth();
    const { data: userProfile } = useUserProfile();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const menuItems = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Nueva Bitácora", href: "/new-dive-log", icon: PlusCircle },
        { title: "Mis Bitácoras", href: "/dive-logs", icon: BookOpen },
    ];
    
    const adminMenuItems = [
        { title: "Administración", href: "/admin", icon: UserCog },
    ];

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <Ship className="w-8 h-8 text-ocean-400"/>
                    <h1 className="text-xl font-bold text-white group-data-[collapsible=icon]:hidden">Aerocam</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.title}>
                                    <Link to={item.href}>
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                
                {userProfile?.role === 'admin' && (
                    <SidebarGroup>
                        <SidebarMenu>
                            {adminMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.title}>
                                        <Link to={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                <div className="flex flex-col gap-2 p-2">
                     <p className="text-sm text-muted-foreground text-center truncate group-data-[collapsible=icon]:hidden">{user?.email}</p>
                     <Button onClick={handleLogout} variant="secondary" size="sm" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};
