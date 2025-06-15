
import {
  REQUEST_GET_EXAMINERS,
  REQUEST_CREATE_EXAMINER,
  REQUEST_UPDATE_EXAMINER,
  REQUEST_DELETE_EXAMINER,
} from '../actionTypes';
import callApi from '../../utils/callApi';
import { baseUrl } from '../../utils/config';

export const getExaminers = () => (dispatch: any) => {
  const url = `${baseUrl}/examiners?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'GET',
    url,
    actionType: REQUEST_GET_EXAMINERS,
  };

  return callApi(params);
};

export const createExaminer = (data: any) => (dispatch: any) => {
  const url = `${baseUrl}/examiners?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'POST',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_CREATE_EXAMINER,
  };

  return callApi(params);
};

export const updateExaminer = (id: string, data: any) => (dispatch: any) => {
  const url = `${baseUrl}/examiners/${id}?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'PUT',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_UPDATE_EXAMINER,
  };

  return callApi(params);
};

export const deleteExaminer = (id: string) => (dispatch: any) => {
  const url = `${baseUrl}/examiners/${id}?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'DELETE',
    url,
    actionType: REQUEST_DELETE_EXAMINER,
  };

  return callApi(params);
};
