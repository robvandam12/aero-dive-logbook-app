
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProtectedLayout from "@/components/ProtectedLayout";
import NavigationLoader from "@/components/NavigationLoader";
import { Suspense, lazy } from "react";

// Lazy load pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AllDiveLogs = lazy(() => import("@/pages/AllDiveLogs"));
const NewDiveLog = lazy(() => import("@/pages/NewDiveLog"));
const EditDiveLog = lazy(() => import("@/pages/EditDiveLog"));
const DiveLogDetail = lazy(() => import("@/pages/DiveLogDetail"));
const SignDiveLog = lazy(() => import("@/pages/SignDiveLog"));
const Admin = lazy(() => import("@/pages/Admin"));
const Reports = lazy(() => import("@/pages/Reports"));
const UserSettings = lazy(() => import("@/pages/UserSettings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

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
              <Route path="/" element={
                <Suspense fallback={<NavigationLoader />}>
                  <LandingPage />
                </Suspense>
              } />
              <Route path="/auth" element={
                <Suspense fallback={<NavigationLoader />}>
                  <Auth />
                </Suspense>
              } />

              {/* Protected routes with layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <Dashboard />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/dive-logs" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <AllDiveLogs />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/dive-logs/:id" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <DiveLogDetail />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/dive-logs/:id/edit" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <EditDiveLog />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/dive-logs/:id/sign" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <SignDiveLog />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/new-dive-log" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <NewDiveLog />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <Admin />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <Reports />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Suspense fallback={<NavigationLoader />}>
                      <UserSettings />
                    </Suspense>
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              {/* Legacy route redirect */}
              <Route path="/index" element={<Navigate to="/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={
                <Suspense fallback={<NavigationLoader />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
