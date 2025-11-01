'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

import FileExplorer, { FileItem } from '@/components/FileExplorer';
import TabSystem from '@/components/TabSystem';
import UserPresence from '@/components/UserPresence';
import RoomManager from '@/components/RoomManager';

// Dynamically import Monaco Editor wrapper to avoid SSR issues
const MonacoEditor = dynamic(() => import('@/components/MonacoWrapper'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-800 text-white">
      Loading ColabPad...
    </div>
  ),
});

interface Tab {
  id: string;
  file: FileItem;
  isDirty: boolean;
  isActive: boolean;
}

interface ActiveUser {
  id: string;
  name: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
  isTyping?: boolean;
}

export default function Home() {
  // User and Room State
  const [userId] = useState(() => uuidv4());
  const [userName] = useState(() => `User_${Math.random().toString(36).substr(2, 4)}`);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  // File Management State
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'welcome',
      name: 'Welcome.md',
      type: 'file',
      language: 'markdown',
      content: `# Welcome to ColabPad! 🚀

ColabPad is a collaborative code editor inspired by Notepad++. Here's what you can do:

## Features ✨
- **Real-time collaboration**: Multiple people can edit simultaneously
- **Syntax highlighting**: Support for multiple programming languages
- **File management**: Create, rename, and organize files and folders
- **Tab system**: Work with multiple files at once
- **User presence**: See who's online and what they're working on

## Getting Started 🛠️
1. Create or join a room to start collaborating
2. Use the file explorer to manage your files
3. Start coding together in real-time!

## Supported Languages 💻
- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- Markdown
- JSON
- And many more!

Happy coding! 🎉`,
    },
  ]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize with welcome tab
  useEffect(() => {
    const welcomeFile = files.find(f => f.id === 'welcome');
    if (welcomeFile && tabs.length === 0) {
      const welcomeTab = {
        id: welcomeFile.id,
        file: welcomeFile,
        isDirty: false,
        isActive: true,
      };
      setTabs([welcomeTab]);
      setActiveTabId(welcomeFile.id);
    }
  }, [files, tabs.length]);

  // Check for room ID in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      setRoomId(roomParam);
      setIsConnected(true);
      // Add current user to active users
      setActiveUsers([{
        id: userId,
        name: userName,
        color: '#4ECDC4',
      }]);
    }
  }, [userId, userName]);

  // Room Management
  const handleCreateRoom = useCallback(() => {
    const newRoomId = uuidv4().split('-')[0]; // Short room ID
    setRoomId(newRoomId);
    setIsConnected(true);
    setActiveUsers([{
      id: userId,
      name: userName,
      color: '#4ECDC4',
    }]);
    
    // Update URL without refresh
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('room', newRoomId);
    window.history.pushState({}, '', newUrl);
  }, [userId, userName]);

  const handleJoinRoom = useCallback((targetRoomId: string) => {
    setRoomId(targetRoomId);
    setIsConnected(true);
    setActiveUsers([{
      id: userId,
      name: userName,
      color: '#FF6B6B',
    }]);
    
    // Update URL without refresh
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('room', targetRoomId);
    window.history.pushState({}, '', newUrl);
  }, [userId, userName]);

  const handleLeaveRoom = useCallback(() => {
    setRoomId(null);
    setIsConnected(false);
    setActiveUsers([]);
    
    // Clear room from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('room');
    window.history.pushState({}, '', newUrl);
  }, []);

  // File Management
  const handleFileSelect = useCallback((file: FileItem) => {
    if (file.type === 'file') {
      // Check if tab already exists
      const existingTab = tabs.find(tab => tab.file.id === file.id);
      
      if (existingTab) {
        // Switch to existing tab
        setActiveTabId(file.id);
        setTabs(prevTabs =>
          prevTabs.map(tab => ({
            ...tab,
            isActive: tab.id === file.id,
          }))
        );
      } else {
        // Create new tab
        const newTab = {
          id: file.id,
          file,
          isDirty: false,
          isActive: true,
        };
        
        setTabs(prevTabs => [
          ...prevTabs.map(tab => ({ ...tab, isActive: false })),
          newTab,
        ]);
        setActiveTabId(file.id);
      }
    }
  }, [tabs]);

  const handleFileCreate = useCallback((parentId: string | null, type: 'file' | 'folder') => {
    const newId = uuidv4();
    const defaultName = type === 'file' ? 'untitled.txt' : 'New Folder';
    const language = type === 'file' ? getLanguageFromFileName(defaultName) : undefined;
    
    const newFile: FileItem = {
      id: newId,
      name: defaultName,
      type,
      language,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    setFiles(prevFiles => {
      if (parentId) {
        // Add to specific parent folder
        return addFileToParent(prevFiles, parentId, newFile);
      } else {
        // Add to root level
        return [...prevFiles, newFile];
      }
    });
  }, []);

  const handleFileDelete = useCallback((fileId: string) => {
    setFiles(prevFiles => removeFileFromTree(prevFiles, fileId));
    
    // Close tab if it exists
    setTabs(prevTabs => {
      const updatedTabs = prevTabs.filter(tab => tab.file.id !== fileId);
      
      // If the deleted file was active, switch to another tab
      if (activeTabId === fileId && updatedTabs.length > 0) {
        const newActiveTab = updatedTabs[updatedTabs.length - 1];
        setActiveTabId(newActiveTab.id);
        return updatedTabs.map(tab => ({
          ...tab,
          isActive: tab.id === newActiveTab.id,
        }));
      } else if (updatedTabs.length === 0) {
        setActiveTabId(null);
      }
      
      return updatedTabs;
    });
  }, [activeTabId]);

  const handleFileRename = useCallback((fileId: string, newName: string) => {
    setFiles(prevFiles => renameFileInTree(prevFiles, fileId, newName));
    
    // Update tab if it exists
    setTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.file.id === fileId) {
          return {
            ...tab,
            file: {
              ...tab.file,
              name: newName,
              language: getLanguageFromFileName(newName),
            },
          };
        }
        return tab;
      })
    );
  }, []);

  // Tab Management
  const handleTabSelect = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId,
      }))
    );
  }, []);

  const handleTabClose = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const updatedTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If the closed tab was active, switch to another tab
      if (activeTabId === tabId && updatedTabs.length > 0) {
        const newActiveTab = updatedTabs[updatedTabs.length - 1];
        setActiveTabId(newActiveTab.id);
        return updatedTabs.map(tab => ({
          ...tab,
          isActive: tab.id === newActiveTab.id,
        }));
      } else if (updatedTabs.length === 0) {
        setActiveTabId(null);
      }
      
      return updatedTabs;
    });
  }, [activeTabId]);

  const handleContentChange = useCallback((content: string) => {
    if (activeTabId) {
      // Update the file content in the files state
      setFiles(prevFiles => 
        updateFileInTree(prevFiles, activeTabId, { content })
      );
      
      // Mark the tab as dirty
      setTabs(prevTabs =>
        prevTabs.map(tab => {
          if (tab.id === activeTabId) {
            return { ...tab, isDirty: true };
          }
          return tab;
        })
      );
    }
  }, [activeTabId]);

  // Get active file for editor
  const activeFile = activeTabId ? files.find(f => f.id === activeTabId) : null;

  const handleSaveFile = useCallback((tabId?: string) => {
    const targetTabId = tabId || activeTabId;
    if (targetTabId) {
      const targetFile = files.find(f => f.id === targetTabId);
      
      // Mark the tab as saved (not dirty)
      setTabs(prevTabs =>
        prevTabs.map(tab => {
          if (tab.id === targetTabId) {
            return { ...tab, isDirty: false };
          }
          return tab;
        })
      );
      
      // Show success toast
      setToast({
        message: `File "${targetFile?.name}" saved successfully!`,
        type: 'success'
      });
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
      
      // In a real application, this would save to a server or file system
      console.log('File saved:', targetFile?.name, 'Content length:', targetFile?.content?.length || 0);
    }
  }, [activeTabId, files]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSaveFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveFile]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0">
        <RoomManager
          roomId={roomId}
          isConnected={isConnected}
          userCount={activeUsers.length}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onLeaveRoom={handleLeaveRoom}
        />
        
        {roomId && (
          <UserPresence
            users={activeUsers}
            currentUserId={userId}
          />
        )}
      </div>

      {/* Main Content */}
      {roomId ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-gray-700">
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
              selectedFileId={activeTabId}
              className="h-full"
            />
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex-shrink-0">
              <TabSystem
                tabs={tabs}
                activeTabId={activeTabId}
                onTabSelect={handleTabSelect}
                onTabClose={handleTabClose}
                onTabSave={handleSaveFile}
              />
            </div>

            {/* Editor */}
            <div className="flex-1">
              {activeFile && roomId ? (
                <MonacoEditor
                  key={activeFile.id}
                  fileId={activeFile.id}
                  language={activeFile.language || 'plaintext'}
                  roomId={roomId}
                  userId={userId}
                  userName={userName}
                  onContentChange={handleContentChange}
                  initialContent={activeFile.content || ''}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-800 text-gray-400">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">No file selected</h3>
                    <p>Select a file from the explorer or create a new one to start editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <RoomManager
            roomId={roomId}
            isConnected={isConnected}
            userCount={activeUsers.length}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
            className="h-full flex items-center justify-center"
          />
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 
          toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getLanguageFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    ps1: 'powershell',
    dockerfile: 'dockerfile',
    txt: 'plaintext',
  };
  
  return languageMap[extension || ''] || 'plaintext';
}

function addFileToParent(files: FileItem[], parentId: string, newFile: FileItem): FileItem[] {
  return files.map(file => {
    if (file.id === parentId && file.type === 'folder') {
      return {
        ...file,
        children: [...(file.children || []), newFile],
      };
    } else if (file.children) {
      return {
        ...file,
        children: addFileToParent(file.children, parentId, newFile),
      };
    }
    return file;
  });
}

function removeFileFromTree(files: FileItem[], fileId: string): FileItem[] {
  return files
    .filter(file => file.id !== fileId)
    .map(file => {
      if (file.children) {
        return {
          ...file,
          children: removeFileFromTree(file.children, fileId),
        };
      }
      return file;
    });
}

function renameFileInTree(files: FileItem[], fileId: string, newName: string): FileItem[] {
  return files.map(file => {
    if (file.id === fileId) {
      return {
        ...file,
        name: newName,
        language: file.type === 'file' ? getLanguageFromFileName(newName) : undefined,
      };
    } else if (file.children) {
      return {
        ...file,
        children: renameFileInTree(file.children, fileId, newName),
      };
    }
    return file;
  });
}

function updateFileInTree(files: FileItem[], fileId: string, updates: Partial<FileItem>): FileItem[] {
  return files.map(file => {
    if (file.id === fileId) {
      return {
        ...file,
        ...updates,
      };
    } else if (file.children) {
      return {
        ...file,
        children: updateFileInTree(file.children, fileId, updates),
      };
    }
    return file;
  });
}
