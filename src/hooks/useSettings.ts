
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getSettings, updateSettings } from '@/store/actions/settingsActions';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const { settings, loading, error } = useAppSelector(state => state.settings);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const handleUpdateSettings = (data: any) => {
    return dispatch(updateSettings(data));
  };

  return {
    settings,
    loading,
    error,
    updateSettings: handleUpdateSettings,
  };
};
