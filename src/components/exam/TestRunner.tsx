
import React from 'react';
import { Question, TestCase } from '@/pages/Exam';

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  output: any;
  error?: string;
}

export interface TestRunnerProps {
  question: Question;
  code: string;
  onTestComplete: (results: TestResult[]) => void;
}

export class TestRunner {
  static async runTests(question: Question, code: string): Promise<TestResult[]> {
    if (!question?.testCases || !Array.isArray(question.testCases)) {
      console.warn('No test cases found for question');
      return [];
    }

    const results: TestResult[] = [];
    
    try {
      // Determine test type based on question properties
      const isReactQuestion = TestRunner.isReactQuestion(question);
      
      for (const testCase of question.testCases) {
        if (!testCase) continue;
        
        try {
          let result: TestResult;
          
          if (isReactQuestion) {
            result = await TestRunner.runReactTest(code, testCase, question);
          } else {
            result = await TestRunner.runJavaScriptTest(code, testCase, question);
          }
          
          results.push(result);
        } catch (error) {
          results.push({
            testCase,
            passed: false,
            output: null,
            error: error instanceof Error ? error.message : 'Unknown test error'
          });
        }
      }
    } catch (error) {
      console.error('Test execution failed:', error);
    }
    
    return results;
  }

  private static isReactQuestion(question: Question): boolean {
    if (!question) return false;
    
    const indicators = [
      question.title?.toLowerCase().includes('react'),
      question.description?.toLowerCase().includes('react'),
      question.description?.toLowerCase().includes('component'),
      question.boilerplate?.javascript?.includes('import React'),
      question.boilerplate?.javascript?.includes('useState'),
      question.id === 'id234' // Legacy check
    ];
    
    return indicators.some(Boolean);
  }

