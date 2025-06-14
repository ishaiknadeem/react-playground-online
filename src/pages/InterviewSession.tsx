
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Timer, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

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
  
  const [timeLeft, setTimeLeft] = useState((config?.duration || 60) * 60); // Convert minutes to seconds
  const [isActive, setIsActive] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(1);
  const [totalProblems] = useState(2);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Handle session timeout
      console.log('Session timeout');
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
  };

  const handlePauseSession = () => {
    setIsActive(false);
  };

  const handleEndSession = () => {
    navigate('/practice');
  };

  const handleNextProblem = () => {
    if (currentProblem < totalProblems) {
      setCurrentProblem(currentProblem + 1);
    } else {
      handleEndSession();
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
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
              
              {config.company && (
                <Badge className="bg-purple-600 text-white">
                  {config.company}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                Problem {currentProblem} of {totalProblems}
              </div>
              <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono text-lg">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!isActive ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {sessionId === 'custom' ? 'Custom Interview Session' : 'Interview Session'}
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
        ) : (
          <div className="space-y-6">
            {/* Session Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button onClick={handlePauseSession} variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <span className="text-white">Problem {currentProblem} of {totalProblems}</span>
              </div>
              
              <Button onClick={handleNextProblem} className="bg-green-600 hover:bg-green-700">
                {currentProblem < totalProblems ? 'Next Problem' : 'Finish Session'}
              </Button>
            </div>
            
            {/* Problem Content */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Problem {currentProblem}</h2>
                  <p className="text-gray-300 mb-6">
                    This is where the actual coding problem would be displayed.
                    In a full implementation, this would load a real problem from your question bank.
                  </p>
                  <div className="bg-gray-800 rounded-lg p-6 text-left">
                    <h3 className="text-lg font-semibold mb-2">Example Problem:</h3>
                    <p className="text-gray-300 mb-4">
                      Given an array of integers, find two numbers such that they add up to a specific target number.
                    </p>
                    <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                      <p>Input: nums = [2,7,11,15], target = 9</p>
                      <p>Output: [0,1]</p>
                      <p>Explanation: nums[0] + nums[1] = 2 + 7 = 9</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
