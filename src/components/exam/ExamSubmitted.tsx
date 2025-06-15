
import React from 'react';
import { CheckCircle, Clock, Code, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/pages/Exam';

interface ExamSubmittedProps {
  question: Question;
  submissionData: {
    code: string;
    testResults: any[];
    timeTaken: number;
    submittedAt: string;
  };
}

const ExamSubmitted: React.FC<ExamSubmittedProps> = ({ question, submissionData }) => {
  const passedTests = submissionData.testResults?.filter(r => r.passed).length || 0;
  const totalTests = submissionData.testResults?.length || 0;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate === 100) return { text: 'Perfect!', color: 'bg-green-600 text-white' };
    if (rate >= 80) return { text: 'Great!', color: 'bg-green-500 text-white' };
    if (rate >= 60) return { text: 'Good', color: 'bg-yellow-500 text-white' };
    return { text: 'Needs Work', color: 'bg-red-500 text-white' };
  };

  const badge = getPerformanceBadge(successRate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gray-800/50 border-gray-700 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-600/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Solution Submitted!
          </CardTitle>
          <p className="text-gray-300">
            Your solution for "{question.title}" has been submitted successfully.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {passedTests}/{totalTests}
                </div>
                <div className="text-sm text-gray-300">Tests Passed</div>
                <Badge className={`mt-2 ${badge.color} border-0`}>
                  {badge.text}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {submissionData.timeTaken}m
                </div>
                <div className="text-sm text-gray-300">Time Taken</div>
                <div className="text-xs text-gray-400 mt-1">
                  of {question.timeLimit} minutes
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4 text-center">
                <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getPerformanceColor(successRate)}`}>
                  {Math.round(successRate)}%
                </div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Details */}
          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-lg text-blue-400">Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Question:</span>
                  <span className="text-white">{question.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-white">{question.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Submitted At:</span>
                  <span className="text-white">
                    {new Date(submissionData.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-600 text-white border-0">
                    Submitted
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamSubmitted;
