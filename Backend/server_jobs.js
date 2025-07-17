const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'Frontend')));

// API route
app.get('/api/jobs', async (req, res) => {
  try {
    console.log("Fetching jobs from API...");

    const response = await fetch('https://himalayas.app/jobs/api');
    if (!response.ok) {
      console.error('Arbeitnow API error:', response.status, response.statusText);
      return res.status(500).json({ error: 'Failed to fetch jobs from API' });
    }

    const data = await response.json();
if (!data.jobs) {
      return res.status(500).json({ error: 'No jobs found in Himalayas API response' });
    }

    res.json({ jobs: data.jobs }); // make sure frontend gets jobs array
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
