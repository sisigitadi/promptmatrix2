#!/usr/bin/env node
/**
 * package-agensi-skills.mjs
 * Zero-dependency POSIX ZIP packager & pre-upload validator for Agensi.io Open Agent Skills.
 *
 * Outputs:
 *   - dist-agensi/<slug>.zip (POSIX '/' paths, SKILL.md directly at ZIP root, < 50 MB)
 *   - dist-agensi/AGENSI-LISTING-MANIFEST.md (Indonesia Zoneless SOP + Upload Checklist + Listing Copy)
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const SKILLS_ROOT = path.join(ROOT, 'agensi-skills');
const CONFIG_PATH = path.join(ROOT, 'config', 'agensiConfig.ts');
const OUT_DIR = path.join(ROOT, 'dist-agensi');
const MAX_ZIP_BYTES = 50 * 1024 * 1024;
const EMDASH = '\u2014';

const EXCLUDED_NAMES = new Set(['.DS_Store', 'Thumbs.db', '__MACOSX', 'node_modules', '.git']);
const TEXT_EXTS = new Set(['.md', '.txt', '.json', '.sql', '.mjs', '.js', '.ts', '.yaml', '.yml']);

const BANNED_BUZZWORDS = [
  ['ai', 'powered'],
  ['revo', 'lutionary'],
  ['seam', 'less'],
  ['cutting', 'edge'],
  ['ulti', 'mate'],
].map(([a, b]) => ({
  label: `${a} ${b}`,
  regex: new RegExp(`\\b${a}[\\s-]+${b}\\b`, 'gi'),
}));

const FORBIDDEN_SCRIPT_PATTERNS = [
  { label: 'fetch(', regex: /\bfetch\s*\(/ },
  { label: 'http.', regex: /\bhttp\./ },
  { label: 'https.', regex: /\bhttps\./ },
  { label: 'eval(', regex: /\beval\s*\(/ },
  { label: 'new Function', regex: /\bnew\s+Function\s*\(/ },
  { label: 'process.env', regex: /\bprocess\.env\b/ },
  { label: 'child_process', regex: /\bchild_process\b/ },
];

const LISTING_METADATA_BY_SLUG = {
  'prompt-matrix-prompt-architect': {
    tagline: 'Structure deterministic agent prompts with CO-STAR, RTF, GCC, Few-Shot, and RFC 8259 JSON contracts.',
    tags: ['prompt-engineering', 'co-star', 'json-schema', 'rfc-8259', 'prompt-matrix', 'claude-code', 'cursor'],
  },
  'multimodal-video-image-director': {
    tagline: 'Compile model-native prompts for Midjourney v8.2, FLUX.3, Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6.',
    tags: ['midjourney-v8', 'flux-3', 'veo-3', 'kling-3', 'runway-gen4', 'suno-v6', 'multimodal-prompts'],
  },
  'seo-geo-aeo-content-engine': {
    tagline: 'Author evidence-first SEO pillar pages, AI citation blocks (GEO), AEO answers, and validated JSON-LD schemas.',
    tags: ['technical-seo', 'geo-optimization', 'aeo', 'json-ld', 'schema-org', 'content-engineering'],
  },
  'antislop-ui-and-copy-auditor': {
    tagline: 'Audit WCAG AA dark/light contrast, 375px mobile reflow, keyboard focus rings, em dashes, and copy hygiene.',
    tags: ['wcag-aa', 'accessibility', 'ui-audit', 'copywriting', 'react-tsx', 'focus-visible'],
  },
  'fullstack-ts-nextjs-architect': {
    tagline: 'Enforce Next.js App Router server boundaries, strict zero-any TypeScript, Zod contracts, and safe SQL migrations.',
    tags: ['nextjs-app-router', 'strict-typescript', 'zero-any', 'zod', 'server-actions', 'architecture'],
  },
  'mcp-server-production-builder': {
    tagline: 'Build hardened Model Context Protocol servers with Zod tool schemas, stdio/Streamable HTTP, and secret redaction.',
    tags: ['mcp-server', 'model-context-protocol', 'zod-schema', 'streamable-http', 'stdio', 'security'],
  },
  'postgres-prisma-zero-downtime-sql-tuner': {
    tagline: 'Author lock-safe PostgreSQL and Prisma migrations with CONCURRENTLY indexes, RLS policies, and SQL linting.',
    tags: ['postgresql', 'prisma', 'zero-downtime-migration', 'rls', 'sql-linter', 'database'],
  },
  'playwright-e2e-and-openapi-contract-suite': {
    tagline: 'Deliver flake-free Playwright E2E tests and OpenAPI 3.x API schema contracts with automated validation.',
    tags: ['playwright', 'e2e-testing', 'openapi-3', 'api-contracts', 'qa-automation', 'testing'],
  },
  'owasp-api-and-cloud-security-auditor': {
    tagline: 'Audit OWASP API Top 10 risks, CORS policies, hardcoded secrets, and cloud IAM posture via CLI scanner.',
    tags: ['owasp-api', 'cloud-security', 'iam-hardening', 'secret-scanner', 'appsec', 'devsecops'],
  },
  'multi-agent-swarm-and-subagent-orchestrator': {
    tagline: 'Coordinate parallel subagent swarms with strict file ownership, JSON handoff contracts, and workspace checks.',
    tags: ['multi-agent', 'swarm-orchestration', 'subagents', 'agents-md', 'claude-code', 'automation'],
  },
};

// Precompute standard IEEE 802.3 CRC-32 lookup table
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC32_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function toDosTimeDate(date) {
  const year = Math.max(1980, date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);

  const dosTime = ((hours & 0x1f) << 11) | ((minutes & 0x3f) << 5) | (seconds & 0x1f);
  const dosDate = (((year - 1980) & 0x7f) << 9) | ((month & 0x0f) << 5) | (day & 0x1f);
  return { dosTime, dosDate };
}

function normalizePosixPath(relPath) {
  return relPath.split(path.sep).join('/').replace(/^\/+/, '');
}

/**
 * Builds a deterministic POSIX-compatible ZIP archive buffer using zlib.deflateRawSync
 * (falls back to Store method 0 if compression does not shrink the entry).
 */
