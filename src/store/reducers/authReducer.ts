
interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const validateToken = (token: string): any | null => {
  try {
    const payload = JSON.parse(atob(token));
    
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

const authReducer = (state = initialState, action: any): AuthState => {
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
      if (token) {
        sessionStorage.setItem('userToken', token);
      }
      return {
        ...state,
        user: user || validateToken(token),
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'ERROR_LOGIN':
    case 'ERROR_SIGNUP':
      return {
        ...state,
        loading: false,
        error: action.payload.error?.message || 'Authentication failed',
      };

    case 'SUCCESS_LOGOUT':
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
      const validatedUser = validateToken(storedToken);
      return {
        ...state,
        user: validatedUser,
        token: storedToken,
        isAuthenticated: !!validatedUser,
      };

    default:
      return state;
  }
};

export default authReducer;
