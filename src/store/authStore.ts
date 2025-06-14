
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'examiner';
  organizationId: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

// Dummy credentials for testing
const DUMMY_USERS = [
  {
    id: '1',
    email: 'admin@company.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    organizationId: 'org1'
  },
  {
    id: '2',
    email: 'hr@company.com',
    password: 'hr123',
    name: 'HR Manager',
    role: 'examiner' as const,
    organizationId: 'org1'
  }
];

// Mock JWT token generation
const generateMockToken = (user: Omit<User, 'id'> & { id: string }) => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // In production, this would be a real JWT
  return btoa(JSON.stringify(payload));
};

// Mock token validation
const validateToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      organizationId: payload.organizationId
    };
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // TODO: Replace with actual API call
        // const response = await authService.login(email, password);
        
        // Mock authentication
        const foundUser = DUMMY_USERS.find(
          u => u.email === email && u.password === password
        );
        
        if (!foundUser) {
          return { success: false, error: 'Invalid email or password' };
        }
        
        const user: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          organizationId: foundUser.organizationId
        };
        
        const token = generateMockToken(user);
        
        set({
          user,
          token,
          isAuthenticated: true
        });
        
        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      checkAuth: () => {
        const { token } = get();
        if (token) {
          const user = validateToken(token);
          if (user) {
            set({ user, isAuthenticated: true });
          } else {
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);
