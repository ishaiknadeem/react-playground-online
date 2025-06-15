
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import examinerReducer from './examinerReducer';
import examReducer from './examReducer';
import candidateReducer from './candidateReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  examiner: examinerReducer,
  exam: examReducer,
  candidate: candidateReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
