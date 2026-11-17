#!/usr/bin/env node
/**
 * check-strict-ts.mjs
 * Scans .ts and .tsx files for unsafe TypeScript escapes:
 *   - explicit `: any` / `any[]` / `<any>`
 *   - `as any`
 *   - `@ts-ignore` / `@ts-nocheck`
 *
 * Usage:
 *   node scripts/check-strict-ts.mjs <file-or-dir> [--allow-tests]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage']);

const RULES = [
  {
    id: 'TS-NO-EXPLICIT-ANY',
    regex: /:\s*any\b|\bany\[\]|<\s*any\s*>/g,
    message: 'Avoid explicit `any` type; use `unknown`, generics, or a concrete interface.',
  },
  {
    id: 'TS-NO-AS-ANY',
    regex: /\bas\s+any\b/g,
    message: 'Avoid `as any` type assertion; narrow with type guards or schema parsing.',
  },
  {
    id: 'TS-NO-IGNORE',
    regex: /@ts-ignore\b|@ts-nocheck\b/g,
    message: 'Do not suppress compiler checks with @ts-ignore or @ts-nocheck.',
  },
];

function collectTsFiles(targetPath, allowTests) {
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
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTsFiles(full, allowTests));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      if (allowTests && /\.(test|spec)\.(ts|tsx)$/.test(entry.name)) continue;
      files.push(full);
    }
  }
  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('/*')) {
      inBlockComment = !trimmed.includes('*/');
      // Still scan block comment lines for @ts-nocheck / @ts-ignore
    } else if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
    }

    for (const rule of RULES) {
      // Skip non-directive single-line comments unless checking @ts-ignore / @ts-nocheck
      if (rule.id !== 'TS-NO-IGNORE' && (trimmed.startsWith('//') || inBlockComment)) {
        continue;
      }
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        findings.push({
          line: i + 1,
          col: match.index + 1,
          ruleId: rule.id,
          snippet: trimmed,
          message: rule.message,
        });
      }
    }
  }
  return findings;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node check-strict-ts.mjs <file-or-dir> [--allow-tests]');
    process.exit(args.length === 0 ? 1 : 0);
  }

  const target = args.find((a) => !a.startsWith('--'));
  if (!target) {
    console.error('Error: missing <file-or-dir> argument.');
    process.exit(1);
  }
  const allowTests = args.includes('--allow-tests');

  let files;
  try {
    files = collectTsFiles(target, allowTests);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    console.log(`No .ts/.tsx files found in ${target}.`);
    process.exit(0);
  }

  let totalFindings = 0;
  for (const file of files) {
    const findings = scanFile(file);
    if (findings.length > 0) {
      totalFindings += findings.length;
      const rel = path.relative(process.cwd(), file);
      for (const f of findings) {
        console.error(`${rel}:${f.line}:${f.col} [${f.ruleId}] ${f.message}`);
        console.error(`  > ${f.snippet}`);
      }
    }
  }

  if (totalFindings > 0) {
    console.error(`\nFound ${totalFindings} strict TypeScript violation(s) across ${files.length} file(s).`);
    process.exit(1);
  }
  console.log(`PASS: Scanned ${files.length} TypeScript file(s) with 0 strict-mode violations.`);
}

main();
