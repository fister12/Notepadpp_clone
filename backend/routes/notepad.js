// routes/notepad.js
const express = require('express');
const router = express.Router();

// In-memory notepad store for demonstration purposes (replace with a database)
const notepads = {};

// Notepad content route
router.get('/:notepadId', (req, res) => {
  const { notepadId } = req.params;
  const notepad = notepads[notepadId];
  if (!notepad) {
    return res.status(404).json({ message: 'Notepad not found' });
  }
  res.json({ content: notepad.content, users: notepad.users });
});

// Notepad update route
router.post('/:notepadId', (req, res) => {
  const { notepadId } = req.params;
  const { content, username } = req.body;
  if (!notepadId || !content || !username) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  if (!notepads[notepadId]) {
    notepads[notepadId] = { content: content, users: {} };
  }

  notepads[notepadId].content = content;
  notepads[notepadId].users[username] = username;
  res.json({ message: 'Notepad updated successfully' });
});

module.exports = router;
