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

      // Pure JavaScript Logic Mode - Console Only
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JavaScript Logic Console</title>
          <style>
            ${css}
            
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
              background: #0d1117;
              color: #c9d1d9;
              height: 100vh;
              overflow: hidden;
            }

            .console-container {
              height: 100vh;
              display: flex;
              flex-direction: column;
            }

            .console-header {
              background: #161b22;
              border-bottom: 1px solid #30363d;
              padding: 12px 16px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              font-weight: 500;
            }

            .status-dot {
              width: 8px;
              height: 8px;
              background: #238636;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }

            .console-output {
              flex: 1;
              padding: 16px;
              overflow-y: auto;
              font-size: 13px;
              line-height: 1.5;
            }

            .console-line {
              margin: 4px 0;
              padding: 4px 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }

            .console-log {
              color: #7c3aed;
            }

            .console-error {
              color: #f87171;
              background: rgba(248, 113, 113, 0.1);
              padding: 8px;
              border-left: 3px solid #f87171;
              border-radius: 4px;
              margin: 8px 0;
            }

            .console-warn {
              color: #fbbf24;
            }

            .timestamp {
              color: #6b7280;
              font-size: 11px;
              margin-right: 8px;
            }
          </style>
        </head>
        <body>
          <div class="console-container">
            <div class="console-header">
              <div class="status-dot"></div>
              <span>JavaScript Console</span>
            </div>
            <div id="console" class="console-output">
              <div class="console-line">
                <span class="timestamp">[Loading...]</span>
                <span>🔧 Initializing JavaScript environment...</span>
              </div>
            </div>
          </div>
          
          <script>
            const originalConsole = window.console;
            const consoleElement = document.getElementById('console');
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
            
            function addToConsole(type, message) {
              const timestamp = new Date().toLocaleTimeString();
              const line = document.createElement('div');
              line.className = 'console-line console-' + type;
              line.innerHTML = \`<span class="timestamp">[\${timestamp}]</span><span>\${message}</span>\`;
              consoleElement.appendChild(line);
              consoleElement.scrollTop = consoleElement.scrollHeight;
              
              sendToParent(type, message, Date.now());
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
                addToConsole('log', message);
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
                addToConsole('error', message);
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
                addToConsole('warn', message);
              }
            };

            // Global error handling
            window.addEventListener('error', function(event) {
              const message = \`❌ Runtime Error: \${event.message}\${event.filename ? ' in ' + event.filename : ''}\${event.lineno ? ' at line ' + event.lineno : ''}\`;
              addToConsole('error', message);
            });

            window.addEventListener('unhandledrejection', function(event) {
              const message = \`❌ Unhandled Promise Rejection: \${event.reason}\`;
              addToConsole('error', message);
              event.preventDefault();
            });

            // Execute user code
            function executeCode() {
              if (isInitialized) return;
              isInitialized = true;
              
              // Clear loading and start execution
              consoleElement.innerHTML = '';
              addToConsole('log', '🚀 JavaScript execution environment ready!');
              
              try {
                const userCode = \`${codeToExecute.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
                
                if (!userCode.trim()) {
                  console.log('📝 No JavaScript code provided - add your code to see it execute!');
                  return;
                }
                
                console.log('⚡ Executing JavaScript code...');
                console.log('━'.repeat(40));
                
                eval(userCode);
                
                console.log('━'.repeat(40));
                console.log('✅ JavaScript execution completed!');
              } catch (error) {
                console.error('JavaScript Execution Error:', error.message);
                if (error.stack) {
                  console.error('Stack trace:', error.stack);
                }
              }
            }
            
            // Execute when ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', executeCode);
            } else {
              setTimeout(executeCode, 100);
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
      // Vanilla JavaScript mode - FIXED to properly expose functions to global scope
      console.log('Building vanilla JS preview with HTML:', html);
      console.log('Building vanilla JS preview with CSS:', css);
      console.log('Building vanilla JS preview with JS:', javascript);
      
      // Determine the HTML content to use
      let htmlContent;
      if (html && html.trim()) {
        // User provided HTML - use it directly but ensure proper structure
        if (html.includes('<!DOCTYPE') || html.includes('<html')) {
          // Full HTML document provided
          htmlContent = html;
        } else if (html.includes('<body>')) {
          // Body tag provided, wrap in minimal HTML
          htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head>${html}</html>`;
        } else {
          // Just content, wrap in full structure
          htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body>${html}</body></html>`;
        }
      } else {
        // No HTML provided, create basic structure
        htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body><div id="app">
          <h1>Vanilla JavaScript Preview</h1>
          <p>Add your HTML content in the HTML tab, or use JavaScript to create elements dynamically.</p>
          <div id="output"></div>
        </body></html>`;
      }

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
              padding: 20px;
            }

            #app {
              min-height: 50vh;
            }

            #output {
              margin-top: 20px;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              background: #f9f9f9;
            }
          </style>
        </head>
        <body>
          ${html.trim() || `
            <div id="app">
              <h1>Vanilla JavaScript Preview</h1>
              <p>Add your HTML content in the HTML tab, or use JavaScript to create elements dynamically.</p>
              <div id="output"></div>
            </div>
          `}
          
          <script>
            console.log('🚀 Vanilla JavaScript mode initialized');
            
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
                      typeof arg === 'object' && arg !== null ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '),
                    timestamp: Date.now()
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
                      typeof arg === 'object' && arg !== null ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '),
                    timestamp: Date.now()
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
                      typeof arg === 'object' && arg !== null ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '),
                    timestamp: Date.now()
                  }, '*');
                } catch (e) {
                  originalConsole.error('Console warn message error:', e);
                }
              }
            };

            // Global error handling
            window.addEventListener('error', (event) => {
              const errorMessage = \`❌ Error: \${event.message}\${event.filename ? ' in ' + event.filename : ''}\${event.lineno ? ' at line ' + event.lineno : ''}\`;
              console.error(errorMessage);
            });

            window.addEventListener('unhandledrejection', (event) => {
              console.error('❌ Unhandled Promise Rejection:', event.reason);
              event.preventDefault();
            });

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', executeUserCode);
            } else {
              // DOM is already ready
              executeUserCode();
            }

            function executeUserCode() {
              try {
                console.log('⚡ Executing vanilla JavaScript code...');
                
                const userCode = \`${javascript.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
                
                if (!userCode.trim()) {
                  console.log('📝 No JavaScript code provided - add your code to see it execute!');
                  // Still show the HTML content even without JS
                  return;
                }
                
                console.log('🔄 Running user JavaScript...');
                
                // Execute user code directly in global scope using window.eval
                // This ensures functions are properly exposed to the global window object
                window.eval(userCode);
                
                console.log('✅ JavaScript execution completed successfully!');
                
              } catch (error) {
                console.error('❌ JavaScript Error:', error.message);
                if (error.stack) {
                  console.error('Stack trace:', error.stack);
                }
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
