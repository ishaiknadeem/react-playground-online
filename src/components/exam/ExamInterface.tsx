
import React, { useState, useEffect, useCallback } from 'react';
import { Send, Play, AlertTriangle, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MonacoEditor from '@monaco-editor/react';
import { Question, TestCase } from '@/pages/Exam';
import { toast } from '@/hooks/use-toast';
import TestRunner from './TestRunner';
import ExamTimer from './ExamTimer';
import TestResultsPanel from './TestResultsPanel';

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
  // Safety checks for question prop
  const safeQuestion = question || {
    id: '',
    title: 'Unknown Question',
    description: 'No description available',
    difficulty: 'Medium' as const,
    timeLimit: 30,
    testCases: [],
    boilerplate: { javascript: '', html: '', css: '' }
  };

  const timeLimit = Math.max(1, safeQuestion.timeLimit || 30);
  
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [code, setCode] = useState(safeQuestion.boilerplate?.javascript || '');
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
  const isReactExam = React.useMemo(() => {
    if (!safeQuestion) return false;
    
    const indicators = [
      safeQuestion.title?.toLowerCase().includes('react'),
      safeQuestion.description?.toLowerCase().includes('react'),
      safeQuestion.description?.toLowerCase().includes('component'),
      safeQuestion.boilerplate?.javascript?.includes('import React'),
      safeQuestion.boilerplate?.javascript?.includes('useState'),
      safeQuestion.id === 'id234'
    ];
    
    return indicators.some(Boolean);
  }, [safeQuestion]);

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
          
          if (newData.totalSwitches % 3 === 0) {
            setShowTabWarning(true);
            newData.warningsShown++;
            
            toast({
              title: "⚠️ Tab Switch Warning",
              description: `You have switched tabs ${newData.totalSwitches} times. This affects your evaluation.`,
              variant: "destructive"
            });
            
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
    if (!startTime || hasSubmitted) return;

    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = Math.max(0, timeLimit * 60 - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, timeLimit, hasSubmitted]);

  const runTests = useCallback(async () => {
    if (!code?.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before running tests.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    console.log('Running tests for question:', safeQuestion.id);
    
    try {
      const results = await TestRunner.runTests(safeQuestion, code);
      setTestResults(results);
      
      const passedCount = results.filter(r => r?.passed).length;
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
  }, [code, safeQuestion]);

  const handleSubmit = useCallback(() => {
    if (hasSubmitted) return;
    
    setHasSubmitted(true);
    
    try {
      onSubmit(code, testResults, tabSwitchData);
      
      toast({
        title: "Solution Submitted",
        description: "Your solution has been submitted successfully!"
      });
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit solution. Please try again.",
        variant: "destructive"
      });
    }
  }, [code, testResults, tabSwitchData, hasSubmitted, onSubmit]);

  const renderReactPreview = () => {
    if (!isReactExam || !code?.trim()) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Code className="w-12 h-12 mx-auto mb-4" />
            <p>Write your React component to see preview</p>
          </div>
        </div>
      );
    }

    try {
      const cleanedCode = code
        .replace(/import\s+.*?from\s+['"]react['"];?\s*/g, '')
        .replace(/import\s+.*?from\s+['"]react-dom\/client['"];?\s*/g, '')
        .replace(/import\s+{.*?}\s+from\s+['"]react['"];?\s*/g, '')
        .replace(/export\s+default\s+\w+;?\s*$/, '');

      const previewHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Component Preview</title>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            ${safeQuestion.boilerplate?.css || 'body { margin: 20px; font-family: Arial, sans-serif; }'}
            
            .error-display {
              background: #ffebee;
              border: 1px solid #f44336;
              border-radius: 4px;
              padding: 16px;
              color: #c62828;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          
          <script type="text/babel">
            const { useState, useEffect, useCallback, useMemo, useRef } = React;
            
            try {
              ${cleanedCode}
              
              let ComponentToRender = null;
              const possibleComponents = [
                typeof Counter !== 'undefined' ? Counter : null,
                typeof Component !== 'undefined' ? Component : null,
                typeof App !== 'undefined' ? App : null
              ].filter(Boolean);
              
              ComponentToRender = possibleComponents[0];
              
              if (ComponentToRender) {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(ComponentToRender));
              } else {
                document.getElementById('root').innerHTML = '<div class="error-display">No React component found. Make sure to define a component.</div>';
              }
            } catch (error) {
              console.error('Preview error:', error);
              document.getElementById('root').innerHTML = '<div class="error-display">Error rendering component: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `;

      return (
        <iframe
          srcDoc={previewHtml}
          className="w-full h-full border-0 bg-white rounded"
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

  if (!safeQuestion.id) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
          <p>The requested question could not be loaded.</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-white truncate max-w-md">
              {safeQuestion.title}
            </h1>
            <Badge className="bg-blue-600 flex-shrink-0">
              {safeQuestion.difficulty}
            </Badge>
            {tabSwitchData.totalSwitches > 0 && (
              <Badge className="bg-red-600 flex-shrink-0">
                Tab Switches: {tabSwitchData.totalSwitches}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <ExamTimer 
              timeLeft={timeLeft} 
              totalTime={timeLimit * 60} 
            />
            
            <Button
              onClick={runTests}
              disabled={isRunning || hasSubmitted}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600/10 flex-shrink-0"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={hasSubmitted}
              className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Problem Description and Results */}
        <div className="w-1/3 border-r border-gray-700/50 bg-gray-900/30 overflow-y-auto">
          <div className="p-6 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg text-blue-400">Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                  {safeQuestion.description || 'No description available'}
                </div>
              </CardContent>
            </Card>

            <TestResultsPanel results={testResults} isLoading={isRunning} />
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
              
              <TabsContent value="preview" className="flex-1 m-0 p-4">
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
