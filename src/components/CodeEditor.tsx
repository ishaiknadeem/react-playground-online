import React, { useState, useEffect, useCallback } from 'react';
import { Play, Settings, Folder, FileText, Code, Palette, RotateCcw, Zap, Code2, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MonacoEditor from '@monaco-editor/react';
import Preview from './Preview';
import Console from './Console';
import PackageManager from './PackageManager';
import { toast } from '@/hooks/use-toast';
import CollapsibleConsolePanel from './CollapsibleConsolePanel';

interface FileContent {
  html: string;
  css: string;
  javascript: string;
}

type CompilerMode = 'react' | 'vanilla' | 'logic';

const defaultFilesReact: FileContent = {
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

const defaultFilesVanilla: FileContent = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla JS App</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>`,
  css: `/* Your CSS styles here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
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
  margin: 0 5px;
}

.button:hover {
  transform: translateY(-2px);
}

.input {
  padding: 10px;
  border-radius: 6px;
  border: 2px solid #ddd;
  font-size: 16px;
  margin-bottom: 20px;
  width: 200px;
}`,
  javascript: `// Vanilla JavaScript App
let count = 0;
let name = 'World';

function createApp() {
  const app = document.getElementById('app');
  
  app.innerHTML = \`
    <div class="container">
      <h1 class="title">Welcome to Vanilla JS Playground!</h1>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <p style="font-size: 18px; color: #666; margin: 20px 0;">
          Hello, \${name}! 👋
        </p>
        
        <input
          type="text"
          value="\${name}"
          placeholder="Enter your name"
          class="input"
          id="nameInput"
        />
      </div>

      <div style="text-align: center;">
        <h2 style="color: #555; margin-bottom: 20px;">
          Counter: \${count}
        </h2>
        
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="button" onclick="increment()">
            Increment
          </button>
          
          <button class="button" onclick="decrement()">
            Decrement
          </button>
          
          <button class="button" onclick="reset()">
            Reset
          </button>
        </div>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
        <p style="color: #666; margin: 0;">
          🚀 Edit the code and see changes in real-time!
        </p>
      </div>
    </div>
  \`;
  
  // Add event listener for name input
  const nameInput = document.getElementById('nameInput');
  nameInput.addEventListener('input', (e) => {
    name = e.target.value;
    createApp(); // Re-render
  });
}

function increment() {
  count++;
  console.log('Count incremented:', count);
  createApp();
}

function decrement() {
  count--;
  console.log('Count decremented:', count);
  createApp();
}

function reset() {
  count = 0;
  console.log('Count reset:', count);
  createApp();
}

// Initialize app
createApp();`
};

const defaultFilesLogic: FileContent = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Logic Compiler</title>
</head>
<body>
    <div id="output">
        <div style="font-family: monospace; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">📊 Function Results:</h3>
            <div id="results"></div>
        </div>
    </div>
</body>
</html>`,
  css: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

#output {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

#results {
  font-family: 'Courier New', monospace;
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  white-space: pre-wrap;
  overflow-x: auto;
  min-height: 200px;
}

.result-item {
  margin: 8px 0;
  padding: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  border-left: 3px solid #4fd1c7;
}`,
  javascript: `// JavaScript Logic Compiler - Write your functions and logic here

// Example: Mathematical functions
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

// Example: Array operations
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Example: String operations
function reverseWords(str) {
  return str.split(' ').map(word => word.split('').reverse().join('')).join(' ');
}

// Test your functions here
console.log('🧮 Mathematical Functions:');
console.log('Fibonacci(10):', fibonacci(10));
console.log('Is 17 prime?', isPrime(17));
console.log('Is 15 prime?', isPrime(15));

console.log('\\n📊 Array Operations:');
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log('Original array:', unsortedArray);
console.log('Sorted array:', quickSort([...unsortedArray]));

console.log('\\n📝 String Operations:');
const testString = "Hello World JavaScript";
console.log('Original:', testString);
console.log('Reversed words:', reverseWords(testString));

// Your custom functions go here
// Write any JavaScript logic, algorithms, data structures, etc.

// Example: Custom function
function customFunction(input) {
  // Your logic here
  return \`Processed: \${input}\`;
}

console.log('\\n⚡ Custom Function:');
console.log(customFunction('Test Input'));`
};

const CodeEditor = () => {
  const [compilerMode, setCompilerMode] = useState<CompilerMode>('react');
  const [files, setFiles] = useState<FileContent>(defaultFilesReact);
  const [activeTab, setActiveTab] = useState<keyof FileContent>('javascript');
  const [packages, setPackages] = useState<string[]>(['react', 'react-dom']);
  const [consoleOutput, setConsoleOutput] = useState<Array<{type: string, message: string, timestamp: number}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    const savedMode = localStorage.getItem('code-editor-mode');
    const savedFiles = localStorage.getItem('code-editor-files');
    
    if (savedMode) {
      const mode = JSON.parse(savedMode) as CompilerMode;
      setCompilerMode(mode);
      const defaultFiles = mode === 'react' ? defaultFilesReact : 
                          mode === 'vanilla' ? defaultFilesVanilla : defaultFilesLogic;
      setFiles(defaultFiles);
      setPackages(mode === 'react' ? ['react', 'react-dom'] : []);
    } else if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Failed to load saved files:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('code-editor-mode', JSON.stringify(compilerMode));
    localStorage.setItem('code-editor-files', JSON.stringify(files));
    setPreviewKey(prev => prev + 1);
  }, [files, compilerMode]);

  const updateFile = useCallback((fileType: keyof FileContent, content: string) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: content
    }));
  }, []);

  const changeMode = useCallback((mode: CompilerMode) => {
    setCompilerMode(mode);
    const defaultFiles = mode === 'react' ? defaultFilesReact : 
                        mode === 'vanilla' ? defaultFilesVanilla : defaultFilesLogic;
    setFiles(defaultFiles);
    setPackages(mode === 'react' ? ['react', 'react-dom'] : []);
    setConsoleOutput([]);
    setPreviewKey(prev => prev + 1);
    
    const modeNames = { react: 'React', vanilla: 'Vanilla JS', logic: 'JavaScript Logic' };
    toast({
      title: `Switched to ${modeNames[mode]} Mode`,
      description: `Your editor is now configured for ${modeNames[mode].toLowerCase()} development.`,
    });
  }, []);

  const runCode = useCallback(() => {
    setIsRunning(true);
    // Only clear console output for React and Vanilla modes, not Logic mode
    if (compilerMode !== 'logic') {
      setConsoleOutput([]);
    }
    setPreviewKey(prev => prev + 1);
    
    setTimeout(() => {
      setIsRunning(false);
      const modeNames = { react: 'React', vanilla: 'vanilla JavaScript', logic: 'JavaScript logic' };
      toast({
        title: "Code Compiled",
        description: `Your ${modeNames[compilerMode]} code has been compiled and is running in the preview.`,
      });
    }, 500);
  }, [compilerMode]);

  const resetCode = useCallback(() => {
    const defaultFiles = compilerMode === 'react' ? defaultFilesReact : 
                        compilerMode === 'vanilla' ? defaultFilesVanilla : defaultFilesLogic;
    setFiles(defaultFiles);
    setConsoleOutput([]);
    setPreviewKey(prev => prev + 1);
    const modeNames = { react: 'React', vanilla: 'vanilla JavaScript', logic: 'JavaScript logic' };
    toast({
      title: "Code Reset",
      description: `Your code has been reset to the default ${modeNames[compilerMode]} template.`,
    });
  }, [compilerMode]);

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

  const getModeIcon = (mode: CompilerMode) => {
    switch (mode) {
      case 'react': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'vanilla': return <Code className="w-4 h-4 text-green-400" />;
      case 'logic': return <Cpu className="w-4 h-4 text-purple-400" />;
    }
  };

  const getModeColor = (mode: CompilerMode) => {
    switch (mode) {
      case 'react': return 'bg-blue-600 text-white';
      case 'vanilla': return 'bg-green-600 text-white';
      case 'logic': return 'bg-purple-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Modern Header */}
      <div className="border-b border-gray-700/50 bg-gray-800/90 backdrop-blur-sm px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Code Playground
                </h1>
                <p className="text-xs text-gray-400">Build, compile, and preview</p>
              </div>
            </div>
            
            {/* Mode Selector */}
            <div className="flex items-center space-x-3 bg-gray-700/50 rounded-lg px-4 py-2 border border-gray-600/50">
              <Label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                {getModeIcon(compilerMode)}
                <span>Mode:</span>
              </Label>
              <Select value={compilerMode} onValueChange={changeMode}>
                <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="react" className="text-white hover:bg-gray-600">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>React</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vanilla" className="text-white hover:bg-gray-600">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-green-400" />
                      <span>Vanilla JS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="logic" className="text-white hover:bg-gray-600">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span>JS Logic</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge 
              variant="secondary" 
              className={`${getModeColor(compilerMode)} border-0`}
            >
              {compilerMode === 'react' ? 'React Mode' : 
               compilerMode === 'vanilla' ? 'Vanilla JS Mode' : 'JS Logic Mode'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Compiling...' : 'Run Code'}
            </Button>
            
            <Button
              onClick={resetCode}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-85px)]">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 border-r border-gray-700/50 flex flex-col bg-gray-900/50">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof FileContent)} className="flex-1 flex flex-col">
            <TabsList className="bg-gray-800/70 border-b border-gray-700/50 rounded-none justify-start p-0 h-auto backdrop-blur-sm">
              {Object.keys(files).map((fileType) => (
                <TabsTrigger
                  key={fileType}
                  value={fileType}
                  className="data-[state=active]:bg-gray-700/70 data-[state=active]:text-white rounded-none border-r border-gray-700/50 px-6 py-3 flex items-center space-x-2 hover:bg-gray-700/30 transition-colors"
                >
                  {getFileIcon(fileType as keyof FileContent)}
                  <span className="capitalize font-medium">
                    {fileType === 'javascript' ? 
                      (compilerMode === 'react' ? 'React/JSX' : 
                       compilerMode === 'vanilla' ? 'JavaScript' : 'JS Logic') : 
                      fileType}
                  </span>
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
                    fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
                    fontLigatures: true,
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right Panel - Preview and Console */}
        <CollapsibleConsolePanel
          files={files}
          packages={packages}
          previewKey={previewKey}
          compilerMode={compilerMode}
          consoleOutput={consoleOutput}
          onConsoleOutput={(output) => setConsoleOutput(prev => [...prev, output])}
        />
      </div>

      {/* Package Manager - Hidden for now */}
      <PackageManager
        packages={packages}
        onPackagesChange={setPackages}
        isVisible={false}
      />
    </div>
  );
};

export default CodeEditor;
