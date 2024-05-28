const express = require('express');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8443;
const keyFile = path.join(__dirname, '/../../data/privkey.pem');
const certFile = path.join(__dirname, '/../../data/fullchain.pem');

async function checkFileAndResolveSymlink(filePath) {
  try {
    const stats = await fs.lstat(filePath);
    if (stats.isSymbolicLink()) {
      const realPath = await fs.realpath(filePath);
      return { exists: true, isSymlink: true, realPath: realPath };
    } else {
      return { exists: true, isSymlink: false, realPath: filePath };
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { exists: false, isSymlink: false, realPath: null };
    } else {
      throw err;
    }
  }
}

(async () => {
  try {
    const keyResult = await checkFileAndResolveSymlink(keyFile);
    const certResult = await checkFileAndResolveSymlink(certFile);
    if (!keyResult.exists) {
      throw new Error('keyFile does not exist');
    }
    if (!certResult.exists) {
      throw new Error('certFile does not exist');
    }

    console.log('keyfile:' + keyResult.realPath);
    console.log('certFile:' + certResult.realPath);

    // SSL Options
    const httpsOptions = {
      key: await fs.readFile(keyResult.realPath),
      cert: await fs.readFile(certResult.realPath),
    };

    // Serve static files of the React build
    app.use(express.static(path.join(__dirname, 'build')));

    // Handle all other requests with index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    // Create the HTTPS server
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`Server is running on https://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
})();
