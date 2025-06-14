
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Send, Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MonacoEditor from '@monaco-editor/react';
import { Question, TestCase } from '@/pages/Exam';
import { toast } from '@/hooks/use-toast';

interface ExamInterfaceProps {
  question: Question;
  startTime: Date;
  onSubmit: (code: any, testResults: any) => void;
}

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  output: any;
  error?: string;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ question, startTime, onSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit * 60); // Convert to seconds
  const [code, setCode] = useState(question.boilerplate.javascript);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = Math.max(0, question.timeLimit * 60 - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining === 0 && !hasSubmitted) {
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, question.timeLimit, hasSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const runTests = useCallback(() => {
    setIsRunning(true);
    console.log('Running tests...');
    
    try {
      // Create a safe evaluation environment
      const results: TestResult[] = [];
      
      for (const testCase of question.testCases) {
        try {
          // Create a function wrapper for the user's code
          const wrappedCode = `
            ${code}
            
            // Return the function result
            (function() {
              const input = ${JSON.stringify(testCase.input)};
              return twoSum(input.nums, input.target);
            })();
          `;
          
          const output = eval(wrappedCode);
          const passed = JSON.stringify(output) === JSON.stringify(testCase.expectedOutput);
          
          results.push({
            testCase,
            passed,
            output
          });
        } catch (error) {
          results.push({
            testCase,
            passed: false,
            output: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      toast({
        title: "Tests Completed",
        description: `${passedCount}/${totalCount} tests passed`,
        variant: passedCount === totalCount ? "default" : "destructive"
      });
      
    } catch (error) {
      console.error('Test execution failed:', error);
      toast({
        title: "Test Error",
        description: "Failed to run tests. Check your code syntax.",
        variant: "destructive"
      });
    }
    
    setIsRunning(false);
  }, [code, question.testCases]);

  const handleSubmit = useCallback(() => {
    if (hasSubmitted) return;
    
    setHasSubmitted(true);
    onSubmit(code, testResults);
    
    toast({
      title: "Solution Submitted",
      description: "Your solution has been submitted successfully!"
    });
  }, [code, testResults, hasSubmitted, onSubmit]);

  const getTimeColor = () => {
    const percentage = timeLeft / (question.timeLimit * 60);
    if (percentage > 0.5) return 'text-green-400';
    if (percentage > 0.25) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">{question.title}</h1>
            <Badge className="bg-blue-600">{question.difficulty}</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 font-mono text-lg ${getTimeColor()}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            
            <Button
              onClick={runTests}
              disabled={isRunning}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600/10"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={hasSubmitted}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/3 border-r border-gray-700/50 bg-gray-900/30 overflow-y-auto">
          <div className="p-6">
            <Card className="bg-gray-800/50 border-gray-700 text-white mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400">Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                  {question.description}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-lg text-green-400">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={result.testCase.id} className="flex items-center space-x-3">
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            Test {index + 1}: {result.testCase.description}
                          </div>
                          {!result.passed && (
                            <div className="text-xs text-red-300 mt-1">
                              {result.error || `Expected: ${JSON.stringify(result.testCase.expectedOutput)}, Got: ${JSON.stringify(result.output)}`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
              fontLigatures: true,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
