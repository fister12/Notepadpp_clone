'use client';

import React from 'react';
import { User, Users } from 'lucide-react';

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

interface UserPresenceProps {
  users: ActiveUser[];
  currentUserId: string;
  className?: string;
}

const UserPresence: React.FC<UserPresenceProps> = ({
  users,
  currentUserId,
  className = '',
}) => {
  const otherUsers = users.filter(user => user.id !== currentUserId);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700 ${className}`}>
      {/* Users Icon */}
      <Users size={16} className="text-gray-400" />
      
      {/* User Count */}
      <span className="text-sm text-gray-400">
        {users.length} user{users.length !== 1 ? 's' : ''} online
      </span>

      {/* User Avatars */}
      <div className="flex items-center gap-1 ml-auto">
        {users.slice(0, 8).map((user) => (
          <div
            key={user.id}
            className="relative group"
            title={`${user.name}${user.id === currentUserId ? ' (You)' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 ${
                user.id === currentUserId 
                  ? 'border-blue-400' 
                  : 'border-transparent'
              } ${user.isTyping ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: user.color }}
            >
              {getInitials(user.name)}
            </div>
            
            {/* Typing indicator */}
            {user.isTyping && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-gray-900">
                <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
              </div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {user.name}
              {user.id === currentUserId && ' (You)'}
              {user.cursor && (
                <div className="text-gray-300">
                  Line {user.cursor.line + 1}, Col {user.cursor.column + 1}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Show more indicator if there are too many users */}
        {users.length > 8 && (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300 border border-gray-500">
            +{users.length - 8}
          </div>
        )}
      </div>

      {/* Status indicators */}
      {otherUsers.length > 0 && (
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700">
          {otherUsers.some(user => user.isTyping) && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Someone is typing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPresence;