const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// Helpful logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Fallback for /public/ without file name -> serve /public/index.html
app.get('/public', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Static server listening at http://localhost:${port}`);
});
