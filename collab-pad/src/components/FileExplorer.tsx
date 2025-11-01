'use client';

import React, { useState, useCallback } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Plus, 
  FolderPlus,
  Trash2,
  Edit3,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  language?: string;
  content?: string;
  isOpen?: boolean;
}

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onFileCreate: (parentId: string | null, type: 'file' | 'folder') => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
  selectedFileId: string | null;
  className?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFileId,
  className = '',
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const handleRename = useCallback((fileId: string, currentName: string) => {
    setEditingFile(fileId);
    setEditingName(currentName);
  }, []);

  const handleRenameSubmit = useCallback((fileId: string) => {
    if (editingName.trim()) {
      onFileRename(fileId, editingName.trim());
    }
    setEditingFile(null);
    setEditingName('');
  }, [editingName, onFileRename]);

  const handleRenameCancel = useCallback(() => {
    setEditingFile(null);
    setEditingName('');
  }, []);

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? (
        <FolderOpen size={16} className="text-blue-400" />
      ) : (
        <Folder size={16} className="text-blue-400" />
      );
    }

    // File type icons based on extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileText size={16} className="text-yellow-400" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileText size={16} className="text-blue-300" />;
      case 'html':
      case 'htm':
        return <FileText size={16} className="text-orange-400" />;
      case 'json':
        return <FileText size={16} className="text-green-400" />;
      case 'md':
        return <FileText size={16} className="text-gray-400" />;
      default:
        return <File size={16} className="text-gray-300" />;
    }
  };

  const renderFileTree = (items: FileItem[], level = 0): React.ReactNode => {
    return items.map((item) => (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer group ${
            selectedFileId === item.id ? 'bg-blue-600' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              onFileSelect(item);
            }
          }}
        >
          {/* Expand/Collapse Icon for folders */}
          {item.type === 'folder' && (
            <div className="flex-shrink-0">
              {expandedFolders.has(item.id) ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </div>
          )}
          
          {/* File/Folder Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(item)}
          </div>

          {/* File/Folder Name */}
          {editingFile === item.id ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => handleRenameSubmit(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit(item.id);
                } else if (e.key === 'Escape') {
                  handleRenameCancel();
                }
              }}
              className="flex-1 bg-gray-600 text-white px-1 py-0.5 text-sm rounded"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm truncate">{item.name}</span>
          )}

          {/* Action Buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 flex-shrink-0">
            {item.type === 'folder' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileCreate(item.id, 'file');
                  }}
                  className="p-1 hover:bg-gray-600 rounded"
                  title="New File"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileCreate(item.id, 'folder');
                  }}
                  className="p-1 hover:bg-gray-600 rounded"
                  title="New Folder"
                >
                  <FolderPlus size={12} />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRename(item.id, item.name);
              }}
              className="p-1 hover:bg-gray-600 rounded"
              title="Rename"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileDelete(item.id);
              }}
              className="p-1 hover:bg-red-600 rounded"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Render children for expanded folders */}
        {item.type === 'folder' && 
         expandedFolders.has(item.id) && 
         item.children && 
         renderFileTree(item.children, level + 1)
        }
      </div>
    ));
  };

  return (
    <div className={`bg-gray-800 text-white h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-900">
        <h3 className="text-sm font-semibold">Explorer</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onFileCreate(null, 'file')}
            className="p-1 hover:bg-gray-700 rounded"
            title="New File"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => onFileCreate(null, 'folder')}
            className="p-1 hover:bg-gray-700 rounded"
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No files yet. Create your first file!
          </div>
        ) : (
          renderFileTree(files)
        )}
      </div>
    </div>
  );
};

export default FileExplorer;