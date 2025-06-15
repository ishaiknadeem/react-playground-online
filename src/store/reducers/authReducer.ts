
import { validateToken } from '../../utils/jwt';
import { handleApiError, AppError } from '../../utils/errorHandler';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AppError | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

const authReducer = (state = initialState, action: any): AuthState => {
  console.log('Auth Reducer: Processing action:', action.type);
  
  switch (action.type) {
    case 'REQUEST_LOGIN':
    case 'REQUEST_SIGNUP':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SUCCESS_LOGIN':
    case 'SUCCESS_SIGNUP':
      const { token, user } = action.payload;
      console.log('Auth Reducer: Login/Signup success with token:', !!token, 'and user:', user);
      
      // Validate token and extract user info
      const validatedUser = token ? validateToken(token) : null;
      console.log('Auth Reducer: Validated user from token:', validatedUser);
      
      // Use either validated user from token or provided user
      const finalUser = validatedUser ? {
        id: validatedUser.sub,
        email: validatedUser.email,
        name: validatedUser.name,
        role: validatedUser.role,
        organizationId: validatedUser.organizationId
      } : user;
      
      const isAuthenticated = !!(token && (validatedUser || user));
      console.log('Auth Reducer: Final authentication state:', { isAuthenticated, finalUser });
      
      if (token && isAuthenticated) {
        sessionStorage.setItem('userToken', token);
      }
      
      return {
        ...state,
        user: finalUser,
        token,
        isAuthenticated,
        loading: false,
        error: null,
        initialized: true,
      };

    case 'ERROR_LOGIN':
    case 'ERROR_SIGNUP':
      console.log('Auth Reducer: Login/Signup error:', action.payload);
      const authError = handleApiError(action.payload.error, 'Authentication failed');
      return {
        ...state,
        loading: false,
        error: authError,
        isAuthenticated: false,
        user: null,
        token: null,
        initialized: true,
      };

    case 'SUCCESS_LOGOUT':
      console.log('Auth Reducer: Logout success');
      sessionStorage.removeItem('userToken');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case 'SUCCESS_CHECK_AUTH':
      const storedToken = action.payload.token;
      const tokenPayload = validateToken(storedToken);
      console.log('Auth Reducer: Check auth result - user valid:', !!tokenPayload);
      
      if (!tokenPayload) {
        sessionStorage.removeItem('userToken');
      }
      
      return {
        ...state,
        user: tokenPayload ? {
          id: tokenPayload.sub,
          email: tokenPayload.email,
          name: tokenPayload.name,
          role: tokenPayload.role,
          organizationId: tokenPayload.organizationId
        } : null,
        token: tokenPayload ? storedToken : null,
        isAuthenticated: !!tokenPayload,
        initialized: true,
      };

    case 'SET_AUTH_INITIALIZED':
      return {
        ...state,
        initialized: true,
      };

    default:
      return state;
  }
};

export default authReducer;
