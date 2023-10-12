const express = require('express');
const app = express();
const port = 3001; // Choose a port for your server

app.use(express.json()); // Middleware to parse JSON data

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get('/api/items', (req, res) => {
    // Fetch data from your database or other sources
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      // Add more items as needed
    ];
    res.json(items);
  });

  const cors = require('cors');
app.use(cors());

  