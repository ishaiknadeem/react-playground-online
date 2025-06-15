
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { checkAuth } from "@/store/actions/authActions";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Exams from "./pages/Exams";
import Exam from "./pages/Exam";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CandidateLogin from "./pages/CandidateLogin";
import CandidateSignup from "./pages/CandidateSignup";
import Practice from "./pages/Practice";
import PracticeProblem from "./pages/PracticeProblem";
import InterviewSession from "./pages/InterviewSession";
import Dashboard from "./pages/Dashboard";
import ExaminersPage from "./pages/dashboard/ExaminersPage";
import CandidatesPage from "./pages/dashboard/CandidatesPage";
import AllExamsPage from "./pages/dashboard/AllExamsPage";
import MyExamsPage from "./pages/dashboard/MyExamsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/candidate-login" element={<CandidateLogin />} />
            <Route path="/candidate-signup" element={<CandidateSignup />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/problem" element={<PracticeProblem />} />
            <Route path="/practice/interview-session" element={<InterviewSession />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/examiners" element={<ExaminersPage />} />
            <Route path="/dashboard/candidates" element={<CandidatesPage />} />
            <Route path="/dashboard/exams" element={<AllExamsPage />} />
            <Route path="/dashboard/my-exams" element={<MyExamsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