  private static async runReactTest(code: string, testCase: TestCase, question: Question): Promise<TestResult> {
    return new Promise((resolve) => {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        document.body.appendChild(iframe);

        const testHtml = TestRunner.generateReactTestHTML(code, question);
        iframe.srcdoc = testHtml;

        const cleanup = () => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        };

        const messageHandler = (event: MessageEvent) => {
          if (event.source === iframe.contentWindow) {
            window.removeEventListener('message', messageHandler);
            cleanup();
            
            if (event.data?.success) {
              const passed = TestRunner.compareResults(event.data.result, testCase.expectedOutput);
              resolve({
                testCase,
                passed,
                output: event.data.result
              });
            } else {
              resolve({
                testCase,
                passed: false,
                output: null,
                error: event.data?.error || 'Test execution failed'
              });
            }
          }
        };

        window.addEventListener('message', messageHandler);

        iframe.onload = () => {
          setTimeout(() => {
            try {
              if (iframe.contentWindow && testCase.input) {
                (iframe.contentWindow as any).runTest(testCase.input);
              }
            } catch (err) {
              cleanup();
              resolve({
                testCase,
                passed: false,
                output: null,
                error: 'Failed to execute test'
              });
            }
          }, 500);
        };

        // Timeout after 10 seconds
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          cleanup();
          resolve({
            testCase,
            passed: false,
            output: null,
            error: 'Test timeout - component may not be responding'
          });
        }, 10000);

      } catch (error) {
        resolve({
          testCase,
          passed: false,
          output: null,
          error: error instanceof Error ? error.message : 'Test setup failed'
        });
      }
    });
  }

  private static async runJavaScriptTest(code: string, testCase: TestCase, question: Question): Promise<TestResult> {
    try {
      // Extract function name from the code or question
      const functionName = TestRunner.extractFunctionName(code, question);
      
      if (!functionName) {
        return {
          testCase,
          passed: false,
          output: null,
          error: 'Could not identify function to test'
        };
      }

      const wrappedCode = `
        ${code}
        
        (function() {
          try {
            const input = ${JSON.stringify(testCase.input)};
            if (typeof ${functionName} !== 'function') {
              throw new Error('Function ${functionName} is not defined');
            }
            return ${functionName}(${TestRunner.generateFunctionArgs(testCase.input)});
          } catch (err) {
            throw err;
          }
        })();
      `;
      
      const output = eval(wrappedCode);
      const passed = TestRunner.compareResults(output, testCase.expectedOutput);
      
      return {
        testCase,
        passed,
        output
      };
      
    } catch (error) {
      return {
        testCase,
        passed: false,
        output: null,
        error: error instanceof Error ? error.message : 'JavaScript execution error'
      };
    }
  }

  private static extractFunctionName(code: string, question: Question): string | null {
    // Try multiple patterns to find function name
    const patterns = [
      /function\s+(\w+)\s*\(/,
      /const\s+(\w+)\s*=.*?=>/,
      /let\s+(\w+)\s*=.*?=>/,
      /var\s+(\w+)\s*=.*?=>/
    ];

    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Fallback: try to infer from question title
    if (question?.title) {
      const titleWords = question.title.toLowerCase().split(' ');
      const commonFunctionNames = ['twosum', 'sum', 'add', 'calculate', 'find', 'search'];
      for (const word of titleWords) {
        if (commonFunctionNames.some(fn => word.includes(fn))) {
          return word.replace(/[^a-zA-Z]/g, '');
        }
      }
    }

    return null;
  }

  private static generateFunctionArgs(input: any): string {
    if (!input || typeof input !== 'object') {
      return JSON.stringify(input);
    }

    // Handle common input patterns
    if (input.nums && input.target !== undefined) {
      return `${JSON.stringify(input.nums)}, ${JSON.stringify(input.target)}`;
    }

    // Generic object destructuring
    const values = Object.values(input);
    return values.map(v => JSON.stringify(v)).join(', ');
  }

  private static compareResults(actual: any, expected: any): boolean {
    if (actual === null && expected === null) return true;
    if (actual === undefined && expected === undefined) return true;
    
    try {
      return JSON.stringify(actual) === JSON.stringify(expected);
    } catch {
      return actual === expected;
    }
  }

  private static generateReactTestHTML(code: string, question: Question): string {
    const cleanedCode = code
      .replace(/import\s+.*?from\s+['"]react['"];?\s*/g, '')
      .replace(/import\s+.*?from\s+['"]react-dom\/client['"];?\s*/g, '')
      .replace(/import\s+{.*?}\s+from\s+['"]react['"];?\s*/g, '')
      .replace(/export\s+default\s+\w+;?\s*$/, '');

    const css = question?.boilerplate?.css || `
      body { margin: 20px; font-family: Arial, sans-serif; }
      #root { min-height: 200px; }
      .error-display { 
        background: #ffebee; border: 1px solid #f44336; 
        border-radius: 4px; padding: 16px; color: #c62828; 
        font-family: monospace; 
      }
    `;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Component Test</title>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>${css}</style>
      </head>
      <body>
        <div id="root"></div>
        
        <script type="text/babel">
          const { useState, useEffect, useCallback, useMemo, useRef } = React;
          
          try {
            ${cleanedCode}
            
            // Find component to render
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
              
              window.runTest = (testInput) => {
                setTimeout(() => {
                  try {
                    const result = window.executeTest ? window.executeTest(testInput) : null;
                    window.parent.postMessage({ success: true, result }, '*');
                  } catch (err) {
                    window.parent.postMessage({ success: false, error: err.message }, '*');
                  }
                }, 100);
              };
            } else {
              window.parent.postMessage({ 
                success: false, 
                error: 'No React component found. Make sure to define a component.' 
              }, '*');
            }
          } catch (error) {
            window.parent.postMessage({ 
              success: false, 
              error: 'Component error: ' + error.message 
            }, '*');
          }
        </script>
      </body>
      </html>
    `;
  }
}

export default TestRunner;
