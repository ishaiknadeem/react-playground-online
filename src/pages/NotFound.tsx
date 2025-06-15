
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, LogIn, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const getRedirectPath = () => {
    if (isAuthenticated) {
      // If user has admin/examiner role, redirect to dashboard
      if (user?.role === 'admin' || user?.role === 'examiner') {
        return '/dashboard';
      }
      // For candidates or other authenticated users, redirect to practice
      return '/practice';
    }
    // For non-authenticated users, redirect to home
    return '/';
  };

  const getRedirectText = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin' || user?.role === 'examiner') {
        return 'Go to Dashboard';
      }
      return 'Go to Practice';
    }
    return 'Go to Home';
  };

  const getRedirectIcon = () => {
    if (isAuthenticated) {
      return <Home className="w-4 h-4" />;
    }
    return <LogIn className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Oops! Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            How did you land here? The page you're looking for doesn't exist or may have been moved.
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, let's get you back on track!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={getRedirectPath()}>
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                {getRedirectIcon()}
                {getRedirectText()}
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
