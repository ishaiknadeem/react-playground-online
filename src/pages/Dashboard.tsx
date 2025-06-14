
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ExaminerDashboard } from '@/components/dashboard/ExaminerDashboard';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dashboard Stats */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {user?.role === 'admin' ? <AdminDashboard /> : <ExaminerDashboard />}
          </div>
          
          {/* Sidebar with Quick Actions and Recent Activity */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
