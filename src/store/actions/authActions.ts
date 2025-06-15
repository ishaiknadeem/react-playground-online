
import {
  REQUEST_LOGIN,
  REQUEST_SIGNUP,
  REQUEST_LOGOUT,
  REQUEST_CHECK_AUTH,
} from '../actionTypes';
import { authApi } from '../../services/authApi';

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

export const loginUser = (data: LoginData, userType: 'admin' | 'candidate') => async (dispatch: any) => {
  console.log('Auth Action: Starting login process for', userType);
  
  dispatch({ type: REQUEST_LOGIN });
  
  try {
    const response = await authApi.login(data, userType);
    console.log('Auth Action: Login response:', response);
    
    if (response.success) {
      dispatch({ 
        type: 'SUCCESS_LOGIN', 
        payload: { 
          token: response.token, 
          user: response.user 
        } 
      });
      return response;
    } else {
      dispatch({ 
        type: 'ERROR_LOGIN', 
        payload: { 
          error: { message: response.error || 'Login failed' } 
        } 
      });
      throw new Error(response.error || 'Login failed');
    }
  } catch (error) {
    console.error('Auth Action: Login error:', error);
    dispatch({ 
      type: 'ERROR_LOGIN', 
      payload: { 
        error: { message: 'Authentication failed' } 
      } 
    });
    throw error;
  }
};

export const signupUser = (data: SignupData) => async (dispatch: any) => {
  console.log('Auth Action: Starting signup process');
  
  dispatch({ type: REQUEST_SIGNUP });
  
  try {
    const response = await authApi.signup(data);
    console.log('Auth Action: Signup response:', response);
    
    if (response.success) {
      dispatch({ 
        type: 'SUCCESS_SIGNUP', 
        payload: { 
          token: response.token, 
          user: response.user 
        } 
      });
      return response;
    } else {
      dispatch({ 
        type: 'ERROR_SIGNUP', 
        payload: { 
          error: { message: response.error || 'Signup failed' } 
        } 
      });
      throw new Error(response.error || 'Signup failed');
    }
  } catch (error) {
    console.error('Auth Action: Signup error:', error);
    dispatch({ 
      type: 'ERROR_SIGNUP', 
      payload: { 
        error: { message: 'Registration failed' } 
      } 
    });
    throw error;
  }
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
