
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, BarChart3, Users, FileText, Settings, User, LogOut, ChevronUp } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { logoutUser } from '@/store/actions/authActions';
import { useNavigate } from 'react-router-dom';

export function AppSidebar() {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setOpenMobile } = useSidebar();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleNavigation = () => {
    // Always close mobile sidebar after navigation
    if (setOpenMobile) {
      setOpenMobile(false);
    }
  };

  const handleAccountSettings = () => {
    navigate('/dashboard/settings');
    handleNavigation();
  };

  const handleProfile = () => {
    // For now, redirect to settings. Later this could be a separate profile page
    navigate('/dashboard/settings');
    handleNavigation();
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

  const candidateNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'My Exams', href: '/dashboard/my-exams' },
    { icon: Settings, label: 'Account Settings', href: '/dashboard/settings' },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminNavItems;
      case 'examiner':
        return examinerNavItems;
      case 'candidate':
        return candidateNavItems;
      default:
        return examinerNavItems;
    }
  };

  const navItems = getNavItems();

  const getUserInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {getUserInitials(user?.name || '', user?.email || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || 'User'}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={state === 'collapsed' ? 'right' : 'top'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user?.name || '', user?.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || 'User'}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAccountSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
