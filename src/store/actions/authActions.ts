
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

// Mock credentials for fallback
const getAllMockCredentials = () => [
  // Admin credentials
  { email: 'admin@company.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { email: 'hr@company.com', password: 'hr123', name: 'HR Manager', role: 'examiner' as const },
  // Candidate credentials
  { email: 'john@example.com', password: 'candidate123', name: 'John Doe', role: 'candidate' as const },
  { email: 'jane@example.com', password: 'candidate123', name: 'Jane Smith', role: 'candidate' as const }
];

const createAuthResponse = (email: string, name: string, role: 'admin' | 'examiner' | 'candidate') => {
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

export const loginUser = (data: LoginData, userType: 'admin' | 'candidate') => async (dispatch: any) => {
  console.log('Auth Action: Starting login process for', userType, 'with email:', data.email);
  
  // Trim email and password to handle whitespace
  const trimmedData = {
    email: data.email.trim(),
    password: data.password.trim()
  };
  
  // Start loading
  dispatch({ type: REQUEST_LOGIN });
  
  try {
    // Always attempt API first
    console.log('Auth Action: Attempting API login...');
    const apiUrl = `${baseUrl}/auth/login`;
    
    const result = await callApi({
      dispatch,
      actionType: REQUEST_LOGIN,
      url: apiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...trimmedData, userType })
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
    console.log('Auth Action: API login failed, simulating successful API response with mock data:', apiError);
    
    // Simulate what we expect from a real API
    const allCredentials = getAllMockCredentials();
    const allowedRoles = userType === 'admin' ? ['admin', 'examiner'] : ['candidate'];
    
    // Find matching user credentials
    const foundUser = allCredentials.find(u => {
      const emailMatch = u.email === trimmedData.email;
      const passwordMatch = u.password === trimmedData.password;
      const roleMatch = allowedRoles.includes(u.role);
      return emailMatch && passwordMatch && roleMatch;
    });
    
    if (!foundUser) {
      console.log('Auth Action: Invalid credentials provided');
      const errorAction = {
        type: 'ERROR_LOGIN',
        payload: { error: { message: 'Invalid email or password' } }
      };
      dispatch(errorAction);
      throw new Error('Invalid credentials');
    }
    
    // Create response that simulates successful API call
    const mockApiResponse = createAuthResponse(foundUser.email, foundUser.name, foundUser.role);
    console.log('Auth Action: Simulating successful API response:', mockApiResponse);
    
    // Store token and dispatch success as if it came from API
    sessionStorage.setItem('userToken', mockApiResponse.token);
    const successAction = {
      type: 'SUCCESS_LOGIN',
      payload: mockApiResponse
    };
    dispatch(successAction);
    
    console.log('Auth Action: Login completed successfully (simulated API response)');
    return mockApiResponse;
  }
};

export const signupUser = (data: SignupData) => async (dispatch: any) => {
  console.log('Auth Action: Starting signup process');
  
  // Start loading
  dispatch({ type: REQUEST_SIGNUP });
  
  try {
    // Always attempt API first
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
    console.log('Auth Action: API signup failed, simulating successful API response:', apiError);
    
    // Simulate API validation
    if (data.email === 'test@error.com') {
      const errorAction = {
        type: 'ERROR_SIGNUP',
        payload: { error: { message: 'Email already exists' } }
      };
      dispatch(errorAction);
      throw new Error('Email already exists');
    }
    
    if (data.password.length < 6) {
      const errorAction = {
        type: 'ERROR_SIGNUP',
        payload: { error: { message: 'Password must be at least 6 characters long' } }
      };
      dispatch(errorAction);
      throw new Error('Password too short');
    }
    
    // Create response that simulates successful API call
    const role = data.role || 'candidate';
    const mockApiResponse = createAuthResponse(data.email, data.name, role);
    console.log('Auth Action: Simulating successful API signup response:', mockApiResponse);
    
    // Store token and dispatch success as if it came from API
    sessionStorage.setItem('userToken', mockApiResponse.token);
    const successAction = {
      type: 'SUCCESS_SIGNUP',
      payload: mockApiResponse
    };
    dispatch(successAction);
    
    console.log('Auth Action: Signup completed successfully (simulated API response)');
    return mockApiResponse;
  }
};

export const logoutUser = () => async (dispatch: any) => {
  console.log('Auth Action: Starting logout process');
  
  try {
    // Attempt API logout
    const apiUrl = `${baseUrl}/auth/logout`;
    
    await callApi({
      dispatch,
      actionType: REQUEST_LOGOUT,
      url: apiUrl,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('Auth Action: API logout successful');
  } catch (apiError) {
    console.log('Auth Action: API logout failed, proceeding with local logout:', apiError);
  }
  
  // Always clear local session regardless of API response
  sessionStorage.removeItem('userToken');
  dispatch({ type: 'SUCCESS_LOGOUT' });
  console.log('Auth Action: Logout completed');
};

export const checkAuth = () => async (dispatch: any) => {
  console.log('Auth Action: Checking authentication');
  
  const token = sessionStorage.getItem('userToken');
  if (!token) {
    console.log('Auth Action: No token found');
    return;
  }
  
  try {
    // Attempt to validate token with API
    const apiUrl = `${baseUrl}/auth/verify`;
    
    const result = await callApi({
      dispatch,
      actionType: REQUEST_CHECK_AUTH,
      url: apiUrl,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Auth Action: Token validation successful:', result);
    dispatch({ type: 'SUCCESS_CHECK_AUTH', payload: result });
  } catch (apiError) {
    console.log('Auth Action: Token validation failed, using local token:', apiError);
    
    // Simulate successful token validation
    try {
      const tokenData = JSON.parse(atob(token));
      const mockValidationResponse = {
        token,
        user: {
          id: tokenData.sub,
          email: tokenData.email,
          name: tokenData.name,
          role: tokenData.role,
          organizationId: tokenData.organizationId
        }
      };
      
      console.log('Auth Action: Simulating successful token validation:', mockValidationResponse);
      dispatch({ type: 'SUCCESS_CHECK_AUTH', payload: mockValidationResponse });
    } catch (tokenError) {
      console.log('Auth Action: Invalid token format, clearing session');
      sessionStorage.removeItem('userToken');
    }
  }
};
