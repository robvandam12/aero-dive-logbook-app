
import * as React from "react"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ReactNode
  label?: string
  description?: string
}

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  children: React.ReactNode
}

import { Calendar, Home, Ship, Users, Cog, BarChart3, Settings, Anchor, ChevronUp, User2, FileText } from "lucide-react"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthProvider"
import { useUserProfile } from "@/hooks/useUserProfile"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isAdmin = userProfile?.role === 'admin';

  // Elementos de navegación principales
  const mainNavigation = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Nueva Bitácora",
      url: "/new-dive-log",
      icon: Ship,
    },
    {
      title: "Todas las Bitácoras",
      url: "/all-dive-logs",
      icon: FileText,
    },
  ];

  // Elementos solo para administradores
  const adminNavigation = [
    {
      title: "Reportes",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "Administración",
      url: "/admin",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#6555FF] to-purple-700 text-sidebar-primary-foreground relative overflow-hidden">
                  <img 
                    src="/lovable-uploads/69b45c89-8ef7-40b3-88e7-21a3e0d1cd98.png" 
                    alt="Aerocam" 
                    className="w-6 h-6 object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">Aerocam App</span>
                  <span className="truncate text-xs text-ocean-300">Sistema de Bitácoras</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-ocean-300">Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-ocean-200 hover:text-white hover:bg-gradient-to-r hover:from-[#6555FF]/20 hover:to-purple-700/20">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-ocean-300">Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-ocean-200 hover:text-white hover:bg-gradient-to-r hover:from-[#6555FF]/20 hover:to-purple-700/20">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-[#6555FF]/20 data-[state=open]:to-purple-700/20 text-ocean-200"
                >
                  <User2 className="size-4" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userProfile?.username || user?.email?.split('@')[0] || 'Usuario'}
                    </span>
                    <span className="truncate text-xs text-ocean-400">
                      {userProfile?.role === 'admin' ? 'Administrador' : 'Supervisor'}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-ocean-900 border-ocean-700"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleSignOut} className="text-ocean-200 hover:text-white hover:bg-gradient-to-r hover:from-[#6555FF]/20 hover:to-purple-700/20">
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
