const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8443;

// SSL Options
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../../data/privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../../data/fullchain.pem')),
};

// Serv static files of the React build
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other requests with index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create the HTTPS server
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
