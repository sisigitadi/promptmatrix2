#!/usr/bin/env node
/**
 * audit-slop.mjs
 * Scans .tsx, .jsx, .md, and .html files for:
 *   1. Em dash character (U+2014)
 *   2. Banned AI hype buzzwords
 *   3. `outline: none` / `outline: 0` / `outline-none` without a visible focus-visible ring
 *
 * Usage:
 *   node scripts/audit-slop.mjs <file-or-dir> [<file-or-dir> ...]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TARGET_EXTS = new Set(['.tsx', '.jsx', '.md', '.html', '.css']);
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage']);

const EMDASH_CHAR = '\u2014';

// Build banned buzzword patterns cleanly without triggering literal self-matches.
const BANNED_BUZZWORDS = [
  ['ai', 'powered'],
  ['revo', 'lutionary'],
  ['seam', 'less'],
  ['cutting', 'edge'],
  ['ulti', 'mate'],
  ['next', 'generation'],
  ['game', 'changer'],
].map(([a, b]) => ({
  label: `${a} ${b}`,
  regex: new RegExp(`\\b${a}[\\s-]+${b}\\b`, 'gi'),
}));

const OUTLINE_NONE_REGEX = /\boutline\s*:\s*(none|0)\b|\boutline-none\b/g;
const FOCUS_RING_GUARD_REGEX = /focus-visible:ring|focus-visible:outline|focus:ring|:focus-visible/;

function collectFiles(targetPath) {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Path not found: ${targetPath}`);
  }
  const stat = fs.statSync(resolved);
  if (stat.isFile()) {
    return [resolved];
  }
  const results = [];
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.isFile() && TARGET_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Em dash check
    let idx = line.indexOf(EMDASH_CHAR);
    while (idx !== -1) {
      findings.push({
        line: i + 1,
        col: idx + 1,
        ruleId: 'COPY-NO-EMDASH',
        message: 'Forbidden em dash (U+2014). Use comma, colon, period, or parentheses.',
        snippet: line.trim(),
      });
      idx = line.indexOf(EMDASH_CHAR, idx + 1);
    }

    // 2. Banned buzzwords check
    for (const bw of BANNED_BUZZWORDS) {
      bw.regex.lastIndex = 0;
      let match;
      while ((match = bw.regex.exec(line)) !== null) {
        findings.push({
          line: i + 1,
          col: match.index + 1,
          ruleId: 'COPY-NO-BUZZWORD',
          message: `Banned marketing buzzword "${match[0]}". Replace with concrete behavior.`,
          snippet: line.trim(),
        });
      }
    }

    // 3. Outline removal without visible focus replacement
    if (/\.(tsx|jsx|html|css)$/.test(filePath)) {
      OUTLINE_NONE_REGEX.lastIndex = 0;
      let match;
      while ((match = OUTLINE_NONE_REGEX.exec(line)) !== null) {
        const contextWindow = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join(' ');
        if (!FOCUS_RING_GUARD_REGEX.test(contextWindow)) {
          findings.push({
            line: i + 1,
            col: match.index + 1,
            ruleId: 'A11Y-NO-OUTLINE-NONE',
            message: 'Focus outline removed without a visible :focus-visible or focus-visible:ring replacement.',
            snippet: line.trim(),
          });
        }
      }
    }
  }

  return findings;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node audit-slop.mjs <file-or-dir> [<file-or-dir> ...]');
    process.exit(args.length === 0 ? 1 : 0);
  }

  const allFiles = [];
  for (const target of args) {
    if (target.startsWith('--')) continue;
    try {
      allFiles.push(...collectFiles(target));
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  }

  if (allFiles.length === 0) {
    console.log('No matching .tsx, .jsx, .md, .html, or .css files found.');
    process.exit(0);
  }

  let totalFindings = 0;
  for (const file of allFiles) {
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
    console.error(`\nAudit failed: ${totalFindings} slop/a11y violation(s) across ${allFiles.length} file(s).`);
    process.exit(1);
  }
  console.log(`PASS: Audited ${allFiles.length} file(s) with 0 slop or focus-outline violations.`);
}

main();
