
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users, Clock, Edit, Copy } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateExamModal from '@/components/dashboard/CreateExamModal';
import { examApi, type ExamDetails } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const MyExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['my-exams', user?.id],
    queryFn: () => examApi.getByExaminer(user?.id || ''),
  });

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
    console.error('Error loading my exams:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
            <p className="text-gray-600">Manage your created examinations</p>
          </div>
          <CreateExamModal />
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
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExams.length === 0 && (
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
