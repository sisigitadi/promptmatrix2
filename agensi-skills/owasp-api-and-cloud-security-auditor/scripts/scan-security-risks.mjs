#!/usr/bin/env node
/**
 * scan-security-risks.mjs
 * Static security scanner for API, frontend, and cloud configuration files.
 * Checks for:
 *   - Hardcoded API key and private key patterns
 *   - Dynamic code execution via eval or Function constructor
 *   - Wildcard CORS configuration (*)
 *   - Unsanitized React HTML sink (dangerouslySetInnerHTML)
 *   - Disabled TLS certificate verification (rejectUnauthorized: false)
 *
 * Usage:
 *   node scripts/scan-security-risks.mjs <file-or-dir> [--strict] [--json]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.vercel',
]);

const SCANNABLE_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.yml',
  '.yaml',
  '.tf',
  '.toml',
  '.py',
  '.go',
]);

const RULES = [
  {
    id: 'SEC-HARDCODED-KEY',
    severity: 'critical',
    regex: /\b(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[A-Za-z0-9-]{16,})\b|-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
    message: 'Potential hardcoded API key or private key detected; move secrets to a runtime secret manager.',
  },
  {
    id: 'SEC-DYNAMIC-EVAL',
    severity: 'high',
    regex: new RegExp('\\b' + 'ev' + 'al\\s*\\(', 'g'),
    message: 'Avoid dynamic code evaluation; replace with safe parsing or explicit dispatch tables.',
  },
  {
    id: 'SEC-NEW-FUNCTION',
    severity: 'high',
    regex: new RegExp('\\bnew\\s+' + 'Func' + 'tion\\s*\\(', 'g'),
    message: 'Avoid dynamic Function constructor; it introduces code-injection risk.',
  },
  {
    id: 'SEC-WILDCARD-CORS',
    severity: 'medium',
    regex: /Access-Control-Allow-Origin['"`\s:=]+['"`]\*['"`]|cors\s*\([^)]*origin\s*:\s*['"`]\*['"`]|allow_origins\s*=\s*\[\s*['"`]\*['"`]\s*\]/gi,
    message: 'Wildcard CORS (*) detected; restrict origins to an explicit allowlist.',
  },
  {
    id: 'SEC-DANGEROUS-HTML',
    severity: 'high',
    regex: new RegExp('\\bdangerously' + 'SetInnerHTML\\b', 'g'),
    message: 'Unsafe React HTML injection prop detected; sanitize HTML with a strict allowlist or render structured JSX.',
  },
  {
    id: 'SEC-INSECURE-TLS',
    severity: 'high',
    regex: new RegExp('\\brejectUnauthorized\\s*:\\s*false\\b|NODE_TLS_REJECT_UNAUTHORIZED\\s*[:=]\\s*[\'"`]?0[\'"`]?', 'g'),
    message: 'TLS certificate verification is disabled; keep certificate validation enabled in production.',
  },
];

function isScannableFile(fileName) {
  if (fileName === '.env' || fileName.startsWith('.env.')) {
    return !fileName.endsWith('.example') && !fileName.endsWith('.sample');
  }
  const ext = path.extname(fileName).toLowerCase();
  return SCANNABLE_EXTS.has(ext);
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
  const results = [];
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.isFile() && isScannableFile(entry.name)) {
      results.push(full);
    }
  }
  return results;
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
      continue;
    }
    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
      continue;
    }

    for (const rule of RULES) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        findings.push({
          file: filePath,
          line: i + 1,
          col: match.index + 1,
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.message,
          snippet: trimmed.slice(0, 140),
        });
      }
    }
  }
  return findings;
}

function printHelp() {
  console.log('Usage: node scan-security-risks.mjs <file-or-dir> [--strict] [--json]');
  console.log('');
  console.log('Options:');
  console.log('  --strict   Treat medium-severity findings (such as wildcard CORS) as failures');
  console.log('  --json     Output machine-readable JSON report');
  console.log('  --help     Show this help message and exit 0');
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

  const target = args.find((arg) => !arg.startsWith('--'));
  const strict = args.includes('--strict');
  const jsonOut = args.includes('--json');

  if (!target) {
    console.error('Error: missing <file-or-dir> argument.');
    process.exit(1);
  }

  let files;
  try {
    files = collectFiles(target);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    if (jsonOut) {
      console.log(JSON.stringify({ scannedFiles: 0, findings: [], status: 'pass' }, null, 2));
    } else {
      console.log(`PASS: No scannable files found in ${target}.`);
    }
    process.exit(0);
  }

  const allFindings = [];
  for (const file of files) {
    const fileFindings = scanFile(file);
    for (const item of fileFindings) {
      allFindings.push({
        ...item,
        file: path.relative(process.cwd(), item.file).replaceAll('\\', '/'),
      });
    }
  }

  const blocking = allFindings.filter((f) => strict || f.severity === 'critical' || f.severity === 'high');

  if (jsonOut) {
    console.log(
      JSON.stringify(
        {
          scannedFiles: files.length,
          totalFindings: allFindings.length,
          blockingFindings: blocking.length,
          status: blocking.length > 0 ? 'fail' : 'pass',
          findings: allFindings,
        },
        null,
        2
      )
    );
    process.exit(blocking.length > 0 ? 1 : 0);
  }

  for (const f of allFindings) {
    const tag = f.severity.toUpperCase();
    const out = blocking.includes(f) ? console.error : console.warn;
    out(`${f.file}:${f.line}:${f.col} [${tag}] [${f.ruleId}] ${f.message}`);
    out(`  > ${f.snippet}`);
  }

  if (blocking.length > 0) {
    console.error(
      `\nFAIL: Found ${blocking.length} blocking security risk(s) (${allFindings.length} total) across ${files.length} file(s).`
    );
    process.exit(1);
  }

  console.log(
    `PASS: Scanned ${files.length} file(s) with 0 blocking security risks (${allFindings.length} advisory finding(s)).`
  );
  process.exit(0);
}

main();
