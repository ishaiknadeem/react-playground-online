import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Send, Play, CheckCircle, XCircle, AlertTriangle, Eye, Code } from 'lucide-react';
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
  onSubmit: (code: any, testResults: any, tabSwitchData: any) => void;
}

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  output: any;
  error?: string;
}

interface TabSwitchData {
  totalSwitches: number;
  switchTimestamps: string[];
  warningsShown: number;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ question, startTime, onSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit * 60);
  const [code, setCode] = useState(question.boilerplate.javascript);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [tabSwitchData, setTabSwitchData] = useState<TabSwitchData>({
    totalSwitches: 0,
    switchTimestamps: [],
    warningsShown: 0
  });
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [activeTab, setActiveTab] = useState('code');

  // Check if this is a React exam
  const isReactExam = question.id === 'id234' || question.title.toLowerCase().includes('react');

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !hasSubmitted) {
        const now = new Date().toISOString();
        
        setTabSwitchData(prev => {
          const newData = {
            totalSwitches: prev.totalSwitches + 1,
            switchTimestamps: [...prev.switchTimestamps, now],
            warningsShown: prev.warningsShown
          };
          
          console.log('Tab switch detected:', newData);
          
          // Show warning for every 3rd tab switch
          if (newData.totalSwitches % 3 === 0) {
            setShowTabWarning(true);
            newData.warningsShown++;
            
            toast({
              title: "⚠️ Tab Switch Warning",
              description: `You have switched tabs ${newData.totalSwitches} times. This affects your evaluation.`,
              variant: "destructive"
            });
            
            // Hide warning after 5 seconds
            setTimeout(() => setShowTabWarning(false), 5000);
          }
          
          return newData;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasSubmitted]);

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
      const results: TestResult[] = [];
      
      for (const testCase of question.testCases) {
        try {
          if (isReactExam) {
            // For React exams, we'll simulate test results based on code analysis
            const hasCounter = code.includes('useState') && code.includes('counter');
            const hasIncrement = code.includes('Increment');
            const hasDecrement = code.includes('Decrement');
            const hasReset = code.includes('Reset');
            
            const passed = hasCounter && hasIncrement && hasDecrement && hasReset;
            
            results.push({
              testCase,
              passed,
              output: passed ? testCase.expectedOutput : 'Component not properly implemented'
            });
          } else {
            const wrappedCode = `
              ${code}
              
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
          }
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
  }, [code, question.testCases, isReactExam]);

  const handleSubmit = useCallback(() => {
    if (hasSubmitted) return;
    
    setHasSubmitted(true);
    onSubmit(code, testResults, tabSwitchData);
    
    toast({
      title: "Solution Submitted",
      description: "Your solution has been submitted successfully!"
    });
  }, [code, testResults, tabSwitchData, hasSubmitted, onSubmit]);

  const getTimeColor = () => {
    const percentage = timeLeft / (question.timeLimit * 60);
    if (percentage > 0.5) return 'text-green-400';
    if (percentage > 0.25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderReactPreview = () => {
    if (!isReactExam) return null;

    try {
      // Create a safe preview of the React component
      const previewHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Component Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            ${question.boilerplate.css}
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${code}
            
            const App = () => {
              return React.createElement(Counter);
            };
            
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(App));
          </script>
        </body>
        </html>
      `;

      return (
        <iframe
          srcDoc={previewHtml}
          className="w-full h-full border-0 bg-white"
          title="React Component Preview"
          sandbox="allow-scripts"
        />
      );
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <p>Preview Error</p>
            <p className="text-sm">Check your code syntax</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Tab Switch Warning Overlay */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-red-900/80 flex items-center justify-center z-50">
          <Card className="bg-red-800 border-red-600 text-white max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Tab Switch Detected!</h2>
              <p className="text-red-200 mb-4">
                You have switched tabs {tabSwitchData.totalSwitches} times. 
                This behavior is being tracked and will affect your evaluation.
              </p>
              <p className="text-sm text-red-300">
                Please focus on this window to avoid further warnings.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">{question.title}</h1>
            <Badge className="bg-blue-600">{question.difficulty}</Badge>
            {tabSwitchData.totalSwitches > 0 && (
              <Badge className="bg-red-600">
                Tab Switches: {tabSwitchData.totalSwitches}
              </Badge>
            )}
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

        {/* Right Panel - Code Editor and Preview */}
        <div className="flex-1 flex flex-col">
          {isReactExam ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-gray-700/50 bg-gray-800/30 px-4">
                <TabsList className="bg-gray-800/50">
                  <TabsTrigger value="code" className="data-[state=active]:bg-gray-700">
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="code" className="flex-1 m-0">
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
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 m-0">
                {renderReactPreview()}
              </TabsContent>
            </Tabs>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
