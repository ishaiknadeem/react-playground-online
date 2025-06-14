
import React, { useEffect, useRef } from 'react';
import { AlertCircle, Info, AlertTriangle, Terminal } from 'lucide-react';

interface ConsoleOutput {
  type: string;
  message: string;
  timestamp: number;
}

interface ConsoleProps {
  output: ConsoleOutput[];
}

const Console: React.FC<ConsoleProps> = ({ output }) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />;
      case 'log':
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />;
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-300';
      case 'warn':
        return 'text-yellow-300';
      case 'log':
      default:
        return 'text-gray-300';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="h-full bg-gray-900 border-t border-gray-700 flex flex-col">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
        <Terminal className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-300">Console</h3>
        {output.length > 0 && (
          <span className="text-xs text-gray-500">({output.length} messages)</span>
        )}
      </div>
      
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm"
      >
        {output.length === 0 ? (
          <div className="text-gray-500 italic">
            Console output will appear here. Try adding console.log() to your code.
          </div>
        ) : (
          output.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 py-1 px-2 rounded hover:bg-gray-800 transition-colors"
            >
              {getIcon(item.type)}
              <div className="flex-1">
                <div className={`${getTextColor(item.type)} whitespace-pre-wrap break-words`}>
                  {item.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(item.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Console;
