
import React, { Suspense } from 'react';
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

// Lazy load all page components
const Index = React.lazy(() => import('./pages/Index'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Exam = React.lazy(() => import('./pages/Exam'));
const ExaminersPage = React.lazy(() => import('./pages/dashboard/ExaminersPage'));
const AllExamsPage = React.lazy(() => import('./pages/dashboard/AllExamsPage'));
const MyExamsPage = React.lazy(() => import('./pages/dashboard/MyExamsPage'));
const CandidatesPage = React.lazy(() => import('./pages/dashboard/CandidatesPage'));
const SettingsPage = React.lazy(() => import('./pages/dashboard/SettingsPage'));
const Practice = React.lazy(() => import('./pages/Practice'));
const PracticeProblem = React.lazy(() => import('./pages/PracticeProblem'));
const CandidateLogin = React.lazy(() => import('./pages/CandidateLogin'));
const CandidateSettings = React.lazy(() => import('./pages/CandidateSettings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Route loading fallback component
const RouteLoadingFallback = ({ routeName }: { routeName: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text={`Loading ${routeName}...`} />
  </div>
);

const AppContent = () => {
  const { initialized } = useAuthInit();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing application..." />
      </div>
    );
  }

  console.log('App initialized, setting up routes...');

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<RouteLoadingFallback routeName="Application" />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <RouteErrorBoundary routeName="Home">
                <Suspense fallback={<RouteLoadingFallback routeName="Home" />}>
                  <Index />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/login" element={
              <RouteErrorBoundary routeName="Login">
                <Suspense fallback={<RouteLoadingFallback routeName="Login" />}>
                  <Login />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/register" element={
              <RouteErrorBoundary routeName="Register">
                <Suspense fallback={<RouteLoadingFallback routeName="Register" />}>
                  <Signup />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/candidate-login" element={
              <RouteErrorBoundary routeName="Candidate Login">
                <Suspense fallback={<RouteLoadingFallback routeName="Candidate Login" />}>
                  <CandidateLogin />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/unauthorized" element={
              <RouteErrorBoundary routeName="Unauthorized">
                <Suspense fallback={<RouteLoadingFallback routeName="Unauthorized" />}>
                  <Unauthorized />
                </Suspense>
              </RouteErrorBoundary>
            } />
            
            {/* Public information pages */}
            <Route path="/privacy-policy" element={
              <RouteErrorBoundary routeName="Privacy Policy">
                <Suspense fallback={<RouteLoadingFallback routeName="Privacy Policy" />}>
                  <PrivacyPolicy />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/terms-of-service" element={
              <RouteErrorBoundary routeName="Terms of Service">
                <Suspense fallback={<RouteLoadingFallback routeName="Terms of Service" />}>
                  <TermsOfService />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/cookie-policy" element={
              <RouteErrorBoundary routeName="Cookie Policy">
                <Suspense fallback={<RouteLoadingFallback routeName="Cookie Policy" />}>
                  <CookiePolicy />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/about" element={
              <RouteErrorBoundary routeName="About">
                <Suspense fallback={<RouteLoadingFallback routeName="About" />}>
                  <About />
                </Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="/contact" element={
              <RouteErrorBoundary routeName="Contact">
                <Suspense fallback={<RouteLoadingFallback routeName="Contact" />}>
                  <Contact />
                </Suspense>
              </RouteErrorBoundary>
            } />
            
            {/* Public exam route - no authentication required - MOVED UP FOR PRIORITY */}
            <Route path="/exam" element={
              <RouteErrorBoundary routeName="Exam">
                <Suspense fallback={<RouteLoadingFallback routeName="Exam" />}>
                  {(() => {
                    console.log('Exam route matched! Rendering Exam component...');
                    return <Exam />;
                  })()}
                </Suspense>
              </RouteErrorBoundary>
            } />
            
            {/* Admin/Examiner protected routes */}
            <Route path="/dashboard" element={
              <RouteErrorBoundary routeName="Dashboard">
                <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                  <Suspense fallback={<RouteLoadingFallback routeName="Dashboard" />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            
            {/* Admin only routes */}
            <Route path="/dashboard/examiners" element={
              <RouteErrorBoundary routeName="Examiners Management">
                <ProtectedRoute allowedRoles={['admin']}>
                  <Suspense fallback={<RouteLoadingFallback routeName="Examiners Management" />}>
                    <ExaminersPage />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            <Route path="/dashboard/exams" element={
              <RouteErrorBoundary routeName="All Exams">
                <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                  <Suspense fallback={<RouteLoadingFallback routeName="All Exams" />}>
                    <AllExamsPage />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            <Route path="/dashboard/my-exams" element={
              <RouteErrorBoundary routeName="My Exams">
                <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                  <Suspense fallback={<RouteLoadingFallback routeName="My Exams" />}>
                    <MyExamsPage />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            <Route path="/dashboard/candidates" element={
              <RouteErrorBoundary routeName="Candidates Management">
                <ProtectedRoute allowedRoles={['admin', 'examiner']}>
                  <Suspense fallback={<RouteLoadingFallback routeName="Candidates Management" />}>
                    <CandidatesPage />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            <Route path="/dashboard/settings" element={
              <RouteErrorBoundary routeName="Settings">
                <ProtectedRoute allowedRoles={['admin']}>
                  <Suspense fallback={<RouteLoadingFallback routeName="Settings" />}>
                    <SettingsPage />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            
            {/* Authenticated user routes (all roles) */}
            <Route path="/practice" element={
              <RouteErrorBoundary routeName="Practice">
                <ProtectedRoute>
                  <Suspense fallback={<RouteLoadingFallback routeName="Practice" />}>
                    <Practice />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            <Route path="/practice/problem" element={
              <RouteErrorBoundary routeName="Practice Problem">
                <ProtectedRoute>
                  <Suspense fallback={<RouteLoadingFallback routeName="Practice Problem" />}>
                    <PracticeProblem />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            <Route path="/candidate-settings" element={
              <RouteErrorBoundary routeName="Candidate Settings">
                <ProtectedRoute>
                  <Suspense fallback={<RouteLoadingFallback routeName="Candidate Settings" />}>
                    <CandidateSettings />
                  </Suspense>
                </ProtectedRoute>
              </RouteErrorBoundary>
            } />
            
            {/* Catch all route for 404 */}
            <Route path="*" element={
              <RouteErrorBoundary routeName="404 Not Found">
                <Suspense fallback={<RouteLoadingFallback routeName="404 Page" />}>
                  <NotFound />
                </Suspense>
              </RouteErrorBoundary>
            } />
          </Routes>
        </Suspense>
        <Toaster />
      </div>
    </Router>
  );
};

function App() {
  console.log('App component rendering...');
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
