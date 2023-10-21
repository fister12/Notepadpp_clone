// routes/user.js
const express = require('express');
const router = express.Router();

// In-memory user store for demonstration purposes (replace with a database)
const users = [];

// User registration route
router.post('/register', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  // Check if the username is already registered
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  // Add the user to the in-memory store
  users.push({ username });
  res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;
