
import React, { useId } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Eye, Edit, Copy } from 'lucide-react';
import ViewExamModal from './ViewExamModal';
import { type ExamDetails } from '@/services/api';
import { ARIA_LABELS } from '@/utils/accessibility';

interface ExamCardProps {
  exam: ExamDetails;
  onEdit: (examId: string) => void;
  onDuplicate: (exam: ExamDetails) => void;
}

const ExamCard: React.FC<ExamCardProps> = React.memo(({ exam, onEdit, onDuplicate }) => {
  const cardId = useId();
  
  const getStatusBadge = (status: ExamDetails['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' }
    };

    const config = statusConfig[status];
    
    return (
      <Badge 
        variant="secondary" 
        className={config.color}
        aria-label={`Exam status: ${config.label}`}
      >
        {config.label}
      </Badge>
    );
  };

  const handleEdit = () => onEdit(exam.id);
  const handleDuplicate = () => onDuplicate(exam);

  return (
    <Card 
      className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle 
            id={`${cardId}-title`}
            className="text-lg line-clamp-2"
          >
            {exam.title}
          </CardTitle>
          {getStatusBadge(exam.status)}
        </div>
        <p 
          id={`${cardId}-description`}
          className="text-sm text-gray-600 line-clamp-2"
        >
          {exam.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm" aria-label="Exam details">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate" aria-label={`Duration: ${exam.duration} minutes`}>
              {exam.duration} mins
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate" aria-label={`${exam.candidates} candidates enrolled`}>
              {exam.candidates} candidates
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1" aria-label="Exam metadata">
          <div className="truncate">
            Created: {new Date(exam.createdAt).toLocaleDateString()}
          </div>
          <div className="truncate">
            Completed: {exam.completedSubmissions}/{exam.candidates}
          </div>
        </div>

        <div 
          className="flex gap-2 pt-2" 
          role="group" 
          aria-label={ARIA_LABELS.dashboard.examActions}
        >
          <ViewExamModal 
            exam={exam}
            trigger={
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 min-w-0"
                aria-label={`View details for ${exam.title}`}
              >
                <Eye className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">View</span>
              </Button>
            }
          />
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleEdit}
            className="flex-shrink-0"
            aria-label={`Edit ${exam.title}`}
          >
            <Edit className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDuplicate}
            className="flex-shrink-0"
            aria-label={`Duplicate ${exam.title}`}
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Duplicate</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ExamCard.displayName = 'ExamCard';

export default ExamCard;
