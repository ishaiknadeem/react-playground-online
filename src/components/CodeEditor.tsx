
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Save, Share2, Download, Settings, Folder, FileText, Code, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MonacoEditor from '@monaco-editor/react';
import Preview from './Preview';
import Console from './Console';
import PackageManager from './PackageManager';
import { toast } from '@/hooks/use-toast';

interface FileContent {
  html: string;
  css: string;
  javascript: string;
}

const defaultFiles: FileContent = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`,
  css: `/* Your CSS styles here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#root {
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.title {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
}

.button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.button:hover {
  transform: translateY(-2px);
}`,
  javascript: `import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('World');

  console.log('App rendered with count:', count);

  return (
    <div className="container">
      <h1 className="title">Welcome to React Playground!</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <p style={{ fontSize: '18px', color: '#666', margin: '20px 0' }}>
          Hello, {name}! 👋
        </p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '2px solid #ddd',
            fontSize: '16px',
            marginBottom: '20px',
            width: '200px'
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#555', marginBottom: '20px' }}>
          Counter: {count}
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            className="button"
            onClick={() => setCount(count + 1)}
          >
            Increment
          </button>
          
          <button
            className="button"
            onClick={() => setCount(count - 1)}
          >
            Decrement
          </button>
          
          <button
            className="button"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#666', margin: 0 }}>
          🚀 Edit the code and see changes in real-time!
        </p>
      </div>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
};

const CodeEditor = () => {
  const [files, setFiles] = useState<FileContent>(defaultFiles);
  const [activeTab, setActiveTab] = useState<keyof FileContent>('javascript');
  const [packages, setPackages] = useState<string[]>(['react', 'react-dom']);
  const [consoleOutput, setConsoleOutput] = useState<Array<{type: string, message: string, timestamp: number}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Auto-save to localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('code-editor-files');
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Failed to load saved files:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('code-editor-files', JSON.stringify(files));
    // Auto-compile on file changes
    setPreviewKey(prev => prev + 1);
  }, [files]);

  const updateFile = useCallback((fileType: keyof FileContent, content: string) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: content
    }));
  }, []);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setConsoleOutput([]);
    setPreviewKey(prev => prev + 1);
    
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Code Compiled",
        description: "Your React code has been compiled and is running in the preview.",
      });
    }, 500);
  }, []);

  const resetCode = useCallback(() => {
    setFiles(defaultFiles);
    setConsoleOutput([]);
    setPreviewKey(prev => prev + 1);
    toast({
      title: "Code Reset",
      description: "Your code has been reset to default.",
    });
  }, []);

  const saveProject = useCallback(() => {
    const projectData = {
      files,
      packages,
      timestamp: Date.now()
    };
    
    localStorage.setItem('code-editor-project', JSON.stringify(projectData));
    toast({
      title: "Project Saved",
      description: "Your project has been saved locally.",
    });
  }, [files, packages]);

  const shareProject = useCallback(() => {
    const shareData = {
      files,
      packages
    };
    
    const shareUrl = `${window.location.origin}?share=${btoa(JSON.stringify(shareData))}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Copied",
      description: "Share link has been copied to clipboard.",
    });
  }, [files, packages]);

  const getFileIcon = (fileType: keyof FileContent) => {
    switch (fileType) {
      case 'html': return <FileText className="w-4 h-4" />;
      case 'css': return <Palette className="w-4 h-4" />;
      case 'javascript': return <Code className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getLanguage = (fileType: keyof FileContent) => {
    switch (fileType) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'javascript';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold">React Playground</h1>
            </div>
            <Badge variant="secondary" className="bg-green-600 text-white">
              Live Compiler
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Compiling...' : 'Compile & Run'}
            </Button>
            
            <Button
              onClick={resetCode}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={saveProject}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button
              onClick={shareProject}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {/* File Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof FileContent)} className="flex-1 flex flex-col">
            <TabsList className="bg-gray-800 border-b border-gray-700 rounded-none justify-start p-0 h-auto">
              {Object.keys(files).map((fileType) => (
                <TabsTrigger
                  key={fileType}
                  value={fileType}
                  className="data-[state=active]:bg-gray-700 rounded-none border-r border-gray-700 px-4 py-3 flex items-center space-x-2"
                >
                  {getFileIcon(fileType as keyof FileContent)}
                  <span className="capitalize">{fileType === 'javascript' ? 'JS/React' : fileType}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(files).map(([fileType, content]) => (
              <TabsContent key={fileType} value={fileType} className="flex-1 m-0">
                <MonacoEditor
                  height="100%"
                  language={getLanguage(fileType as keyof FileContent)}
                  theme="vs-dark"
                  value={content}
                  onChange={(value) => updateFile(fileType as keyof FileContent, value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right Panel - Preview and Console */}
        <div className="w-1/2 flex flex-col">
          {/* Preview */}
          <div className="flex-1 border-b border-gray-700">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Compiled Output</h3>
              <Badge variant="outline" className="text-xs">
                Auto-compile enabled
              </Badge>
            </div>
            <Preview
              key={previewKey}
              html={files.html}
              css={files.css}
              javascript={files.javascript}
              packages={packages}
              onConsoleOutput={(output) => setConsoleOutput(prev => [...prev, output])}
            />
          </div>

          {/* Console */}
          <div className="h-48">
            <Console output={consoleOutput} />
          </div>
        </div>
      </div>

      {/* Package Manager - Hidden for now, can be toggled */}
      <PackageManager
        packages={packages}
        onPackagesChange={setPackages}
        isVisible={false}
      />
    </div>
  );

  function getFileIcon(fileType: keyof FileContent) {
    switch (fileType) {
      case 'html': return <FileText className="w-4 h-4" />;
      case 'css': return <Palette className="w-4 h-4" />;
      case 'javascript': return <Code className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }

  function getLanguage(fileType: keyof FileContent) {
    switch (fileType) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'javascript';
    }
  }
};

export default CodeEditor;
