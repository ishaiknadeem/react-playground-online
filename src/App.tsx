
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store';
import { Toaster } from '@/components/ui/toaster';
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

const queryClient = new QueryClient();

function App() {
  return (
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
            </Routes>
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
