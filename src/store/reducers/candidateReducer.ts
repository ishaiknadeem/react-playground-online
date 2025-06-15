
interface CandidateState {
  candidates: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
};

const candidateReducer = (state = initialState, action: any): CandidateState => {
  switch (action.type) {
    case 'REQUEST_GET_CANDIDATES':
    case 'REQUEST_CREATE_CANDIDATE':
    case 'REQUEST_UPDATE_CANDIDATE':
    case 'REQUEST_DELETE_CANDIDATE':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SUCCESS_GET_CANDIDATES':
      return {
        ...state,
        candidates: action.payload,
        loading: false,
        error: null,
      };

    case 'SUCCESS_CREATE_CANDIDATE':
      return {
        ...state,
        candidates: [...state.candidates, action.payload],
        loading: false,
        error: null,
      };

    case 'SUCCESS_UPDATE_CANDIDATE':
      return {
        ...state,
        candidates: state.candidates.map(candidate =>
          candidate.id === action.payload.id ? action.payload : candidate
        ),
        loading: false,
        error: null,
      };

    case 'SUCCESS_DELETE_CANDIDATE':
      return {
        ...state,
        candidates: state.candidates.filter(candidate => candidate.id !== action.payload.id),
        loading: false,
        error: null,
      };

    case 'ERROR_GET_CANDIDATES':
    case 'ERROR_CREATE_CANDIDATE':
    case 'ERROR_UPDATE_CANDIDATE':
    case 'ERROR_DELETE_CANDIDATE':
      return {
        ...state,
        loading: false,
        error: action.payload.error?.message || 'Operation failed',
      };

    default:
      return state;
  }
};

export default candidateReducer;
