
import { toast } from '@/hooks/use-toast';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export const handleApiError = (error: any, fallbackMessage = 'An error occurred'): AppError => {
  console.error('API Error:', error);

  let errorMessage = fallbackMessage;
  let errorCode = 'UNKNOWN_ERROR';

  if (error?.response) {
    // HTTP error response
    errorMessage = error.response.data?.message || error.response.statusText || fallbackMessage;
    errorCode = `HTTP_${error.response.status}`;
  } else if (error?.message) {
    // JavaScript error
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return {
    message: errorMessage,
    code: errorCode,
    details: error
  };
};

export const showErrorToast = (error: AppError | string) => {
  const message = typeof error === 'string' ? error : error.message;
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

export const showSuccessToast = (message: string, description?: string) => {
  toast({
    title: message,
    description,
  });
};
