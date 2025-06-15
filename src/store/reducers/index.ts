
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import examinerReducer from './examinerReducer';
import examReducer from './examReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  examiner: examinerReducer,
  exam: examReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
