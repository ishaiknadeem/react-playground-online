
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code2, Clock, Trophy, Search, Filter, Play, Star, TrendingUp, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: number;
  description: string;
  solved?: boolean;
  attempts?: number;
}

const mockProblems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    timeEstimate: 15,
    description: 'Given an array of integers, return indices of two numbers that add up to a target.',
    solved: true,
    attempts: 2
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    category: 'String',
    timeEstimate: 10,
    description: 'Write a function that reverses a string.',
    solved: true,
    attempts: 1
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Medium',
    category: 'Algorithm',
    timeEstimate: 25,
    description: 'Implement binary search in a sorted array.',
    attempts: 1
  },
  {
    id: 'react-counter',
    title: 'React Counter Component',
    difficulty: 'Easy',
    category: 'React',
    timeEstimate: 20,
    description: 'Create a React counter with increment, decrement, and reset functionality.',
    solved: true,
    attempts: 1
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Array',
    timeEstimate: 30,
    description: 'Given intervals, merge all overlapping intervals.',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    timeEstimate: 15,
    description: 'Determine if the input string has valid parentheses.',
  }
];

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const filteredProblems = mockProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const solvedCount = mockProblems.filter(p => p.solved).length;
  const totalCount = mockProblems.length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/candidate-login');
  };

  const handleStartProblem = (problemId: string) => {
    navigate(`/practice/problem?id=${problemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Code2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">CodePractice</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                  <p className="text-2xl font-bold text-green-600">{solvedCount}/{totalCount}</p>
                </div>
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round((solvedCount / totalCount) * 100)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-purple-600">7</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Practice Time</p>
                  <p className="text-2xl font-bold text-orange-600">2.5h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Array">Array</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Algorithm">Algorithm</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="Stack">Stack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline">{problem.category}</Badge>
                      {problem.solved && (
                        <Badge className="bg-green-100 text-green-800">✓ Solved</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{problem.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>~{problem.timeEstimate} min</span>
                      </div>
                      {problem.attempts && (
                        <div>
                          <span>Attempts: {problem.attempts}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleStartProblem(problem.id)}
                    className="ml-4"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {problem.solved ? 'Practice Again' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
