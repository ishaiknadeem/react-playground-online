
import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getMyExams, createExam } from '@/store/actions/examActions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
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

const MyExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  const { myExams: exams, loading, error } = useAppSelector(state => state.exam);
  const { user } = useAppSelector(state => state.auth);
  const { toast } = useToast();

  // Memoized fetch function to prevent recreation on every render
  const fetchExams = useCallback(() => {
    if (user?.id) {
      console.log('Fetching exams for user:', user.id);
      dispatch(getMyExams(user.id));
    }
  }, [dispatch, user?.id]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log('MyExamsPage mounted, user:', user?.id);
    if (user?.id && exams.length === 0 && !loading) {
      fetchExams();
    }
  }, [user?.id, exams.length, loading, fetchExams]);

  const handleDuplicateExam = async (exam: ExamDetails) => {
    try {
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
    } catch (error) {
      console.error('Error duplicating exam:', error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate exam',
        variant: 'destructive',
      });
    }
  };

  const handleEditExam = (examId: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Edit exam functionality will be implemented',
    });
  };

  const filteredExams = exams?.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading your exams..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Failed to load exams</p>
              <Button onClick={fetchExams} variant="outline">
                Try Again
              </Button>
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
        {filteredExams.length === 0 && !loading && (
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
