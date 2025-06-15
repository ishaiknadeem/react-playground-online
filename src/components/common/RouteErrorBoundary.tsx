
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `ROUTE_ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Route Error in ${this.props.routeName || 'Unknown Route'}:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Page Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  We're aware of this issue and working to fix it. The page crashed unexpectedly.
                </p>
                {this.props.routeName && (
                  <p className="text-sm text-gray-500">
                    Error on: {this.props.routeName}
                  </p>
                )}
              </div>

              {this.state.errorId && (
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <p className="text-gray-600">Error ID: <code className="bg-white px-1 rounded">{this.state.errorId}</code></p>
                </div>
              )}

              <div className="flex gap-2 justify-center flex-wrap">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Link to="/dashboard">
                  <Button className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 p-3 rounded text-sm mt-4">
                  <summary className="cursor-pointer font-medium">Error Details (Dev Mode)</summary>
                  <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
