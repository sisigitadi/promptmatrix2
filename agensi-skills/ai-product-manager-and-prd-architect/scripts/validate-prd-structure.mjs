#!/usr/bin/env node
/**
 * validate-prd-structure.mjs
 * Validates PRD markdown files for structural completeness, Gherkin syntax,
 * and unresolved placeholders.
 *
 * Usage:
 *   node scripts/validate-prd-structure.mjs <file-or-dir> [--strict]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const MANDATORY_SECTIONS = [
  'Problem Statement',
  'Goals',
  'User Stories',
  'Acceptance Criteria',
];

const GHERKIN_KEYWORDS = ['given', 'when', 'then'];
const PLACEHOLDER_REGEX = /\[TBD\]|\[TODO\]|\{\{[^}]+\}\}|\[INSERT[^\]]*\]/gi;

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
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.txt'))) {
      files.push(full);
    }
  }
  return files;
}

function validateFile(filePath, isStrict) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lower = content.toLowerCase();

  for (const section of MANDATORY_SECTIONS) {
    if (!lower.includes(section.toLowerCase())) {
      errors.push(`Missing mandatory section: "${section}".`);
    }
  }

  for (const kw of GHERKIN_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (!regex.test(content)) {
      errors.push(`Missing Gherkin keyword "${kw.toUpperCase()}" in acceptance criteria.`);
    }
  }

  if (isStrict) {
    let match;
    PLACEHOLDER_REGEX.lastIndex = 0;
    while ((match = PLACEHOLDER_REGEX.exec(content)) !== null) {
      errors.push(`Unresolved placeholder found: "${match[0]}".`);
    }
  }

  return errors;
}

function run() {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  const isStrict = args.includes('--strict');

  if (!target) {
    console.error('Usage: node scripts/validate-prd-structure.mjs <file-or-dir> [--strict]');
    process.exit(1);
  }

  try {
    const files = collectFiles(target);
    if (files.length === 0) {
      console.log(`No markdown files found in ${target}.`);
      process.exit(0);
    }

    let totalErrors = 0;
    for (const file of files) {
      const rel = path.relative(process.cwd(), file);
      const errors = validateFile(file, isStrict);
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

    if (totalErrors > 0) {
      console.error(`\nValidation failed with ${totalErrors} error(s).`);
      process.exit(1);
    } else {
      console.log('\nAll PRD files passed validation.');
      process.exit(0);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

run();
