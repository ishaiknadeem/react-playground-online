
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, BookOpen, Clock } from 'lucide-react';
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error || !problemId || !question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Problem Not Found</h1>
          <p className="text-gray-600 mb-6">The requested problem could not be loaded.</p>
          <Button onClick={() => navigate('/practice')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
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
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/practice')} 
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Practice</span>
                <span className="sm:hidden">Back</span>
              </Button>
              
              <div className="h-5 w-px bg-gray-200 hidden sm:block" />
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-medium text-gray-900">{question.title}</h1>
                  <p className="text-xs text-gray-500">Practice Mode</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {question.timeEstimate && (
                <div className="flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Est. </span>
                  <span>{question.timeEstimate} min</span>
                </div>
              )}
              
              {pathId && (
                <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm border border-purple-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Learning Path</span>
                  <span className="sm:hidden">Path</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        <ExamInterface 
          question={examQuestion}
          startTime={startTime}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default PracticeProblem;
