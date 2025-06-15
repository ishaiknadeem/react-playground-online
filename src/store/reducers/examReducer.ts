
interface ExamState {
  exams: any[];
  myExams: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  myExams: [],
  loading: false,
  error: null,
};

const examReducer = (state = initialState, action: any): ExamState => {
  switch (action.type) {
    case 'REQUEST_GET_EXAMS':
    case 'REQUEST_GET_MY_EXAMS':
    case 'REQUEST_CREATE_EXAM':
    case 'REQUEST_UPDATE_EXAM':
    case 'REQUEST_DELETE_EXAM':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SUCCESS_GET_EXAMS':
      return {
        ...state,
        exams: action.payload,
        loading: false,
        error: null,
      };

    case 'SUCCESS_GET_MY_EXAMS':
      return {
        ...state,
        myExams: action.payload,
        loading: false,
        error: null,
      };

    case 'SUCCESS_CREATE_EXAM':
      return {
        ...state,
        exams: [...state.exams, action.payload],
        myExams: [...state.myExams, action.payload],
        loading: false,
        error: null,
      };

    case 'SUCCESS_UPDATE_EXAM':
      return {
        ...state,
        exams: state.exams.map(exam =>
          exam.id === action.payload.id ? action.payload : exam
        ),
        myExams: state.myExams.map(exam =>
          exam.id === action.payload.id ? action.payload : exam
        ),
        loading: false,
        error: null,
      };

    case 'SUCCESS_DELETE_EXAM':
      return {
        ...state,
        exams: state.exams.filter(exam => exam.id !== action.payload.id),
        myExams: state.myExams.filter(exam => exam.id !== action.payload.id),
        loading: false,
        error: null,
      };

    case 'ERROR_GET_EXAMS':
    case 'ERROR_GET_MY_EXAMS':
    case 'ERROR_CREATE_EXAM':
    case 'ERROR_UPDATE_EXAM':
    case 'ERROR_DELETE_EXAM':
      return {
        ...state,
        loading: false,
        error: action.payload.error?.message || 'Operation failed',
      };

    default:
      return state;
  }
};

export default examReducer;
