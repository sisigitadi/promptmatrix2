#!/usr/bin/env node
/**
 * validate-openapi-and-e2e.mjs
 * Validates OpenAPI 3.x JSON contracts and Playwright E2E spec files:
 *   - OpenAPI 3.x: openapi version, info (title, version), paths, unique operationId, responses
 *   - Playwright specs: flags waitForTimeout(), test.only/describe.only, networkidle, force: true
 *
 * Usage:
 *   node scripts/validate-openapi-and-e2e.mjs <file-or-dir> [--strict] [--json]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'playwright-report', 'test-results']);
const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']);
const OPENAPI_VERSION_REGEX = /^3\.\d+\.\d+$/;
const STATUS_CODE_REGEX = /^(?:[1-5][0-9]{2}|[1-5]XX|default)$/;
const PLAYWRIGHT_FILE_REGEX = /\.(spec|test|e2e)\.(ts|tsx|js|jsx|mjs|cjs)$/i;

function isOpenApiJsonFile(fileName) {
  const lower = fileName.toLowerCase();
  return lower.endsWith('.json') && (lower.includes('openapi') || lower.includes('swagger') || lower.includes('contract'));
}

function collectTargets(targetPath) {
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
      results.push(...collectTargets(full));
    } else if (entry.isFile()) {
      if (isOpenApiJsonFile(entry.name) || PLAYWRIGHT_FILE_REGEX.test(entry.name)) {
        results.push(full);
      }
    }
  }
  return results;
}

function validateOpenApiFile(filePath, strict) {
  const errors = [];
  const warnings = [];
  let spec;
  try {
    spec = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    errors.push(`${filePath}: invalid JSON (${err instanceof Error ? err.message : String(err)}).`);
    return { errors, warnings };
  }

  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
    errors.push(`${filePath}: OpenAPI root must be a JSON object.`);
    return { errors, warnings };
  }

  if (typeof spec.openapi !== 'string' || !OPENAPI_VERSION_REGEX.test(spec.openapi)) {
    errors.push(`${filePath}: "openapi" must match 3.x.y (got ${JSON.stringify(spec.openapi)}).`);
  }

  if (!spec.info || typeof spec.info !== 'object' || Array.isArray(spec.info)) {
    errors.push(`${filePath}: missing required "info" object.`);
  } else {
    if (typeof spec.info.title !== 'string' || spec.info.title.trim().length === 0) {
      errors.push(`${filePath}: "info.title" must be a non-empty string.`);
    }
    if (typeof spec.info.version !== 'string' || spec.info.version.trim().length === 0) {
      errors.push(`${filePath}: "info.version" must be a non-empty string.`);
    }
  }

  if (!spec.paths || typeof spec.paths !== 'object' || Array.isArray(spec.paths)) {
    errors.push(`${filePath}: missing required "paths" object.`);
    return { errors, warnings };
  }

  const pathEntries = Object.entries(spec.paths);
  if (pathEntries.length === 0) {
    errors.push(`${filePath}: "paths" must declare at least one endpoint.`);
    return { errors, warnings };
  }

  const seenOperationIds = new Set();
  let operationCount = 0;

  for (const [routePath, pathItem] of pathEntries) {
    if (!routePath.startsWith('/')) {
      errors.push(`${filePath}: path "${routePath}" must start with "/".`);
    }
    if (!pathItem || typeof pathItem !== 'object' || Array.isArray(pathItem)) {
      errors.push(`${filePath}: path "${routePath}" must be an object.`);
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      const lowerMethod = method.toLowerCase();
      if (!HTTP_METHODS.has(lowerMethod)) continue;
      operationCount++;
      const opLabel = `${filePath} ${lowerMethod.toUpperCase()} ${routePath}`;

      if (!operation || typeof operation !== 'object' || Array.isArray(operation)) {
        errors.push(`${opLabel}: operation definition must be an object.`);
        continue;
      }

      if (typeof operation.operationId !== 'string' || operation.operationId.trim().length === 0) {
        errors.push(`${opLabel}: missing required non-empty "operationId".`);
      } else if (seenOperationIds.has(operation.operationId)) {
        errors.push(`${opLabel}: duplicate operationId "${operation.operationId}".`);
      } else {
        seenOperationIds.add(operation.operationId);
      }

      if (!operation.responses || typeof operation.responses !== 'object' || Array.isArray(operation.responses)) {
        errors.push(`${opLabel}: missing required "responses" object.`);
      } else {
        const statusKeys = Object.keys(operation.responses);
        if (statusKeys.length === 0) {
          errors.push(`${opLabel}: "responses" must define at least one status code.`);
        }
        for (const code of statusKeys) {
          if (!STATUS_CODE_REGEX.test(code)) {
            errors.push(`${opLabel}: invalid response status key "${code}".`);
          }
        }
        if (strict && !statusKeys.some((k) => k.startsWith('4') || k.startsWith('5') || k === 'default')) {
          warnings.push(`${opLabel}: consider documenting at least one 4xx/5xx error response.`);
        }
      }
    }
  }

  if (operationCount === 0) {
    errors.push(`${filePath}: no HTTP operations found under "paths".`);
  }

  return { errors, warnings };
}

function validatePlaywrightFile(filePath, strict) {
  const errors = [];
  const warnings = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      continue;
    }

    if (/\bwaitForTimeout\s*\(/.test(line)) {
      errors.push(`${filePath}:${i + 1}: [E2E-NO-WAIT-FOR-TIMEOUT] Avoid waitForTimeout(); use web-first expect() assertions or waitForResponse().`);
    }
    if (/\b(?:test|describe)\.only\s*\(/.test(line)) {
      errors.push(`${filePath}:${i + 1}: [E2E-NO-ONLY] Remove .only() before committing E2E tests.`);
    }
    if (/waitForLoadState\s*\(\s*['"]networkidle['"]\s*\)/.test(line)) {
      const msg = `${filePath}:${i + 1}: [E2E-NO-NETWORKIDLE] Avoid waitForLoadState('networkidle'); wait for explicit UI or API response.`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
    }
    if (/force\s*:\s*true/.test(line)) {
      warnings.push(`${filePath}:${i + 1}: [E2E-FORCE-CLICK] Avoid { force: true }; ensure target element is genuinely actionable.`);
    }
  }

  return { errors, warnings };
}

function printHelp() {
  console.log('Usage: node validate-openapi-and-e2e.mjs <file-or-dir> [--strict] [--json]');
  console.log('');
  console.log('Checks:');
  console.log('  - OpenAPI 3.x JSON: openapi, info.title/version, paths, unique operationId, responses');
  console.log('  - Playwright specs: waitForTimeout(), test.only(), waitForLoadState("networkidle"), force: true');
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
    files = collectTargets(target);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    console.log(`PASS: No OpenAPI JSON or Playwright spec files found in ${target}.`);
    process.exit(0);
  }

  const allErrors = [];
  const allWarnings = [];

  for (const file of files) {
    const rel = path.relative(process.cwd(), file).replaceAll('\\', '/');
    const ext = path.extname(file).toLowerCase();
    const res =
      ext === '.json'
        ? validateOpenApiFile(file, strict)
        : validatePlaywrightFile(file, strict);
    for (const e of res.errors) allErrors.push(e.replace(file, rel));
    for (const w of res.warnings) allWarnings.push(w.replace(file, rel));
  }

  if (jsonOut) {
    console.log(
      JSON.stringify(
        {
          validatedFiles: files.length,
          errors: allErrors,
          warnings: allWarnings,
          status: allErrors.length > 0 ? 'fail' : 'pass',
        },
        null,
        2
      )
    );
    process.exit(allErrors.length > 0 ? 1 : 0);
  }

  for (const w of allWarnings) console.warn(`WARN  ${w}`);
  for (const e of allErrors) console.error(`ERROR ${e}`);

  if (allErrors.length > 0) {
    console.error(`\nFAIL: ${allErrors.length} error(s), ${allWarnings.length} warning(s) across ${files.length} file(s).`);
    process.exit(1);
  }

  console.log(`PASS: Validated ${files.length} OpenAPI/Playwright file(s) with 0 errors (${allWarnings.length} warning(s)).`);
  process.exit(0);
}

main();
