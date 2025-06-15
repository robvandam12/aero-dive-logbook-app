
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const ProtectedLayout = () => {
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="bg-hero-gradient ocean-pattern">
                <Outlet />
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
