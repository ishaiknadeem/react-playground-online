import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, User, CheckCircle, Clock } from 'lucide-react';
import { candidateApi, examApi } from '@/services/api';
import { useAppSelector } from '@/store/store';

interface Activity {
  id: string;
  type: 'exam_created' | 'candidate_invited' | 'exam_completed' | 'exam_submitted';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status?: string;
}

const RecentActivity = () => {
  const { user } = useAppSelector(state => state.auth);

  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidateApi.getAll,
  });

  const { data: exams } = useQuery({
    queryKey: user?.role === 'admin' ? ['all-exams'] : ['my-exams', user?.id],
    queryFn: user?.role === 'admin' ? examApi.getAll : () => examApi.getByExaminer(user?.id || ''),
  });

  // Generate activity feed from candidates and exams data
  const activities: Activity[] = React.useMemo(() => {
    const activityList: Activity[] = [];

    // Add candidate activities
    if (candidates) {
      candidates.forEach(candidate => {
        if (candidate.submittedAt) {
          activityList.push({
            id: `candidate-${candidate.id}-submitted`,
            type: 'exam_submitted',
            title: 'Exam Submitted',
            description: `${candidate.name} submitted ${candidate.examTitle}`,
            user: candidate.name,
            timestamp: candidate.submittedAt,
            status: candidate.status
          });
        }
        
        if (candidate.status === 'completed') {
          activityList.push({
            id: `candidate-${candidate.id}-completed`,
            type: 'exam_completed',
            title: 'Exam Completed',
            description: `${candidate.name} completed ${candidate.examTitle} with score ${candidate.score || 'N/A'}%`,
            user: candidate.name,
            timestamp: candidate.submittedAt || candidate.invitedAt,
            status: candidate.status
          });
        }

        activityList.push({
          id: `candidate-${candidate.id}-invited`,
          type: 'candidate_invited',
          title: 'Candidate Invited',
          description: `${candidate.name} was invited to ${candidate.examTitle}`,
          user: candidate.name,
          timestamp: candidate.invitedAt,
          status: candidate.status
        });
      });
    }

    // Add exam creation activities
    if (exams) {
      exams.forEach(exam => {
        activityList.push({
          id: `exam-${exam.id}-created`,
          type: 'exam_created',
          title: 'Exam Created',
          description: `${exam.title} was created`,
          user: exam.createdBy,
          timestamp: exam.createdAt,
          status: exam.status
        });
      });
    }

    // Sort by timestamp (most recent first)
    return activityList
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10); // Show only 10 most recent
  }, [candidates, exams]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'exam_created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'candidate_invited':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'exam_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'exam_submitted':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      submitted: 'default',
      'in-progress': 'secondary',
      invited: 'outline',
      active: 'default',
      draft: 'secondary'
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {status}
      </Badge>
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-xs">
                      {activity.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500">{activity.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
