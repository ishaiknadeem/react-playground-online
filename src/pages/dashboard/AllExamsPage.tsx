import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Users, Clock, MoreHorizontal, Edit, Trash2, Play, Square } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateExamModal from '@/components/dashboard/CreateExamModal';
import { examApi, type ExamDetails } from '@/services/api';

const AllExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['all-exams'],
    queryFn: examApi.getAll,
  });

  const updateExamMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ExamDetails> }) =>
      examApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-exams'] });
      toast({
        title: 'Success',
        description: 'Exam updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update exam',
        variant: 'destructive',
      });
    },
  });

  const deleteExamMutation = useMutation({
    mutationFn: examApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-exams'] });
      toast({
        title: 'Success',
        description: 'Exam deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete exam',
        variant: 'destructive',
      });
    },
  });

  const handleToggleExamStatus = (exam: ExamDetails) => {
    const newStatus = exam.status === 'active' ? 'draft' : 'active';
    updateExamMutation.mutate({
      id: exam.id,
      updates: { status: newStatus }
    });
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      deleteExamMutation.mutate(examId);
    }
  };

  const handleViewExam = (examId: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Exam details view will be implemented',
    });
  };

  const handleEditExam = (examId: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: 'Exam editing will be implemented',
    });
  };

  console.log('All Exams Page - Data:', exams);
  console.log('All Exams Page - Loading:', isLoading);
  console.log('All Exams Page - Error:', error);

  const filteredExams = exams?.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: ExamDetails['status']) => {
    const variants = {
      draft: 'secondary',
      active: 'default',
      completed: 'default'
    } as const;

    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty: ExamDetails['difficulty']) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="secondary" className={colors[difficulty]}>
        {difficulty}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.error('Error loading exams:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 w-full max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Exams</h1>
            <p className="text-gray-600">Manage and monitor all examination activities</p>
          </div>
          <CreateExamModal />
        </div>

        {/* Stats and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search exams..."
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
              <div className="text-sm text-gray-600">Active Exams</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {exams?.reduce((total, exam) => total + exam.candidates, 0) || 0}
              </div>
              <div className="text-sm text-gray-600">Total Candidates</div>
            </CardContent>
          </Card>
        </div>

        {/* Exams Table */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle>All Exams ({filteredExams.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px] hidden md:table-cell">Created By</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Difficulty</TableHead>
                    <TableHead className="min-w-[100px] hidden sm:table-cell">Duration</TableHead>
                    <TableHead className="min-w-[100px]">Candidates</TableHead>
                    <TableHead className="min-w-[100px] hidden lg:table-cell">Completed</TableHead>
                    <TableHead className="min-w-[100px] hidden md:table-cell">Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium truncate">{exam.title}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {exam.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{exam.createdBy}</TableCell>
                      <TableCell>{getStatusBadge(exam.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getDifficultyBadge(exam.difficulty)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {exam.duration}m
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          {exam.candidates}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{exam.completedSubmissions}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewExam(exam.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditExam(exam.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleExamStatus(exam)}>
                              {exam.status === 'active' ? (
                                <>
                                  <Square className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteExam(exam.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AllExamsPage;
