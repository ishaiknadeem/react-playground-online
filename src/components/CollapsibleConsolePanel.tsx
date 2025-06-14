
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Preview from './Preview';
import Console from './Console';

interface FileContent {
  html: string;
  css: string;
  javascript: string;
}

type CompilerMode = 'react' | 'vanilla' | 'logic';

interface CollapsibleConsolePanelProps {
  files: FileContent;
  packages: string[];
  previewKey: number;
  compilerMode: CompilerMode;
  consoleOutput: Array<{type: string, message: string, timestamp: number}>;
  onConsoleOutput: (output: {type: string, message: string, timestamp: number}) => void;
}

const CollapsibleConsolePanel: React.FC<CollapsibleConsolePanelProps> = ({
  files,
  packages,
  previewKey,
  compilerMode,
  consoleOutput,
  onConsoleOutput
}) => {
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

  return (
    <div className="w-1/2 flex flex-col bg-gray-900/30">
      {/* Preview */}
      <div className={`${isConsoleCollapsed ? 'flex-1' : 'flex-1'} border-b border-gray-700/50`}>
        <div className="bg-gray-800/70 px-6 py-3 border-b border-gray-700/50 flex items-center justify-between backdrop-blur-sm">
          <h3 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{compilerMode === 'logic' ? 'Function Output' : 'Live Preview'}</span>
          </h3>
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
            Auto-compile enabled
          </Badge>
        </div>
        <Preview
          key={previewKey}
          html={files.html}
          css={files.css}
          javascript={files.javascript}
          packages={packages}
          onConsoleOutput={onConsoleOutput}
          isReactMode={compilerMode === 'react'}
          isLogicMode={compilerMode === 'logic'}
        />
      </div>

      {/* Collapsible Console */}
      <div className={`${isConsoleCollapsed ? 'h-auto' : 'h-48'} bg-gray-900/70 transition-all duration-300`}>
        <div className="bg-gray-800/70 px-6 py-2 border-b border-gray-700/50 flex items-center justify-between backdrop-blur-sm">
          <h3 className="text-sm font-medium text-gray-300 flex items-center space-x-2">
            <span>Console</span>
            {consoleOutput.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                {consoleOutput.length}
              </Badge>
            )}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-1 h-auto"
          >
            {isConsoleCollapsed ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {!isConsoleCollapsed && (
          <div className="h-40">
            <Console output={consoleOutput} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleConsolePanel;
