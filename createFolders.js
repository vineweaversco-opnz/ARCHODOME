const fs = require('fs');
const path = require('path');
const folderStructure = fs.readFileSync('ARCHODOME_FOLDERS.txt', 'utf-8');

const lines = folderStructure.split('\n');

let currentPath = '.';

for (let line of lines) {
  const match = line.match(/├── (\/.*)/) || line.match(/└── (\/.*)/);
  if (match) {
    const folder = match[1];
    const fullPath = path.join(currentPath, folder);
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${fullPath}`);
  }
}