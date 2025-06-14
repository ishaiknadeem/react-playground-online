
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, BarChart3, Users, FileText, Settings, User, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setOpenMobile } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = () => {
    // Always close mobile sidebar after navigation
    if (setOpenMobile) {
      setOpenMobile(false);
    }
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
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center space-x-3 px-3 py-2" onClick={handleNavigation}>
          <Code className="w-8 h-8 text-blue-600 flex-shrink-0" />
          {state === 'expanded' && (
            <div className="overflow-hidden">
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">CodeExam</span>
              <div className="text-xs text-gray-500 capitalize whitespace-nowrap">{user?.role} Panel</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                    tooltip={state === 'collapsed' ? item.label : undefined}
                  >
                    <Link 
                      to={item.href} 
                      className="flex items-center space-x-3" 
                      onClick={handleNavigation}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
              <User className="w-4 h-4 flex-shrink-0" />
              {state === 'expanded' && (
                <span className="truncate">{user?.email}</span>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              tooltip={state === 'collapsed' ? 'Logout' : undefined}
            >
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                {state === 'expanded' && <span className="ml-2">Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
