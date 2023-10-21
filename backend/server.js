const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define the path to the notepads directory
const notepadsDirectory = './notepads/';

// In-memory store for user registration
const registeredUsers = {};

// API endpoint to get the content of a specific notepad
app.get('/api/notepad/:id', (req, res) => {
  const notepadId = req.params.id;
  const notepadPath = `${notepadsDirectory}notepad${notepadId}.json`;

  if (fs.existsSync(notepadPath)) {
    const content = fs.readFileSync(notepadPath, 'utf8');
    res.json({ content, users: registeredUsers });
  } else {
    res.status(404).json({ message: 'Notepad not found' });
  }
});

// API endpoint to save changes to a specific notepad
app.post('/api/notepad/:id', (req, res) => {
  const notepadId = req.params.id;
  const notepadPath = `${notepadsDirectory}notepad${notepadId}.json`;
  const newContent = req.body.content;

  fs.writeFileSync(notepadPath, JSON.stringify({ content: newContent }));
  res.json({ message: 'Notepad updated successfully' });

  // Notify all connected clients about the change
  io.sockets.emit(`notepad-${notepadId}-update`, newContent);
});

// API endpoint for user registration
app.post('/api/register', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  if (registeredUsers[username]) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  registeredUsers[username] = username;
  res.status(201).json({ message: 'User registered successfully' });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
