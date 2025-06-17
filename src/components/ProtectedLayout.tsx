
import React from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-900">
        <AppSidebar />
        <SidebarInset className="flex-1 min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-900">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