function buildPosixZip(entries) {
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const entry of entries) {
    const posixName = normalizePosixPath(entry.name);
    if (!posixName || posixName.includes('\\') || posixName.startsWith('/')) {
      throw new Error(`Invalid ZIP entry path: "${entry.name}"`);
    }

    const nameBytes = Buffer.from(posixName, 'utf8');
    const rawData = entry.data;
    const checksum = crc32(rawData);
    const compressed = zlib.deflateRawSync(rawData, { level: 9 });
    const useDeflate = compressed.length < rawData.length;
    const method = useDeflate ? 8 : 0;
    const payload = useDeflate ? compressed : rawData;

    const { dosTime, dosDate } = toDosTimeDate(entry.mtime || new Date('2026-11-18T00:00:00Z'));
    const flags = 0x0800; // UTF-8 filename encoding
    const versionNeeded = 20;
    const versionMadeBy = 0x031e; // Unix (3) + PKZIP 3.0 (30)
    const unixMode = posixName.endsWith('.mjs') ? 0o100755 : 0o100644;
    const externalAttrs = (unixMode << 16) >>> 0;

    // Local File Header (30 bytes + filename)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(versionNeeded, 4);
    localHeader.writeUInt16LE(flags, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(payload.length, 18);
    localHeader.writeUInt32LE(rawData.length, 22);
    localHeader.writeUInt16LE(nameBytes.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localChunks.push(localHeader, nameBytes, payload);

    // Central Directory File Header (46 bytes + filename)
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(versionMadeBy, 4);
    centralHeader.writeUInt16LE(versionNeeded, 6);
    centralHeader.writeUInt16LE(flags, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(payload.length, 20);
    centralHeader.writeUInt32LE(rawData.length, 24);
    centralHeader.writeUInt16LE(nameBytes.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(externalAttrs, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralChunks.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + payload.length;
  }

  const centralDirBuffer = Buffer.concat(centralChunks);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localChunks, centralDirBuffer, eocd]);
}

/**
 * Reads back Central Directory entry filenames from a written ZIP buffer
 * to verify archive structure without external unzip binaries.
 */
function readZipCentralDirectoryFilenames(zipBuffer) {
  let eocdOffset = -1;
  const minOffset = Math.max(0, zipBuffer.length - 65557);
  for (let i = zipBuffer.length - 22; i >= minOffset; i--) {
    if (zipBuffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    throw new Error('EOCD signature (0x06054b50) not found in generated ZIP');
  }

  const totalEntries = zipBuffer.readUInt16LE(eocdOffset + 10);
  const cdOffset = zipBuffer.readUInt32LE(eocdOffset + 16);
  const filenames = [];
  let cursor = cdOffset;

  for (let i = 0; i < totalEntries; i++) {
    if (cursor + 46 > zipBuffer.length || zipBuffer.readUInt32LE(cursor) !== 0x02014b50) {
      throw new Error(`Invalid Central Directory header at offset ${cursor}`);
    }
    const nameLen = zipBuffer.readUInt16LE(cursor + 28);
    const extraLen = zipBuffer.readUInt16LE(cursor + 30);
    const commentLen = zipBuffer.readUInt16LE(cursor + 32);
    const filename = zipBuffer.subarray(cursor + 46, cursor + 46 + nameLen).toString('utf8');
    filenames.push(filename);
    cursor += 46 + nameLen + extraLen + commentLen;
  }
  return filenames;
}

function parseSimpleYamlFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const yamlText = match[1];
  const body = match[2];
  const data = {};
  const lines = yamlText.split(/\r?\n/);
  let currentParent = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indentMatch = line.match(/^(\s+)([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (indentMatch && currentParent) {
      const key = indentMatch[2];
      let val = indentMatch[3].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (typeof data[currentParent] !== 'object' || data[currentParent] === null) {
        data[currentParent] = {};
      }
      data[currentParent][key] = val;
      continue;
    }

    const topMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (topMatch) {
      const key = topMatch[1];
      let val = topMatch[2].trim();
      if (!val) {
        data[key] = {};
        currentParent = key;
      } else {
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        data[key] = val;
        currentParent = null;
      }
    }
  }
  return { frontmatter: data, body };
}

/**
 * Extracts bundledSkillPacks items directly from config/agensiConfig.ts
 * without third-party dependencies.
 */
function parseBundledSkillPacksFromConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing config file: ${configPath}`);
  }
  const source = fs.readFileSync(configPath, 'utf8');
  const match = source.match(/bundledSkillPacks:\s*\[/);
  if (!match || match.index === undefined) {
    throw new Error('Could not locate bundledSkillPacks: [ in config/agensiConfig.ts');
  }
  const arrayStart = match.index + match[0].length - 1;

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  let arrayEnd = -1;

  for (let i = arrayStart; i < source.length; i++) {
    const ch = source[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\' && (inSingle || inDouble)) {
      escaped = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (inSingle || inDouble) continue;

    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }

  if (arrayEnd === -1) {
    throw new Error('Could not locate bundledSkillPacks array closing bracket');
  }

  const arrayBlock = source.slice(arrayStart + 1, arrayEnd);
  const objects = [];
  let objDepth = 0;
  let objStart = -1;
  inSingle = false;
  inDouble = false;
  escaped = false;

  for (let i = 0; i < arrayBlock.length; i++) {
    const ch = arrayBlock[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\' && (inSingle || inDouble)) {
      escaped = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (inSingle || inDouble) continue;

    if (ch === '{') {
      if (objDepth === 0) objStart = i;
      objDepth++;
    } else if (ch === '}') {
      objDepth--;
      if (objDepth === 0 && objStart !== -1) {
        objects.push(arrayBlock.slice(objStart, i + 1));
        objStart = -1;
      }
    }
  }

  const readStringProp = (block, key) => {
    const m = block.match(new RegExp(`${key}:\\s*'([^']*)'`));
    return m ? m[1] : '';
  };
  const readNumberProp = (block, key) => {
    const m = block.match(new RegExp(`${key}:\\s*([0-9]+(?:\\.[0-9]+)?)`));
    return m ? Number(m[1]) : 0;
  };
  const readStringArrayProp = (block, key) => {
    const m = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
    if (!m) return [];
    const vals = [];
    const re = /'([^']*)'/g;
    let item;
    while ((item = re.exec(m[1])) !== null) {
      vals.push(item[1]);
    }
    return vals;
  };

  return objects.map((block) => ({
    slug: readStringProp(block, 'slug'),
    title: readStringProp(block, 'title'),
    tier: readStringProp(block, 'tier'),
    priceUsd: readNumberProp(block, 'priceUsd'),
    priceLabel: readStringProp(block, 'priceLabel'),
    summaryEn: readStringProp(block, 'summaryEn'),
    summaryId: readStringProp(block, 'summaryId'),
    includedFiles: readStringArrayProp(block, 'includedFiles'),
  }));
}

