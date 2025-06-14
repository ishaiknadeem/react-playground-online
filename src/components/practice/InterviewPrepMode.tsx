
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timer, Users, Building, Target, Play, Settings } from 'lucide-react';

interface InterviewSession {
  id: string;
  title: string;
  duration: number;
  problemCount: number;
  difficulty: 'Mixed' | 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
}

interface InterviewPrepModeProps {
  onStartSession: (sessionId: string, config: SessionConfig) => void;
}

interface SessionConfig {
  company?: string;
  duration: number;
  difficulty: string;
  categories: string[];
}

const InterviewPrepMode: React.FC<InterviewPrepModeProps> = ({ onStartSession }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('60');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Mixed');

  const interviewSessions: InterviewSession[] = [
    {
      id: 'google-practice',
      title: 'Google-style Interview',
      duration: 45,
      problemCount: 2,
      difficulty: 'Hard',
      category: 'Algorithm & Data Structures',
      description: 'Practice with problems commonly asked at Google interviews'
    },
    {
      id: 'facebook-practice',
      title: 'Meta-style Interview',
      duration: 45,
      problemCount: 2,
      difficulty: 'Medium',
      category: 'System Design & Coding',
      description: 'Simulate Meta\'s coding interview format'
    },
    {
      id: 'general-practice',
      title: 'General Tech Interview',
      duration: 60,
      problemCount: 3,
      difficulty: 'Mixed',
      category: 'Mixed Topics',
      description: 'Standard technical interview simulation'
    }
  ];

  const companies = [
    'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Tesla', 'Uber', 'Airbnb'
  ];

  const handleStartCustomSession = () => {
    const config: SessionConfig = {
      company: selectedCompany || undefined,
      duration: parseInt(selectedDuration),
      difficulty: selectedDifficulty,
      categories: ['Array', 'String', 'Dynamic Programming']
    };
    
    onStartSession('custom', config);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      case 'Mixed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Timer className="w-6 h-6 text-blue-600 mr-2" />
            Interview Prep Mode
          </CardTitle>
          <p className="text-gray-600">Practice with timed sessions that simulate real technical interviews</p>
        </CardHeader>
      </Card>

      {/* Custom Session Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Custom Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Target Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleStartCustomSession} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Custom Session
          </Button>
        </CardContent>
      </Card>

      {/* Preset Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Popular Interview Formats</h3>
        <div className="grid gap-4">
          {interviewSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{session.title}</h4>
                      <Badge className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{session.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>{session.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{session.problemCount} problems</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{session.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onStartSession(session.id, {
                      duration: session.duration,
                      difficulty: session.difficulty,
                      categories: [session.category]
                    })}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
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

export default InterviewPrepMode;
