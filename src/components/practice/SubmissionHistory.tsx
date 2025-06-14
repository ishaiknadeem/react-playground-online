
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Play } from 'lucide-react';

interface Submission {
  id: string;
  questionId: string;
  questionTitle: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  language: string;
  submittedAt: Date;
  runtime?: string;
  memory?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SubmissionHistoryProps {
  submissions?: Submission[];
  onRetryProblem?: (questionId: string) => void;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ 
  submissions = [], 
  onRetryProblem 
}) => {
  // Mock data if no submissions provided
  const mockSubmissions: Submission[] = [
    {
      id: '1',
      questionId: 'two-sum',
      questionTitle: 'Two Sum',
      status: 'Accepted',
      language: 'JavaScript',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      runtime: '68 ms',
      memory: '44.2 MB',
      difficulty: 'Easy'
    },
    {
      id: '2',
      questionId: 'reverse-string',
      questionTitle: 'Reverse String',
      status: 'Accepted',
      language: 'JavaScript',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      runtime: '76 ms',
      memory: '42.1 MB',
      difficulty: 'Easy'
    },
    {
      id: '3',
      questionId: 'binary-search',
      questionTitle: 'Binary Search',
      status: 'Wrong Answer',
      language: 'JavaScript',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      difficulty: 'Medium'
    }
  ];

  const displaySubmissions = submissions.length > 0 ? submissions : mockSubmissions;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Wrong Answer':
      case 'Time Limit Exceeded':
      case 'Runtime Error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Wrong Answer':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Time Limit Exceeded':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Runtime Error':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-lg">Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {displaySubmissions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-600">Start solving problems to see your submission history here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displaySubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {submission.questionTitle}
                      </h4>
                      <Badge className={`${getDifficultyColor(submission.difficulty)} text-xs px-2 py-1 border`}>
                        {submission.difficulty}
                      </Badge>
                      <Badge className={`${getStatusColor(submission.status)} text-xs px-2 py-1 border`}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1">{submission.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{submission.language}</span>
                      <span>{formatDate(submission.submittedAt)}</span>
                      {submission.runtime && <span>Runtime: {submission.runtime}</span>}
                      {submission.memory && <span>Memory: {submission.memory}</span>}
                    </div>
                  </div>
                  
                  {onRetryProblem && (
                    <Button 
                      onClick={() => onRetryProblem(submission.questionId)}
                      size="sm"
                      variant="outline"
                      className="ml-4"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionHistory;
