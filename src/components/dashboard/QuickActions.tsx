
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus, FileText, Settings, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import AddExaminerModal from './AddExaminerModal';
import CreateExamModal from './CreateExamModal';

const QuickActions = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const adminActions = [
    {
      title: 'Add Examiner',
      icon: UserPlus,
      component: <AddExaminerModal trigger={
        <Button variant="outline" className="w-full justify-start">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Examiner
        </Button>
      } />
    },
    {
      title: 'Create Exam',
      icon: FileText,
      component: <CreateExamModal trigger={
        <Button variant="outline" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-2" />
          Create Exam
        </Button>
      } />
    },
    {
      title: 'View All Exams',
      icon: FileText,
      action: () => navigate('/dashboard/exams'),
      component: (
        <Button variant="outline" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-2" />
          View All Exams
        </Button>
      )
    },
    {
      title: 'Settings',
      icon: Settings,
      action: () => navigate('/dashboard/settings'),
      component: (
        <Button variant="outline" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      )
    }
  ];

  const examinerActions = [
    {
      title: 'Create Exam',
      icon: Plus,
      component: <CreateExamModal trigger={
        <Button variant="outline" className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Create Exam
        </Button>
      } />
    },
    {
      title: 'My Exams',
      icon: FileText,
      action: () => navigate('/dashboard/my-exams'),
      component: (
        <Button variant="outline" className="w-full justify-start">
          <FileText className="w-4 h-4 mr-2" />
          My Exams
        </Button>
      )
    },
    {
      title: 'Candidates',
      icon: Users,
      action: () => navigate('/dashboard/candidates'),
      component: (
        <Button variant="outline" className="w-full justify-start">
          <Users className="w-4 h-4 mr-2" />
          Candidates
        </Button>
      )
    }
  ];

  const actions = user?.role === 'admin' ? adminActions : examinerActions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} onClick={action.action}>
            {action.component}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
