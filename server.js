const express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const port = 3000;

// CONFIG
const OWNER = 'vineweaversco-opnz';
const REPO = 'ARCHODOME';
const BRANCH = 'main';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Root test route
app.get('/', (req, res) => {
  res.send('🌿 Vine Archodome backend is alive');
});

// Single catch-all docs route
app.get(/^\/docs(?:\/(.*))?$/, async (req, res) => {
  const path = req.params[0] || '';
  try {
    const response = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH,
    });

    if (Array.isArray(response.data)) {
      const contents = response.data.map(item => ({
        name: item.name,
        type: item.type,
        path: item.path,
        download_url: item.download_url,
      }));
      res.json({ folder: path, contents });
    } else {
      const fileData = Buffer.from(response.data.content, 'base64').toString('utf-8');
      res.send(fileData);
    }
  } catch (err) {
    console.error('Error fetching content:', err.message);
    res.status(404).json({ error: 'Content not found', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`🌐 Archodome backend running at http://localhost:${port}`);
});