function collectSkillFiles(skillDir, currentDir = skillDir) {
  const results = [];
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (EXCLUDED_NAMES.has(entry.name)) continue;
    const absPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSkillFiles(skillDir, absPath));
    } else if (entry.isFile()) {
      const relPosix = normalizePosixPath(path.relative(skillDir, absPath));
      results.push({ absPath, relPosix });
    }
  }
  return results;
}

function validateSkillPackage(slug, skillDir, expectedConfigPack) {
  const errors = [];
  const skillMdPath = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    errors.push(`Missing SKILL.md at root of agensi-skills/${slug}`);
    return { errors, frontmatter: null, files: [] };
  }

  const skillMdRaw = fs.readFileSync(skillMdPath, 'utf8');
  const parsed = parseSimpleYamlFrontmatter(skillMdRaw);
  if (!parsed) {
    errors.push(`Invalid or missing YAML frontmatter in agensi-skills/${slug}/SKILL.md`);
    return { errors, frontmatter: null, files: [] };
  }

  const { frontmatter, body } = parsed;
  const skillName = frontmatter.name || '';
  const desc = frontmatter.description || '';
  const license = frontmatter.license || '';
  const metadata = frontmatter.metadata;

  if (!skillName || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillName) || skillName.length > 64) {
    errors.push(`Invalid kebab-case frontmatter name "${skillName}"`);
  }
  if (skillName !== slug) {
    errors.push(`Frontmatter name "${skillName}" does not match folder "${slug}"`);
  }
  if (!desc || desc.length > 1024) {
    errors.push(`Frontmatter description length invalid (${desc.length}, must be 1..1024)`);
  }
  if (!license) {
    errors.push('Missing frontmatter license');
  }
  if (!metadata || typeof metadata !== 'object' || !metadata.author || !metadata.version) {
    errors.push('Missing metadata.author or metadata.version');
  }
  if (!body || body.trim().length < 50) {
    errors.push('SKILL.md markdown body is empty or too short');
  }

  const files = collectSkillFiles(skillDir);
  if (files.length === 0) {
    errors.push('No package files found');
  }

  // Verify every includedFile declared in config/agensiConfig.ts exists
  for (const declaredFile of expectedConfigPack.includedFiles) {
    if (!files.some((f) => f.relPosix === declaredFile)) {
      errors.push(`Declared file "${declaredFile}" from agensiConfig.ts missing on disk`);
    }
  }

  for (const file of files) {
    const ext = path.extname(file.relPosix).toLowerCase();
    if (!TEXT_EXTS.has(ext)) continue;

    const raw = fs.readFileSync(file.absPath, 'utf8');
    const lines = raw.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(EMDASH)) {
        errors.push(`${slug}/${file.relPosix}:${i + 1} contains em-dash (U+2014)`);
      }
      for (const bw of BANNED_BUZZWORDS) {
        bw.regex.lastIndex = 0;
        if (bw.regex.test(line)) {
          errors.push(`${slug}/${file.relPosix}:${i + 1} contains banned buzzword "${bw.label}"`);
        }
      }
    }

    if (file.relPosix.startsWith('scripts/') && ext === '.mjs') {
      try {
        execFileSync(process.execPath, ['--check', file.absPath], { stdio: 'pipe' });
      } catch (err) {
        const stderr = err && err.stderr ? String(err.stderr).trim() : String(err);
        errors.push(`${slug}/${file.relPosix} failed node --check: ${stderr}`);
      }

      for (const rule of FORBIDDEN_SCRIPT_PATTERNS) {
        if (rule.regex.test(raw)) {
          errors.push(`${slug}/${file.relPosix} contains forbidden security-scan pattern "${rule.label}"`);
        }
      }
    }
  }

  return { errors, frontmatter, files };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB (${bytes} bytes)`;
}

function buildListingManifest(packagedResults) {
  const ordered = [
    ...packagedResults.filter((r) => r.pack.tier === 'lead-magnet'),
    ...packagedResults.filter((r) => r.pack.tier !== 'lead-magnet').sort((a, b) => a.pack.priceUsd - b.pack.priceUsd),
  ];

  const lines = [];
  lines.push('# Agensi.io Listing Manifest & Upload Checklist (PromptMatrix 2.0)');
  lines.push('');
  lines.push(`Generated automatically by \`scripts/package-agensi-skills.mjs\` (${packagedResults.length} verified skill archives).`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 1. Indonesia Payout Setup SOP (Stripe Connect vs. Zoneless USDC on Solana)');
  lines.push('');
  lines.push('Agensi.io restricts Stripe Connect instant payouts to the US, Canada, UK, EEA, and Switzerland. Creators in Indonesia receive payouts via **Zoneless (USDC on Solana)** directly to a self-custody wallet.');
  lines.push('');
  lines.push('- **Minimum Payout Threshold:** `$3.50 USD`');
  lines.push('- **Settlement Window:** Within `72 hours` of each completed buyer purchase (Agensi absorbs buyer card/Stripe fees)');
  lines.push('- **Revenue Split:** `70%` organic marketplace discovery | `90%` via your `?ref=` affiliate link + `20%` on all other Agensi purchases by that buyer for 6 months');
  lines.push('');
  lines.push('### Step-by-Step Cashout Architecture (Zero Lost Funds)');
  lines.push('1. **Stage 1 (Non-Custodial Vault):** Create a **Phantom** or **Solflare** Solana wallet and register its Solana address in Agensi Creator Studio -> Zoneless Payouts. Never paste a centralized exchange (CEX) deposit address directly into Zoneless because exchanges rotate deposit addresses and may pause SPL-USDC maintenance. Keep `~0.05 SOL` in the wallet for Solana gas fees (`< $0.005` per transfer).');
  lines.push('2. **Stage 2A (Direct SPL-USDC Off-Ramp):** Open **Pintu** -> Deposit **USDC** -> explicitly select the **Solana (SPL)** network -> transfer USDC from Phantom/Solflare -> swap USDC to IDR -> withdraw to BCA/Mandiri/BRI/Jago.');
  lines.push('3. **Stage 2B (Universal Fallback via Jupiter -> SOL):** If SPL-USDC deposits are under maintenance, swap **USDC -> SOL** inside Phantom/Solflare via **Jupiter (`jup.ag`)**, send **SOL** on the native Solana network to **Pintu**, **Tokocrypto**, or **Indodax**, sell SOL to IDR, and withdraw to your bank account.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 2. Recommended Upload Sequence');
  lines.push('');
  lines.push('1. **Upload #1 First (`prompt-matrix-prompt-architect` at `$0 Free`):** Establishes your Agensi creator store profile, verifies automated security scan clearance, builds install count social proof, and drops 6-month `20%` affiliate cookies when PromptMatrix visitors claim the free pack.');
  lines.push('2. **Upload #2 to #10 (Paid Flagships `$9.99` to `$19.99`):** Upload each `.zip` directly from `dist-agensi/<slug>.zip`. Every archive places `SKILL.md` at the ZIP root with POSIX `/` paths and passes size (`< 50 MB`) and script security checks.');
  lines.push('3. **Wire Production Affiliate Links:** Copy your Creator Store URL, Affiliate Referral URL, and `ref` code into PromptMatrix (`9-tap header logo -> Pengaturan AI -> Tab Paket Skill` or `config/agensiConfig.ts`) so public visitors on `https://prompt.sigitadi.id` route through your 90% affiliate funnel.');
  lines.push('');
  lines.push('| # | Slug | Tier | Price (USD) | Archive | Size | Root `SKILL.md` |');
  lines.push('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');
  ordered.forEach((item, idx) => {
    lines.push(
      `| ${idx + 1} | \`${item.pack.slug}\` | ${item.pack.tier} | ${item.pack.priceLabel} | \`${item.zipFileName}\` | ${formatBytes(item.zipBytes)} | Verified (${item.centralDirEntries.length} files) |`
    );
  });
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 3. Ready-to-Copy Listing Copy (All 10 Skills)');
  lines.push('');

  ordered.forEach((item, idx) => {
    const meta = LISTING_METADATA_BY_SLUG[item.pack.slug] || {
      tagline: item.pack.summaryEn,
      tags: ['agent-skills', 'promptmatrix', 'automation'],
    };
    const descriptionText = `${item.frontmatter.description} Built from PromptMatrix 2.0 (${item.pack.summaryEn}) and packaged with deterministic offline references and Node.js verification tooling (${item.pack.includedFiles.join(', ')}).`;

    lines.push(`### ${idx + 1}. ${item.pack.title} (\`${item.pack.slug}\`)`);
    lines.push('');
    lines.push(`- **Archive:** \`dist-agensi/${item.zipFileName}\` (${formatBytes(item.zipBytes)}, ${item.centralDirEntries.length} files)`);
    lines.push(`- **Title:** ${item.pack.title}`);
    lines.push(`- **Price (USD):** ${item.pack.priceLabel}`);
    lines.push(`- **Tagline:** ${meta.tagline}`);
    lines.push(`- **Tags:** ${meta.tags.map((t) => `\`${t}\``).join(', ')}`);
    lines.push('- **Description Markdown:**');
    lines.push('');
    lines.push('```markdown');
    lines.push(descriptionText);
    lines.push('');
    lines.push('Included in this skill package:');
    for (const fileEntry of item.centralDirEntries) {
      lines.push(`- \`${fileEntry}\``);
    }
    lines.push('');
    lines.push('Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 20+ Open Agent Skills runtimes.');
    lines.push('```');
    lines.push('');
  });

  return `${lines.join('\n')}\n`;
}

