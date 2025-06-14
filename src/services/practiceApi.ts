
export interface PracticeQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: number;
  description: string;
  solved?: boolean;
  attempts?: number;
  acceptance?: number;
  likes?: number;
  tags: string[];
  companies?: string[];
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
}

export interface UserProgress {
  totalSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  streak: number;
  totalAttempts: number;
  practiceTime: string;
}

const API_BASE_URL = 'https://api.practiceplatform.com/v1';

const MOCK_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    timeEstimate: 15,
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
    solved: true,
    attempts: 2,
    acceptance: 49.1,
    likes: 15432,
    tags: ['Array', 'Hash Table'],
    companies: ['Amazon', 'Google', 'Microsoft'],
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
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'String',
    timeEstimate: 10,
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

Example 2:
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]

Constraints:
- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
    solved: true,
    attempts: 1,
    acceptance: 71.8,
    likes: 4523,
    tags: ['Two Pointers', 'String'],
    companies: ['Apple', 'Facebook'],
    testCases: [
      {
        id: '1',
        input: { s: ["h","e","l","l","o"] },
        expectedOutput: ["o","l","l","e","h"],
        description: 'Basic string reversal'
      }
    ],
    boilerplate: {
      javascript: `function reverseString(s) {
    // Your solution here
    
}

// Test the function
console.log('Testing reverseString function...');
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log('Test 1:', test1); // Expected: ["o","l","l","e","h"]`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reverse String</title>
</head>
<body>
    <div id="app">
        <h1>Reverse String Problem</h1>
        <p>Check the console for test results</p>
    </div>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f5f5f5;
}`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Medium',
    category: 'Algorithm',
    timeEstimate: 25,
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4

Example 2:
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1

Constraints:
- 1 <= nums.length <= 10^4
- -10^4 < nums[i], target < 10^4
- All the integers in nums are unique.
- nums is sorted in ascending order.`,
    attempts: 1,
    acceptance: 54.7,
    likes: 8234,
    tags: ['Array', 'Binary Search'],
    companies: ['Google', 'Microsoft', 'Amazon'],
    testCases: [
      {
        id: '1',
        input: { nums: [-1,0,3,5,9,12], target: 9 },
        expectedOutput: 4,
        description: 'Target exists in array'
      },
      {
        id: '2',
        input: { nums: [-1,0,3,5,9,12], target: 2 },
        expectedOutput: -1,
        description: 'Target does not exist'
      }
    ],
    boilerplate: {
      javascript: `function search(nums, target) {
    // Your solution here
    
}

// Test the function
console.log('Testing binary search...');
console.log('Test 1:', search([-1,0,3,5,9,12], 9)); // Expected: 4
console.log('Test 2:', search([-1,0,3,5,9,12], 2)); // Expected: -1`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Binary Search</title>
</head>
<body>
    <div id="app">
        <h1>Binary Search Problem</h1>
        <p>Check the console for test results</p>
    </div>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f5f5f5;
}`
    }
  },
  {
    id: 'react-counter',
    title: 'React Counter Component',
    difficulty: 'Easy',
    category: 'React',
    timeEstimate: 20,
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
    solved: true,
    attempts: 1,
    acceptance: 89.2,
    likes: 2134,
    tags: ['React', 'State Management'],
    companies: ['Netflix', 'Airbnb'],
    testCases: [
      {
        id: '1',
        input: { action: 'increment', times: 3 },
        expectedOutput: 3,
        description: 'Increment 3 times should show 3'
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
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Array',
    timeEstimate: 30,
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example 1:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Example 2:
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

Constraints:
- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= starti <= endi <= 10^4`,
    acceptance: 42.3,
    likes: 12543,
    tags: ['Array', 'Sorting'],
    companies: ['Facebook', 'Google', 'LinkedIn'],
    testCases: [
      {
        id: '1',
        input: { intervals: [[1,3],[2,6],[8,10],[15,18]] },
        expectedOutput: [[1,6],[8,10],[15,18]],
        description: 'Basic merge case'
      }
    ],
    boilerplate: {
      javascript: `function merge(intervals) {
    // Your solution here
    
}

// Test the function
console.log('Testing merge intervals...');
console.log('Test 1:', merge([[1,3],[2,6],[8,10],[15,18]])); // Expected: [[1,6],[8,10],[15,18]]`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merge Intervals</title>
</head>
<body>
    <div id="app">
        <h1>Merge Intervals Problem</h1>
        <p>Check the console for test results</p>
    </div>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f5f5f5;
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    timeEstimate: 15,
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
    acceptance: 40.1,
    likes: 18234,
    tags: ['String', 'Stack'],
    companies: ['Amazon', 'Microsoft', 'Google'],
    testCases: [
      {
        id: '1',
        input: { s: "()" },
        expectedOutput: true,
        description: 'Simple valid case'
      },
      {
        id: '2',
        input: { s: "()[]{}" },
        expectedOutput: true,
        description: 'Multiple valid brackets'
      },
      {
        id: '3',
        input: { s: "(]" },
        expectedOutput: false,
        description: 'Invalid case'
      }
    ],
    boilerplate: {
      javascript: `function isValid(s) {
    // Your solution here
    
}

// Test the function
console.log('Testing valid parentheses...');
console.log('Test 1:', isValid("()")); // Expected: true
console.log('Test 2:', isValid("()[]{}")); // Expected: true
console.log('Test 3:', isValid("(]")); // Expected: false`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Valid Parentheses</title>
</head>
<body>
    <div id="app">
        <h1>Valid Parentheses Problem</h1>
        <p>Check the console for test results</p>
    </div>
</body>
</html>`,
      css: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f5f5f5;
}`
    }
  }
];

const MOCK_USER_PROGRESS: UserProgress = {
  totalSolved: 3,
  easyCount: 3,
  mediumCount: 0,
  hardCount: 0,
  streak: 2,
  totalAttempts: 7,
  practiceTime: '2.5h'
};

export const practiceApi = {
  getQuestions: async (): Promise<PracticeQuestion[]> => {
    console.log('API: Fetching practice questions...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      console.log('API: Successfully fetched questions from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch questions, using fallback data:', error);
      return MOCK_QUESTIONS;
    }
  },

  getQuestion: async (id: string): Promise<PracticeQuestion | null> => {
    console.log('API: Fetching question:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch question');
      
      const data = await response.json();
      console.log('API: Successfully fetched question from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch question, using fallback data:', error);
      return MOCK_QUESTIONS.find(q => q.id === id) || null;
    }
  },

  getUserProgress: async (): Promise<UserProgress> => {
    console.log('API: Fetching user progress...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/progress`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      console.log('API: Successfully fetched progress from server:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to fetch progress, using fallback data:', error);
      return MOCK_USER_PROGRESS;
    }
  },

  submitSolution: async (questionId: string, solution: string, language: string): Promise<any> => {
    console.log('API: Submitting solution for question:', questionId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solution, language })
      });
      
      if (!response.ok) throw new Error('Failed to submit solution');
      
      const data = await response.json();
      console.log('API: Solution submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Failed to submit solution:', error);
      return { success: false, error: 'Submission failed' };
    }
  }
};
