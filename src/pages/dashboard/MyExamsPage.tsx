
import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getMyExams, createExam } from '@/store/actions/examActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users, Clock, Edit, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateExamModal from '@/components/dashboard/CreateExamModal';
import AddCandidateModal from '@/components/dashboard/AddCandidateModal';
import SendInvitesModal from '@/components/dashboard/SendInvitesModal';
import ViewExamModal from '@/components/dashboard/ViewExamModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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

  const handleDuplicateExam = async (exam: any) => {
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

  const filteredExams = exams?.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: ExamDetails['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge variant="secondary" className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const handleEditExam = (examId: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Edit exam functionality will be implemented',
    });
  };

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Exams</h1>
            <p className="text-gray-600">Manage your created examinations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <AddCandidateModal />
            <SendInvitesModal />
            <CreateExamModal />
          </div>
        </div>

        {/* Search and Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search my exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {exams?.filter(e => e.status === 'active').length || 0}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {exams?.filter(e => e.status === 'draft').length || 0}
              </div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{exam.title}</CardTitle>
                  {getStatusBadge(exam.status)}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{exam.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{exam.candidates} candidates</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <div>Created: {new Date(exam.createdAt).toLocaleDateString()}</div>
                  <div>Completed: {exam.completedSubmissions}/{exam.candidates}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <ViewExamModal 
                    exam={exam}
                    trigger={
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    }
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditExam(exam.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicateExam(exam)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExams.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600 mb-4">
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
