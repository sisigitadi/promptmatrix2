const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/frameworks.ts');
let content = fs.readFileSync(filePath, 'utf8');

const keysToRemove = [
    'Audio_Musik',
    'Gambar_Desain',
    'Koleksi_Inovasi',
    'Prompt_Proyek',
    'Prompt_Ringkas',
    'Teks_Konten'
];

function removeKey(fileContent, key) {
    // Regex to find the key followed by a colon and opening brace
    // Matches "Key": { or Key: { with flexible whitespace
    // Double escaping backslashes for string literal, then for RegExp constructor
    const regex = new RegExp(`^\s*(?["']?)${key}\1\s*:\s*{`, 'm');
    const match = fileContent.match(regex);

    if (!match) {
        console.log(`Key ${key} not found.`);
        return fileContent;
    }

    const startIndex = match.index;
    console.log(`Found ${key} at index ${startIndex}`);

    // Find the opening brace of this block
    const openBraceIndex = fileContent.indexOf('{', startIndex);
    
    let braceCount = 1;
    let endIndex = -1;

    // Scan forward from after the first {
    for (let i = openBraceIndex + 1; i < fileContent.length; i++) {
        if (fileContent[i] === '{') {
            braceCount++;
        } else if (fileContent[i] === '}') {
            braceCount--;
        }

        if (braceCount === 0) {
            endIndex = i + 1; // Include the closing brace
            break;
        }
    }

    if (endIndex !== -1) {
        // Look ahead for a trailing comma and consume it + trailing whitespace
        let removalEnd = endIndex;
        while (removalEnd < fileContent.length) {
            const char = fileContent[removalEnd];
            if (char === ',') {
                removalEnd++;
                break; // Stop after comma
            } else if (/\s/.test(char)) {
                removalEnd++; // Consume whitespace
            } else {
                break; // Found non-whitespace, non-comma char
            }
        }
        
        console.log(`Removing ${key} block from ${startIndex} to ${removalEnd}`);
        return fileContent.slice(0, startIndex) + fileContent.slice(removalEnd);
    } else {
        console.log(`Could not find closing brace for ${key}`);
    }

    return fileContent;
}

// Perform cleanup
for (const key of keysToRemove) {
    content = removeKey(content, key);
}

// Write result back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleanup complete.');
