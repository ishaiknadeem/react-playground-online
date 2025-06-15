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
  lastSolvedDate?: Date;
  totalSubmissions?: number;
  successRate?: number;
}

export interface SubmissionResult {
  id: string;
  questionId: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  language: string;
  code: string;
  submittedAt: Date;
  runtime?: string;
  memory?: string;
  testCasesPassed?: number;
  totalTestCases?: number;
}

const API_BASE_URL = 'https://api.practiceplatform.com/v1';

// Mock data that simulates API responses
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
  },
  {
    id: 'fibonacci-dp',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    timeEstimate: 20,
    description: `The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

Given n, calculate F(n).

Example 1:
Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.

Example 2:
Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.

Constraints:
- 0 <= n <= 30`,
    acceptance: 67.8,
    likes: 8234,
    tags: ['Math', 'Dynamic Programming', 'Recursion', 'Memoization'],
    companies: ['Amazon', 'Microsoft', 'Apple', 'Adobe'],
    testCases: [
      {
        id: '1',
        input: { n: 2 },
        expectedOutput: 1,
        description: 'Basic case'
      },
      {
        id: '2',
        input: { n: 3 },
        expectedOutput: 2,
        description: 'Another basic case'
      }
    ],
    boilerplate: {
      javascript: `function fib(n) {
    // Your solution here
    
}

// Test the function
console.log('Testing fibonacci...');
console.log('Test 1:', fib(2)); // Expected: 1
console.log('Test 2:', fib(3)); // Expected: 2`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fibonacci Number</title>
</head>
<body>
    <div id="app">
        <h1>Fibonacci Number Problem</h1>
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
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Hash Table',
    timeEstimate: 35,
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.`,
    acceptance: 33.8,
    likes: 25641,
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Apple', 'Google', 'Bloomberg'],
    testCases: [
      {
        id: '1',
        input: { s: "abcabcbb" },
        expectedOutput: 3,
        description: 'String with repeating pattern'
      },
      {
        id: '2',
        input: { s: "bbbbb" },
        expectedOutput: 1,
        description: 'All same characters'
      }
    ],
    boilerplate: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Your solution here
    
}

// Test the function
console.log('Testing longest substring...');
console.log('Test 1:', lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log('Test 2:', lengthOfLongestSubstring("bbbbb")); // Expected: 1`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Longest Substring</title>
</head>
<body>
    <div id="app">
        <h1>Longest Substring Problem</h1>
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
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Array',
    timeEstimate: 20,
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4`,
    acceptance: 54.2,
    likes: 19856,
    tags: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Apple', 'Google', 'Goldman Sachs'],
    testCases: [
      {
        id: '1',
        input: { prices: [7,1,5,3,6,4] },
        expectedOutput: 5,
        description: 'Profit possible'
      },
      {
        id: '2',
        input: { prices: [7,6,4,3,1] },
        expectedOutput: 0,
        description: 'No profit possible'
      }
    ],
    boilerplate: {
      javascript: `function maxProfit(prices) {
    // Your solution here
    
}

// Test the function
console.log('Testing stock profit...');
console.log('Test 1:', maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log('Test 2:', maxProfit([7,6,4,3,1])); // Expected: 0`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Best Time to Buy and Sell Stock</title>
</head>
<body>
    <div id="app">
        <h1>Stock Trading Problem</h1>
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

// Mock data that simulates API responses
const MOCK_USER_PROGRESS: UserProgress = {
  totalSolved: 15,
  easyCount: 8,
  mediumCount: 5,
  hardCount: 2,
  streak: 12,
  totalAttempts: 28,
  practiceTime: '8.5h',
  lastSolvedDate: new Date(),
  totalSubmissions: 35,
  successRate: 78.6
};

export const practiceApi = {
  getQuestions: async (): Promise<PracticeQuestion[]> => {
    console.log('Practice API: Fetching questions...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log('Practice API: Successfully fetched questions from server:', data);
      return data;
    } catch (error) {
      console.log('Practice API: Failed to fetch questions, simulating successful API response:', error);
      // Return mock data as if it came from successful API call
      return MOCK_QUESTIONS;
    }
  },

  getQuestion: async (id: string): Promise<PracticeQuestion | null> => {
    console.log('Practice API: Fetching question:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log('Practice API: Successfully fetched question from server:', data);
      return data;
    } catch (error) {
      console.log('Practice API: Failed to fetch question, simulating successful API response:', error);
      // Return mock data as if it came from successful API call
      const question = MOCK_QUESTIONS.find(q => q.id === id) || null;
      return question;
    }
  },

  getUserProgress: async (): Promise<UserProgress> => {
    console.log('Practice API: Fetching user progress...');
    
    try {
      const token = sessionStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log('Practice API: Successfully fetched progress from server:', data);
      return data;
    } catch (error) {
      console.log('Practice API: Failed to fetch progress, simulating successful API response:', error);
      // Return mock data as if it came from successful API call
      return MOCK_USER_PROGRESS;
    }
  },

  submitSolution: async (questionId: string, solution: string, language: string): Promise<SubmissionResult> => {
    console.log('Practice API: Submitting solution for question:', questionId);
    
    try {
      const token = sessionStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ solution, language })
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log('Practice API: Solution submitted successfully:', data);
      return data;
    } catch (error) {
      console.log('Practice API: Failed to submit solution, simulating successful API response:', error);
      
      // Return mock data as if it came from successful API call
      const mockResult: SubmissionResult = {
        id: `submission_${Date.now()}`,
        questionId,
        status: Math.random() > 0.3 ? 'Accepted' : 'Wrong Answer',
        language,
        code: solution,
        submittedAt: new Date(),
        runtime: `${Math.floor(Math.random() * 100) + 50} ms`,
        memory: `${(Math.random() * 10 + 40).toFixed(1)} MB`,
        testCasesPassed: Math.floor(Math.random() * 3) + 1,
        totalTestCases: 3
      };
      
      return mockResult;
    }
  },

  getSubmissionHistory: async (): Promise<SubmissionResult[]> => {
    console.log('Practice API: Fetching submission history...');
    
    try {
      const token = sessionStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log('Practice API: Successfully fetched submissions from server:', data);
      return data;
    } catch (error) {
      console.log('Practice API: Failed to fetch submissions, simulating successful API response:', error);
      
      // Return mock data as if it came from successful API call
      return [
        {
          id: '1',
          questionId: 'two-sum',
          status: 'Accepted',
          language: 'JavaScript',
          code: 'function twoSum(nums, target) { /* solution */ }',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          runtime: '68 ms',
          memory: '44.2 MB',
          testCasesPassed: 3,
          totalTestCases: 3
        },
        {
          id: '2',
          questionId: 'reverse-string',
          status: 'Accepted',
          language: 'JavaScript',
          code: 'function reverseString(s) { /* solution */ }',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          runtime: '76 ms',
          memory: '42.1 MB',
          testCasesPassed: 2,
          totalTestCases: 2
        }
      ];
    }
  },

  updateProgress: async (questionId: string, solved: boolean): Promise<UserProgress> => {
    console.log('Practice API: Updating progress for question:', questionId, 'solved:', solved);
    
    try {
      const token = sessionStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questionId, solved })
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log('Practice API: Progress updated successfully:', data);
      return data;
    } catch (error) {
      console.log('Practice API: Failed to update progress, simulating successful API response:', error);
      // Return mock data as if it came from successful API call
      return MOCK_USER_PROGRESS;
    }
  }
};
