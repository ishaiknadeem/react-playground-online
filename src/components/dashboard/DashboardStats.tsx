
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { examinerApi, examApi, candidateApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const DashboardStats = () => {
  const { user } = useAuthStore();

  const { data: examiners } = useQuery({
    queryKey: ['examiners'],
    queryFn: examinerApi.getAll,
    enabled: user?.role === 'admin'
  });

  const { data: allExams } = useQuery({
    queryKey: ['all-exams'],
    queryFn: examApi.getAll,
    enabled: user?.role === 'admin'
  });

  const { data: myExams } = useQuery({
    queryKey: ['my-exams', user?.id],
    queryFn: () => examApi.getByExaminer(user?.id || ''),
    enabled: user?.role === 'examiner'
  });

  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidateApi.getAll,
  });

  const exams = user?.role === 'admin' ? allExams : myExams;

  const stats = [
    {
      title: user?.role === 'admin' ? 'Total Examiners' : 'My Exams',
      value: user?.role === 'admin' ? examiners?.length || 0 : exams?.length || 0,
      icon: user?.role === 'admin' ? Users : FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Exams',
      value: exams?.length || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Candidates',
      value: candidates?.length || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Completed Exams',
      value: candidates?.filter(c => c.status === 'completed' || c.status === 'submitted').length || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
