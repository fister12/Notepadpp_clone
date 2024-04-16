
const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./backend/routes/noteRoutes');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes); // Mount note routes under /api/notes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
