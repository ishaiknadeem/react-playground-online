
// Authentication API service with real endpoints and dummy data fallback
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'examiner' | 'candidate';
  organizationName?: string;
  department?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'examiner' | 'candidate';
    organizationId?: string;
  };
  error?: string;
}

// Base API URL for authentication
const AUTH_API_BASE_URL = 'https://api.examplatform.com/v1/auth';

// Generic API request helper for auth
const authApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  console.log(`Auth API: Making request to ${AUTH_API_BASE_URL}${endpoint}`);
  
  const response = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Auth API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Mock successful responses for fallback
const createMockAuthResponse = (email: string, name: string, role: 'admin' | 'examiner' | 'candidate'): AuthResponse => {
  const user = {
    id: Date.now().toString(),
    name,
    email,
    role,
    organizationId: role !== 'candidate' ? 'org_' + Date.now() : undefined
  };

  const token = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));

  return {
    success: true,
    token,
    user
  };
};

export const authApi = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    console.log('Auth API: Attempting signup:', { ...data, password: '[REDACTED]' });
    
    try {
      const response = await authApiRequest('/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      console.log('Auth API: Signup successful:', response);
      return response;
    } catch (error) {
      console.error('Auth API: Signup failed, using fallback:', error);
      
      // Simulate some validation
      if (data.email === 'test@error.com') {
        return {
          success: false,
          error: 'Email already exists'
        };
      }
      
      if (data.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }
      
      // Return mock success response
      const role = data.role || 'candidate';
      return createMockAuthResponse(data.email, data.name, role);
    }
  },

  login: async (data: LoginRequest, userType: 'admin' | 'candidate'): Promise<AuthResponse> => {
    console.log('Auth API: Attempting login:', { email: data.email, userType });
    
    try {
      const response = await authApiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ ...data, userType }),
      });
      
      console.log('Auth API: Login successful:', response);
      return response;
    } catch (error) {
      console.error('Auth API: Login failed, using fallback:', error);
      
      // Mock validation with dummy credentials
      const mockCredentials = {
        candidate: [
          { email: 'john@example.com', password: 'candidate123', name: 'John Doe', role: 'candidate' as const },
          { email: 'jane@example.com', password: 'candidate123', name: 'Jane Smith', role: 'candidate' as const }
        ],
        admin: [
          { email: 'admin@company.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
          { email: 'hr@company.com', password: 'hr123', name: 'HR Manager', role: 'examiner' as const }
        ]
      };

      const credentials = mockCredentials[userType];
      const foundUser = credentials.find(u => u.email === data.email && u.password === data.password);
      
      if (!foundUser) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      return createMockAuthResponse(foundUser.email, foundUser.name, foundUser.role);
    }
  }
};
