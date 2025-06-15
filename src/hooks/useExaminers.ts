
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getExaminers, createExaminer, updateExaminer, deleteExaminer } from '@/store/actions/examinerActions';

export const useExaminers = () => {
  const dispatch = useAppDispatch();
  const { examiners, loading, error } = useAppSelector(state => state.examiner);

  useEffect(() => {
    dispatch(getExaminers());
  }, [dispatch]);

  const handleCreateExaminer = (data: any) => {
    return dispatch(createExaminer(data));
  };

  const handleUpdateExaminer = (id: string, data: any) => {
    return dispatch(updateExaminer(id, data));
  };

  const handleDeleteExaminer = (id: string) => {
    return dispatch(deleteExaminer(id));
  };

  return {
    examiners,
    loading,
    error,
    createExaminer: handleCreateExaminer,
    updateExaminer: handleUpdateExaminer,
    deleteExaminer: handleDeleteExaminer,
  };
};
