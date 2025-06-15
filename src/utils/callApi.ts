
import { isPublicRoute } from './common';
import { getXheaders } from './xheaders';

const errorResponse = (actionType: string) => `ERROR_${actionType}`;
const successResponse = (actionType: string) => `SUCCESS_${actionType}`;

const createAction = (type: string, payload: any) => ({
  type,
  payload,
});

const defaultDispatch = () => null;

interface CallApiParams {
  dispatch?: any;
  actionType: string;
  headers?: Record<string, string>;
  url: string;
  method?: string;
  body?: string;
  responseType?: string;
  [key: string]: any;
}

const callApi = (params: CallApiParams) => {
  const {
    dispatch = defaultDispatch,
    actionType,
    headers,
    url,
    ...otherParams
  } = params;
  
  let finalHeaders = headers;
  
  if (dispatch != null && dispatch != undefined) {
    dispatch({ type: actionType });
  }
  
  const token = sessionStorage.getItem('userToken');
  if (token !== null && token !== undefined) {
    if (headers) {
      finalHeaders = { ...headers, Authorization: token };
    } else {
      finalHeaders = { Authorization: token };
    }
  }
  
  const xh = getXheaders();
  if (finalHeaders) {
    finalHeaders = {
      ...finalHeaders,
      ...xh,
    };
  } else {
    finalHeaders = xh;
  }
  
  const fetchOptions = {
    ...otherParams,
    headers: finalHeaders,
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode,
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      const actionName = actionType.split('REQUEST_')[1];
      const errorResponseType = errorResponse(actionName);

      if (response.ok) {
        const successResponseType = successResponse(actionName);

        // Handle different response types
        if (params.responseType === 'text/html') {
          return response.text().then((resp) => {
            dispatch(createAction(successResponseType, resp));
            return resp;
          });
        }
        if (
          params.responseType === 'application/pdf' ||
          params.responseType === 'blob'
        ) {
          return response.blob().then((resp) => {
            dispatch(createAction(successResponseType, resp));
            const cdh = response.headers.get('content-disposition');
            let fileName = 'downloaded_file';
            if (cdh) {
              const fileNameArr = cdh.split('filename=');
              fileName = fileNameArr[1]
                ? fileNameArr[1].replace(/"/g, '')
                : fileName;
            }
            return { resp, fileName };
          });
        }
        if (params.responseType === 'text/csv') {
          return response.blob().then((resp) => {
            dispatch(createAction(successResponseType, resp));
            const cdh = response.headers.get('content-disposition');
            let fileName = 'export.csv';
            if (cdh) {
              const fileNameArr = cdh.split('filename=');
              fileName = fileNameArr[1]
                ? fileNameArr[1].replace(/"/g, '')
                : fileName;
            }
            return { resp, fileName };
          });
        }

        // Default to JSON response
        return response.json().then((resp) => {
          dispatch(createAction(successResponseType, resp));
          return resp;
        });
      }

      return response
        .json()
        .then((resp) => {
          dispatch(createAction(errorResponseType, { error: resp }));
          return Promise.reject(resp);
        })
        .catch((resp) => {
          dispatch(createAction(errorResponseType, { error: resp }));
          return Promise.reject(resp);
        });
    })
    .catch((err: any = {}) => {
      console.error('Request error:', err);
      const { error, code } = err;
      const originPath = '/';
      const currentPath = window.location.pathname;
      if (isPublicRoute(currentPath)) {
        return;
      }
      if (code && error) {
        if (
          error === 'Unauthorized' &&
          code === 'X0PA-401-1' &&
          originPath !== currentPath
        ) {
          window.location.href = window.location.origin;
        }
      }
    });
};

export default callApi;
