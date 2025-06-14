import React, { useEffect, useRef, useCallback, useMemo } from 'react';

interface PreviewProps {
  html: string;
  css: string;
  javascript: string;
  packages: string[];
  isReactMode?: boolean;
  isLogicMode?: boolean;
  onConsoleOutput: (output: {type: string, message: string, timestamp: number}) => void;
}

const Preview: React.FC<PreviewProps> = ({ 
  html, 
  css, 
  javascript, 
  packages, 
  isReactMode = true, 
  isLogicMode = false,
  onConsoleOutput 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewContent = useMemo(() => {
    if (isLogicMode) {
      // Properly escape JavaScript code for safe injection
      const escapedJavaScript = javascript
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/'/g, "\\'")    // Escape single quotes
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/`/g, '\\`')    // Escape backticks
        .replace(/\r?\n/g, '\\n') // Escape newlines
        .replace(/\r/g, '\\r')   // Escape carriage returns
        .replace(/\t/g, '\\t');  // Escape tabs

      // Pure JavaScript Logic Mode
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JavaScript Logic Compiler</title>
          <style>
            ${css}
            
            /* Base iframe styles */
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              overflow-x: hidden;
              background: #f8f9fa;
              padding: 20px;
            }

            .results-container {
              max-width: 1000px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            .results-header {
              margin: 0 0 20px 0;
              color: #333;
              font-size: 18px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .results-output {
              font-family: 'Courier New', monospace;
              background: #1a1a1a;
              color: #e2e8f0;
              padding: 20px;
              border-radius: 8px;
              white-space: pre-wrap;
              overflow-x: auto;
              min-height: 300px;
              font-size: 14px;
              line-height: 1.5;
            }

            .result-item {
              margin: 4px 0;
              padding: 4px 0;
            }

            .result-log {
              color: #4ade80;
            }

            .result-error {
              color: #f87171;
            }

            .result-warn {
              color: #fbbf24;
            }
          </style>
        </head>
        <body>
          <div class="results-container">
            <div class="results-header">
              <span>📊</span>
              <span>JavaScript Logic Execution Results</span>
            </div>
            <div id="results" class="results-output">
              <div class="result-item result-log">🚀 Starting JavaScript execution...</div>
            </div>
          </div>
          
          <script>
            // Store original console for internal use
            const originalConsole = window.console;
            const results = [];
            let isInitialized = false;
            
            // Add initial message
            results.push({ 
              type: 'log', 
              message: '🚀 Starting JavaScript execution...', 
              timestamp: Date.now() 
            });
            
            function sendToParent(type, message, timestamp) {
              try {
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({
                    type: 'console',
                    level: type,
                    message: message,
                    timestamp: timestamp || Date.now()
                  }, '*');
                }
              } catch (e) {
                originalConsole.error('Failed to send message to parent:', e);
              }
            }
            
            function addResult(type, message) {
              const timestamp = Date.now();
              const result = { type, message, timestamp };
              results.push(result);
              updateResults();
              sendToParent(type, message, timestamp);
            }

            function updateResults() {
              const resultsDiv = document.getElementById('results');
              if (resultsDiv) {
                resultsDiv.innerHTML = results.map(result => {
                  const className = result.type === 'error' ? 'result-error' : 
                                   result.type === 'warn' ? 'result-warn' : 'result-log';
                  const timestamp = new Date(result.timestamp).toLocaleTimeString();
                  return \`<div class="result-item \${className}">[\${timestamp}] \${result.message}</div>\`;
                }).join('');
                resultsDiv.scrollTop = resultsDiv.scrollHeight;
              }
            }

            // Override console methods
            window.console = {
              ...originalConsole,
              log: function(...args) {
                originalConsole.log(...args);
                const message = args.map(arg => {
                  if (typeof arg === 'object' && arg !== null) {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                }).join(' ');
                addResult('log', message);
              },
              error: function(...args) {
                originalConsole.error(...args);
                const message = args.map(arg => {
                  if (typeof arg === 'object' && arg !== null) {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                }).join(' ');
                addResult('error', message);
              },
              warn: function(...args) {
                originalConsole.warn(...args);
                const message = args.map(arg => {
                  if (typeof arg === 'object' && arg !== null) {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                }).join(' ');
                addResult('warn', message);
              }
            };

            // Global error handling
            window.addEventListener('error', function(event) {
              const message = \`Error: \${event.message}\${event.filename ? ' in ' + event.filename : ''}\${event.lineno ? ' at line ' + event.lineno : ''}\`;
              addResult('error', message);
            });

            window.addEventListener('unhandledrejection', function(event) {
              const message = \`Unhandled Promise Rejection: \${event.reason}\`;
              addResult('error', message);
              event.preventDefault();
            });

            // Initialize and execute user code
            function executeUserCode() {
              if (isInitialized) return;
              isInitialized = true;
              
              // Update initial display
              updateResults();
              
              // Send initial message to parent
              sendToParent('log', '🚀 Starting JavaScript execution...', Date.now());
              
              try {
                // Get the user's JavaScript code
                const userCode = '${escapedJavaScript}';
                
                if (!userCode.trim()) {
                  console.log('No JavaScript code to execute');
                  return;
                }
                
                console.log('Executing JavaScript code...');
                
                // Execute the user's code using eval in a try-catch
                eval(userCode);
                
                console.log('✅ JavaScript execution completed successfully!');
              } catch (error) {
                console.error('❌ JavaScript Error:', error.message);
                if (error.stack) {
                  console.error('Stack trace:', error.stack);
                }
              }
            }
            
            // Execute when DOM is ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', executeUserCode);
            } else {
              setTimeout(executeUserCode, 100);
            }
          </script>
        </body>
        </html>
      `;
    } else if (isReactMode) {
      // React Mode
      const cleanedJS = javascript
        .replace(/import\s+React.*?from\s+['"]react['"];?\s*/g, '')
        .replace(/import\s+ReactDOM.*?from\s+['"]react-dom\/client['"];?\s*/g, '')
        .replace(/import\s+{.*?}\s+from\s+['"]react['"];?\s*/g, '')
        .replace(/export\s+default\s+\w+;?\s*$/, '');

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Preview</title>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            ${css}
            
            /* Base iframe styles */
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              overflow-x: hidden;
            }

            #root {
              min-height: 100vh;
            }
          </style>
        </head>
        <body>
          ${html.includes('<body>') ? html.replace(/<body[^>]*>/, '<body>').replace('</body>', '') : `<div id="root"></div>`}
          
          <script>
            let isExecuted = false;
            
            function executeUserCode() {
              if (isExecuted) return;
              isExecuted = true;
              
              // Make React hooks available globally
              const { useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue } = React;
              
              // Override console methods to capture output
              const originalConsole = window.console;
              window.console = {
                ...originalConsole,
                log: (...args) => {
                  originalConsole.log(...args);
                  try {
                    window.parent.postMessage({
                      type: 'console',
                      level: 'log',
                      message: args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                      ).join(' ')
                    }, '*');
                  } catch (e) {
                    originalConsole.error('Console message error:', e);
                  }
                },
                error: (...args) => {
                  originalConsole.error(...args);
                  try {
                    window.parent.postMessage({
                      type: 'console',
                      level: 'error',
                      message: args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                      ).join(' ')
                    }, '*');
                  } catch (e) {
                    originalConsole.error('Console error message error:', e);
                  }
                },
                warn: (...args) => {
                  originalConsole.warn(...args);
                  try {
                    window.parent.postMessage({
                      type: 'console',
                      level: 'warn',
                      message: args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                      ).join(' ')
                    }, '*');
                  } catch (e) {
                    originalConsole.error('Console warn message error:', e);
                  }
                }
              };

              // Error handling
              window.addEventListener('error', (event) => {
                try {
                  window.parent.postMessage({
                    type: 'console',
                    level: 'error',
                    message: \`Error: \${event.message} at line \${event.lineno}\`
                  }, '*');
                } catch (e) {
                  originalConsole.error('Error message posting failed:', e);
                }
              });

              window.addEventListener('unhandledrejection', (event) => {
                try {
                  window.parent.postMessage({
                    type: 'console',
                    level: 'error',
                    message: \`Unhandled Promise Rejection: \${event.reason}\`
                  }, '*');
                } catch (e) {
                  originalConsole.error('Unhandled rejection message posting failed:', e);
                }
              });

              // Execute the React code
              try {
                const code = \`${cleanedJS.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
                
                if (!code.trim()) {
                  console.log('No JavaScript code to execute');
                  return;
                }
                
                // Transform JSX using Babel
                const transformedCode = Babel.transform(code, {
                  presets: [['react', { runtime: 'classic' }]],
                  plugins: []
                }).code;
                
                console.log('Executing React code...');
                
                // Execute in a safer context with React and ReactDOM available
                const executeCode = new Function(
                  'React', 
                  'ReactDOM', 
                  'useState', 
                  'useEffect', 
                  'useContext', 
                  'useReducer', 
                  'useCallback', 
                  'useMemo', 
                  'useRef', 
                  'useImperativeHandle', 
                  'useLayoutEffect', 
                  'useDebugValue',
                  transformedCode
                );
                
                executeCode(
                  window.React, 
                  window.ReactDOM, 
                  useState, 
                  useEffect, 
                  useContext, 
                  useReducer, 
                  useCallback, 
                  useMemo, 
                  useRef, 
                  useImperativeHandle, 
                  useLayoutEffect, 
                  useDebugValue
                );
                
              } catch (error) {
                console.error('React Error:', error);
                try {
                  window.parent.postMessage({
                    type: 'console',
                    level: 'error',
                    message: \`React Error: \${error.message}\`
                  }, '*');
                } catch (e) {
                  originalConsole.error('React error message posting failed:', e);
                }
              }
            }
            
            // Wait for React to be fully loaded
            if (window.React && window.ReactDOM && window.Babel) {
              executeUserCode();
            } else {
              window.addEventListener('load', executeUserCode);
            }
          </script>
        </body>
        </html>
      `;
    } else {
      // Vanilla JavaScript mode
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vanilla JS Preview</title>
          <style>
            ${css}
            
            /* Base iframe styles */
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              overflow-x: hidden;
            }
          </style>
        </head>
        <body>
          ${html.includes('<body>') ? html.replace(/<body[^>]*>/, '<body>').replace('</body>', '') : `<div id="app"></div>`}
          
          <script>
            // Override console methods to capture output
            const originalConsole = window.console;
            window.console = {
              ...originalConsole,
              log: (...args) => {
                originalConsole.log(...args);
                try {
                  window.parent.postMessage({
                    type: 'console',
                    level: 'log',
                    message: args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ')
                  }, '*');
                } catch (e) {
                  originalConsole.error('Console message error:', e);
                }
              },
              error: (...args) => {
                originalConsole.error(...args);
                try {
                  window.parent.postMessage({
                    type: 'console',
                    level: 'error',
                    message: args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ')
                  }, '*');
                } catch (e) {
                  originalConsole.error('Console error message error:', e);
                }
              },
              warn: (...args) => {
                originalConsole.warn(...args);
                try {
                  window.parent.postMessage({
                    type: 'console',
                    level: 'warn',
                    message: args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ')
                  }, '*');
                } catch (e) {
                  originalConsole.error('Console warn message error:', e);
                }
              }
            };

            // Error handling
            window.addEventListener('error', (event) => {
              try {
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: \`Error: \${event.message} at line \${event.lineno}\`
                }, '*');
              } catch (e) {
                originalConsole.error('Error message posting failed:', e);
              }
            });

            // Execute vanilla JavaScript code
            try {
              console.log('Executing vanilla JavaScript code...');
              ${javascript.replace(/`/g, '\\`')}
            } catch (error) {
              console.error('JavaScript Error:', error);
              try {
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: \`JavaScript Error: \${error.message}\`
                }, '*');
              } catch (e) {
                originalConsole.error('JavaScript error message posting failed:', e);
              }
            }
          </script>
        </body>
        </html>
      `;
    }
  }, [html, css, javascript, isReactMode, isLogicMode]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data && event.data.type === 'console') {
      onConsoleOutput({
        type: event.data.level || event.data.type,
        message: event.data.message || '',
        timestamp: event.data.timestamp || Date.now()
      });
    }
  }, [onConsoleOutput]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Update iframe content
    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(previewContent);
      doc.close();
    }
  }, [previewContent]);

  return (
    <div className="h-full bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        title="Preview"
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    </div>
  );
};

export default Preview;
