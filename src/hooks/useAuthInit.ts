
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { checkAuth } from '@/store/actions/authActions';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const { initialized, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!initialized && !loading) {
      console.log('Auth Init: Checking stored authentication');
      dispatch(checkAuth());
    }
  }, [dispatch, initialized, loading]);

  return { initialized };
};
