#!/usr/bin/env node
/**
 * validate-json-prompt.mjs
 * Validates JSON prompt files for RFC 8259 compliance, zero-width Unicode leaks,
 * and optional structural / placeholder checks.
 *
 * Usage:
 *   node scripts/validate-json-prompt.mjs <file-or-dir> [--strict-schema] [--no-placeholders]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ZERO_WIDTH_REGEX = /[\u200B\u200C\u200D\u200E\u200F\u202A-\u202E\u2060\uFEFF\u00AD]/g;
const PLACEHOLDER_REGEX = /\{\{[^}]+\}\}|\[INSERT[^\]]*\]/gi;

function collectJsonFiles(targetPath) {
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
      files.push(...collectJsonFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

function getLineAndCol(content, index) {
  const slice = content.slice(0, index);
  const lines = slice.split('\n');
  return {
    line: lines.length,
    col: lines[lines.length - 1].length + 1,
  };
}

function validateFile(filePath, options) {
  const errors = [];
  const raw = fs.readFileSync(filePath, 'utf8');

  if (raw.charCodeAt(0) === 0xfeff) {
    errors.push('UTF-8 BOM detected at byte 0 (strip BOM for strict RFC 8259 compatibility).');
  }

  let match;
  ZERO_WIDTH_REGEX.lastIndex = 0;
  while ((match = ZERO_WIDTH_REGEX.exec(raw)) !== null) {
    const code = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    const pos = getLineAndCol(raw, match.index);
    errors.push(`Hidden Unicode char U+${code} at line ${pos.line}, col ${pos.col}.`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    errors.push(`RFC 8259 JSON parse error: ${message}`);
    return errors;
  }

  if (parsed === null || typeof parsed !== 'object') {
    errors.push('Top-level JSON value must be an object or array.');
    return errors;
  }

  if (options.strictSchema) {
    if (Array.isArray(parsed)) {
      errors.push('--strict-schema requires a top-level JSON object.');
    } else {
      const hasCoreField =
        typeof parsed.role === 'string' ||
        typeof parsed.task === 'string' ||
        typeof parsed.system === 'string' ||
        typeof parsed.prompt === 'string';
      if (!hasCoreField) {
        errors.push('Strict schema check failed: expected at least one of "role", "task", "system", or "prompt" as a string.');
      }
      if (!parsed.output_contract && !parsed.response_format && !parsed.output_schema) {
        errors.push('Strict schema check failed: missing "output_contract", "response_format", or "output_schema".');
      }
    }
  }

  if (options.noPlaceholders) {
    PLACEHOLDER_REGEX.lastIndex = 0;
    while ((match = PLACEHOLDER_REGEX.exec(raw)) !== null) {
      const pos = getLineAndCol(raw, match.index);
      errors.push(`Unresolved placeholder "${match[0]}" at line ${pos.line}, col ${pos.col}.`);
    }
  }

  return errors;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node validate-json-prompt.mjs <file-or-dir> [--strict-schema] [--no-placeholders]');
    process.exit(args.length === 0 ? 1 : 0);
  }

  const target = args.find((a) => !a.startsWith('--'));
  if (!target) {
    console.error('Error: missing <file-or-dir> argument.');
    process.exit(1);
  }

  const options = {
    strictSchema: args.includes('--strict-schema'),
    noPlaceholders: args.includes('--no-placeholders'),
  };

  let files;
  try {
    files = collectJsonFiles(target);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`No .json files found in: ${target}`);
    process.exit(1);
  }

  let totalErrors = 0;
  for (const file of files) {
    const errors = validateFile(file, options);
    const rel = path.relative(process.cwd(), file);
    if (errors.length === 0) {
      console.log(`PASS  ${rel}`);
    } else {
      totalErrors += errors.length;
      console.error(`FAIL  ${rel}`);
      for (const e of errors) {
        console.error(`  - ${e}`);
      }
    }
  }

  if (totalErrors > 0) {
    console.error(`\nValidation failed with ${totalErrors} issue(s).`);
    process.exit(1);
  }
  console.log(`\nValidated ${files.length} JSON prompt file(s) with 0 errors.`);
}

main();
