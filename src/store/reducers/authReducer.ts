
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
    console.log('Auth Reducer: Validating token payload:', payload);
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('Auth Reducer: Token expired');
      return null;
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      organizationId: payload.organizationId
    };
  } catch (error) {
    console.error('Auth Reducer: Token validation failed:', error);
    return null;
  }
};

const authReducer = (state = initialState, action: any): AuthState => {
  console.log('Auth Reducer: Processing action:', action.type, action.payload);
  
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
      console.log('Auth Reducer: Login/Signup error:', action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload.error?.message || 'Authentication failed',
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
      const validatedUser = validateToken(storedToken);
      console.log('Auth Reducer: Check auth result - user valid:', !!validatedUser);
      
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
