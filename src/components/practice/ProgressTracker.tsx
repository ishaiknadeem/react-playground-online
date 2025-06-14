
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, Zap } from 'lucide-react';

interface ProgressTrackerProps {
  userProgress: {
    totalSolved: number;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    streak: number;
    practiceTime: string;
  };
  totalQuestions: {
    easy: number;
    medium: number;
    hard: number;
  };
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userProgress, totalQuestions }) => {
  const calculateProgress = (solved: number, total: number) => {
    return total > 0 ? (solved / total) * 100 : 0;
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { text: 'Fire Streak!', color: 'bg-red-500' };
    if (streak >= 14) return { text: 'Hot Streak!', color: 'bg-orange-500' };
    if (streak >= 7) return { text: 'Great Streak!', color: 'bg-yellow-500' };
    if (streak >= 3) return { text: 'Good Streak', color: 'bg-green-500' };
    return { text: 'Keep Going!', color: 'bg-blue-500' };
  };

  const streakBadge = getStreakBadge(userProgress.streak);

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-xl font-bold text-slate-900">{userProgress.totalSolved}</p>
                <p className="text-xs text-slate-600">Problems Solved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className={`w-5 h-5 text-white`} />
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold text-slate-900">{userProgress.streak}</p>
                  <Badge className={`${streakBadge.color} text-white text-xs px-2 py-1`}>
                    {streakBadge.text}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xl font-bold text-slate-900">{userProgress.practiceTime}</p>
                <p className="text-xs text-slate-600">Practice Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {Math.round((userProgress.totalSolved / (totalQuestions.easy + totalQuestions.medium + totalQuestions.hard)) * 100)}%
                </p>
                <p className="text-xs text-slate-600">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Progress */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-lg">Progress by Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Easy Problems</span>
              <span className="text-sm text-slate-600">{userProgress.easyCount}/{totalQuestions.easy}</span>
            </div>
            <Progress 
              value={calculateProgress(userProgress.easyCount, totalQuestions.easy)} 
              className="h-2 bg-gray-200"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Medium Problems</span>
              <span className="text-sm text-slate-600">{userProgress.mediumCount}/{totalQuestions.medium}</span>
            </div>
            <Progress 
              value={calculateProgress(userProgress.mediumCount, totalQuestions.medium)} 
              className="h-2 bg-gray-200"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Hard Problems</span>
              <span className="text-sm text-slate-600">{userProgress.hardCount}/{totalQuestions.hard}</span>
            </div>
            <Progress 
              value={calculateProgress(userProgress.hardCount, totalQuestions.hard)} 
              className="h-2 bg-gray-200"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
