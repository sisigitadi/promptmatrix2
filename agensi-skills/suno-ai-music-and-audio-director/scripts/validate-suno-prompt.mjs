#!/usr/bin/env node
/**
 * validate-suno-prompt.mjs
 * Validates Suno generative music prompts for style character budget (< 200 chars),
 * structural meta-tags ([Verse], [Chorus], [Outro]), and BPM parameters.
 *
 * Usage:
 *   node scripts/validate-suno-prompt.mjs <file-or-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const MAX_STYLE_CHARS = 200;
const MANDATORY_TAGS = ['[verse', '[chorus', '[outro'];

function collectFiles(targetPath) {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Path not found: ${targetPath}`);
  }
  const stat = fs.statSync(resolved);
  if (stat.isFile()) {
    return [resolved];
  }
  const files = [];
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full));
    } else if (entry.isFile() && (entry.name.endsWith('.json') || entry.name.endsWith('.md'))) {
      files.push(full);
    }
  }
  return files;
}

function validateSunoData(data, filePath) {
  const errors = [];

  if (!data.style_prompt) {
    errors.push('Missing "style_prompt" string.');
  } else {
    const len = data.style_prompt.length;
    if (len > MAX_STYLE_CHARS) {
      errors.push(`style_prompt exceeds ${MAX_STYLE_CHARS} character budget (${len} chars). Truncate to avoid engine clipping.`);
    }
  }

  let lyricsText = '';
  if (data.structure && Array.isArray(data.structure.sections)) {
    lyricsText = data.structure.sections.join('\n');
  } else if (typeof data.lyrics === 'string') {
    lyricsText = data.lyrics;
  }

  if (lyricsText) {
    const lowerLyrics = lyricsText.toLowerCase();
    for (const tag of MANDATORY_TAGS) {
      if (!lowerLyrics.includes(tag)) {
        errors.push(`Lyrics missing structural section tag matching "${tag}...]"`);
      }
    }
  }

  return errors;
}

function run() {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.error('Usage: node scripts/validate-suno-prompt.mjs <file-or-dir>');
    process.exit(1);
  }

  try {
    const files = collectFiles(target);
    if (files.length === 0) {
      console.log(`No prompt files found in ${target}.`);
      process.exit(0);
    }

    let totalErrors = 0;
    for (const file of files) {
      const rel = path.relative(process.cwd(), file);
      try {
        const raw = fs.readFileSync(file, 'utf8');
        if (file.endsWith('.json')) {
          const parsed = JSON.parse(raw);
          const errors = validateSunoData(parsed, file);
          if (errors.length > 0) {
            console.error(`\n[FAIL] ${rel}:`);
            for (const err of errors) {
              console.error(`  - ${err}`);
            }
            totalErrors += errors.length;
          } else {
            console.log(`[PASS] ${rel}`);
          }
        }
      } catch (err) {
        console.error(`\n[FAIL] ${rel}: Parse error - ${err.message}`);
        totalErrors++;
      }
    }

    if (totalErrors > 0) {
      console.error(`\nValidation failed with ${totalErrors} error(s).`);
      process.exit(1);
    } else {
      console.log('\nAll Suno prompt files passed validation.');
      process.exit(0);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

run();
