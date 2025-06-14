
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
    // Transform React/JSX code to work in browser
    const transformedJS = javascript
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
          }
        </style>
      </head>
      <body>
        ${html.replace(/<script.*?<\/script>/gs, '')}
        
        <script>
          // Override console methods to capture output
          const originalConsole = window.console;
          window.console = {
            ...originalConsole,
            log: (...args) => {
              originalConsole.log(...args);
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                message: args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ')
              }, '*');
            },
            error: (...args) => {
              originalConsole.error(...args);
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ')
              }, '*');
            },
            warn: (...args) => {
              originalConsole.warn(...args);
              window.parent.postMessage({
                type: 'console',
                level: 'warn',
                message: args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ')
              }, '*');
            }
          };

          // Error handling
          window.addEventListener('error', (event) => {
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: event.message + ' at line ' + event.lineno
            }, '*');
          });

          // Transform and execute the JavaScript code
          try {
            const code = \`${transformedJS}\`;
            
            // Use Babel to transform JSX
            const transformedCode = Babel.transform(code, {
              presets: ['react'],
              plugins: []
            }).code;
            
            // Execute the transformed code
            eval(transformedCode);
          } catch (error) {
            console.error('JavaScript Error:', error.message);
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: 'JavaScript Error: ' + error.message
            }, '*');
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
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default Preview;
