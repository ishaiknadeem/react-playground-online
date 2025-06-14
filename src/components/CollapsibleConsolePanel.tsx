
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
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
  return (
    <div className="w-1/2 flex flex-col bg-gray-900/30">
      <ResizablePanelGroup direction="vertical">
        {/* Preview Panel */}
        <ResizablePanel defaultSize={75} minSize={30}>
          <div className="h-full border-b border-gray-700/50">
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
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle className="bg-gray-700/50 hover:bg-gray-600/50 transition-colors" />

        {/* Console Panel */}
        <ResizablePanel defaultSize={25} minSize={15} maxSize={70}>
          <div className="h-full bg-gray-900/70">
            <Console output={consoleOutput} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CollapsibleConsolePanel;
