
import React, { useEffect, useRef, useCallback } from 'react';

interface PreviewProps {
  html: string;
  css: string;
  javascript: string;
  packages: string[];
  onConsoleOutput: (output: {type: string, message: string, timestamp: number}) => void;
}

const Preview: React.FC<PreviewProps> = ({ html, css, javascript, packages, onConsoleOutput }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const createPreviewContent = useCallback(() => {
    // Clean and prepare the JavaScript code
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
        <title>Preview</title>
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
        <div id="root"></div>
        
        <script>
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

          // Execute the code
          try {
            const code = \`${cleanedJS.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
            
            // Transform JSX using Babel
            const transformedCode = Babel.transform(code, {
              presets: [['react', { runtime: 'classic' }]],
              plugins: []
            }).code;
            
            console.log('Executing transformed code...');
            
            // Execute in a safer context with React and ReactDOM available
            const executeCode = new Function('React', 'ReactDOM', 'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue', transformedCode);
            executeCode(window.React, window.ReactDOM, useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue);
            
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
  }, [html, css, javascript]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        onConsoleOutput({
          type: event.data.level,
          message: event.data.message,
          timestamp: Date.now()
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Update iframe content
    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(createPreviewContent());
      doc.close();
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [html, css, javascript, createPreviewContent, onConsoleOutput]);

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
