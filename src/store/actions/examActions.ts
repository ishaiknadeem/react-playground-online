
import {
  REQUEST_GET_EXAMS,
  REQUEST_GET_MY_EXAMS,
  REQUEST_CREATE_EXAM,
  REQUEST_UPDATE_EXAM,
  REQUEST_DELETE_EXAM,
} from '../actionTypes';
import callApi from '../../utils/callApi';
import { baseUrl } from '../../utils/config';
import { examApi } from '../../services/api';

export const getExams = () => (dispatch: any) => {
  const url = `${baseUrl}/exams?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'GET',
    url,
    actionType: REQUEST_GET_EXAMS,
  };

  return callApi(params);
};

export const getMyExams = (examinerId: string) => async (dispatch: any) => {
  dispatch({ type: REQUEST_GET_MY_EXAMS });
  
  try {
    // Try to get exams using the API service which has fallback logic
    const exams = await examApi.getByExaminer(examinerId);
    dispatch({
      type: 'SUCCESS_GET_MY_EXAMS',
      payload: exams
    });
    return exams;
  } catch (error) {
    console.error('Error fetching my exams:', error);
    dispatch({
      type: 'ERROR_GET_MY_EXAMS',
      payload: { error: { message: 'Failed to fetch exams' } }
    });
    throw error;
  }
};

export const createExam = (data: any) => (dispatch: any) => {
  const url = `${baseUrl}/exams?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'POST',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_CREATE_EXAM,
  };

  return callApi(params);
};

export const updateExam = (id: string, data: any) => (dispatch: any) => {
  const url = `${baseUrl}/exams/${id}?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'PUT',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_UPDATE_EXAM,
  };

  return callApi(params);
};

export const deleteExam = (id: string) => (dispatch: any) => {
  const url = `${baseUrl}/exams/${id}?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'DELETE',
    url,
    actionType: REQUEST_DELETE_EXAM,
  };

  return callApi(params);
};
