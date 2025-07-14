const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Serve static files from the 'Frontend' directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// API endpoint to fetch jobs from Remotive API
app.get('/api/jobs', async (req, res) => {
  try {
    const response = await fetch('https://remotive.io/api/remote-jobs');
    if (!response.ok) {
      console.error('Remotive API error:', response.status, response.statusText);
      return res.status(500).json({ error: 'Failed to fetch jobs from Remotive API' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
