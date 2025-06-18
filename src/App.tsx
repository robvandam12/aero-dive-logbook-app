
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import AllDiveLogsPage from "@/pages/AllDiveLogs";
import NewDiveLog from "@/pages/NewDiveLog";
import DiveLogDetail from "@/pages/DiveLogDetail";
import Reports from "@/pages/Reports";
import UserSettings from "@/pages/UserSettings";
import Admin from "@/pages/Admin";

import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import NavigationLoader from "@/components/NavigationLoader";
import { LoadingProvider } from "@/contexts/LoadingProvider";
import ProtectedLayout from "@/components/ProtectedLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AuthProvider>
          <LoadingProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900">
              <Routes>
                {/* Redirect root to dashboard */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } />
                <Route path="/landing" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <UserSettings />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dive-logs" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <AllDiveLogsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/new-dive-log" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <NewDiveLog />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dive-logs/:id" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <DiveLogDetail />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Reports />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Admin />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </LoadingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <NavigationLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default App;
