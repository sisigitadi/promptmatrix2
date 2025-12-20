import fs from 'fs';
const content = fs.readFileSync('src/data/frameworks.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('"Automation') || line.includes(' Automation')) {
        console.log('Found at line:', i + 1, line.trim());
    }
});
