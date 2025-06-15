
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from './components/common/ErrorBoundary';
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

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/examiners" element={<ExaminersPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/practice/problem" element={<PracticeProblem />} />
                <Route path="/candidate-login" element={<CandidateLogin />} />
                <Route path="/candidate-settings" element={<CandidateSettings />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                {/* Catch all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
