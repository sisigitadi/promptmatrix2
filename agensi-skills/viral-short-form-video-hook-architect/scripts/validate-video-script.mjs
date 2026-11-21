#!/usr/bin/env node
/**
 * validate-video-script.mjs
 * Validates short-form video scripts for hook word counts (< 15 words),
 * spoken pacing (130-165 wpm), and absence of banned intro greetings.
 *
 * Usage:
 *   node scripts/validate-video-script.mjs <file-or-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const BANNED_OPENERS = [
  'hey guys',
  'welcome back',
  'in this video',
  'hello everyone',
  'so today',
  'what is up',
];

const MAX_HOOK_WORDS = 15;

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

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

function validateScript(data, filePath) {
  const errors = [];

  if (!data.target_duration_seconds || typeof data.target_duration_seconds !== 'number') {
    errors.push('Script must specify "target_duration_seconds" as a positive number.');
  }

  if (!data.hook || !data.hook.spoken_text) {
    errors.push('Script must contain a "hook" object with "spoken_text".');
  } else {
    const hookWords = countWords(data.hook.spoken_text);
    if (hookWords > MAX_HOOK_WORDS) {
      errors.push(`Hook exceeds ${MAX_HOOK_WORDS} words limit (${hookWords} words). Shorten for 3-second delivery.`);
    }

    const lowerHook = data.hook.spoken_text.toLowerCase();
    for (const banned of BANNED_OPENERS) {
      if (lowerHook.startsWith(banned)) {
        errors.push(`Hook begins with banned filler opener: "${banned}".`);
      }
    }
  }

  if (!data.scenes || !Array.isArray(data.scenes) || data.scenes.length === 0) {
    errors.push('Script must define an array of "scenes" with visual cues and spoken text.');
  } else {
    let totalSpokenWords = data.hook ? countWords(data.hook.spoken_text) : 0;
    data.scenes.forEach((scene, idx) => {
      if (!scene.visual) {
        errors.push(`Scene ${idx + 1} is missing a "visual" direction description.`);
      }
      if (!scene.spoken_text) {
        errors.push(`Scene ${idx + 1} is missing "spoken_text".`);
      } else {
        totalSpokenWords += countWords(scene.spoken_text);
      }
    });

    if (data.target_duration_seconds) {
      const minutes = data.target_duration_seconds / 60;
      const wpm = Math.round(totalSpokenWords / minutes);
      if (wpm < 115) {
        errors.push(`Pacing is too slow (${wpm} wpm). Target 130 - 160 wpm for short-form retention.`);
      } else if (wpm > 175) {
        errors.push(`Pacing is too dense (${wpm} wpm). Target 130 - 160 wpm to avoid audio crowding.`);
      }
    }
  }

  return errors;
}

function run() {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.error('Usage: node scripts/validate-video-script.mjs <file-or-dir>');
    process.exit(1);
  }

  try {
    const files = collectFiles(target);
    if (files.length === 0) {
      console.log(`No files found in ${target}.`);
      process.exit(0);
    }

    let totalErrors = 0;
    for (const file of files) {
      const rel = path.relative(process.cwd(), file);
      try {
        const raw = fs.readFileSync(file, 'utf8');
        if (file.endsWith('.json')) {
          const parsed = JSON.parse(raw);
          const errors = validateScript(parsed, file);
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
      console.log('\nAll video script files passed validation.');
      process.exit(0);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

run();
