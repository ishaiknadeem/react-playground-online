
import {
  REQUEST_GET_CANDIDATES,
  REQUEST_CREATE_CANDIDATE,
  REQUEST_UPDATE_CANDIDATE,
  REQUEST_DELETE_CANDIDATE,
} from '../actionTypes';
import callApi from '../../utils/callApi';
import { baseUrl } from '../../utils/config';

export const getCandidates = () => (dispatch: any) => {
  const url = `${baseUrl}/candidates?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'GET',
    url,
    actionType: REQUEST_GET_CANDIDATES,
  };

  return callApi(params);
};

export const createCandidate = (data: any) => (dispatch: any) => {
  const url = `${baseUrl}/candidates?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'POST',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_CREATE_CANDIDATE,
  };

  return callApi(params);
};

export const updateCandidate = (id: string, data: any) => (dispatch: any) => {
  const url = `${baseUrl}/candidates/${id}?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'PUT',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_UPDATE_CANDIDATE,
  };

  return callApi(params);
};

export const deleteCandidate = (id: string) => (dispatch: any) => {
  const url = `${baseUrl}/candidates/${id}?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'DELETE',
    url,
    actionType: REQUEST_DELETE_CANDIDATE,
  };

  return callApi(params);
};
