
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import ExamInterface from '@/components/exam/ExamInterface';
import { Question } from '@/pages/Exam';

const PracticeProblem = () => {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('id');
  const navigate = useNavigate();
  const [startTime] = useState<Date>(new Date());

  const mockProblems: Record<string, Question> = {
    'two-sum': {
      id: 'two-sum',
      title: 'Two Sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
      difficulty: 'Easy',
      timeLimit: 30,
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
          description: 'Same values'
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
    },
    'react-counter': {
      id: 'react-counter',
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
      timeLimit: 30,
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
    }
  };

  const question = problemId ? mockProblems[problemId] : null;

  const handleSubmit = (code: any, testResults: any, tabSwitchData: any) => {
    console.log('Practice submission:', { problemId, code, testResults, tabSwitchData });
    // In a real app, you'd save the practice session results
    navigate('/practice');
  };

  if (!problemId || !question) {
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
        </div>
      </div>
      
      <ExamInterface 
        question={question}
        startTime={startTime}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PracticeProblem;
