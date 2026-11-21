#!/usr/bin/env node
/**
 * validate-outreach-copy.mjs
 * Validates B2B cold outreach email sequences for deliverability standards,
 * word count limits (< 125 words), subject line lengths, and spam triggers.
 *
 * Usage:
 *   node scripts/validate-outreach-copy.mjs <file-or-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SPAM_TRIGGERS = [
  'guarantee',
  'guaranteed',
  'risk-free',
  '100% free',
  'free trial',
  'act now',
  'urgent',
  'exclusive deal',
  'make money',
  'cash bonus',
  'no obligation',
];

const MAX_SUBJECT_CHARS = 45;
const MAX_SUBJECT_WORDS = 6;
const MAX_BODY_WORDS = 125;

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

function validateSequence(data, filePath) {
  const errors = [];

  if (!data.sequence || !Array.isArray(data.sequence) || data.sequence.length === 0) {
    errors.push('Outreach file must contain a non-empty "sequence" array.');
    return errors;
  }

  data.sequence.forEach((item, index) => {
    const stepLabel = `Step ${item.step || index + 1}`;

    if (!item.subject) {
      errors.push(`${stepLabel} is missing a "subject" line.`);
    } else {
      const subjChars = item.subject.length;
      const subjWords = countWords(item.subject);
      if (subjChars > MAX_SUBJECT_CHARS) {
        errors.push(`${stepLabel} subject exceeds ${MAX_SUBJECT_CHARS} chars (${subjChars} chars).`);
      }
      if (subjWords > MAX_SUBJECT_WORDS) {
        errors.push(`${stepLabel} subject exceeds ${MAX_SUBJECT_WORDS} words (${subjWords} words).`);
      }
    }

    if (!item.body) {
      errors.push(`${stepLabel} is missing email "body" text.`);
    } else {
      const bodyWords = countWords(item.body);
      if (bodyWords > MAX_BODY_WORDS) {
        errors.push(`${stepLabel} body exceeds ${MAX_BODY_WORDS} words (${bodyWords} words).`);
      }

      const lower = item.body.toLowerCase();
      for (const trigger of SPAM_TRIGGERS) {
        if (lower.includes(trigger)) {
          errors.push(`${stepLabel} body contains spam trigger phrase: "${trigger}".`);
        }
      }
    }
  });

  return errors;
}

function run() {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.error('Usage: node scripts/validate-outreach-copy.mjs <file-or-dir>');
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
          const errors = validateSequence(parsed, file);
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
      console.log('\nAll outreach sequence files passed validation.');
      process.exit(0);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

run();
