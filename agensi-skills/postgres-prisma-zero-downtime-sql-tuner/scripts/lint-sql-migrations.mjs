#!/usr/bin/env node
/**
 * lint-sql-migrations.mjs
 * Lints PostgreSQL/Prisma/Drizzle .sql migration files for zero-downtime hazards:
 *   - CREATE [UNIQUE] INDEX without CONCURRENTLY
 *   - ALTER TABLE ... DROP COLUMN without deprecation guard comment
 *   - ALTER TABLE ... ADD COLUMN ... NOT NULL without DEFAULT
 *   - User/tenant CREATE TABLE missing ENABLE ROW LEVEL SECURITY + CREATE POLICY
 *
 * Usage:
 *   node scripts/lint-sql-migrations.mjs <file-or-dir> [--strict] [--json]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage']);

const USER_TABLE_NAME_HINT = /(user|account|profile|tenant|org|organization|workspace|project|order|payment|invoice|session|token|key|document|message|audit|member)/i;
const USER_COLUMN_HINT = /\b(user_id|tenant_id|organization_id|org_id|workspace_id|account_id|owner_id)\b/i;

function collectSqlFiles(targetPath) {
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
      results.push(...collectSqlFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.sql')) {
      results.push(full);
    }
  }
  return results;
}

function getLineNumber(content, charIndex) {
  return content.slice(0, charIndex).split(/\r?\n/).length;
}

function stripSqlCommentsPreserveLines(sql) {
  let out = '';
  let i = 0;
  let inSingle = false;
  let inDouble = false;

  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (!inDouble && ch === "'" && sql[i - 1] !== '\\') {
      inSingle = !inSingle;
      out += ch;
      i++;
      continue;
    }
    if (!inSingle && ch === '"' && sql[i - 1] !== '\\') {
      inDouble = !inDouble;
      out += ch;
      i++;
      continue;
    }

    if (!inSingle && !inDouble && ch === '-' && next === '-') {
      while (i < sql.length && sql[i] !== '\n') {
        out += ' ';
        i++;
      }
      continue;
    }

    if (!inSingle && !inDouble && ch === '/' && next === '*') {
      out += '  ';
      i += 2;
      while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) {
        out += sql[i] === '\n' ? '\n' : ' ';
        i++;
      }
      if (i < sql.length) {
        out += '  ';
        i += 2;
      }
      continue;
    }

    out += ch;
    i++;
  }
  return out;
}

function normalizeTableName(rawName) {
  return rawName.replaceAll('"', '').trim().toLowerCase();
}

function lintSqlFile(filePath, strict) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const cleaned = stripSqlCommentsPreserveLines(raw);
  const rawLines = raw.split(/\r?\n/);
  const findings = [];

  // 1. CREATE [UNIQUE] INDEX without CONCURRENTLY
  const indexRegex = /\bCREATE\s+(?:UNIQUE\s+)?INDEX\b([\s\S]*?);/gi;
  let match;
  while ((match = indexRegex.exec(cleaned)) !== null) {
    const stmt = match[0];
    if (!/\bCONCURRENTLY\b/i.test(stmt)) {
      const line = getLineNumber(cleaned, match.index);
      findings.push({
        file: filePath,
        line,
        ruleId: 'SQL-INDEX-NOT-CONCURRENT',
        severity: 'error',
        message: 'CREATE INDEX without CONCURRENTLY acquires a SHARE lock and blocks writes; use CREATE INDEX CONCURRENTLY.',
        snippet: rawLines[line - 1]?.trim() || stmt.slice(0, 100),
      });
    }
  }

  // 2. ALTER TABLE ... DROP COLUMN without deprecation guard
  const dropColRegex = /\bALTER\s+TABLE\s+[^\s;]+\s+DROP\s+COLUMN\b[\s\S]*?;/gi;
  while ((match = dropColRegex.exec(cleaned)) !== null) {
    const line = getLineNumber(cleaned, match.index);
    const contextWindow = rawLines.slice(Math.max(0, line - 4), line).join('\n');
    const hasGuard = /--\s*(?:deprecation-verified|safe-drop|@allow-drop-column)\b/i.test(contextWindow);
    if (!hasGuard) {
      findings.push({
        file: filePath,
        line,
        ruleId: 'SQL-DROP-COLUMN-UNGUARDED',
        severity: 'error',
        message: 'DROP COLUMN detected without deprecation guard (-- deprecation-verified: <reason>). Confirm zero active code reads first.',
        snippet: rawLines[line - 1]?.trim() || match[0].slice(0, 100),
      });
    }
  }

  // 3. ALTER TABLE ... ADD [COLUMN] ... NOT NULL without DEFAULT
  const addColRegex = /\bALTER\s+TABLE\s+[^\s;]+\s+ADD\s+(?:COLUMN\s+)?(?:IF\s+NOT\s+EXISTS\s+)?[^\s,;]+\s+[^;]*?;/gi;
  while ((match = addColRegex.exec(cleaned)) !== null) {
    const stmt = match[0];
    if (/\bADD\s+(?:CONSTRAINT|PRIMARY|UNIQUE|FOREIGN|CHECK)\b/i.test(stmt)) {
      continue;
    }
    if (/\bNOT\s+NULL\b/i.test(stmt) && !/\bDEFAULT\b/i.test(stmt)) {
      const line = getLineNumber(cleaned, match.index);
      findings.push({
        file: filePath,
        line,
        ruleId: 'SQL-ADD-NOT-NULL-NO-DEFAULT',
        severity: 'error',
        message: 'ALTER TABLE ADD COLUMN with NOT NULL and no DEFAULT fails on populated tables; add nullable or provide DEFAULT first.',
        snippet: rawLines[line - 1]?.trim() || stmt.slice(0, 100),
      });
    }
  }

  // 4. Missing RLS policies on user/tenant tables created in this migration
  const createTableRegex = /\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z0-9_."]+)\s*\(([\s\S]*?)\)\s*;/gi;
  while ((match = createTableRegex.exec(cleaned)) !== null) {
    const fullTableName = normalizeTableName(match[1]);
    const shortTableName = fullTableName.includes('.') ? fullTableName.split('.').pop() : fullTableName;
    const body = match[2];
    const line = getLineNumber(cleaned, match.index);
    const headerContext = rawLines.slice(Math.max(0, line - 3), line).join('\n');

    if (/--\s*rls-exempt\s*:/i.test(headerContext)) {
      continue;
    }

    const isUserTable = USER_TABLE_NAME_HINT.test(shortTableName) || USER_COLUMN_HINT.test(body);
    if (!isUserTable) {
      continue;
    }

    const escapedFull = fullTableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedShort = shortTableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tablePattern = `(?:${escapedFull}|(?:[a-z0-9_]+\\.)?${escapedShort})`;

    const hasEnableRls = new RegExp(
      `ALTER\\s+TABLE\\s+${tablePattern}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`,
      'i'
    ).test(cleaned);
    const hasPolicy = new RegExp(
      `CREATE\\s+POLICY\\s+[A-Za-z0-9_"]+\\s+ON\\s+${tablePattern}\\b`,
      'i'
    ).test(cleaned);

    if (!hasEnableRls || !hasPolicy) {
      findings.push({
        file: filePath,
        line,
        ruleId: 'SQL-MISSING-RLS',
        severity: strict ? 'error' : 'error',
        message: `User/tenant table "${fullTableName}" is missing ENABLE ROW LEVEL SECURITY and/or CREATE POLICY in this migration.`,
        snippet: rawLines[line - 1]?.trim() || `CREATE TABLE ${fullTableName}`,
      });
    }
  }

  return findings;
}

function printHelp() {
  console.log('Usage: node lint-sql-migrations.mjs <file-or-dir> [--strict] [--json]');
  console.log('');
  console.log('Rules checked:');
  console.log('  - SQL-INDEX-NOT-CONCURRENT     Require CONCURRENTLY on CREATE INDEX');
  console.log('  - SQL-DROP-COLUMN-UNGUARDED    Require -- deprecation-verified: guard before DROP COLUMN');
  console.log('  - SQL-ADD-NOT-NULL-NO-DEFAULT  Disallow ADD COLUMN ... NOT NULL without DEFAULT');
  console.log('  - SQL-MISSING-RLS              Require ENABLE ROW LEVEL SECURITY + CREATE POLICY on user tables');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  if (args.length === 0) {
    printHelp();
    process.exit(1);
  }

  const target = args.find((a) => !a.startsWith('--'));
  const strict = args.includes('--strict');
  const jsonOut = args.includes('--json');

  if (!target) {
    console.error('Error: missing <file-or-dir> argument.');
    process.exit(1);
  }

  let files;
  try {
    files = collectSqlFiles(target);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    console.log(`PASS: No .sql files found in ${target}.`);
    process.exit(0);
  }

  const allFindings = [];
  for (const file of files) {
    const findings = lintSqlFile(file, strict);
    for (const f of findings) {
      allFindings.push({
        ...f,
        file: path.relative(process.cwd(), f.file).replaceAll('\\', '/'),
      });
    }
  }

  if (jsonOut) {
    console.log(
      JSON.stringify(
        {
          scannedFiles: files.length,
          totalFindings: allFindings.length,
          status: allFindings.length > 0 ? 'fail' : 'pass',
          findings: allFindings,
        },
        null,
        2
      )
    );
    process.exit(allFindings.length > 0 ? 1 : 0);
  }

  for (const f of allFindings) {
    console.error(`${f.file}:${f.line} [${f.ruleId}] ${f.message}`);
    console.error(`  > ${f.snippet}`);
  }

  if (allFindings.length > 0) {
    console.error(`\nFAIL: Found ${allFindings.length} SQL migration violation(s) across ${files.length} file(s).`);
    process.exit(1);
  }

  console.log(`PASS: Linted ${files.length} SQL migration file(s) with 0 zero-downtime or RLS violations.`);
  process.exit(0);
}

main();
