
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteErrorBoundary from './components/common/RouteErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuthInit } from './hooks/useAuthInit';

// Page imports
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import ExaminersPage from './pages/dashboard/ExaminersPage';
import AllExamsPage from './pages/dashboard/AllExamsPage';
import MyExamsPage from './pages/dashboard/MyExamsPage';
import CandidatesPage from './pages/dashboard/CandidatesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import Practice from './pages/Practice';
import PracticeProblem from './pages/PracticeProblem';
import CandidateLogin from './pages/CandidateLogin';
import CandidateSettings from './pages/CandidateSettings';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import About from './pages/About';
import Contact from './pages/Contact';

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
          <Route path="/" element={
            <RouteErrorBoundary routeName="Home">
              <Index />
            </RouteErrorBoundary>
          } />
          <Route path="/login" element={
            <RouteErrorBoundary routeName="Login">
              <Login />
            </RouteErrorBoundary>
          } />
          <Route path="/register" element={
            <RouteErrorBoundary routeName="Register">
              <Signup />
            </RouteErrorBoundary>
          } />
          <Route path="/candidate-login" element={
            <RouteErrorBoundary routeName="Candidate Login">
              <CandidateLogin />
            </RouteErrorBoundary>
          } />
          <Route path="/unauthorized" element={
            <RouteErrorBoundary routeName="Unauthorized">
              <Unauthorized />
            </RouteErrorBoundary>
          } />
          
          {/* Public information pages */}
          <Route path="/privacy-policy" element={
            <RouteErrorBoundary routeName="Privacy Policy">
              <PrivacyPolicy />
            </RouteErrorBoundary>
          } />
          <Route path="/terms-of-service" element={
            <RouteErrorBoundary routeName="Terms of Service">
              <TermsOfService />
            </RouteErrorBoundary>
          } />
          <Route path="/cookie-policy" element={
            <RouteErrorBoundary routeName="Cookie Policy">
              <CookiePolicy />
            </RouteErrorBoundary>
          } />
          <Route path="/about" element={
            <RouteErrorBoundary routeName="About">
              <About />
            </RouteErrorBoundary>
          } />
          <Route path="/contact" element={
            <RouteErrorBoundary routeName="Contact">
              <Contact />
            </RouteErrorBoundary>
          } />
          
          {/* Public exam route - no authentication required */}
          <Route path="/exam" element={
            <RouteErrorBoundary routeName="Exam">
              <Exam />
            </RouteErrorBoundary>
          } />
          
          {/* Admin/Examiner protected routes */}
          <Route path="/dashboard" element={
            <RouteErrorBoundary routeName="Dashboard">
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <Dashboard />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          
          {/* Admin only routes */}
          <Route path="/dashboard/examiners" element={
            <RouteErrorBoundary routeName="Examiners Management">
              <ProtectedRoute allowedRoles={['admin']}>
                <ExaminersPage />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          <Route path="/dashboard/exams" element={
            <RouteErrorBoundary routeName="All Exams">
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <AllExamsPage />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          <Route path="/dashboard/my-exams" element={
            <RouteErrorBoundary routeName="My Exams">
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <MyExamsPage />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          <Route path="/dashboard/candidates" element={
            <RouteErrorBoundary routeName="Candidates Management">
              <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                <CandidatesPage />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          <Route path="/dashboard/settings" element={
            <RouteErrorBoundary routeName="Settings">
              <ProtectedRoute allowedRoles={['admin']}>
                <SettingsPage />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          
          {/* Authenticated user routes (all roles) */}
          <Route path="/practice" element={
            <RouteErrorBoundary routeName="Practice">
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          <Route path="/practice/problem" element={
            <RouteErrorBoundary routeName="Practice Problem">
              <ProtectedRoute>
                <PracticeProblem />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          <Route path="/candidate-settings" element={
            <RouteErrorBoundary routeName="Candidate Settings">
              <ProtectedRoute>
                <CandidateSettings />
              </ProtectedRoute>
            </RouteErrorBoundary>
          } />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={
            <RouteErrorBoundary routeName="404 Not Found">
              <NotFound />
            </RouteErrorBoundary>
          } />
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
