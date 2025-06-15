
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/authApi';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'examiner' | 'candidate';
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType: 'admin' | 'candidate') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

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

      login: async (email: string, password: string, userType: 'admin' | 'candidate') => {
        try {
          const result = await authApi.login({ email, password }, userType);
          
          if (result.success && result.token && result.user) {
            set({
              user: result.user,
              token: result.token,
              isAuthenticated: true
            });
            
            return { success: true };
          } else {
            return { success: false, error: result.error || 'Login failed' };
          }
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: 'An unexpected error occurred' };
        }
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
