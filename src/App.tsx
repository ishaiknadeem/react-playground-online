import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuthInit } from './hooks/useAuthInit';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import ExaminersPage from './pages/dashboard/ExaminersPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import Practice from './pages/Practice';
import PracticeProblem from './pages/PracticeProblem';
import CandidateLogin from './pages/CandidateLogin';
import CandidateSettings from './pages/CandidateSettings';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { initialized } = useAuthInit();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing application..." />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Admin/Examiner protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'examiner']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin only routes */}
          <Route path="/dashboard/examiners" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ExaminersPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Authenticated user routes (all roles) */}
          <Route path="/exam" element={
            <ProtectedRoute>
              <Exam />
            </ProtectedRoute>
          } />
          <Route path="/practice" element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          } />
          <Route path="/practice/problem" element={
            <ProtectedRoute>
              <PracticeProblem />
            </ProtectedRoute>
          } />
          <Route path="/candidate-settings" element={
            <ProtectedRoute>
              <CandidateSettings />
            </ProtectedRoute>
          } />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
