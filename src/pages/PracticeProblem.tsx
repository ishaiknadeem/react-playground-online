
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ExamInterface from '@/components/exam/ExamInterface';
import { practiceApi } from '@/services/practiceApi';
import { useQuery } from '@tanstack/react-query';

const PracticeProblem = () => {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('id');
  const pathId = searchParams.get('path');
  const navigate = useNavigate();
  const [startTime] = useState<Date>(new Date());

  const { data: question, isLoading, error } = useQuery({
    queryKey: ['practice-question', problemId],
    queryFn: () => practiceApi.getQuestion(problemId!),
    enabled: !!problemId,
  });

  const handleSubmit = async (code: any, testResults: any, tabSwitchData: any) => {
    console.log('Practice submission:', { problemId, code, testResults, tabSwitchData });
    
    if (problemId && code.javascript) {
      try {
        await practiceApi.submitSolution(problemId, code.javascript, 'javascript');
      } catch (error) {
        console.error('Failed to submit solution:', error);
      }
    }
    
    // If this is part of a learning path, navigate to next problem
    if (pathId) {
      // In a real implementation, you'd get the next problem in the path
      navigate(`/practice?tab=paths&path=${pathId}`);
    } else {
      navigate('/practice');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error || !problemId || !question) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
          <p className="mb-4">The requested problem could not be loaded.</p>
          <Button onClick={() => navigate('/practice')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  // Convert PracticeQuestion to Question format for ExamInterface
  const examQuestion = {
    ...question,
    timeLimit: question.timeEstimate,
  };

  return (
    <div className="relative">
      {/* Practice Mode Header Overlay */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => navigate('/practice')} 
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            Practice Mode
          </div>
          {pathId && (
            <div className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              Learning Path
            </div>
          )}
        </div>
      </div>
      
      <ExamInterface 
        question={examQuestion}
        startTime={startTime}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PracticeProblem;
