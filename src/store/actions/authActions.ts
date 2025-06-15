
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

export const loginUser = (data: LoginData, userType: 'admin' | 'candidate') => (dispatch: any) => {
  const url = `${baseUrl}/auth/login?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'POST',
    url,
    body: JSON.stringify({ ...data, userType }),
    actionType: REQUEST_LOGIN,
  };

  return callApi(params);
};

export const signupUser = (data: SignupData) => (dispatch: any) => {
  const url = `${baseUrl}/auth/signup?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'POST',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_SIGNUP,
  };

  return callApi(params);
};

export const logoutUser = () => (dispatch: any) => {
  sessionStorage.removeItem('userToken');
  dispatch({ type: 'SUCCESS_LOGOUT' });
};

export const checkAuth = () => (dispatch: any) => {
  const token = sessionStorage.getItem('userToken');
  if (token) {
    dispatch({ type: 'SUCCESS_CHECK_AUTH', payload: { token } });
  }
};
