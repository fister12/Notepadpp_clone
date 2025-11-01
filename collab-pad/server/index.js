const { Server } = require('socket.io');
const Y = require('yjs');

// Create HTTP server
const server = require('http').createServer();

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Simplified WebSocket server for Y.js (collaborative editing)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ 
  port: 1234,
  perMessageDeflate: false
});

// Store Y.js documents and connections
const rooms = new Map();

const getRoom = (roomName) => {
  if (!rooms.has(roomName)) {
    const ydoc = new Y.Doc();
    const connections = new Set();
    rooms.set(roomName, { doc: ydoc, connections });
  }
  return rooms.get(roomName);
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomName = url.pathname.slice(1) || 'default';
  
  console.log(`New connection to room: ${roomName}`);
  
  const room = getRoom(roomName);
  room.connections.add(ws);
  
  // Send sync step 1: current document state
  const state = Y.encodeStateAsUpdate(room.doc);
  if (state.byteLength > 0) {
    ws.send(state);
  }
  
  ws.on('message', (data) => {
    try {
      const message = new Uint8Array(data);
      
      // Apply the update to the document
      Y.applyUpdate(room.doc, message);
      
      // Broadcast to all other connections in the room
      room.connections.forEach((conn) => {
        if (conn !== ws && conn.readyState === WebSocket.OPEN) {
          conn.send(data);
        }
      });
    } catch (error) {
      console.error('Error processing Y.js message:', error.message);
      // Don't crash the server, just log the error
    }
  });

  ws.on('close', () => {
    console.log(`Connection closed for room: ${roomName}`);
    room.connections.delete(ws);
    
    // Clean up empty rooms
    if (room.connections.size === 0) {
      rooms.delete(roomName);
      console.log(`Room ${roomName} cleaned up`);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
    room.connections.delete(ws);
  });
});

// Socket.IO for additional real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId, userName });
    console.log(`${userName} (${userId}) joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId, userId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { userId });
  });

  socket.on('cursor-position', (data) => {
    socket.to(data.roomId).emit('cursor-position', data);
  });

  socket.on('file-operation', (data) => {
    // Handle file operations like create, delete, rename
    socket.to(data.roomId).emit('file-operation', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Y.js WebSocket server running on port 1234`);
});