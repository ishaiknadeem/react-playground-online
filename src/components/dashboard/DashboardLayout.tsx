
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuthStore } from '@/store/authStore';
import NotificationPanel from './NotificationPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuthStore();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-hidden">
          {/* Top Header */}
          <header className="sticky top-0 z-10 bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
              <div className="flex items-center space-x-4 min-w-0">
                <SidebarTrigger />
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  Welcome back, {user?.name}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4 flex-shrink-0">
                <NotificationPanel />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto max-w-full">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
