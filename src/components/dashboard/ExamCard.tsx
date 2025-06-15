
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Eye, Edit, Copy } from 'lucide-react';
import ViewExamModal from './ViewExamModal';
import { type ExamDetails } from '@/services/api';

interface ExamCardProps {
  exam: ExamDetails;
  onEdit: (examId: string) => void;
  onDuplicate: (exam: ExamDetails) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onEdit, onDuplicate }) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{exam.title}</CardTitle>
          {getStatusBadge(exam.status)}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{exam.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{exam.candidates} candidates</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <div className="truncate">Created: {new Date(exam.createdAt).toLocaleDateString()}</div>
          <div className="truncate">Completed: {exam.completedSubmissions}/{exam.candidates}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <ViewExamModal 
            exam={exam}
            trigger={
              <Button size="sm" variant="outline" className="flex-1 min-w-0">
                <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">View</span>
              </Button>
            }
          />
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(exam.id)}
            className="flex-shrink-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDuplicate(exam)}
            className="flex-shrink-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamCard;
