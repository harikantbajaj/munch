'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Code2, 
  Settings, 
  Download, 
  Copy, 
  Check,
  AlertCircle,
  Loader2,
  Terminal,
  FileText,
  Zap
} from 'lucide-react';

const languages = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', sample: 'console.log("Hello, World!");', jdoodleId: 'nodejs' },
  { id: 'python', name: 'Python', extension: '.py', sample: 'print("Hello, World!")', jdoodleId: 'python3' },
  { id: 'java', name: 'Java', extension: '.java', sample: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}', jdoodleId: 'java' },
  { id: 'cpp', name: 'C++', extension: '.cpp', sample: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}', jdoodleId: 'cpp' },
  { id: 'csharp', name: 'C#', extension: '.cs', sample: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}', jdoodleId: 'csharp' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', sample: 'puts "Hello, World!"', jdoodleId: 'ruby' },
];

interface ExecutionResult {
  stdout: string;
  stderr: string;
  error: string | null;
  executionTime?: string;
  memoryUsage?: string;
}

const CodeCompiler: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(14);

  const runCode = async () => {
    if (!code.trim()) {
      setOutput({
        stdout: '',
        stderr: '',
        error: 'Please enter some code to execute'
      });
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      const selectedLang = languages.find(l => l.id === language);
      if (!selectedLang) {
        setOutput({
          stdout: '',
          stderr: '',
          error: 'Unsupported language selected'
        });
        setLoading(false);
        return;
      }

      // Get JDoodle credentials from environment variables
      const clientId = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID;
      const clientSecret = process.env.NEXT_PUBLIC_JDOODLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('JDoodle credentials not configured. Please add NEXT_PUBLIC_JDOODLE_CLIENT_ID and NEXT_PUBLIC_JDOODLE_CLIENT_SECRET to your .env file.');
      }

      // Call JDoodle API for code execution
      const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: code,
          language: selectedLang.jdoodleId,
          versionIndex: '0',
          clientId: clientId,
          clientSecret: clientSecret
        })
      });

      if (!response.ok) {
        throw new Error(`JDoodle API request failed with status ${response.status}`);
      }

      const result = await response.json();

      setOutput({
        stdout: result.output || '',
        stderr: '',
        error: result.error || null,
        executionTime: result.cpuTime ? `${result.cpuTime}s` : undefined,
        memoryUsage: result.memory ? `${result.memory} KB` : undefined
      });
    } catch (error: any) {
      setOutput({
        stdout: '',
        stderr: '',
        error: error.message || 'Execution failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    const selectedLang = languages.find(l => l.id === language);
    if (selectedLang) {
      setCode(selectedLang.sample);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const downloadCode = () => {
    const selectedLang = languages.find(l => l.id === language);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${selectedLang?.extension || '.txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedLang = languages.find(l => l.id === language);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code2 size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-900">Language:</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Settings size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600">Font Size:</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-2 py-1 text-sm bg-white border border-gray-200 rounded"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
            </div>

            <button
              onClick={loadSample}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1"
            >
              <FileText size={14} />
              <span>Sample</span>
            </button>

            <button
              onClick={downloadCode}
              disabled={!code.trim()}
              className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={14} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-sm font-medium">
              {selectedLang?.name} Editor
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(code)}
              disabled={!code.trim()}
              className="p-1.5 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            className="w-full bg-gray-900 text-gray-100 font-mono p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
            placeholder={`Write your ${selectedLang?.name} code here...\n\nTip: Click "Sample" to load example code`}
          />
          {!code.trim() && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center">
                <Code2 size={48} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Start coding in {selectedLang?.name}</p>
                <p className="text-gray-500 text-sm">Click "Sample" to load example code</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Run Button */}
      <div className="flex justify-center">
        <button
          onClick={runCode}
          disabled={loading || !code.trim()}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play size={24} />
              <span>Run Code</span>
              <Zap size={20} />
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {(output || loading) && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal size={16} className="text-green-400" />
              <span className="text-gray-300 text-sm font-medium">Output</span>
            </div>
            {output && (
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                {output.executionTime && (
                  <span>Time: {output.executionTime}</span>
                )}
                {output.memoryUsage && (
                  <span>Memory: {output.memoryUsage}</span>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 min-h-[200px] font-mono text-sm">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center space-x-3">
                  <Loader2 size={20} className="animate-spin text-green-400" />
                  <span className="text-gray-300">Executing your code...</span>
                </div>
              </div>
            ) : output ? (
              <div className="space-y-4">
                {output.error ? (
                  <div className="flex items-start space-x-2">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-red-400 font-semibold mb-1">Error:</div>
                      <pre className="text-red-300 whitespace-pre-wrap">{output.error}</pre>
                    </div>
                  </div>
                ) : (
                  <>
                    {output.stdout && (
                      <div>
                        <div className="text-green-400 font-semibold mb-2 flex items-center space-x-2">
                          <Check size={16} />
                          <span>Output:</span>
                        </div>
                        <pre className="text-green-300 whitespace-pre-wrap bg-gray-800/50 p-3 rounded-lg">
                          {output.stdout}
                        </pre>
                      </div>
                    )}
                    {output.stderr && (
                      <div>
                        <div className="text-yellow-400 font-semibold mb-2">Warnings:</div>
                        <pre className="text-yellow-300 whitespace-pre-wrap bg-gray-800/50 p-3 rounded-lg">
                          {output.stderr}
                        </pre>
                      </div>
                    )}
                    {!output.stdout && !output.stderr && (
                      <div className="text-gray-400 text-center py-8">
                        <Square size={24} className="mx-auto mb-2 opacity-50" />
                        <p>No output generated</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Quick Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use the "Sample" button to load example code for each language</li>
              <li>• Adjust font size for better readability</li>
              <li>• Download your code to save it locally</li>
              <li>• Check the output section for execution results and errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCompiler;
