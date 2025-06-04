// server.js — Vine Archodome Backend
// Purpose: Serve folder/file data from a GitHub archive repo using GitHub REST API

const express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const port = 3000; // Change as needed

// === CONFIG ===
const OWNER = 'vineweaversco-opnz'; // <-- change this
const REPO = 'ARCHODOME';   // <-- change this
const BRANCH = 'main';                // or 'master', depending on your repo

// === AUTHENTICATE ===
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// === ROUTES ===

// Root test
app.get('/', (req, res) => {
  res.send('🌿 Vine Archodome backend is alive');
});

// List contents of a folder
app.get('/docs/*', async (req, res) => {
  const path = req.params[0]; // path inside the repo, e.g. 'scrolls/akashic-flame'

  try {
    const response = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH,
    });

    // If it's a directory, return list of contents
    if (Array.isArray(response.data)) {
      const contents = response.data.map(item => ({
        name: item.name,
        type: item.type,
        path: item.path,
        download_url: item.download_url,
      }));
      res.json({ folder: path, contents });
    } else {
      // It's a file: return the content (base64 decoded)
      const fileData = Buffer.from(response.data.content, 'base64').toString('utf-8');
      res.send(fileData);
    }
  } catch (err) {
    console.error('Error fetching content:', err.message);
    res.status(404).json({ error: 'Content not found', details: err.message });
  }
});

// === START SERVER ===
app.listen(port, () => {
  console.log(`🌐 Archodome backend running at http://localhost:${port}`);
});