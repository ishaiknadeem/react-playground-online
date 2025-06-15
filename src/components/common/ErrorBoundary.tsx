
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In a real app, you'd send this to your error reporting service
    console.error('Error ID:', this.state.errorId);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReportError = () => {
    // In a real app, this would open a support ticket or email
    const subject = `Error Report - ${this.state.errorId}`;
    const body = `Error ID: ${this.state.errorId}\nError: ${this.state.error?.message}\nURL: ${window.location.href}`;
    window.open(`mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  We're aware of this issue and our team is working hard to fix it.
                </p>
                <p className="text-sm text-gray-500">
                  This error has been automatically reported to our development team.
                </p>
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
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
                <Button 
                  onClick={this.handleReportError}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Report Issue
                </Button>
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

export default ErrorBoundary;
