
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Clock, Calendar } from 'lucide-react';
import { ExamDetails } from '@/services/api';

interface ViewExamModalProps {
  exam: ExamDetails;
  trigger?: React.ReactNode;
}

const ViewExamModal = ({ exam, trigger }: ViewExamModalProps) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {exam.title}
            {getStatusBadge(exam.status)}
          </DialogTitle>
          <DialogDescription>
            Exam details and statistics
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-600">{exam.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Duration: {exam.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Candidates: {exam.candidates}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Difficulty:</span>
                <div className="mt-1">{getDifficultyBadge(exam.difficulty)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Created by:</span>
                <div className="mt-1 text-sm font-medium">{exam.createdBy}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Completion Rate:</span>
                <div className="mt-1 text-sm font-medium">
                  {exam.completedSubmissions}/{exam.candidates} ({Math.round((exam.completedSubmissions / exam.candidates) * 100)}%)
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Quick Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{exam.candidates}</div>
                <div className="text-xs text-gray-600">Total Invited</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{exam.completedSubmissions}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{exam.candidates - exam.completedSubmissions}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewExamModal;
