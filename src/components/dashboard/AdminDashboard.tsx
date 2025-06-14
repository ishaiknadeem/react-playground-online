
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your organization's coding exams</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Examiners</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalExaminers}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Exams</CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalExams}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">+45 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Exams</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeExams}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
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
