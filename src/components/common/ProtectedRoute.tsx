
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
import LoadingSpinner from './LoadingSpinner';
import { canUserAccess } from '@/utils/roleAccess';
import type { UserRole } from '@/utils/roleAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, loading, initialized } = useAppSelector(state => state.auth);
  const location = useLocation();

  // Show loading while auth is being initialized
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying access..." />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user) {
    const hasAccess = canUserAccess(user.role as UserRole, allowedRoles);
    if (!hasAccess) {
      console.log(`ProtectedRoute: User role '${user.role}' not in allowed roles:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Log successful access
  console.log(`ProtectedRoute: Access granted for user role '${user?.role}' to path '${location.pathname}'`);

  return <>{children}</>;
};

export default ProtectedRoute;
