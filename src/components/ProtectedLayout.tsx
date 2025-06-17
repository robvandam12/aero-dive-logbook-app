
import React from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="bg-hero-gradient ocean-pattern">
                {children}
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
