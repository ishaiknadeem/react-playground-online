
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
            {question.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Problem Description</h3>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed">
              {question.description}
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Test Cases</h3>
            <div className="space-y-2">
              {question.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                <div key={testCase.id} className="text-sm">
                  <span className="text-gray-400">Test {index + 1}:</span>
                  <span className="text-gray-300 ml-2">{testCase.description}</span>
                </div>
              ))}
              {question.testCases.some(tc => tc.isHidden) && (
                <div className="text-sm text-yellow-400">
                  + Additional hidden test cases
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-100">
                <p className="font-semibold mb-1">Important Instructions:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-yellow-200">
                  <li>Once you start, the timer cannot be paused</li>
                  <li>Your code will be auto-saved as you type</li>
                  <li>Test your solution before submitting</li>
                  <li>You can submit early or wait for time to expire</li>
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
