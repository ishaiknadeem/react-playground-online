
interface SettingsState {
  settings: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

const settingsReducer = (state = initialState, action: any): SettingsState => {
  switch (action.type) {
    case 'REQUEST_GET_SETTINGS':
    case 'REQUEST_UPDATE_SETTINGS':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SUCCESS_GET_SETTINGS':
    case 'SUCCESS_UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null,
      };

    case 'ERROR_GET_SETTINGS':
    case 'ERROR_UPDATE_SETTINGS':
      return {
        ...state,
        loading: false,
        error: action.payload.error?.message || 'Operation failed',
      };

    default:
      return state;
  }
};

export default settingsReducer;
