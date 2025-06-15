
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, BarChart3, Settings, Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { examinerApi, examApi, candidateApi } from '@/services/api';
import AddExaminerModal from './AddExaminerModal';
import CreateExamModal from './CreateExamModal';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: examiners } = useQuery({
    queryKey: ['examiners'],
    queryFn: examinerApi.getAll,
  });

  const { data: exams } = useQuery({
    queryKey: ['all-exams'],
    queryFn: examApi.getAll,
  });

  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidateApi.getAll,
  });

  const stats = {
    totalExaminers: examiners?.length || 0,
    totalExams: exams?.length || 0,
    totalCandidates: candidates?.length || 0,
    activeExams: exams?.filter(exam => exam.status === 'active').length || 0
  };

  const recentActivity = [
    { id: 1, action: 'New examiner added', user: 'John Smith', time: '2 hours ago' },
    { id: 2, action: 'Exam created', user: 'Sarah Johnson', time: '4 hours ago' },
    { id: 3, action: 'Candidate completed exam', user: 'Mike Wilson', time: '6 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-end">
        <CreateExamModal trigger={
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        } />
        <AddExaminerModal trigger={
          <Button variant="outline" className="w-full sm:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Examiner
          </Button>
        } />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.user}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-gray-50"
                onClick={() => navigate('/dashboard/examiners')}
              >
                <Users className="w-6 h-6 mb-2" />
                <span className="text-xs">Manage Examiners</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-gray-50"
                onClick={() => navigate('/dashboard/exams')}
              >
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-xs">View All Exams</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-gray-50"
                onClick={() => navigate('/dashboard/candidates')}
              >
                <BarChart3 className="w-6 h-6 mb-2" />
                <span className="text-xs">Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-gray-50"
                onClick={() => navigate('/dashboard/settings')}
              >
                <Settings className="w-6 h-6 mb-2" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
