
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import LandingPage from "@/pages/LandingPage";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NewDiveLog from "@/pages/NewDiveLog";
import EditDiveLog from "@/pages/EditDiveLog";
import DiveLogDetail from "@/pages/DiveLogDetail";
import AllDiveLogs from "@/pages/AllDiveLogs";
import Admin from "@/pages/Admin";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

// Protected Components
import ProtectedLayout from "@/components/ProtectedLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with sidebar */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <ProtectedLayout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/new-dive-log" element={<NewDiveLog />} />
                        <Route path="/dive-logs/:id/edit" element={<EditDiveLog />} />
                        <Route path="/dive-logs/:id" element={<DiveLogDetail />} />
                        <Route path="/all-dive-logs" element={<AllDiveLogs />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ProtectedLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
