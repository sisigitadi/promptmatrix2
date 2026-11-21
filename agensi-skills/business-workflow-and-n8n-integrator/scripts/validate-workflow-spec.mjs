#!/usr/bin/env node
/**
 * validate-workflow-spec.mjs
 * Validates integration workflow contracts for required fields, retry policies,
 * idempotency safeguards, and RFC 8259 JSON compliance.
 *
 * Usage:
 *   node scripts/validate-workflow-spec.mjs <file-or-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_ROOT_FIELDS = ['workflow_id', 'trigger', 'idempotency', 'retry_policy', 'steps'];

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
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

function validateWorkflowObject(obj, filePath) {
  const errors = [];

  for (const field of REQUIRED_ROOT_FIELDS) {
    if (!(field in obj)) {
      errors.push(`Missing required root field: "${field}".`);
    }
  }

  if (obj.retry_policy) {
    const rp = obj.retry_policy;
    if (typeof rp.max_retries !== 'number' || rp.max_retries < 1 || rp.max_retries > 10) {
      errors.push('retry_policy.max_retries must be an integer between 1 and 10.');
    }
    if (!rp.dead_letter_target || typeof rp.dead_letter_target !== 'string') {
      errors.push('retry_policy.dead_letter_target must be a valid target identifier string.');
    }
  }

  if (obj.idempotency) {
    const idp = obj.idempotency;
    if (typeof idp.enabled !== 'boolean') {
      errors.push('idempotency.enabled must be a boolean.');
    }
    if (idp.enabled && (!idp.key_path || typeof idp.key_path !== 'string')) {
      errors.push('idempotency.key_path must be specified when idempotency is enabled.');
    }
  }

  if (obj.steps) {
    if (!Array.isArray(obj.steps) || obj.steps.length === 0) {
      errors.push('steps must be a non-empty array of workflow step definitions.');
    } else {
      obj.steps.forEach((step, idx) => {
        if (!step.step_id || !step.action) {
          errors.push(`Step at index ${idx} is missing "step_id" or "action".`);
        }
      });
    }
  }

  return errors;
}

function run() {
  const args = process.argv.slice(2);
  const target = args[0];

  if (!target) {
    console.error('Usage: node scripts/validate-workflow-spec.mjs <file-or-dir>');
    process.exit(1);
  }

  try {
    const files = collectFiles(target);
    if (files.length === 0) {
      console.log(`No JSON files found in ${target}.`);
      process.exit(0);
    }

    let totalErrors = 0;
    for (const file of files) {
      const rel = path.relative(process.cwd(), file);
      try {
        const raw = fs.readFileSync(file, 'utf8');
        const parsed = JSON.parse(raw);
        const errors = validateWorkflowObject(parsed, file);
        if (errors.length > 0) {
          console.error(`\n[FAIL] ${rel}:`);
          for (const err of errors) {
            console.error(`  - ${err}`);
          }
          totalErrors += errors.length;
        } else {
          console.log(`[PASS] ${rel}`);
        }
      } catch (parseErr) {
        console.error(`\n[FAIL] ${rel}: Invalid JSON syntax - ${parseErr.message}`);
        totalErrors++;
      }
    }

    if (totalErrors > 0) {
      console.error(`\nValidation failed with ${totalErrors} error(s).`);
      process.exit(1);
    } else {
      console.log('\nAll workflow specification files passed validation.');
      process.exit(0);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

run();