function main() {
  console.log('=== PromptMatrix 2.0 Agensi.io Skill Packager ===\n');

  const configPacks = parseBundledSkillPacksFromConfig(CONFIG_PATH);
  if (configPacks.length !== 10) {
    throw new Error(`Expected 10 skill packs in config/agensiConfig.ts, found ${configPacks.length}`);
  }

  if (!fs.existsSync(SKILLS_ROOT)) {
    throw new Error('Missing agensi-skills/ directory');
  }

  const diskDirs = fs
    .readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const expectedSlugs = configPacks.map((p) => p.slug).sort();
  if (diskDirs.length !== expectedSlugs.length || diskDirs.some((d, idx) => d !== expectedSlugs[idx])) {
    throw new Error(
      `Skill directory mismatch.\n  Disk:   ${diskDirs.join(', ')}\n  Config: ${expectedSlugs.join(', ')}`
    );
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const allErrors = [];
  const packagedResults = [];

  for (const pack of configPacks) {
    const skillDir = path.join(SKILLS_ROOT, pack.slug);
    const { errors, frontmatter, files } = validateSkillPackage(pack.slug, skillDir, pack);

    if (errors.length > 0) {
      allErrors.push(...errors);
      console.log(`  [FAIL] ${pack.slug}: ${errors.length} error(s)`);
      continue;
    }

    const zipEntries = files.map((file) => {
      const stat = fs.statSync(file.absPath);
      return {
        name: file.relPosix,
        data: fs.readFileSync(file.absPath),
        mtime: stat.mtime,
      };
    });

    const zipBuffer = buildPosixZip(zipEntries);
    if (zipBuffer.length >= MAX_ZIP_BYTES) {
      allErrors.push(`${pack.slug}.zip exceeds 50 MB limit (${zipBuffer.length} bytes)`);
      continue;
    }

    const zipFileName = `${pack.slug}.zip`;
    const zipOutPath = path.join(OUT_DIR, zipFileName);
    fs.writeFileSync(zipOutPath, zipBuffer);

    // Read back Central Directory from disk to assert root SKILL.md and POSIX paths
    const writtenBuffer = fs.readFileSync(zipOutPath);
    const cdFilenames = readZipCentralDirectoryFilenames(writtenBuffer);

    if (!cdFilenames.includes('SKILL.md')) {
      allErrors.push(`${zipFileName}: Central Directory does not contain root SKILL.md`);
      continue;
    }
    if (cdFilenames.some((name) => name.includes('\\') || name.startsWith('/') || name.startsWith(`${pack.slug}/`))) {
      allErrors.push(`${zipFileName}: Invalid non-root or non-POSIX paths in Central Directory: ${cdFilenames.join(', ')}`);
      continue;
    }
    if (cdFilenames.length !== zipEntries.length) {
      allErrors.push(`${zipFileName}: Entry count mismatch (expected ${zipEntries.length}, got ${cdFilenames.length})`);
      continue;
    }

    packagedResults.push({
      pack,
      frontmatter,
      zipFileName,
      zipBytes: writtenBuffer.length,
      centralDirEntries: cdFilenames,
    });

    console.log(
      `  [PACK] ${zipFileName} (${formatBytes(writtenBuffer.length)}, ${cdFilenames.length} entries, root SKILL.md OK)`
    );
  }

  if (allErrors.length > 0) {
    console.error(`\nPackaging FAILED with ${allErrors.length} error(s):`);
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  const manifestContent = buildListingManifest(packagedResults);
  const manifestPath = path.join(OUT_DIR, 'AGENSI-LISTING-MANIFEST.md');
  fs.writeFileSync(manifestPath, manifestContent, 'utf8');

  console.log(`\nGenerated manifest: dist-agensi/AGENSI-LISTING-MANIFEST.md`);
  console.log(`SUCCESS: Packaged and verified ${packagedResults.length}/10 Agensi.io skill archives in dist-agensi/.`);
}

main();
