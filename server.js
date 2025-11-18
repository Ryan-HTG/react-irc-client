const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React build at /chat
app.use('/chat', express.static(path.join(__dirname, 'build')));

// Fallback for SPA routing
app.get('/chat/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`[server] React server running on port ${PORT}`);
});

