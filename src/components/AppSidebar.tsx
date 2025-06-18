"use client"

import * as React from "react"
import { Home, FileText, Plus, BarChart3, Settings, LogOut, ChevronsUpDown } from "lucide-react"
import { Sidebar as ArkSidebar } from "@ark-ui/react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/contexts/AuthProvider"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.ComponentProps<typeof ArkSidebar.Root> {
  collapsible?: "always" | "mobile" | "never" | "icon"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ collapsible = "never", className, children, ...props }, ref) => {
    const { isMobile } = useSidebar()
    const [isCollapsible, setIsCollapsible] = React.useState(
      collapsible === "always" ||
        (collapsible === "mobile" && isMobile) ||
        collapsible === "icon"
    )

    React.useEffect(() => {
      setIsCollapsible(
        collapsible === "always" ||
          (collapsible === "mobile" && isMobile) ||
          collapsible === "icon"
      )
    }, [collapsible, isMobile])

    return (
      <ArkSidebar.Root
        ref={ref}
        collapsible={isCollapsible}
        className={cn(
          "group/sidebar data-[state=collapsed]:w-[var(--sidebar-width-icon)] data-[state=expanded]:w-[var(--sidebar-width)] transition-width border-r border-sidebar bg-sidebar supports-[transition:width]:duration-200",
          className
        )}
        {...props}
      >
        {children}
      </ArkSidebar.Root>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ArkSidebar.Header>
>(({ className, children, ...props }, ref) => {
  return (
    <ArkSidebar.Header
      ref={ref}
      className={cn("flex h-16 items-center justify-between px-4", className)}
      {...props}
    >
      {children}
    </ArkSidebar.Header>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ArkSidebar.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <ArkSidebar.Content
      ref={ref}
      className={cn("flex flex-col gap-2 px-4 py-4", className)}
      {...props}
    >
      {children}
    </ArkSidebar.Content>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ArkSidebar.Footer>
>(({ className, children, ...props }, ref) => {
  return (
    <ArkSidebar.Footer
      ref={ref}
      className={cn("flex items-center px-4 py-4", className)}
      {...props}
    >
      {children}
    </ArkSidebar.Footer>
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, size, children, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "group/sidebar-menu-button flex h-11 w-full items-center gap-2 rounded-lg px-3.5 font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-sidebar-accent-foreground data-[state=collapsed]:px-2.5 data-[state=collapsed]:text-muted-foreground",
        size === "lg" && "text-lg",
        state === "collapsed" && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-semibold text-muted-foreground",
        "group-last:hidden"
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      ref={ref}
      aria-label="Toggle Sidebar"
      onClick={toggleSidebar}
      className={cn(
        "peer inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 group-[[data-variant=inset]]:ml-auto group-[[data-variant=inset]]:mr-2",
        className
      )}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: userProfile } = useUserProfile();

  const navigation = [
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
      url: "/new-dive-log",
      icon: Plus,
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: BarChart3,
    },
  ];

  const adminNavigation = [
    {
      title: "Administración",
      url: "/admin",
      icon: Settings,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <img 
                  src="/lovable-uploads/9b1feb5f-186d-4fd2-b028-f228d9909afd.png" 
                  alt="Aerocam Logo" 
                  className="size-8"
                />
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold text-white">Aerocam App</span>
                  <span className="truncate text-xs text-ocean-300">Bitácoras de Buceo</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userProfile?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => navigate(item.url)}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* User Menu */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.username} />
                        <AvatarFallback className="rounded-lg bg-gradient-to-r from-[#6555FF] to-purple-700 text-white">
                          {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-white">
                          {userProfile?.username || 'Usuario'}
                        </span>
                        <span className="truncate text-xs text-ocean-300">
                          {user?.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-slate-900 border-slate-700"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.username} />
                          <AvatarFallback className="rounded-lg bg-gradient-to-r from-[#6555FF] to-purple-700 text-white">
                            {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold text-white">
                            {userProfile?.username || 'Usuario'}
                          </span>
                          <span className="truncate text-xs text-ocean-300">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-ocean-300 hover:text-white focus:text-white cursor-pointer"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
