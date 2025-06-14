import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Clock, Trophy, Search, Filter, Play, Star, TrendingUp, LogOut, User, Target, Zap, Award, Calendar, Heart, Timer, BookOpen, Users } from 'lucide-react';
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
  const [companyFilter, setCompanyFilter] = useState('all');
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
      title: 'Arrays & Strings Fundamentals',
      description: 'Master the basics of arrays and string manipulation',
      difficulty: 'Beginner',
      estimatedTime: '2-3 weeks',
      problems: ['two-sum', 'reverse-string', 'valid-parentheses'],
      completedProblems: ['two-sum', 'reverse-string'],
      category: 'Data Structures'
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming Mastery',
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
      const matchesCompany = companyFilter === 'all' || 
                            (question.companies && question.companies.includes(companyFilter));
      
      return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany;
    });

    // Sort questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        case 'acceptance':
          return (b.acceptance || 0) - (a.acceptance || 0);
        case 'popularity':
        default:
          return (b.likes || 0) - (a.likes || 0);
      }
    });

    return filtered;
  }, [questions, searchTerm, difficultyFilter, categoryFilter, companyFilter, sortBy]);

  const categories = React.useMemo(() => {
    const cats = new Set(questions.map(q => q.category));
    return Array.from(cats);
  }, [questions]);

  const companies = React.useMemo(() => {
    const comps = new Set(questions.flatMap(q => q.companies || []));
    return Array.from(comps);
  }, [questions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    // In a real implementation, this would start a timed interview session
    navigate('/practice/interview-session', { state: { sessionId, config } });
  };

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Code2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">CodePractice</h1>
              <Badge variant="outline" className="hidden md:flex">
                Practice Platform
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{userProgress?.streak || 0} day streak</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>{userProgress?.totalSolved || 0} solved</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="problems" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="space-y-6">
            {/* Achievements Section */}
            <AchievementBadges achievements={achievements} />

            {/* Filters Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search problems, tags, or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-full sm:w-48">
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
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                        <SelectItem value="acceptance">Acceptance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problems List */}
            <div className="grid gap-4">
              {filteredAndSortedQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{question.title}</h3>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">{question.category}</Badge>
                          {question.solved && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              ✓ Solved
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{question.description.split('\n')[0]}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>~{question.timeEstimate} min</span>
                          </div>
                          {question.acceptance && (
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{question.acceptance}% acceptance</span>
                            </div>
                          )}
                          {question.likes && (
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{question.likes.toLocaleString()}</span>
                            </div>
                          )}
                          {question.attempts && (
                            <div>
                              <span>Attempts: {question.attempts}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {question.companies && question.companies.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Asked by:</span>
                            <div className="flex flex-wrap gap-1">
                              {question.companies.slice(0, 3).map(company => (
                                <Badge key={company} variant="outline" className="text-xs">
                                  {company}
                                </Badge>
                              ))}
                              {question.companies.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{question.companies.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => handleStartProblem(question.id)}
                        className="ml-4 shrink-0"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {question.solved ? 'Practice Again' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredAndSortedQuestions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                  </CardContent>
                </Card>
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
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                      <p className="text-2xl font-bold text-green-600">{userProgress?.totalSolved || 0}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Current Streak</p>
                      <p className="text-2xl font-bold text-orange-600">{userProgress?.streak || 0} days</p>
                    </div>
                    <Zap className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                      <p className="text-2xl font-bold text-purple-600">{userProgress?.totalAttempts || 0}</p>
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
                      <p className="text-2xl font-bold text-blue-600">{userProgress?.practiceTime || '0h'}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Progress by Difficulty</CardTitle>
                <CardDescription>Track your solving progress across different difficulty levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-600 font-medium">Easy</span>
                      <span>{userProgress?.easyCount || 0} solved</span>
                    </div>
                    <Progress value={(userProgress?.easyCount || 0) / questions.filter(q => q.difficulty === 'Easy').length * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-yellow-600 font-medium">Medium</span>
                      <span>{userProgress?.mediumCount || 0} solved</span>
                    </div>
                    <Progress value={(userProgress?.mediumCount || 0) / questions.filter(q => q.difficulty === 'Medium').length * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-red-600 font-medium">Hard</span>
                      <span>{userProgress?.hardCount || 0} solved</span>
                    </div>
                    <Progress value={(userProgress?.hardCount || 0) / questions.filter(q => q.difficulty === 'Hard').length * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Practice;
