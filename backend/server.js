const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Define app variable
const app = express();

// Proxy middleware for API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true
}));

// Create server
const server = require('http').createServer(app);

// Port for server
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to store JSON files and user data
const dataPath = './data.json';
const usersPath = './users.json';

// Function to read data from file
function readData(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error(err);
    return {};
  }
}

// Function to write data to file
function writeData(path, data) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(err);
  }
}

// Documents and users stored in memory
let documents = readData(dataPath);
let users = readData(usersPath);

// Socket.io
const io = socketio(server);

io.on('connection', (socket) => {
  // User authentication (replace with your preferred method)
  socket.on('authenticate', ({ username, password }) => {
    if (users[username] && users[username].password === password) {
      socket.emit('authenticated', { username });
    } else {
      socket.emit('unauthorized');
    }
  });

  // Join document room
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    io.to(documentId).emit('init-document', documents[documentId]);
  });

  // User edits the document
  socket.on('edit-document', (data) => {
    const { documentId, content, position } = data;
    documents[documentId] = content; // Update document in memory
    writeData(dataPath, documents); // Write updated data to file
    // Broadcast updated document and user information to all users in the room
    io.to(documentId).emit('update-document', { content, position, username: socket.username });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
