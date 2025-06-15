
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
import { logger } from '../../utils/logger';

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
    logger.info('Fetching exams for examiner', { examinerId });
    
    // Try to get exams using the API service which has fallback logic
    const exams = await examApi.getByExaminer(examinerId);
    
    logger.info('Successfully fetched exams', { 
      examinerId, 
      examCount: exams?.length || 0 
    });
    
    dispatch({
      type: 'SUCCESS_GET_MY_EXAMS',
      payload: exams || []
    });
    return exams;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch exams';
    logger.error('Error fetching my exams', error as Error, { examinerId });
    
    dispatch({
      type: 'ERROR_GET_MY_EXAMS',
      payload: { error: { message: errorMessage } }
    });
    throw error;
  }
};

export const createExam = (data: any) => (dispatch: any) => {
  logger.info('Creating new exam', { title: data.title, status: data.status });
  
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

  return callApi(params).then(result => {
    logger.info('Exam created successfully', { examId: result?.id });
    return result;
  }).catch(error => {
    logger.error('Failed to create exam', error, { title: data.title });
    throw error;
  });
};

export const updateExam = (id: string, data: any) => (dispatch: any) => {
  logger.info('Updating exam', { examId: id, updates: Object.keys(data) });
  
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

  return callApi(params).then(result => {
    logger.info('Exam updated successfully', { examId: id });
    return result;
  }).catch(error => {
    logger.error('Failed to update exam', error, { examId: id });
    throw error;
  });
};

export const deleteExam = (id: string) => (dispatch: any) => {
  logger.info('Deleting exam', { examId: id });
  
  const url = `${baseUrl}/exams/${id}?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'DELETE',
    url,
    actionType: REQUEST_DELETE_EXAM,
  };

  return callApi(params).then(result => {
    logger.info('Exam deleted successfully', { examId: id });
    return result;
  }).catch(error => {
    logger.error('Failed to delete exam', error, { examId: id });
    throw error;
  });
};
