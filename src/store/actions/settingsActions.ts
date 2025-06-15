
import {
  REQUEST_GET_SETTINGS,
  REQUEST_UPDATE_SETTINGS,
} from '../actionTypes';
import callApi from '../../utils/callApi';
import { baseUrl } from '../../utils/config';

export const getSettings = () => (dispatch: any) => {
  const url = `${baseUrl}/settings?_=${new Date().getTime()}`;
  const params = {
    dispatch,
    method: 'GET',
    url,
    actionType: REQUEST_GET_SETTINGS,
  };

  return callApi(params);
};

export const updateSettings = (data: any) => (dispatch: any) => {
  const url = `${baseUrl}/settings?_=${new Date().getTime()}`;
  const params = {
    headers: {
      'content-type': 'application/json',
    },
    dispatch,
    method: 'PUT',
    url,
    body: JSON.stringify(data),
    actionType: REQUEST_UPDATE_SETTINGS,
  };

  return callApi(params);
};
