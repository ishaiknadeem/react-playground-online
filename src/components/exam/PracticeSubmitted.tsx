
import React from 'react';
import { CheckCircle, Clock, Code, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/pages/Exam';

interface PracticeSubmittedProps {
  question: Question;
  submissionData: {
    code: string;
    testResults: any[];
    timeTaken: number;
    submittedAt: string;
    tabSwitchData?: any;
  };
  pathId?: string | null;
  onContinue: () => void;
}

const PracticeSubmitted: React.FC<PracticeSubmittedProps> = ({ 
  question, 
  submissionData, 
  pathId, 
  onContinue 
}) => {
  const passedTests = submissionData.testResults?.filter(r => r.passed).length || 0;
  const totalTests = submissionData.testResults?.length || 0;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate === 100) return { text: 'Perfect!', color: 'bg-green-500 text-white' };
    if (rate >= 80) return { text: 'Great!', color: 'bg-green-500 text-white' };
    if (rate >= 60) return { text: 'Good', color: 'bg-yellow-500 text-white' };
    return { text: 'Keep Practicing', color: 'bg-orange-500 text-white' };
  };

  const badge = getPerformanceBadge(successRate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Practice Complete!
          </CardTitle>
          <p className="text-gray-600">
            Great job working on "{question.title}". Here's how you did:
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {passedTests}/{totalTests}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
                <Badge className={`mt-2 ${badge.color} border-0`}>
                  {badge.text}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {submissionData.timeTaken}m
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
                <div className="text-xs text-gray-500 mt-1">
                  Est. {question.timeLimit} minutes
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 text-center">
                <Code className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getPerformanceColor(successRate)}`}>
                  {Math.round(successRate)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Practice Details */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Practice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Problem:</span>
                  <span className="text-gray-900 font-medium">{question.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <Badge variant="outline" className="text-xs text-gray-700 border-gray-300">
                    {question.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed At:</span>
                  <span className="text-gray-900">
                    {new Date(submissionData.submittedAt).toLocaleString()}
                  </span>
                </div>
                {pathId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Learning Path:</span>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      In Progress
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1 gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Button 
              onClick={onContinue}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {pathId ? (
                <>
                  Next Problem
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Back to Practice
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeSubmitted;
