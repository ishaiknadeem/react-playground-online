
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ExaminerDashboard from '@/components/dashboard/ExaminerDashboard';

const Dashboard = () => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, checkAuth]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'admin' ? <AdminDashboard /> : <ExaminerDashboard />}
    </div>
  );
};

export default Dashboard;
