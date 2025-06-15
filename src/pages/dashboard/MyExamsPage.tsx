
import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getMyExams, createExam } from '@/store/actions/examActions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateExamModal from '@/components/dashboard/CreateExamModal';
import AddCandidateModal from '@/components/dashboard/AddCandidateModal';
import SendInvitesModal from '@/components/dashboard/SendInvitesModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ExamSearch from '@/components/dashboard/ExamSearch';
import MyExamsStats from '@/components/dashboard/MyExamsStats';
import ExamCard from '@/components/dashboard/ExamCard';
import { type ExamDetails } from '@/services/api';
import { logger } from '@/utils/logger';

const MyExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const dispatch = useAppDispatch();
  const { myExams: exams, loading, error } = useAppSelector(state => state.exam);
  const { user } = useAppSelector(state => state.auth);
  const { toast } = useToast();

  // Memoized fetch function to prevent recreation on every render
  const fetchExams = useCallback(() => {
    if (user?.id) {
      logger.info('Fetching exams for user', { userId: user.id, retryCount });
      dispatch(getMyExams(user.id))
        .catch((err: any) => {
          logger.error('Failed to fetch exams', err, { userId: user.id, retryCount });
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
          }
        });
    }
  }, [dispatch, user?.id, retryCount]);

  // Auto-retry logic with backoff
  useEffect(() => {
    if (retryCount > 0 && retryCount < 3) {
      const timeoutId = setTimeout(() => {
        fetchExams();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff

      return () => clearTimeout(timeoutId);
    }
  }, [retryCount, fetchExams]);

  // Initial fetch effect
  useEffect(() => {
    logger.info('MyExamsPage mounted', { userId: user?.id, examsLength: exams.length });
    if (user?.id && exams.length === 0 && !loading && !error) {
      fetchExams();
    }
  }, [user?.id, exams.length, loading, error, fetchExams]);

  const handleDuplicateExam = async (exam: ExamDetails) => {
    try {
      logger.info('Duplicating exam', { examId: exam.id, title: exam.title });
      const duplicatedExam = {
        ...exam,
        title: `${exam.title} (Copy)`,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        candidates: 0,
        completedSubmissions: 0,
      };
      delete (duplicatedExam as any).id;
      
      await dispatch(createExam(duplicatedExam));
      toast({
        title: 'Success',
        description: 'Exam duplicated successfully',
      });
      logger.info('Exam duplicated successfully', { originalId: exam.id });
    } catch (error) {
      logger.error('Error duplicating exam', error as Error, { examId: exam.id });
      toast({
        title: 'Error',
        description: 'Failed to duplicate exam',
        variant: 'destructive',
      });
    }
  };

  const handleEditExam = (examId: string) => {
    logger.info('Edit exam requested', { examId });
    toast({
      title: 'Feature Coming Soon',
      description: 'Edit exam functionality will be implemented',
    });
  };

  const handleRetry = () => {
    logger.info('Manual retry requested');
    setRetryCount(0);
    fetchExams();
  };

  const filteredExams = exams?.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading your exams..." />
        </div>
      </DashboardLayout>
    );
  }

  // Error state with retry options
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load exams</h3>
              <p className="text-sm text-gray-600 mb-4">
                {retryCount >= 3 
                  ? 'Multiple attempts failed. Please check your connection and try again.'
                  : 'There was an error loading your exams. Please try again.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRetry} variant="outline" disabled={loading}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                {retryCount >= 3 && (
                  <Button onClick={() => window.location.reload()} variant="default">
                    Reload Page
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">My Exams</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your created examinations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <AddCandidateModal />
            <SendInvitesModal />
            <CreateExamModal />
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ExamSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div className="lg:col-span-2">
            <MyExamsStats exams={exams} />
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onEdit={handleEditExam}
              onDuplicate={handleDuplicateExam}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first exam.'}
              </p>
              {!searchTerm && (
                <CreateExamModal trigger={
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create Your First Exam
                  </Button>
                } />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyExamsPage;
