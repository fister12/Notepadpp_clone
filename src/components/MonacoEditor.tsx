'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-800 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p>Loading ColabPad Editor...</p>
      </div>
    </div>
  ),
});

interface MonacoEditorProps {
  fileId: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light';
  roomId: string;
  userId: string;
  userName: string;
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  fileId,
  language = 'typescript',
  theme = 'vs-dark',
  roomId,
  userId,
  userName,
  onContentChange,
  initialContent = '',
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [isConnected, setIsConnected] = useState(false);

  const handleEditorDidMount: OnMount = (editorInstance) => {
    editorRef.current = editorInstance;

    // Set initial content
    if (initialContent) {
      editorInstance.setValue(initialContent);
    }

    // Listen for content changes
    if (onContentChange) {
      editorInstance.onDidChangeModelContent(() => {
        onContentChange(editorInstance.getValue());
      });
    }

    // Configure editor options
    editorInstance.updateOptions({
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      contextmenu: true,
      folding: true,
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      mouseWheelZoom: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Simulate connection status (for demo purposes)
    setTimeout(() => setIsConnected(true), 1000);
  };

  return (
    <div className="h-full w-full relative">
      {/* Connection status indicator */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-gray-800 px-2 py-1 rounded text-xs">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className="text-white">
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      <Editor
        height="100%"
        language={language}
        theme={theme}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-800 text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Loading ColabPad Editor...</p>
            </div>
          </div>
        }
        options={{
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          contextmenu: true,
          folding: true,
          renderLineHighlight: 'all',
          selectOnLineNumbers: true,
          mouseWheelZoom: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;