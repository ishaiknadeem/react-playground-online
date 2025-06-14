
import React from 'react';
import { Play, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/pages/Exam';

interface ExamStartProps {
  question: Question;
  onStart: () => void;
}

const ExamStart: React.FC<ExamStartProps> = ({ question, onStart }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800/50 border-gray-700 text-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Badge className={`${getDifficultyColor(question.difficulty)} text-white px-3 py-1`}>
              {question.difficulty}
            </Badge>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-5 h-5" />
              <span>{question.timeLimit} minutes</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Coding Challenge Ready
          </CardTitle>
          <p className="text-gray-300">
            Question details will be revealed once you start the exam
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-100">
                <p className="font-semibold mb-1">Exam Security Notice:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-yellow-200">
                  <li>Once started, the timer cannot be paused</li>
                  <li>Tab switching is monitored and will affect your evaluation</li>
                  <li>Multiple tab switches will trigger warnings</li>
                  <li>Your code will be auto-saved as you type</li>
                  <li>Test your solution before submitting</li>
                  <li>You can submit early or wait for time to expire</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-red-100">
                <p className="font-semibold mb-1">⚠️ Anti-Cheating Measures:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-red-200">
                  <li>Tab switching behavior is tracked and recorded</li>
                  <li>Excessive tab switches may result in exam termination</li>
                  <li>Focus on this window throughout the exam</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={onStart}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamStart;
