
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestCase } from '@/pages/Exam';

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  output: any;
  error?: string;
}

interface TestResultsPanelProps {
  results: TestResult[];
  isLoading?: boolean;
}

const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ 
  results = [], 
  isLoading = false 
}) => {
  const [showHidden, setShowHidden] = React.useState(false);

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-blue-400 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
            Running Tests...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-gray-400">No Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Click "Run Tests" to see how your solution performs.
          </p>
        </CardContent>
      </Card>
    );
  }

  const visibleResults = results.filter(result => 
    result?.testCase && (!result.testCase.isHidden || showHidden)
  );
  
  const hiddenCount = results.filter(result => 
    result?.testCase?.isHidden
  ).length;

  const passedCount = results.filter(result => result?.passed).length;
  const totalCount = results.length;

  const getResultIcon = (result: TestResult) => {
    if (!result) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    
    return result.passed ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const formatOutput = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-green-400 flex items-center">
            Test Results
            <Badge 
              className={`ml-3 ${
                passedCount === totalCount 
                  ? 'bg-green-600' 
                  : passedCount > 0 
                  ? 'bg-yellow-600' 
                  : 'bg-red-600'
              }`}
            >
              {passedCount}/{totalCount}
            </Badge>
          </CardTitle>
          
          {hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHidden(!showHidden)}
              className="text-gray-400 hover:text-white"
            >
              {showHidden ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Hidden
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Show Hidden ({hiddenCount})
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {visibleResults.map((result, index) => {
            if (!result?.testCase) return null;
            
            return (
              <div key={result.testCase.id || index} className="border-l-2 border-gray-600 pl-4">
                <div className="flex items-start space-x-3">
                  {getResultIcon(result)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        Test {index + 1}
                        {result.testCase.isHidden && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Hidden
                          </Badge>
                        )}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      {result.testCase.description || 'No description'}
                    </div>
                    
                    {!result.passed && (
                      <div className="text-xs space-y-1">
                        {result.error ? (
                          <div className="text-red-300 bg-red-900/20 p-2 rounded font-mono">
                            Error: {result.error}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-gray-400">
                              Expected: <span className="text-green-300 font-mono">
                                {formatOutput(result.testCase.expectedOutput)}
                              </span>
                            </div>
                            <div className="text-gray-400">
                              Got: <span className="text-red-300 font-mono">
                                {formatOutput(result.output)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResultsPanel;
