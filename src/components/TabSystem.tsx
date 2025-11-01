'use client';

import React from 'react';
import { X, Save, Circle } from 'lucide-react';
import { FileItem } from './FileExplorer';

interface Tab {
  id: string;
  file: FileItem;
  isDirty: boolean;
  isActive: boolean;
}

interface TabSystemProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabSave?: (tabId: string) => void;
  className?: string;
}

const TabSystem: React.FC<TabSystemProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabSave,
  className = '',
}) => {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // Return appropriate icon or color indicator based on file type
    const iconClass = "w-3 h-3 rounded-full flex-shrink-0";
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return <Circle className={`${iconClass} text-yellow-400 fill-current`} />;
      case 'ts':
      case 'tsx':
        return <Circle className={`${iconClass} text-blue-400 fill-current`} />;
      case 'css':
      case 'scss':
      case 'sass':
        return <Circle className={`${iconClass} text-blue-300 fill-current`} />;
      case 'html':
      case 'htm':
        return <Circle className={`${iconClass} text-orange-400 fill-current`} />;
      case 'json':
        return <Circle className={`${iconClass} text-green-400 fill-current`} />;
      case 'md':
        return <Circle className={`${iconClass} text-purple-400 fill-current`} />;
      case 'py':
        return <Circle className={`${iconClass} text-yellow-500 fill-current`} />;
      case 'java':
        return <Circle className={`${iconClass} text-red-500 fill-current`} />;
      case 'cpp':
      case 'c':
        return <Circle className={`${iconClass} text-blue-600 fill-current`} />;
      default:
        return <Circle className={`${iconClass} text-gray-400 fill-current`} />;
    }
  };

  const handleTabClick = (tabId: string, event: React.MouseEvent) => {
    // Middle mouse button closes tab
    if (event.button === 1) {
      event.preventDefault();
      onTabClose(tabId);
    } else {
      onTabSelect(tabId);
    }
  };

  const handleCloseClick = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onTabClose(tabId);
  };

  const handleSaveClick = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onTabSave) {
      onTabSave(tabId);
    }
  };

  if (tabs.length === 0) {
    return (
      <div className={`bg-gray-900 border-b border-gray-700 h-10 flex items-center px-4 ${className}`}>
        <span className="text-sm text-gray-400">No files open</span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 border-b border-gray-700 ${className}`}>
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-2 border-r border-gray-700 cursor-pointer select-none min-w-0 max-w-48 group ${
              tab.isActive
                ? 'bg-gray-800 text-white'
                : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
            }`}
            onMouseDown={(e) => handleTabClick(tab.id, e)}
            title={tab.file.name}
          >
            {/* File Type Icon */}
            {getFileIcon(tab.file.name)}

            {/* File Name */}
            <span className="text-sm truncate flex-1 min-w-0">
              {tab.file.name}
            </span>

            {/* Dirty Indicator / Save Button */}
            {tab.isDirty && (
              <>
                {onTabSave ? (
                  <button
                    onClick={(e) => handleSaveClick(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-1 transition-opacity"
                    title="Save file"
                  >
                    <Save size={12} />
                  </button>
                ) : (
                  <div title="Unsaved changes">
                    <Circle className="w-2 h-2 text-white fill-current" />
                  </div>
                )}
              </>
            )}

            {/* Close Button */}
            <button
              onClick={(e) => handleCloseClick(tab.id, e)}
              className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-1 transition-opacity ml-1"
              title="Close file"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Tab Actions */}
      <div className="flex items-center justify-between px-2 py-1 bg-gray-850 text-xs text-gray-400">
        <span>
          {tabs.length} file{tabs.length !== 1 ? 's' : ''} open
        </span>
        
        {tabs.some(tab => tab.isDirty) && (
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 text-orange-400 fill-current" />
            <span>Unsaved changes</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSystem;