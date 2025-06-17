
import React from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 p-0">
          <div className="w-full h-full">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
