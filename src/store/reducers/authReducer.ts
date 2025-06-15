import { decodeJWT, isTokenExpired } from '../../utils/jwt';
import { handleApiError, AppError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

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

// Helper function to validate token and extract user info
const validateToken = (token: string) => {
  if (!token) return null;
  
  const payload = decodeJWT(token);
  if (!payload || isTokenExpired(token)) {
    return null;
  }
  
  return payload;
};

const authReducer = (state = initialState, action: any): AuthState => {
  logger.debug('Auth Reducer: Processing action', { type: action.type, payload: action.payload });
  
  switch (action.type) {
    case 'REQUEST_LOGIN':
    case 'REQUEST_SIGNUP':
      logger.info(`Auth: ${action.type} request initiated`);
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SUCCESS_LOGIN':
    case 'SUCCESS_SIGNUP':
      const { token, user } = action.payload;
      logger.info(`Auth: ${action.type} successful`, { hasToken: !!token, userId: user?.id });
      
      // Validate token and extract user info
      const validatedUser = token ? validateToken(token) : null;
      
      if (validatedUser) {
        logger.debug('Auth: Token validation successful', { userId: validatedUser.id, role: validatedUser.role });
      } else if (token) {
        logger.warn('Auth: Token validation failed');
      }
      
      // Use either validated user from token or provided user
      const finalUser = validatedUser ? {
        id: validatedUser.id,
        email: validatedUser.email,
        name: validatedUser.name,
        role: validatedUser.role,
        organizationId: validatedUser.organizationId || undefined
      } : user;
      
      const isAuthenticated = !!(token && (validatedUser || user));
      
      if (token && isAuthenticated) {
        sessionStorage.setItem('userToken', token);
        logger.info('Auth: Token stored in session storage');
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
      logger.error(`Auth: ${action.type} failed`, action.payload.error);
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
      logger.info('Auth: Logout successful');
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
      
      if (tokenPayload) {
        logger.info('Auth: Check auth successful', { userId: tokenPayload.id });
      } else {
        logger.warn('Auth: Check auth failed - invalid token');
        sessionStorage.removeItem('userToken');
      }
      
      return {
        ...state,
        user: tokenPayload ? {
          id: tokenPayload.id,
          email: tokenPayload.email,
          name: tokenPayload.name,
          role: tokenPayload.role,
          organizationId: tokenPayload.organizationId || undefined
        } : null,
        token: tokenPayload ? storedToken : null,
        isAuthenticated: !!tokenPayload,
        initialized: true,
      };

    case 'SET_AUTH_INITIALIZED':
      logger.debug('Auth: Initialization flag set');
      return {
        ...state,
        initialized: true,
      };

    default:
      return state;
  }
};

export default authReducer;
