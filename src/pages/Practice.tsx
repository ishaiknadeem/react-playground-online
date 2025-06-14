
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Clock, Trophy, Search, Play, Star, TrendingUp, LogOut, User, Target, Zap, Award, Calendar, Heart, Timer, BookOpen, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { practiceApi, PracticeQuestion, UserProgress } from '@/services/practiceApi';
import { useQuery } from '@tanstack/react-query';
import AchievementBadges, { Achievement } from '@/components/practice/AchievementBadges';
import LearningPaths, { LearningPath } from '@/components/practice/LearningPaths';
import InterviewPrepMode from '@/components/practice/InterviewPrepMode';

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['practice-questions'],
    queryFn: practiceApi.getQuestions,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress'],
    queryFn: practiceApi.getUserProgress,
  });

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: 'first-solve',
      title: 'First Steps',
      description: 'Solved your first problem',
      icon: <Star className="w-4 h-4" />,
      earned: (userProgress?.totalSolved || 0) > 0,
      category: 'solving'
    },
    {
      id: 'week-streak',
      title: 'Consistent Learner',
      description: 'Maintained a 7-day streak',
      icon: <Zap className="w-4 h-4" />,
      earned: (userProgress?.streak || 0) >= 7,
      category: 'streak'
    },
    {
      id: 'ten-problems',
      title: 'Problem Solver',
      description: 'Solved 10 problems',
      icon: <Trophy className="w-4 h-4" />,
      earned: (userProgress?.totalSolved || 0) >= 10,
      progress: userProgress?.totalSolved || 0,
      maxProgress: 10,
      category: 'solving'
    }
  ];

  // Mock learning paths data
  const learningPaths: LearningPath[] = [
    {
      id: 'arrays-basics',
      title: 'Arrays & Strings',
      description: 'Master the basics of arrays and string manipulation',
      difficulty: 'Beginner',
      estimatedTime: '2-3 weeks',
      problems: ['two-sum', 'reverse-string', 'valid-parentheses'],
      completedProblems: ['two-sum', 'reverse-string'],
      category: 'Data Structures'
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming',
      description: 'Learn to solve complex optimization problems',
      difficulty: 'Advanced',
      estimatedTime: '4-6 weeks',
      problems: ['fibonacci', 'coin-change', 'longest-subsequence'],
      completedProblems: [],
      category: 'Algorithms'
    }
  ];

  const filteredAndSortedQuestions = React.useMemo(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });

    // Sort questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        case 'popularity':
        default:
          return (b.likes || 0) - (a.likes || 0);
      }
    });

    return filtered;
  }, [questions, searchTerm, difficultyFilter, categoryFilter, sortBy]);

  const categories = React.useMemo(() => {
    const cats = new Set(questions.map(q => q.category));
    return Array.from(cats);
  }, [questions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50 border border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border border-amber-200';
      case 'Hard': return 'text-red-600 bg-red-50 border border-red-200';
      default: return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/candidate-login');
  };

  const handleStartProblem = (questionId: string) => {
    navigate(`/practice/problem?id=${questionId}`);
  };

  const handleStartPath = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (path && path.problems.length > 0) {
      const nextProblem = path.problems.find(p => !path.completedProblems.includes(p)) || path.problems[0];
      navigate(`/practice/problem?id=${nextProblem}&path=${pathId}`);
    }
  };

  const handleStartInterviewSession = (sessionId: string, config: any) => {
    console.log('Starting interview session:', sessionId, config);
    navigate('/practice/interview-session', { state: { sessionId, config } });
  };

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Minimal Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-slate-900">Practice</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>{userProgress?.streak || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <span>{userProgress?.totalSolved || 0}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="problems" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="problems" className="text-sm">Problems</TabsTrigger>
            <TabsTrigger value="paths" className="text-sm">Paths</TabsTrigger>
            <TabsTrigger value="interview" className="text-sm">Interview</TabsTrigger>
            <TabsTrigger value="progress" className="text-sm">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{userProgress?.totalSolved || 0}</p>
                    <p className="text-xs text-slate-600">Solved</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{userProgress?.streak || 0}</p>
                    <p className="text-xs text-slate-600">Day Streak</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{questions.length}</p>
                    <p className="text-xs text-slate-600">Available</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{userProgress?.practiceTime || '0h'}</p>
                    <p className="text-xs text-slate-600">Practice Time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 border-slate-200"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-32 bg-white/80">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40 bg-white/80">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className="space-y-3">
              {filteredAndSortedQuestions.map((question) => (
                <div key={question.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-medium text-slate-900 truncate">{question.title}</h3>
                        <Badge className={`${getDifficultyColor(question.difficulty)} text-xs px-2 py-1`}>
                          {question.difficulty}
                        </Badge>
                        {question.solved && (
                          <Badge className="text-emerald-600 bg-emerald-50 border border-emerald-200 text-xs">
                            ✓ Solved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-slate-600 mb-3 text-sm line-clamp-2">{question.description.split('\n')[0]}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>~{question.timeEstimate}m</span>
                        </div>
                        <span>{question.category}</span>
                        {question.likes && (
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{question.likes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartProblem(question.id)}
                      size="sm"
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </div>
              ))}

              {filteredAndSortedQuestions.length === 0 && (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No problems found</h3>
                  <p className="text-slate-600">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-6">
            <LearningPaths paths={learningPaths} onStartPath={handleStartPath} />
          </TabsContent>

          <TabsContent value="interview" className="space-y-6">
            <InterviewPrepMode onStartSession={handleStartInterviewSession} />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900">Easy Problems</h3>
                  <span className="text-sm text-slate-600">{userProgress?.easyCount || 0} solved</span>
                </div>
                <Progress value={(userProgress?.easyCount || 0) / questions.filter(q => q.difficulty === 'Easy').length * 100} className="h-2" />
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900">Medium Problems</h3>
                  <span className="text-sm text-slate-600">{userProgress?.mediumCount || 0} solved</span>
                </div>
                <Progress value={(userProgress?.mediumCount || 0) / questions.filter(q => q.difficulty === 'Medium').length * 100} className="h-2" />
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900">Hard Problems</h3>
                  <span className="text-sm text-slate-600">{userProgress?.hardCount || 0} solved</span>
                </div>
                <Progress value={(userProgress?.hardCount || 0) / questions.filter(q => q.difficulty === 'Hard').length * 100} className="h-2" />
              </div>
            </div>

            <AchievementBadges achievements={achievements} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Practice;
