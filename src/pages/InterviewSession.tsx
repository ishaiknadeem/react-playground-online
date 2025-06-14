
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Timer, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import ExamInterface from '@/components/exam/ExamInterface';
import { practiceApi } from '@/services/practiceApi';
import { useQuery } from '@tanstack/react-query';

interface SessionConfig {
  company?: string;
  duration: number;
  difficulty: string;
  categories: string[];
}

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, config } = location.state as { sessionId: string; config: SessionConfig } || {};
  
  const [timeLeft, setTimeLeft] = useState((config?.duration || 60) * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(1);
  const [totalProblems] = useState(2);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('two-sum');

  // Get questions for the interview session
  const { data: questions = [] } = useQuery({
    queryKey: ['practice-questions'],
    queryFn: practiceApi.getQuestions,
  });

  const { data: currentQuestion } = useQuery({
    queryKey: ['practice-question', currentQuestionId],
    queryFn: () => practiceApi.getQuestion(currentQuestionId),
    enabled: !!currentQuestionId && sessionStarted,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleEndSession();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setIsActive(true);
    setSessionStarted(true);
    // Set first question based on difficulty and categories
    const filteredQuestions = questions.filter(q => 
      config?.difficulty === 'Mixed' || q.difficulty === config?.difficulty
    );
    if (filteredQuestions.length > 0) {
      setCurrentQuestionId(filteredQuestions[0].id);
    }
  };

  const handlePauseSession = () => {
    setIsActive(false);
  };

  const handleEndSession = () => {
    navigate('/practice');
  };

  const handleSubmit = async (code: any, testResults: any, tabSwitchData: any) => {
    console.log('Interview session submission:', { currentQuestionId, code, testResults });
    
    if (currentProblem < totalProblems) {
      // Move to next problem
      const filteredQuestions = questions.filter(q => 
        config?.difficulty === 'Mixed' || q.difficulty === config?.difficulty
      );
      
      if (filteredQuestions.length > currentProblem) {
        setCurrentQuestionId(filteredQuestions[currentProblem].id);
      }
      setCurrentProblem(currentProblem + 1);
    } else {
      // End session
      handleEndSession();
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <p className="mb-4">No session configuration found.</p>
          <Button onClick={() => navigate('/practice')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Button 
                onClick={() => navigate('/practice')} 
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Session
              </Button>
              
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Interview Session</span>
              </div>
              
              <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono text-lg">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {config.company ? `${config.company} Interview Session` : 'Technical Interview Session'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <Timer className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{config.duration} Minutes</p>
                  <p className="text-sm text-gray-300">Duration</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{totalProblems} Problems</p>
                  <p className="text-sm text-gray-300">To Solve</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <RotateCcw className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{config.difficulty}</p>
                  <p className="text-sm text-gray-300">Difficulty</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  This interview session will simulate a real technical interview environment.
                  You'll have {config.duration} minutes to solve {totalProblems} problems.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleStartSession} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-5 h-5 mr-2" />
                    Start Session
                  </Button>
                  <Button onClick={() => navigate('/practice')} variant="outline" size="lg">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading problem...</p>
        </div>
      </div>
    );
  }

  const examQuestion = {
    ...currentQuestion,
    timeLimit: Math.floor(timeLeft / 60),
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleEndSession} 
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              End Session
            </Button>
            
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">Interview Session</span>
            </div>
            
            {config.company && (
              <Badge className="bg-purple-600 text-white">
                {config.company}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handlePauseSession} variant="outline" size="sm" className="text-white border-gray-600">
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            
            <div className="text-white text-sm">
              Problem {currentProblem} of {totalProblems}
            </div>
            
            <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-16">
        <ExamInterface 
          question={examQuestion}
          startTime={new Date()}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default InterviewSession;
