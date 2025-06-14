
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Zap, Target, Award, Calendar, Star, Code, Timer } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'solving' | 'streak' | 'difficulty' | 'speed' | 'consistency';
}

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ achievements }) => {
  const earnedAchievements = achievements.filter(a => a.earned);
  const recentAchievements = earnedAchievements.slice(0, 3);

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          Achievements
          <Badge className="ml-2 bg-purple-100 text-purple-800">
            {earnedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAchievements.length > 0 ? (
          <div className="space-y-2">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border">
                <div className="text-yellow-500">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{achievement.title}</p>
                  <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                </div>
              </div>
            ))}
            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              View all achievements →
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Start solving problems to earn achievements!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
