import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
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
  console.log('Exam component rendering...');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  console.log('Current search:', window.location.search);

  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('id');
  console.log('Question ID from URL params:', questionId);

  const [examState, setExamState] = useState<ExamState>('waiting');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);

  // Get auth state - will be null for guest users
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  // Mock API call - replace with your actual API
  const { data: question, isLoading, error } = useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      console.log('Fetching question with ID:', questionId);
      console.log('User authentication status:', isAuthenticated ? 'Authenticated' : 'Guest');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Different problems based on ID
      if (questionId === 'id234') {
        // React problem
        const reactQuestion: Question = {
          id: questionId,
          title: 'React Counter Component',
          description: `Create a React Counter component that:

1. Displays a counter starting at 0
2. Has an "Increment" button that increases the counter by 1
3. Has a "Decrement" button that decreases the counter by 1
4. Has a "Reset" button that sets the counter back to 0
5. The counter should not go below 0

Requirements:
- Use React hooks (useState)
- Export the component as default
- Use the exact button texts: "Increment", "Decrement", "Reset"
- Display the counter value in a span with id="counter-value"

Example:
Counter: 5
[Increment] [Decrement] [Reset]`,
          difficulty: 'Easy',
          timeLimit: 20, // 20 minutes
          testCases: [
            {
              id: '1',
              input: { action: 'increment', times: 3 },
              expectedOutput: 3,
              description: 'Increment 3 times should show 3'
            },
            {
              id: '2',
              input: { action: 'decrement', times: 2, initialValue: 5 },
              expectedOutput: 3,
              description: 'Decrement 2 times from 5 should show 3'
            },
            {
              id: '3',
              input: { action: 'reset', initialValue: 10 },
              expectedOutput: 0,
              description: 'Reset from any value should show 0'
            },
            {
              id: '4',
              input: { action: 'decrement', times: 5, initialValue: 2 },
              expectedOutput: 0,
              description: 'Counter should not go below 0',
              isHidden: true
            }
          ],
          boilerplate: {
            javascript: `import React, { useState } from 'react';

const Counter = () => {
  // Your code here
  
  return (
    <div>
      <p>Counter: <span id="counter-value">0</span></p>
      <button>Increment</button>
      <button>Decrement</button>
      <button>Reset</button>
    </div>
  );
};

export default Counter;`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Counter Component</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`,
            css: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f5f5f5;
}

#root {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}`
          }
        };
        return reactQuestion;
      } else {
        // JavaScript problem (existing)
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
      }
    },
    enabled: !!questionId
  });

  const handleStartExam = () => {
    setExamState('started');
    setStartTime(new Date());
    console.log('Exam started at:', new Date().toISOString());
    console.log('Started by:', isAuthenticated ? `User ${user?.email}` : 'Guest user');
  };

  const handleSubmitExam = async (code: any, testResults: any, tabSwitchData: any) => {
    setExamState('submitted');
    const endTime = new Date();
    const timeTaken = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 / 60 : 0;
    
    const submissionData = {
      code,
      testResults,
      tabSwitchData,
      timeTaken: Math.round(timeTaken * 100) / 100,
      submittedAt: endTime.toISOString(),
      submittedBy: isAuthenticated ? {
        userId: user?.id,
        email: user?.email,
        name: user?.name
      } : {
        type: 'guest',
        sessionId: sessionStorage.getItem('guestSessionId') || 'unknown'
      }
    };
    
    setSubmissionData(submissionData);
    
    // Submit proctoring data if available
    if (tabSwitchData.proctoringData) {
      try {
        const { proctoringApi } = await import('@/services/proctoringApi');
        await proctoringApi.submitProctoringData({
          examId: questionId!,
          webcamBlobs: tabSwitchData.proctoringData.webcamBlobs || [],
          screenBlobs: tabSwitchData.proctoringData.screenBlobs || [],
          violations: tabSwitchData.proctoringData.violations || [],
          submittedAt: endTime.toISOString(),
          submittedBy: submissionData.submittedBy
        });
        console.log('Proctoring data submitted successfully');
      } catch (error) {
        console.error('Failed to submit proctoring data:', error);
      }
    }
    
    console.log('Exam submitted:', {
      questionId,
      userType: isAuthenticated ? 'authenticated' : 'guest',
      code,
      testResults,
      tabSwitchData,
      timeTaken,
      proctoringDataIncluded: !!tabSwitchData.proctoringData
    });
  };

  // Generate a guest session ID for tracking if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && !sessionStorage.getItem('guestSessionId')) {
      const guestSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('guestSessionId', guestSessionId);
      console.log('Generated guest session ID:', guestSessionId);
    }
  }, [isAuthenticated]);

  if (!questionId) {
    console.log('No question ID provided in URL');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Exam Link</h1>
          <p>No question ID provided in URL</p>
          <p className="text-sm text-gray-400 mt-2">Expected format: /exam?id=questionId</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('Loading question data...');
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
    console.error('Error loading question:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Question</h1>
          <p>Could not load question with ID: {questionId}</p>
          <p className="text-sm text-gray-400 mt-2">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  console.log('Rendering exam state:', examState);

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
