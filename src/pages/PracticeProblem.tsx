
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, BookOpen } from 'lucide-react';
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
      {/* Clean Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => navigate('/practice')} 
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="h-4 w-px bg-gray-300 hidden sm:block" />
            
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Practice</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {pathId && (
              <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium border border-purple-200">
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Learning Path</span>
                <span className="sm:hidden">Path</span>
              </div>
            )}
            
            <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200">
              <span className="hidden sm:inline">Practice Mode</span>
              <span className="sm:hidden">Practice</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add top padding to account for fixed header */}
      <div className="pt-16">
        <ExamInterface 
          question={examQuestion}
          startTime={startTime}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PracticeProblem;
