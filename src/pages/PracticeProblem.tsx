
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ExamInterface from '@/components/exam/ExamInterface';
import RelatedProblems from '@/components/practice/RelatedProblems';
import { practiceApi } from '@/services/practiceApi';
import { useQuery } from '@tanstack/react-query';

const PracticeProblem = () => {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('id');
  const pathId = searchParams.get('path');
  const navigate = useNavigate();
  const [startTime] = useState<Date>(new Date());
  const [showRelated, setShowRelated] = useState(false);

  const { data: question, isLoading, error } = useQuery({
    queryKey: ['practice-question', problemId],
    queryFn: () => practiceApi.getQuestion(problemId!),
    enabled: !!problemId,
  });

  const { data: allQuestions = [] } = useQuery({
    queryKey: ['practice-questions'],
    queryFn: practiceApi.getQuestions,
  });

  // Generate related problems based on tags and category
  const relatedProblems = React.useMemo(() => {
    if (!question || !allQuestions.length) return [];
    
    return allQuestions
      .filter(q => q.id !== problemId)
      .map(q => {
        // Calculate similarity score based on shared tags and category
        const sharedTags = q.tags.filter(tag => question.tags.includes(tag)).length;
        const categoryMatch = q.category === question.category ? 30 : 0;
        const tagScore = (sharedTags / Math.max(question.tags.length, q.tags.length)) * 70;
        const similarityScore = Math.round(categoryMatch + tagScore);
        
        return {
          id: q.id,
          title: q.title,
          difficulty: q.difficulty,
          category: q.category,
          similarityScore,
          solved: q.solved || false,
          timeEstimate: q.timeEstimate,
          tags: q.tags
        };
      })
      .filter(q => q.similarityScore > 20)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);
  }, [question, allQuestions, problemId]);

  const handleSubmit = async (code: any, testResults: any, tabSwitchData: any) => {
    console.log('Practice submission:', { problemId, code, testResults, tabSwitchData });
    
    if (problemId && code.javascript) {
      try {
        await practiceApi.submitSolution(problemId, code.javascript, 'javascript');
        setShowRelated(true); // Show related problems after submission
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

  const handleRelatedProblemClick = (relatedProblemId: string) => {
    navigate(`/practice/problem?id=${relatedProblemId}`);
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
      
      {/* Related Problems - shown after submission or can be toggled */}
      {(showRelated || relatedProblems.length > 0) && (
        <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-40">
          <RelatedProblems
            currentProblemId={problemId}
            relatedProblems={relatedProblems}
            onProblemClick={handleRelatedProblemClick}
          />
        </div>
      )}
    </div>
  );
};

export default PracticeProblem;
