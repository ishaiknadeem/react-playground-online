
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { type ExamDetails } from '@/services/api';

interface MyExamsStatsProps {
  exams: ExamDetails[];
}

const MyExamsStats: React.FC<MyExamsStatsProps> = ({ exams }) => {
  const activeCount = exams?.filter(e => e.status === 'active').length || 0;
  const draftCount = exams?.filter(e => e.status === 'draft').length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {activeCount}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {draftCount}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyExamsStats;
