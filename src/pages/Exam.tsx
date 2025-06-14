
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ExamStart from '@/components/exam/ExamStart';
import ExamInterface from '@/components/exam/ExamInterface';
import ExamSubmitted from '@/components/exam/ExamSubmitted';
import { useQuery } from '@tanstack/react-query';

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in minutes
  testCases: TestCase[];
  boilerplate: {
    javascript: string;
    html: string;
    css: string;
  };
}

export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
  isHidden?: boolean;
}

type ExamState = 'waiting' | 'started' | 'submitted';

const Exam = () => {
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('id');
  const [examState, setExamState] = useState<ExamState>('waiting');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);

  // Mock API call - replace with your actual API
  const { data: question, isLoading, error } = useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      console.log('Fetching question with ID:', questionId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock question data - replace with actual API call
      const mockQuestion: Question = {
        id: questionId || '1',
        title: 'Two Sum Problem',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        difficulty: 'Easy',
        timeLimit: 30, // 30 minutes
        testCases: [
          {
            id: '1',
            input: { nums: [2, 7, 11, 15], target: 9 },
            expectedOutput: [0, 1],
            description: 'Basic case'
          },
          {
            id: '2',
            input: { nums: [3, 2, 4], target: 6 },
            expectedOutput: [1, 2],
            description: 'Different indices'
          },
          {
            id: '3',
            input: { nums: [3, 3], target: 6 },
            expectedOutput: [0, 1],
            description: 'Same values',
            isHidden: true
          }
        ],
        boilerplate: {
          javascript: `function twoSum(nums, target) {
    // Your solution here
    
}

// Test the function
console.log('Testing twoSum function...');
console.log('Test 1:', twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log('Test 2:', twoSum([3,2,4], 6)); // Expected: [1,2]`,
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two Sum Solution</title>
</head>
<body>
    <div id="app">
        <h1>Two Sum Problem</h1>
        <p>Check the console for test results</p>
    </div>
</body>
</html>`,
          css: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f5f5f5;
}

#app {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`
        }
      };
      
      return mockQuestion;
    },
    enabled: !!questionId
  });

  const handleStartExam = () => {
    setExamState('started');
    setStartTime(new Date());
    console.log('Exam started at:', new Date().toISOString());
  };

  const handleSubmitExam = (code: any, testResults: any, tabSwitchData: any) => {
    setExamState('submitted');
    const endTime = new Date();
    const timeTaken = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 / 60 : 0;
    
    setSubmissionData({
      code,
      testResults,
      tabSwitchData,
      timeTaken: Math.round(timeTaken * 100) / 100,
      submittedAt: endTime.toISOString()
    });
    
    console.log('Exam submitted with tab tracking:', {
      questionId,
      code,
      testResults,
      tabSwitchData,
      timeTaken
    });
  };

  if (!questionId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Exam Link</h1>
          <p>No question ID provided in URL</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading exam question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Question</h1>
          <p>Could not load question with ID: {questionId}</p>
        </div>
      </div>
    );
  }

  if (examState === 'waiting') {
    return <ExamStart question={question} onStart={handleStartExam} />;
  }

  if (examState === 'submitted') {
    return <ExamSubmitted question={question} submissionData={submissionData} />;
  }

  return (
    <ExamInterface 
      question={question}
      startTime={startTime!}
      onSubmit={handleSubmitExam}
    />
  );
};

export default Exam;
