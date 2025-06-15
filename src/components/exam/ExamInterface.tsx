
import React, { useState, useEffect, useCallback } from 'react';
import { Send, Play, AlertTriangle, Eye, Code, CheckCircle2, XCircle, Moon, Sun } from 'lucide-react';
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
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();
  
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
        <div className={`flex items-center justify-center h-full ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
            ${safeQuestion.boilerplate?.css || `body { margin: 20px; font-family: Arial, sans-serif; ${theme === 'dark' ? 'background: #1a1a1a; color: #e5e5e5;' : ''} }`}
            
            .error-display {
              background: ${theme === 'dark' ? '#2d1b1b' : '#ffebee'};
              border: 1px solid ${theme === 'dark' ? '#dc2626' : '#f44336'};
              border-radius: 4px;
              padding: 16px;
              color: ${theme === 'dark' ? '#fca5a5' : '#c62828'};
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
          className={`w-full h-full border-0 rounded ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
          title="React Component Preview"
          sandbox="allow-scripts"
        />
      );
    } catch (error) {
      return (
        <div className={`flex items-center justify-center h-full ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Question Not Found</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>The requested question could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Tab Switch Warning Overlay */}
      {showTabWarning && (
        <div className="fixed inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className={`border-red-200 shadow-xl max-w-md mx-4 ${theme === 'dark' ? 'bg-gray-800 border-red-800' : 'bg-white'}`}>
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-red-900' : 'bg-red-50'}`}>
                <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
              </div>
              <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tab Switch Detected!</h2>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                You have switched tabs {tabSwitchData.totalSwitches} times. 
                This behavior is being tracked and will affect your evaluation.
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Please focus on this window to avoid further warnings.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Bar */}
      <div className={`border-b px-6 py-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {safeQuestion.difficulty}
              </Badge>
              {tabSwitchData.totalSwitches > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Switches: {tabSwitchData.totalSwitches}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Toggle
              pressed={theme === 'dark'}
              onPressedChange={toggleTheme}
              aria-label="Toggle theme"
              size="sm"
              className={`gap-1 ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </Toggle>
            
            <ExamTimer 
              timeLeft={timeLeft} 
              totalTime={timeLimit * 60} 
            />
            
            <Button
              onClick={runTests}
              disabled={isRunning || hasSubmitted}
              variant="outline"
              size="sm"
              className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={hasSubmitted}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100%-5rem)]">
        {/* Left Panel - Problem Description and Results */}
        <div className={`w-1/3 border-r overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50/30 border-gray-100'}`}>
          <div className="p-6 space-y-6">
            <Card className={`shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`prose prose-sm max-w-none leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {safeQuestion.description?.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  )) || 'No description available'}
                </div>
              </CardContent>
            </Card>

            {testResults.length > 0 && (
              <Card className={`shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      {result.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Test {index + 1}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {result.testCase.description}
                        </p>
                        {result.error && (
                          <p className={`text-xs mt-1 font-mono ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                            {result.error}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor and Preview */}
        <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          {isReactExam ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className={`border-b px-6 py-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                <TabsList className={theme === 'dark' ? 'bg-gray-800 p-1' : 'bg-gray-50 p-1'}>
                  <TabsTrigger value="code" className={`gap-2 ${theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}`}>
                    <Code className="w-4 h-4" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="preview" className={`gap-2 ${theme === 'dark' ? 'data-[state=active]:bg-gray-700' : 'data-[state=active]:bg-white'}`}>
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="code" className="flex-1 m-0">
                <MonacoEditor
                  height="100%"
                  language="javascript"
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 m-0 p-6">
                {renderReactPreview()}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 p-4">
              <MonacoEditor
                height="100%"
                language="javascript"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
