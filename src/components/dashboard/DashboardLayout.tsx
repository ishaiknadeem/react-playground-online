
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code, LogOut, User, Settings, FileText, Users, BarChart3, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Examiners', href: '/dashboard/examiners' },
    { icon: FileText, label: 'All Exams', href: '/dashboard/exams' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const examinerNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'My Exams', href: '/dashboard/my-exams' },
    { icon: Users, label: 'Candidates', href: '/dashboard/candidates' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : examinerNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center space-x-3">
            <Code className="w-8 h-8 text-blue-600" />
            <div>
              <span className="text-xl font-bold text-gray-900">CodeExam</span>
              <div className="text-xs text-gray-500 capitalize">{user?.role} Panel</div>
            </div>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, {user?.name}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
