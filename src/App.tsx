import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { Toaster } from '@/components/ui/toaster';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamPage from './pages/ExamPage';
import ExaminersPage from './pages/dashboard/ExaminersPage';
import ExamsPage from './pages/dashboard/ExamsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import Practice from './pages/Practice';
import PracticeProblem from './pages/PracticeProblem';
import CandidateLogin from './pages/CandidateLogin';
import CandidateRegister from './pages/CandidateRegister';
import CandidateSettings from './pages/CandidateSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/examiners" element={<ExaminersPage />} />
          <Route path="/dashboard/exams" element={<ExamsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/problem" element={<PracticeProblem />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/candidate-register" element={<CandidateRegister />} />
          
          {/* Add the candidate settings route */}
          <Route path="/candidate-settings" element={<CandidateSettings />} />
          
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
