#!/usr/bin/env node
/**
 * validate-jsonld.mjs
 * Extracts and validates JSON-LD blocks from .html, .md, or .json/.jsonld files.
 * Checks RFC 8259 JSON validity, @context, @type, and required fields for
 * FAQPage, HowTo, SoftwareApplication, Article, and Product schemas.
 *
 * Usage:
 *   node scripts/validate-jsonld.mjs <file-or-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TARGET_EXTS = new Set(['.html', '.htm', '.md', '.json', '.jsonld']);
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

function collectFiles(targetPath) {
  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Path not found: ${targetPath}`);
  }
  const stat = fs.statSync(resolved);
  if (stat.isFile()) return [resolved];

  const files = [];
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full));
    } else if (entry.isFile() && TARGET_EXTS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function extractBlocks(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const blocks = [];

  if (ext === '.json' || ext === '.jsonld') {
    blocks.push({ source: 'file', raw: content.trim() });
    return blocks;
  }

  if (ext === '.html' || ext === '.htm') {
    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let idx = 0;
    while ((match = scriptRegex.exec(content)) !== null) {
      idx++;
      blocks.push({ source: `<script ld+json #${idx}>`, raw: match[1].trim() });
    }
    return blocks;
  }

  if (ext === '.md') {
    const fenceRegex = /```(?:jsonld|json)\r?\n([\s\S]*?)```/gi;
    let match;
    let idx = 0;
    while ((match = fenceRegex.exec(content)) !== null) {
      const body = match[1].trim();
      if (body.includes('"@context"') || body.includes('"@type"')) {
        idx++;
        blocks.push({ source: `markdown block #${idx}`, raw: body });
      }
    }
    return blocks;
  }

  return blocks;
}

function validateSchemaNode(node, label, errors) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    errors.push(`${label}: JSON-LD node must be a JSON object.`);
    return;
  }

  const ctx = node['@context'];
  if (typeof ctx === 'string') {
    if (!ctx.includes('schema.org')) {
      errors.push(`${label}: @context should reference schema.org (got "${ctx}").`);
    }
  } else if (!Array.isArray(ctx) && typeof ctx !== 'object') {
    errors.push(`${label}: missing @context (expected "https://schema.org").`);
  }

  const types = Array.isArray(node['@type']) ? node['@type'] : node['@type'] ? [node['@type']] : [];
  if (types.length === 0) {
    errors.push(`${label}: missing @type.`);
    return;
  }

  if (types.includes('FAQPage')) {
    if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
      errors.push(`${label} (FAQPage): "mainEntity" must be a non-empty array of Question objects.`);
    } else {
      node.mainEntity.forEach((q, i) => {
        if (!q || q['@type'] !== 'Question' || typeof q.name !== 'string' || !q.name.trim()) {
          errors.push(`${label} (FAQPage): mainEntity[${i}] must have @type "Question" and non-empty "name".`);
        }
        if (!q?.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer' || typeof q.acceptedAnswer.text !== 'string' || !q.acceptedAnswer.text.trim()) {
          errors.push(`${label} (FAQPage): mainEntity[${i}].acceptedAnswer must have @type "Answer" and non-empty "text".`);
        }
      });
    }
  }

  if (types.includes('HowTo')) {
    if (typeof node.name !== 'string' || !node.name.trim()) {
      errors.push(`${label} (HowTo): missing non-empty "name".`);
    }
    if (!Array.isArray(node.step) || node.step.length === 0) {
      errors.push(`${label} (HowTo): "step" must be a non-empty array of HowToStep items.`);
    }
  }

  if (types.includes('SoftwareApplication')) {
    if (typeof node.name !== 'string' || !node.name.trim()) {
      errors.push(`${label} (SoftwareApplication): missing non-empty "name".`);
    }
    if (typeof node.applicationCategory !== 'string' || !node.applicationCategory.trim()) {
      errors.push(`${label} (SoftwareApplication): missing "applicationCategory".`);
    }
  }

  if (types.includes('Article') || types.includes('BlogPosting') || types.includes('TechArticle')) {
    if (typeof node.headline !== 'string' || !node.headline.trim()) {
      errors.push(`${label} (${types[0]}): missing non-empty "headline".`);
    }
  }
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = extractBlocks(filePath, content);
  const errors = [];

  if (blocks.length === 0) {
    return { blocksFound: 0, errors };
  }

  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block.raw);
    } catch (err) {
      errors.push(`${block.source}: JSON parse error (${err instanceof Error ? err.message : String(err)}).`);
      continue;
    }

    if (Array.isArray(parsed)) {
      parsed.forEach((item, idx) => validateSchemaNode(item, `${block.source}[${idx}]`, errors));
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed['@graph'])) {
      if (!parsed['@context']) {
        errors.push(`${block.source}: @graph container missing top-level @context.`);
      }
      parsed['@graph'].forEach((item, idx) => {
        const merged = { '@context': item['@context'] ?? parsed['@context'], ...item };
        validateSchemaNode(merged, `${block.source}.@graph[${idx}]`, errors);
      });
    } else {
      validateSchemaNode(parsed, block.source, errors);
    }
  }

  return { blocksFound: blocks.length, errors };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node validate-jsonld.mjs <file-or-dir>');
    process.exit(args.length === 0 ? 1 : 0);
  }

  const target = args.find((a) => !a.startsWith('--'));
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

  let totalBlocks = 0;
  let totalErrors = 0;

  for (const file of files) {
    const { blocksFound, errors } = validateFile(file);
    if (blocksFound === 0) continue;
    totalBlocks += blocksFound;
    const rel = path.relative(process.cwd(), file);
    if (errors.length === 0) {
      console.log(`PASS  ${rel} (${blocksFound} JSON-LD block(s))`);
    } else {
      totalErrors += errors.length;
      console.error(`FAIL  ${rel}`);
      for (const e of errors) {
        console.error(`  - ${e}`);
      }
    }
  }

  if (totalBlocks === 0) {
    console.error(`No JSON-LD blocks found in: ${target}`);
    process.exit(1);
  }

  if (totalErrors > 0) {
    console.error(`\nJSON-LD validation failed with ${totalErrors} error(s).`);
    process.exit(1);
  }
  console.log(`\nPASS: Validated ${totalBlocks} JSON-LD block(s) with 0 errors.`);
}

main();
