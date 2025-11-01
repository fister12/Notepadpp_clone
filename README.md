# ColabPad - Collaborative Code Editor

ColabPad is a web-based collaborative code editor inspired by Notepad++, built with Next.js, Monaco Editor, and Y.js for real-time collaboration.

## 🚀 Features

- **Real-time Collaborative Editing**: Multiple users can edit the same document simultaneously
- **Syntax Highlighting**: Support for 25+ programming languages
- **File Management**: Create, rename, delete files and folders with a tree-based explorer
- **Tab System**: Work with multiple files using a familiar tab interface
- **User Presence**: See active users and their cursor positions
- **Room-based Collaboration**: Create or join rooms with shareable links
- **Auto-sync**: Changes are automatically synchronized across all connected users
- **Conflict-free**: Uses CRDTs (Conflict-free Replicated Data Types) for seamless collaboration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (VS Code editor)
- **Real-time Sync**: Y.js with WebSocket provider
- **Communication**: Socket.IO for presence and room management
- **Icons**: Lucide React
- **UUID**: For generating unique IDs

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebSocket support

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server with collaboration backend**
   ```bash
   npm run dev:full
   ```

   This will start:
   - Next.js development server on `http://localhost:3000`
   - WebSocket server for Y.js collaboration on `ws://localhost:1234`
   - Socket.IO server for presence/rooms on `http://localhost:3001`

3. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Create a new room or join an existing one
   - Start collaborating!

## 🎯 Usage

### Creating a Room
1. Click "Create New Room" on the home page
2. Share the room ID or URL with collaborators
3. Start editing files together

### Joining a Room
1. Click "Join Existing Room" 
2. Enter the room ID provided by another user
3. Begin collaborative editing

### File Management
- **Create files/folders**: Use the + buttons in the file explorer
- **Rename**: Click the edit icon next to any file or folder
- **Delete**: Click the trash icon to remove files/folders
- **Open files**: Click on any file to open it in a new tab

### Collaboration Features
- **Real-time editing**: See changes from other users instantly
- **User cursors**: View where other users are typing
- **Presence indicators**: See who's online and active
- **Conflict resolution**: Y.js automatically handles editing conflicts

## 🔧 Development

### Running Separately

If you prefer to run the servers separately:

```bash
# Terminal 1 - WebSocket & Socket.IO server
npm run server

# Terminal 2 - Next.js development server
npm run dev
```

### Supported Languages

ColabPad supports syntax highlighting for:
- JavaScript/TypeScript
- Python, Java, C/C++
- HTML/CSS/SCSS
- JSON, XML, YAML
- Markdown
- Shell/PowerShell
- And many more!

## 🏗️ Architecture

### Real-time Collaboration
- **Y.js**: Provides Conflict-free Replicated Data Types (CRDTs)
- **WebSocket Provider**: Enables real-time synchronization
- **Monaco Binding**: Connects Y.js with the Monaco Editor

### Communication
- **WebSocket (port 1234)**: Document synchronization via Y.js
- **Socket.IO (port 3001)**: User presence, room management, and metadata
