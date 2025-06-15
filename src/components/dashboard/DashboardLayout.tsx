
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAppSelector } from '@/store/store';
import NotificationPanel from './NotificationPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAppSelector(state => state.auth);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-hidden">
          {/* Top Header - Improved mobile responsiveness */}
          <header className="sticky top-0 z-10 bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                <SidebarTrigger className="flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  <span className="hidden sm:inline">Welcome back, </span>
                  <span className="sm:hidden">Hi, </span>
                  {user?.name}
                </h2>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <NotificationPanel />
              </div>
            </div>
          </header>

          {/* Page Content - Improved padding and scrolling */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto max-w-full">
            <div className="max-w-full w-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
