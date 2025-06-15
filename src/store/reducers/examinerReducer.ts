
interface ExaminerState {
  examiners: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ExaminerState = {
  examiners: [],
  loading: false,
  error: null,
};

const examinerReducer = (state = initialState, action: any): ExaminerState => {
  switch (action.type) {
    case 'REQUEST_GET_EXAMINERS':
    case 'REQUEST_CREATE_EXAMINER':
    case 'REQUEST_UPDATE_EXAMINER':
    case 'REQUEST_DELETE_EXAMINER':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SUCCESS_GET_EXAMINERS':
      return {
        ...state,
        examiners: action.payload,
        loading: false,
        error: null,
      };

    case 'SUCCESS_CREATE_EXAMINER':
      return {
        ...state,
        examiners: [...state.examiners, action.payload],
        loading: false,
        error: null,
      };

    case 'SUCCESS_UPDATE_EXAMINER':
      return {
        ...state,
        examiners: state.examiners.map(examiner =>
          examiner.id === action.payload.id ? action.payload : examiner
        ),
        loading: false,
        error: null,
      };

    case 'SUCCESS_DELETE_EXAMINER':
      return {
        ...state,
        examiners: state.examiners.filter(examiner => examiner.id !== action.payload.id),
        loading: false,
        error: null,
      };

    case 'ERROR_GET_EXAMINERS':
    case 'ERROR_CREATE_EXAMINER':
    case 'ERROR_UPDATE_EXAMINER':
    case 'ERROR_DELETE_EXAMINER':
      return {
        ...state,
        loading: false,
        error: action.payload.error?.message || 'Operation failed',
      };

    default:
      return state;
  }
};

export default examinerReducer;
