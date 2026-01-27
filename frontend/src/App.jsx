import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Sparkles, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import authService from '@/services/auth.service';

// Pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Dashboard from '@/pages/Dashboard';
import UserDashboard from '@/pages/UserDashboard'; // Added from File 2
import CreateMealPlan from '@/pages/CreateMealPlan';
import MealPlanView from '@/pages/MealPlanView';
import History from '@/pages/History';
import Clients from '@/pages/Clients';
import Settings from '@/pages/Settings';
import ForgotPassword from '@/pages/ForgotPassword';
import Sidebar from '@/pages/Sidebar';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.getUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsMobileSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Layout wrapper for protected routes to handle Sidebar and Mobile Header logic
  const ProtectedLayout = ({ children, requiredRole }) => {
    // If a specific role is required (like 'coach') and user is a 'user', block access
    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-8 text-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-slate-600 dark:text-slate-300">You don't have permission to access this page.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/dashboard'}>Back to Dashboard</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar 
          user={user} 
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Mobile Header Integrated from File 2 */}
          <header className="lg:hidden h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="text-slate-600 dark:text-slate-300 -ml-2"
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Nutritionist</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-red-600">
              <LogOut className="w-5 h-5" />
            </Button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-8 lg:ml-64">
            {children}
          </main>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="ai-nutritionist-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ProtectedLayout>
                  {user?.role === 'user' ? <UserDashboard /> : <Dashboard />}
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/create-plan" element={
              <ProtectedRoute>
                <ProtectedLayout requiredRole="coach">
                  <CreateMealPlan />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/meal-plan/:id" element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <MealPlanView />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <History />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/clients" element={
              <ProtectedRoute>
                <ProtectedLayout requiredRole="coach">
                  <Clients />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;