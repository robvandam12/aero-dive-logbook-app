import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import { Auth } from "@/pages/Auth";
import { Index } from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import AllDiveLogsPage from "@/pages/AllDiveLogs";
import NewDiveLog from "@/pages/NewDiveLog";
import DiveLogDetails from "@/pages/DiveLogDetails";
import Reports from "@/pages/Reports";
import UserSettings from "@/pages/UserSettings";
import Admin from "@/pages/Admin";

import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import { Loading } from "@/components/Loading";
import { QueryClient } from "@/contexts/QueryProvider";
import NavigationLoader from "@/components/NavigationLoader";
import { LoadingProvider } from "@/contexts/LoadingProvider";

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <Toaster />
        <AuthProvider>
          <LoadingProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900">
              <Routes>
                <Route path="/" element={<Index />} />
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
                      <DiveLogDetails />
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
      </QueryClient>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <NavigationLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen antialiased text-foreground">
      {children}
    </div>
  );
}

export default App;
