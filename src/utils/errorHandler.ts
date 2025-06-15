
import { toast } from '@/hooks/use-toast';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
  statusCode?: number;
}

export const handleApiError = (error: any, fallbackMessage = 'An error occurred'): AppError => {
  console.error('API Error:', error);

  let errorMessage = fallbackMessage;
  let errorCode = 'UNKNOWN_ERROR';
  let statusCode = 500;

  if (error?.response) {
    // HTTP error response
    statusCode = error.response.status;
    errorCode = `HTTP_${error.response.status}`;
    
    // Handle specific HTTP status codes
    switch (statusCode) {
      case 401:
        errorMessage = 'Authentication required. Please log in again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = error.response.data?.message || error.response.statusText || fallbackMessage;
    }
  } else if (error?.message) {
    // JavaScript error
    errorMessage = error.message;
    if (error.name) {
      errorCode = error.name;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return {
    message: errorMessage,
    code: errorCode,
    statusCode,
    details: error
  };
};

export const showErrorToast = (error: AppError | string, duration = 5000) => {
  const message = typeof error === 'string' ? error : error.message;
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
    duration,
  });
};

export const showSuccessToast = (message: string, description?: string, duration = 3000) => {
  toast({
    title: message,
    description,
    duration,
  });
};

export const showWarningToast = (message: string, description?: string, duration = 4000) => {
  toast({
    title: message,
    description,
    variant: "default",
    duration,
  });
};

// Network error handling
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

// Retry logic for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain HTTP errors
      if (error?.response?.status && [400, 401, 403, 404].includes(error.response.status)) {
        throw error;
      }
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};
