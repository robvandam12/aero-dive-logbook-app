
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./contexts/AuthProvider";
import { LoadingProvider } from "./contexts/LoadingProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { NavigationLoader } from "./components/NavigationLoader";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewDiveLog from "./pages/NewDiveLog";
import EditDiveLog from "./pages/EditDiveLog";
import DiveLogDetail from "./pages/DiveLogDetail";
import AllDiveLogs from "./pages/AllDiveLogs";
import SignDiveLog from "./pages/SignDiveLog";
import Admin from "./pages/Admin";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserSettings from "./pages/UserSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LoadingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavigationLoader />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/sign/:token" element={<SignDiveLog />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <ProtectedLayout>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/dive-logs/new" element={<NewDiveLog />} />
                          <Route path="/dive-logs/:id/edit" element={<EditDiveLog />} />
                          <Route path="/dive-logs/:id" element={<DiveLogDetail />} />
                          <Route path="/dive-logs" element={<AllDiveLogs />} />
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/user-settings" element={<UserSettings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </ProtectedLayout>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LoadingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
