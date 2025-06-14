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
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/`/g, '\\`')
        .replace(/\r?\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

      // Add sample data if no user code is provided
      const sampleCode = `
// Sample Dataset - Feel free to modify or replace!
const users = [
  { id: 1, name: "Alice Johnson", age: 28, role: "Developer", salary: 75000 },
  { id: 2, name: "Bob Smith", age: 34, role: "Designer", salary: 68000 },
  { id: 3, name: "Carol Davis", age: 29, role: "Manager", salary: 85000 },
  { id: 4, name: "David Wilson", age: 31, role: "Developer", salary: 72000 },
  { id: 5, name: "Eva Brown", age: 26, role: "Analyst", salary: 62000 }
];

const products = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics", inStock: true },
  { id: 2, name: "Coffee Mug", price: 15, category: "Home", inStock: true },
  { id: 3, name: "Notebook", price: 8, category: "Office", inStock: false },
  { id: 4, name: "Smartphone", price: 699, category: "Electronics", inStock: true }
];

// Example operations you can try:
console.log("👥 Sample Users:", users);
console.log("📦 Sample Products:", products);

// Filter examples
const developers = users.filter(user => user.role === "Developer");
console.log("🔍 Developers only:", developers);

const expensiveProducts = products.filter(product => product.price > 100);
console.log("💰 Expensive products:", expensiveProducts);

// Map examples
const userNames = users.map(user => user.name);
console.log("📝 User names:", userNames);

// Reduce examples
const totalSalaries = users.reduce((sum, user) => sum + user.salary, 0);
console.log("💵 Total salaries:", totalSalaries);

const averageSalary = totalSalaries / users.length;
console.log("📊 Average salary:", averageSalary.toFixed(2));

console.log("✨ Try writing your own JavaScript logic above this sample code!");
      `.trim();

      const codeToExecute = javascript.trim() || sampleCode;
      const finalEscapedCode = codeToExecute
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/`/g, '\\`')
        .replace(/\r?\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

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
            
            /* Enhanced UX styles */
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              overflow-x: hidden;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 20px;
            }

            .container {
              max-width: 1200px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              margin-bottom: 30px;
              color: white;
            }

            .header h1 {
              font-size: 2.5rem;
              margin: 0 0 10px 0;
              font-weight: 700;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }

            .header p {
              font-size: 1.1rem;
              opacity: 0.9;
              margin: 0;
            }

            .results-container {
              background: white;
              border-radius: 16px;
              padding: 30px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.2);
            }

            .results-header {
              margin: 0 0 25px 0;
              color: #2d3748;
              font-size: 1.3rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 12px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e2e8f0;
            }

            .status-indicator {
              width: 12px;
              height: 12px;
              background: #48bb78;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }

            .results-output {
              font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
              background: #1a202c;
              color: #e2e8f0;
              padding: 25px;
              border-radius: 12px;
              white-space: pre-wrap;
              overflow-x: auto;
              min-height: 400px;
              font-size: 14px;
              line-height: 1.6;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }

            .result-item {
              margin: 6px 0;
              padding: 8px 0;
              border-left: 3px solid transparent;
              padding-left: 12px;
              transition: all 0.2s ease;
            }

            .result-item:hover {
              background: rgba(255,255,255,0.05);
              border-radius: 6px;
            }

            .result-log {
              color: #68d391;
              border-left-color: #68d391;
            }

            .result-error {
              color: #fc8181;
              border-left-color: #fc8181;
              background: rgba(252, 129, 129, 0.1);
            }

            .result-warn {
              color: #f6e05e;
              border-left-color: #f6e05e;
            }

            .timestamp {
              color: #a0aec0;
              font-size: 12px;
              margin-right: 8px;
            }

            .welcome-message {
              background: linear-gradient(90deg, #4299e1, #3182ce);
              color: white;
              padding: 15px 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>JavaScript Logic Compiler</h1>
              <p>Execute JavaScript code and see real-time results</p>
            </div>
            
            <div class="results-container">
              <div class="results-header">
                <span>🚀</span>
                <span>Execution Results</span>
                <div class="status-indicator"></div>
              </div>
              
              <div class="welcome-message">
                ${javascript.trim() ? 'Executing your custom JavaScript code...' : 'Running sample code demonstration - replace with your own JavaScript!'}
              </div>
              
              <div id="results" class="results-output">
                <div class="result-item result-log">
                  <span class="timestamp">[Loading...]</span>
                  🔧 Initializing JavaScript environment...
                </div>
              </div>
            </div>
          </div>
          
          <script>
            // Store original console for internal use
            const originalConsole = window.console;
            const results = [];
            let isInitialized = false;
            
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
                  return \`<div class="result-item \${className}">
                    <span class="timestamp">[\${timestamp}]</span>
                    \${result.message}
                  </div>\`;
                }).join('');
                resultsDiv.scrollTop = resultsDiv.scrollHeight;
              }
            }

            // Override console methods with enhanced formatting
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
                const message = '❌ ' + args.map(arg => {
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
                const message = '⚠️ ' + args.map(arg => {
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
              const message = \`❌ Runtime Error: \${event.message}\${event.filename ? ' in ' + event.filename : ''}\${event.lineno ? ' at line ' + event.lineno : ''}\`;
              addResult('error', message);
            });

            window.addEventListener('unhandledrejection', function(event) {
              const message = \`❌ Unhandled Promise Rejection: \${event.reason}\`;
              addResult('error', message);
              event.preventDefault();
            });

            // Initialize and execute user code
            function executeUserCode() {
              if (isInitialized) return;
              isInitialized = true;
              
              // Clear loading message and add welcome
              results.length = 0;
              addResult('log', '🚀 JavaScript execution environment ready!');
              
              try {
                const userCode = '${finalEscapedCode}';
                
                if (!userCode.trim()) {
                  console.log('📝 No JavaScript code provided - add your code to see it execute!');
                  return;
                }
                
                console.log('⚡ Executing JavaScript code...');
                console.log('━'.repeat(50));
                
                // Execute the user's code using eval in a try-catch
                eval(userCode);
                
                console.log('━'.repeat(50));
                console.log('✅ JavaScript execution completed successfully!');
              } catch (error) {
                console.error('JavaScript Execution Error:', error.message);
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
