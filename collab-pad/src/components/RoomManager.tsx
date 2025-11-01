'use client';

import React, { useState } from 'react';
import { Share2, Users, Copy, Check, Hash, Globe, Lock } from 'lucide-react';

interface RoomManagerProps {
  roomId: string | null;
  isConnected: boolean;
  userCount: number;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  className?: string;
}

const RoomManager: React.FC<RoomManagerProps> = ({
  roomId,
  isConnected,
  userCount,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  className = '',
}) => {
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleCopyRoomId = async () => {
    if (roomId) {
      try {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy room ID:', err);
      }
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      onJoinRoom(joinRoomId.trim());
      setJoinRoomId('');
      setShowJoinDialog(false);
    }
  };

  const generateShareableLink = () => {
    if (roomId) {
      return `${window.location.origin}?room=${roomId}`;
    }
    return '';
  };

  const handleShareLink = async () => {
    const shareUrl = generateShareableLink();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  if (!roomId) {
    // Not in a room - show join/create options
    return (
      <div className={`bg-gray-900 border-b border-gray-700 p-4 ${className}`}>
        <div className="max-w-md mx-auto text-center">
          <div className="mb-4">
            <Globe className="mx-auto mb-2 text-gray-400" size={32} />
            <h3 className="text-lg font-semibold text-white mb-2">Welcome to ColabPad</h3>
            <p className="text-sm text-gray-400">
              Create a new room or join an existing one to start collaborating
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onCreateRoom}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Hash size={16} />
              Create New Room
            </button>

            <button
              onClick={() => setShowJoinDialog(true)}
              className="flex items-center justify-center gap-2 border border-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Users size={16} />
              Join Existing Room
            </button>
          </div>
        </div>

        {/* Join Room Dialog */}
        {showJoinDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">Join Room</h3>
              <form onSubmit={handleJoinRoom}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room ID
                  </label>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="Enter room ID..."
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowJoinDialog(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!joinRoomId.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // In a room - show room info and controls
  return (
    <div className={`bg-gray-900 border-b border-gray-700 ${className}`}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Room Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
            <span className="text-sm font-medium text-white">
              Room: {roomId}
            </span>
          </div>
          
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Users size={12} />
            {userCount} user{userCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Room Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareDialog(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <Share2 size={12} />
            Share
          </button>
          
          <button
            onClick={handleCopyRoomId}
            className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-600 hover:bg-gray-800 text-white rounded transition-colors"
            disabled={copied}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy ID'}
          </button>

          <button
            onClick={onLeaveRoom}
            className="px-2 py-1 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Share Room</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room ID
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={roomId}
                    readOnly
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg border border-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyRoomId}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg border border-blue-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Shareable Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={generateShareableLink()}
                    readOnly
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg border border-gray-600 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleShareLink}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg border border-green-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowShareDialog(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManager;