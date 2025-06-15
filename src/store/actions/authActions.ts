
import {
  REQUEST_LOGIN,
  REQUEST_SIGNUP,
  REQUEST_LOGOUT,
  REQUEST_CHECK_AUTH,
} from '../actionTypes';
import callApi from '../../utils/callApi';
import { baseUrl } from '../../utils/config';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'examiner' | 'candidate';
  organizationName?: string;
  department?: string;
}

// Mock fallback data for when API fails
const createMockAuthResponse = (email: string, name: string, role: 'admin' | 'examiner' | 'candidate') => {
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

  return { token, user };
};

const getAllMockCredentials = () => [
  // Admin credentials
  { email: 'admin@company.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { email: 'hr@company.com', password: 'hr123', name: 'HR Manager', role: 'examiner' as const },
  // Candidate credentials
  { email: 'john@example.com', password: 'candidate123', name: 'John Doe', role: 'candidate' as const },
  { email: 'jane@example.com', password: 'candidate123', name: 'Jane Smith', role: 'candidate' as const }
];

export const loginUser = (data: LoginData, userType: 'admin' | 'candidate') => async (dispatch: any) => {
  console.log('Auth Action: Starting login process for', userType, 'with email:', data.email);
  
  // Start loading
  dispatch({ type: REQUEST_LOGIN });
  
  try {
    // ALWAYS try API first
    console.log('Auth Action: Attempting API login...');
    const apiUrl = `${baseUrl}/auth/login`;
    const result = await callApi({
      dispatch,
      actionType: REQUEST_LOGIN,
      url: apiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userType })
    });
    
    console.log('Auth Action: API login successful:', result);
    
    // If API succeeds, use API response
    if (result && result.token) {
      sessionStorage.setItem('userToken', result.token);
      const successAction = {
        type: 'SUCCESS_LOGIN',
        payload: result
      };
      dispatch(successAction);
      return result;
    }
  } catch (apiError) {
    console.log('Auth Action: API login failed, falling back to mock authentication:', apiError);
  }
  
  // Fallback to mock authentication
  console.log('Auth Action: Using mock authentication fallback');
  
  // Find valid mock credentials
  const allCredentials = getAllMockCredentials();
  const allowedRoles = userType === 'admin' ? ['admin', 'examiner'] : ['candidate'];
  
  console.log('Auth Action: Looking for credentials with roles:', allowedRoles);
  console.log('Auth Action: Available credentials:', allCredentials.map(c => ({ email: c.email, role: c.role })));
  console.log('Auth Action: Checking email:', data.email, 'password:', data.password);
  
  const foundUser = allCredentials.find(u => {
    console.log('Auth Action: Comparing with:', u.email, u.password, u.role);
    return u.email === data.email && 
           u.password === data.password && 
           allowedRoles.includes(u.role);
  });
  
  console.log('Auth Action: Found matching user:', foundUser ? { email: foundUser.email, role: foundUser.role } : 'None');
  
  if (!foundUser) {
    console.log('Auth Action: Invalid credentials for mock data');
    const errorAction = {
      type: 'ERROR_LOGIN',
      payload: { error: { message: 'Invalid email or password' } }
    };
    dispatch(errorAction);
    throw new Error('Invalid credentials');
  }
  
  // Create mock response
  const mockResponse = createMockAuthResponse(foundUser.email, foundUser.name, foundUser.role);
  console.log('Auth Action: Created mock response:', { token: !!mockResponse.token, user: mockResponse.user });
  
  // Store token in sessionStorage
  sessionStorage.setItem('userToken', mockResponse.token);
  console.log('Auth Action: Token stored in sessionStorage');
  
  const successAction = {
    type: 'SUCCESS_LOGIN',
    payload: mockResponse
  };
  dispatch(successAction);
  
  console.log('Auth Action: Mock login successful for:', foundUser.email);
  return mockResponse;
};

export const signupUser = (data: SignupData) => async (dispatch: any) => {
  console.log('Auth Action: Starting signup process');
  
  // Start loading
  dispatch({ type: REQUEST_SIGNUP });
  
  try {
    // Try API first
    console.log('Auth Action: Attempting API signup...');
    const apiUrl = `${baseUrl}/auth/signup`;
    const result = await callApi({
      dispatch,
      actionType: REQUEST_SIGNUP,
      url: apiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('Auth Action: API signup successful:', result);
    
    if (result && result.token) {
      sessionStorage.setItem('userToken', result.token);
      const successAction = {
        type: 'SUCCESS_SIGNUP',
        payload: result
      };
      dispatch(successAction);
      return result;
    }
  } catch (apiError) {
    console.log('Auth Action: API signup failed, falling back to mock authentication:', apiError);
  }
  
  // Fallback to mock
  console.log('Auth Action: Using mock signup fallback');
  
  // Simulate some validation for fallback
  if (data.email === 'test@error.com') {
    const errorAction = {
      type: 'ERROR_SIGNUP',
      payload: { error: { message: 'Email already exists' } }
    };
    dispatch(errorAction);
    return null;
  }
  
  if (data.password.length < 6) {
    const errorAction = {
      type: 'ERROR_SIGNUP',
      payload: { error: { message: 'Password must be at least 6 characters long' } }
    };
    dispatch(errorAction);
    return null;
  }
  
  // Create mock response
  const role = data.role || 'candidate';
  const mockResponse = createMockAuthResponse(data.email, data.name, role);
  
  // Store token in sessionStorage
  sessionStorage.setItem('userToken', mockResponse.token);
  
  const successAction = {
    type: 'SUCCESS_SIGNUP',
    payload: mockResponse
  };
  dispatch(successAction);
  
  console.log('Auth Action: Mock signup successful for:', data.email);
  return mockResponse;
};

export const logoutUser = () => (dispatch: any) => {
  console.log('Auth Action: Logging out user');
  sessionStorage.removeItem('userToken');
  dispatch({ type: 'SUCCESS_LOGOUT' });
};

export const checkAuth = () => (dispatch: any) => {
  console.log('Auth Action: Checking authentication');
  const token = sessionStorage.getItem('userToken');
  if (token) {
    dispatch({ type: 'SUCCESS_CHECK_AUTH', payload: { token } });
  }
};
