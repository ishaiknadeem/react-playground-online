
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '@/store/actions/candidateActions';

export const useCandidates = () => {
  const dispatch = useAppDispatch();
  const { candidates, loading, error } = useAppSelector(state => state.candidate);

  useEffect(() => {
    dispatch(getCandidates());
  }, [dispatch]);

  const handleCreateCandidate = (data: any) => {
    return dispatch(createCandidate(data));
  };

  const handleUpdateCandidate = (id: string, data: any) => {
    return dispatch(updateCandidate(id, data));
  };

  const handleDeleteCandidate = (id: string) => {
    return dispatch(deleteCandidate(id));
  };

  return {
    candidates,
    loading,
    error,
    createCandidate: handleCreateCandidate,
    updateCandidate: handleUpdateCandidate,
    deleteCandidate: handleDeleteCandidate,
  };
};
