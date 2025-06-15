
export type UserRole = 'admin' | 'examiner' | 'candidate';

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
  description: string;
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Public routes (no authentication required)
  { path: '/', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Home page' },
  { path: '/login', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Login page' },
  { path: '/register', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Registration page' },
  { path: '/candidate-login', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Candidate login' },
  
  // Admin only routes
  { path: '/dashboard/examiners', allowedRoles: ['admin'], description: 'Manage examiners' },
  { path: '/dashboard/settings', allowedRoles: ['admin'], description: 'System settings' },
  
  // Admin and Examiner routes
  { path: '/dashboard', allowedRoles: ['admin', 'examiner'], description: 'Main dashboard' },
  { path: '/dashboard/exams', allowedRoles: ['admin', 'examiner'], description: 'All exams view' },
  { path: '/dashboard/my-exams', allowedRoles: ['admin', 'examiner'], description: 'My exams' },
  { path: '/dashboard/candidates', allowedRoles: ['admin', 'examiner'], description: 'Manage candidates' },
  
  // All authenticated users
  { path: '/exam', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Take exam' },
  { path: '/practice', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Practice mode' },
  { path: '/practice/problem', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'Practice problem' },
  { path: '/candidate-settings', allowedRoles: ['admin', 'examiner', 'candidate'], description: 'User settings' },
];

export const checkRouteAccess = (path: string, userRole: UserRole): boolean => {
  const permission = ROUTE_PERMISSIONS.find(p => p.path === path);
  if (!permission) {
    // If route not defined, default to requiring admin access
    console.warn(`Route ${path} not found in permissions, defaulting to admin only`);
    return userRole === 'admin';
  }
  return permission.allowedRoles.includes(userRole);
};

export const getAccessibleRoutes = (userRole: UserRole): RoutePermission[] => {
  return ROUTE_PERMISSIONS.filter(permission => 
    permission.allowedRoles.includes(userRole)
  );
};

export const canUserAccess = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};
