#!/usr/bin/env node
/**
 * package-multi-channels.mjs
 * Multi-marketplace distribution packager for PromptMatrix 2.0 (3 Pillars):
 *   1. dist-lead-magnet/        -> Public OSS lead-magnet repo (free pack only, zero paid IP leak)
 *   2. dist-channels/storefronts/ -> Global MoR suite ZIP (9 paid flagships) + storefront copy
 *   3. dist-channels/promptbase/  -> 15 structured PromptBase listings compiled from live data
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import zlib from 'node:zlib';
import * as esbuild from 'esbuild';

const ROOT = process.cwd();
const SKILLS_ROOT = path.join(ROOT, 'agensi-skills');
const LEAD_MAGNET_SLUG = 'prompt-matrix-prompt-architect';
const LEAD_MAGNET_DIR = path.join(ROOT, 'dist-lead-magnet');
const STOREFRONTS_DIR = path.join(ROOT, 'dist-channels', 'storefronts');
const PROMPTBASE_DIR = path.join(ROOT, 'dist-channels', 'promptbase');
const MAX_ZIP_BYTES = 50 * 1024 * 1024;
const SUITE_BUNDLE_PRICE_USD = 59.0;
const PROMPTMATRIX_URL = 'https://prompt.sigitadi.id';
const EMDASH = '\u2014';

const EXCLUDED_NAMES = new Set(['.DS_Store', 'Thumbs.db', '__MACOSX', 'node_modules', '.git']);
const AUDIT_TEXT_EXTS = new Set(['.md', '.mdc', '.json', '.mjs', '.txt']);

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

const PROMPTBASE_TARGET_SPECS = [
  {
    frameworkKey: 'AI Coding Agent Rules Architect (.cursorrules & Windsurf)',
    title: 'AI Coding Agent Rules (.cursorrules)',
    targetEngine: 'Claude / ChatGPT (Cursor, Windsurf)',
    suggestedPriceUsd: 6.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or GPT-4o | Temperature: 0.2',
  },
  {
    frameworkKey: 'MCP (Model Context Protocol) Server & Tool Designer',
    title: 'MCP Server & Tool Spec Architect',
    targetEngine: 'Claude / ChatGPT',
    suggestedPriceUsd: 7.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or o3-mini | Temperature: 0.2',
  },
  {
    frameworkKey: 'Claude Code Subagent & Hooks Orchestrator',
    title: 'Claude Code Subagent & Hooks System',
    targetEngine: 'Claude (Claude Code)',
    suggestedPriceUsd: 7.99,
    engineSettings: 'Model: Claude Sonnet 4.5 / Opus | Temperature: 0.2',
  },
  {
    frameworkKey: 'PostgreSQL Zero-Downtime Migration & RLS Architect',
    title: 'Postgres Zero-Downtime & RLS Architect',
    targetEngine: 'Claude / ChatGPT',
    suggestedPriceUsd: 8.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or GPT-4o | Temperature: 0.1',
  },
  {
    frameworkKey: 'API Security Pentest & OWASP Top 10 Reviewer',
    title: 'API Security & OWASP Top 10 Auditor',
    targetEngine: 'Claude / ChatGPT',
    suggestedPriceUsd: 9.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or o3 | Temperature: 0.1',
  },
  {
    frameworkKey: 'Multi-Agent Swarm Task Decomposition & Verifier Spec',
    title: 'Multi-Agent Swarm & Verifier Spec',
    targetEngine: 'Claude / ChatGPT',
    suggestedPriceUsd: 8.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or GPT-4o | Temperature: 0.2',
  },
  {
    frameworkKey: 'SaaS Investor Pitch Deck (12-Slide VC Blueprint)',
    title: 'SaaS Investor 12-Slide Pitch Deck',
    targetEngine: 'ChatGPT / Claude',
    suggestedPriceUsd: 6.99,
    engineSettings: 'Model: GPT-4o or Claude Sonnet 4.5 | Temperature: 0.5',
  },
  {
    frameworkKey: 'Solo Founder Micro-SaaS 30-Day Launch Blueprint',
    title: 'Micro-SaaS 30-Day Launch Blueprint',
    targetEngine: 'ChatGPT / Claude',
    suggestedPriceUsd: 5.99,
    engineSettings: 'Model: GPT-4o or Claude Sonnet 4.5 | Temperature: 0.4',
  },
  {
    frameworkKey: 'SEO Pillar Article 3.000 Words Master Architect',
    title: 'SEO Pillar 3000-Word Master System',
    targetEngine: 'Claude / ChatGPT',
    suggestedPriceUsd: 6.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or GPT-4o | Temperature: 0.5',
  },
  {
    frameworkKey: 'SaaS Onboarding Lifecycle Email Sequence (Behavior-Driven)',
    title: 'SaaS Onboarding Lifecycle Emails',
    targetEngine: 'ChatGPT / Claude',
    suggestedPriceUsd: 5.99,
    engineSettings: 'Model: Claude Sonnet 4.5 or GPT-4o | Temperature: 0.6',
  },
  {
    frameworkKey: 'Midjourney v7 Omniref & Style Weight Director',
    title: 'Midjourney v7 Omniref & Style Director',
    targetEngine: 'Midjourney (v7)',
    suggestedPriceUsd: 4.99,
    engineSettings: 'Model: Midjourney v7 | --style raw | --ar 16:9',
  },
  {
    frameworkKey: 'FLUX.2 / Kontext Precision Image Editing Prompt',
    title: 'FLUX.2 Kontext Precision Image Editor',
    targetEngine: 'FLUX (FLUX.2 / Kontext)',
    suggestedPriceUsd: 4.99,
    engineSettings: 'Model: FLUX.2 / FLUX.1 Kontext Pro | Guidance: 3.5',
  },
  {
    frameworkKey: 'Google Veo 3 Synchronized Audio-Video Shot Director',
    title: 'Google Veo 3 Audio-Video Shot Director',
    targetEngine: 'Veo (Google Veo 3)',
    suggestedPriceUsd: 5.99,
    engineSettings: 'Model: Google Veo 3 / 3.1 | 1080p 24fps Native Audio',
  },
  {
    frameworkKey: 'OpenAI Sora 2 Multi-Shot Storyboard Continuity',
    title: 'Sora 2 Multi-Shot Storyboard Director',
    targetEngine: 'Sora (OpenAI Sora 2)',
    suggestedPriceUsd: 5.99,
    engineSettings: 'Model: OpenAI Sora 2 | Multi-Shot Storyboard Mode',
  },
  {
    frameworkKey: 'Suno v4.5 / v5 Multi-Stem Studio Arrangement',
    title: 'Suno v5 Multi-Stem Studio Arranger',
    targetEngine: 'Suno (v4.5 / v5)',
    suggestedPriceUsd: 4.99,
    engineSettings: 'Model: Suno v4.5 / v5 Custom Mode | Style + Lyrics Split',
  },
];

// IEEE 802.3 CRC-32 lookup table
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
 * Loads a TypeScript module synchronously via esbuild into an isolated data-URL ESM module.
 */
async function loadTsModule(relPath) {
  const absPath = path.join(ROOT, relPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Missing TypeScript module: ${relPath}`);
  }
  const result = esbuild.buildSync({
    entryPoints: [absPath],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(code, 'utf8').toString('base64')}`;
  return import(dataUrl);
}

/**
 * Builds a deterministic POSIX ZIP archive buffer using deflateRawSync, CRC-32, and UTF-8 bit 11.
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
    const flags = 0x0800; // UTF-8 filename encoding (bit 11)
    const versionNeeded = 20;
    const versionMadeBy = 0x031e; // Unix (3) + PKZIP 3.0 (30)
    const unixMode = posixName.endsWith('.mjs') ? 0o100755 : 0o100644;
    const externalAttrs = (unixMode << 16) >>> 0;

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

function collectFilesRecursive(baseDir, currentDir = baseDir) {
  const results = [];
  if (!fs.existsSync(currentDir)) return results;
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (EXCLUDED_NAMES.has(entry.name)) continue;
    const absPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesRecursive(baseDir, absPath));
    } else if (entry.isFile()) {
      results.push({
        absPath,
        relPosix: normalizePosixPath(path.relative(baseDir, absPath)),
      });
    }
  }
  return results;
}

function cleanTextForDistribution(text) {
  return String(text || '')
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .trim();
}

function writeCleanFile(absPath, content) {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content, 'utf8');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Pillar 1: Builds dist-lead-magnet/ as a clean public OSS repo containing ONLY the free pack.
 */
function buildLeadMagnetPillar(agensiConfig) {
  fs.rmSync(LEAD_MAGNET_DIR, { recursive: true, force: true });
  fs.mkdirSync(LEAD_MAGNET_DIR, { recursive: true });

  const allPacks = agensiConfig.bundledSkillPacks || [];
  const leadPack = allPacks.find((p) => p.slug === LEAD_MAGNET_SLUG);
  const flagshipPacks = allPacks.filter((p) => p.tier === 'flagship');

  if (!leadPack || flagshipPacks.length !== 9) {
    throw new Error(
      `Expected 1 lead-magnet and 9 flagship packs in config/agensiConfig.ts, found lead=${Boolean(leadPack)}, flagship=${flagshipPacks.length}`
    );
  }

  const leadSourceDir = path.join(SKILLS_ROOT, LEAD_MAGNET_SLUG);
  const expectedFiles = [
    'SKILL.md',
    'references/frameworks-cheatsheet.md',
    'scripts/validate-json-prompt.mjs',
  ];

  for (const rel of expectedFiles) {
    const src = path.join(leadSourceDir, rel);
    if (!fs.existsSync(src)) {
      throw new Error(`Missing required lead-magnet file: agensi-skills/${LEAD_MAGNET_SLUG}/${rel}`);
    }
    const dest = path.join(LEAD_MAGNET_DIR, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  const affiliateUrl = agensiConfig.affiliateUrl || 'https://www.agensi.io/r/SIGITADI';

  const cursorMdc = [
    '---',
    'description: Structure deterministic agent prompts using CO-STAR, RTF, GCC, Few-Shot, and RFC 8259 JSON contracts from PromptMatrix 2.0.',
    'globs: ["**/*.md", "**/*.json", "**/prompts/**", "**/*prompt*"]',
    'alwaysApply: false',
    '---',
    '',
    '# PromptMatrix Prompt Architect (.cursor/rules)',
    '',
    'Apply these prompt engineering rules whenever drafting system prompts, agent instructions, or structured JSON extraction contracts:',
    '',
    '1. Select the lightest framework that removes task ambiguity:',
    '   - **RTF (Role, Task, Format):** Fast operational task with one clear deliverable.',
    '   - **CO-STAR:** Communication, product copy, and stakeholder writing.',
    '   - **GCC (Goal, Constraints, Context):** Multi-step engineering and analytical reasoning.',
    '   - **Few-Shot (2 to 5 examples):** Format-sensitive classification or extraction.',
    '   - **RFC 8259 JSON Contract:** Machine-parseable payloads for application code.',
    '2. Assemble prompt sections in fixed order: Identity and Scope -> Input Context (`<context>...</context>` or `{{variable}}`) -> Hard Constraints (`MUST` / `MUST NOT`) -> Few-Shot Calibration -> Output Contract.',
    '3. Never mix untrusted user input and system instructions in the same delimiter block.',
    '4. When structured JSON output is required, forbid markdown code fences, commentary, and trailing commas, and define missing-field behavior (`null` plus `"missing_fields"` array).',
    '5. Validate generated JSON prompt files locally before shipping:',
    '',
    '```bash',
    'node scripts/validate-json-prompt.mjs path/to/prompt.json --strict-schema',
    '```',
    '',
    'Reference cheatsheet: `references/frameworks-cheatsheet.md`.',
    `Interactive 400-framework studio: ${PROMPTMATRIX_URL}`,
    '',
  ].join('\n');
  writeCleanFile(path.join(LEAD_MAGNET_DIR, '.cursor', 'rules', 'prompt-matrix-architect.mdc'), cursorMdc);

  const claudeMd = [
    '# CLAUDE.md: PromptMatrix Prompt Architect',
    '',
    'This repository provides the free **PromptMatrix Prompt Architect** Open Agent Skill (`SKILL.md`) for deterministic LLM prompt structuring and RFC 8259 JSON contract validation.',
    '',
    '## Core Workflow',
    '',
    '1. Read `SKILL.md` for framework selection rules (**RTF**, **CO-STAR**, **GCC**, **Few-Shot**, **RFC 8259 JSON Contract**).',
    '2. Consult `references/frameworks-cheatsheet.md` for copy-ready prompt templates and JSON contract skeletons.',
    '3. Validate JSON prompt payloads and exports with the bundled zero-dependency Node.js validator:',
    '',
    '```bash',
    'node scripts/validate-json-prompt.mjs path/to/prompt.json --strict-schema --no-placeholders',
    '```',
    '',
    '## Guardrails',
    '',
    '- Keep untrusted user input wrapped in explicit XML tags (`<context>...</context>`) or named placeholders separate from system rules.',
    '- Specify abstention rules (`null` + `"missing_fields"`) instead of letting models fabricate missing values.',
    '- Strip hidden zero-width Unicode characters (`U+200B`, `U+FEFF`, directional overrides) before parsing JSON outputs.',
    '',
    '## Companion Resources',
    '',
    `- **Web Workspace (400+ Frameworks, 100% Client-Side):** ${PROMPTMATRIX_URL}`,
    `- **9 Paid Flagship Skill Packs (Security, Postgres, Next.js, MCP, Playwright, Multimodal, SEO/GEO):** ${affiliateUrl}`,
    '',
  ].join('\n');
  writeCleanFile(path.join(LEAD_MAGNET_DIR, 'CLAUDE.md'), claudeMd);

  const upgradeRows = flagshipPacks
    .slice()
    .sort((a, b) => a.priceUsd - b.priceUsd)
    .map(
      (pack) =>
        `| **${pack.title}** | \`${pack.slug}\` | ${pack.priceLabel} | ${cleanTextForDistribution(pack.summaryEn)} | [Get on Agensi.io](${affiliateUrl}) |`
    );

  const readmeMd = [
    '# PromptMatrix Prompt Architect (Free Open Agent Skill)',
    '',
    'Deterministic prompt engineering skill for **Claude Code**, **Cursor**, **GitHub Copilot**, **Gemini CLI**, **Windsurf**, **OpenAI Codex**, and **Antigravity**. Structures ambiguous tasks into **RTF**, **CO-STAR**, **GCC**, **Few-Shot**, and **RFC 8259 JSON Contracts**, backed by an offline Node.js JSON payload validator.',
    '',
    'Built from [PromptMatrix 2.0](https://prompt.sigitadi.id) (400 structured frameworks, 100% local browser execution).',
    '',
    '## Quick Install',
    '',
    '### Open Agent Skills CLI (`skills.sh`)',
    '',
    '```bash',
    'npx skills add <github-user>/prompt-matrix-skill',
    '```',
    '',
    '### Cursor (`.cursor/rules`)',
    '',
    'Copy `.cursor/rules/prompt-matrix-architect.mdc` into your project `.cursor/rules/` directory.',
    '',
    '### Claude Code (`CLAUDE.md` + `SKILL.md`)',
    '',
    'Clone or copy `SKILL.md`, `CLAUDE.md`, `references/`, and `scripts/` into `.claude/skills/prompt-matrix-prompt-architect/` or your repository root.',
    '',
    '## Included Files',
    '',
    '- `SKILL.md`: Core prompt architecture workflow and verification checklist.',
    '- `references/frameworks-cheatsheet.md`: Ready-to-use RTF, CO-STAR, GCC, Few-Shot, and RFC 8259 JSON Contract patterns.',
    '- `scripts/validate-json-prompt.mjs`: Zero-dependency Node.js validator (`--strict-schema`, `--no-placeholders`) for JSON syntax, hidden zero-width Unicode detection, and schema completeness.',
    '- `.cursor/rules/prompt-matrix-architect.mdc`: Cursor MDC rule file.',
    '- `CLAUDE.md`: Claude Code instructions.',
    '',
    '## Validate a Prompt Payload Locally',
    '',
    '```bash',
    'node scripts/validate-json-prompt.mjs path/to/prompt.json --strict-schema --no-placeholders',
    '```',
    '',
    '## Upgrade to the 9 Flagship Engineering & Multimodal Skills',
    '',
    `Looking for production validators for Next.js, MCP servers, PostgreSQL zero-downtime migrations, OWASP API security, Playwright E2E, SEO/GEO, or Veo 3 / Midjourney v7? Explore all 9 Flagship Skill Packs on [Agensi.io](${affiliateUrl}):`,
    '',
    '| Flagship Skill Pack | Slug | Price | Focus | Link |',
    '| :--- | :--- | :--- | :--- | :--- |',
    ...upgradeRows,
    '',
    '---',
    '',
    `- **Live App (Free, 100% Local Privacy):** ${PROMPTMATRIX_URL}`,
    `- **Creator Store & Flagship Packs:** ${affiliateUrl}`,
    '- **License:** MIT',
    '',
  ].join('\n');
  writeCleanFile(path.join(LEAD_MAGNET_DIR, 'README.md'), readmeMd);

  const checklistMd = [
    '# Public OSS & Directory Submission Checklist',
    '',
    'Publish `dist-lead-magnet/` as a dedicated public GitHub repository (for example: `https://github.com/<github-user>/prompt-matrix-skill`).',
    'Never push any of the 9 paid flagship folders into this public repository.',
    '',
    '## Pre-Publish Verification',
    '',
    '1. Confirm `SKILL.md`, `README.md`, `CLAUDE.md`, `.cursor/rules/prompt-matrix-architect.mdc`, `references/frameworks-cheatsheet.md`, and `scripts/validate-json-prompt.mjs` are at the repo root.',
    '2. Run `node scripts/validate-json-prompt.mjs --help` (or test against a sample JSON prompt) to verify zero errors.',
    '3. Verify all links point to `https://prompt.sigitadi.id` and `https://www.agensi.io/r/SIGITADI`.',
    '',
    '## Directory Submission Steps',
    '',
    '### 1. `skills.sh` (Open Agent Skills Registry)',
    '- Push the repository publicly to GitHub with `SKILL.md` at the root.',
    '- Test installation locally: `npx skills add <github-user>/prompt-matrix-skill`.',
    '- Trigger indexing by running `npx skills add <github-user>/prompt-matrix-skill` or submitting the GitHub URL on `https://skills.sh`.',
    '',
    '### 2. `skillsmp.com` (Skills Marketplace Crawler)',
    '- **Critical Requirement:** `skillsmp.com` requires the public GitHub repository to have **`>= 2` GitHub stars** and a valid `SKILL.md` YAML frontmatter (`name`, `description`, `license`, `metadata`) before indexing.',
    '- After obtaining at least 2 GitHub stars, submit `https://github.com/<github-user>/prompt-matrix-skill` via the `skillsmp.com` repository submission form.',
    '',
    '### 3. `clawhub.ai`',
    '- Sign in to `https://clawhub.ai` with GitHub.',
    '- Publish the skill using the root `SKILL.md` slug `prompt-matrix-prompt-architect`, linking back to the public GitHub repo and `https://prompt.sigitadi.id`.',
    '',
    '### 4. `lobehub.com` (LobeHub Agent / Skill Directory)',
    '- Open `https://lobehub.com` and submit the skill repository URL or JSON manifest with category `Prompt Engineering / Developer Tools`.',
    '- Include `https://prompt.sigitadi.id` as homepage and `https://www.agensi.io/r/SIGITADI` for flagship upgrades.',
    '',
    '### 5. `claudemarketplaces.com`',
    '- Verify `CLAUDE.md` and `SKILL.md` sit at the repository root.',
    '- Submit `https://github.com/<github-user>/prompt-matrix-skill` on `https://claudemarketplaces.com` under Claude Code Skills / Rules.',
    '',
    '### 6. `cursor.directory`',
    '- Open `https://cursor.directory` -> Submit Rule.',
    '- Paste the content of `.cursor/rules/prompt-matrix-architect.mdc` (preserving `description`, `globs`, and `alwaysApply: false`), tag with `Prompt Engineering`, `JSON`, `TypeScript`, and link `https://prompt.sigitadi.id`.',
    '',
    '### 7. `futuretools.io`',
    '- Submit **PromptMatrix 2.0** (`https://prompt.sigitadi.id`) at `https://www.futuretools.io/submit-a-tool` under **Prompt Guides / Generative AI Productivity**.',
    '- Emphasize 400 structured frameworks, 100% local client-side privacy, and free `SKILL.md` export.',
    '',
    '### 8. `Product Hunt`',
    '- Prepare launch assets for **PromptMatrix 2.0 + Free Prompt Architect Skill**:',
    '  - Tagline: `400 structured AI prompt frameworks and Open Agent Skills, 100% local.`',
    '  - Links: `https://prompt.sigitadi.id` (primary), GitHub `prompt-matrix-skill` (free OSS skill), and `https://www.agensi.io/r/SIGITADI` (9 Flagship packs).',
    '  - Schedule launch at 00:01 PST (14:01 WIB / 15:01 WIB depending on DST) and share in maker comment.',
    '',
  ].join('\n');
  writeCleanFile(path.join(LEAD_MAGNET_DIR, 'SUBMISSION-CHECKLIST.md'), checklistMd);

  // Explicit leak guard: verify zero paid flagship slugs exist anywhere inside dist-lead-magnet/
  const paidSlugs = new Set(flagshipPacks.map((p) => p.slug));
  const writtenLeadFiles = collectFilesRecursive(LEAD_MAGNET_DIR);
  for (const file of writtenLeadFiles) {
    for (const paidSlug of paidSlugs) {
      if (file.relPosix.includes(paidSlug)) {
        throw new Error(`IP LEAK GUARD FAILED: Paid flagship slug "${paidSlug}" found in dist-lead-magnet/${file.relPosix}`);
      }
    }
  }

  return {
    outDir: LEAD_MAGNET_DIR,
    filesCount: writtenLeadFiles.length,
    textFiles: writtenLeadFiles
      .filter((f) => AUDIT_TEXT_EXTS.has(path.extname(f.relPosix).toLowerCase()))
      .map((f) => f.absPath),
  };
}

/**
 * Pillar 2: Builds dist-channels/storefronts/ with 9-flagship bundle ZIP + Global MoR storefront copy.
 */
function buildStorefrontPillar(agensiConfig) {
  fs.rmSync(STOREFRONTS_DIR, { recursive: true, force: true });
  fs.mkdirSync(STOREFRONTS_DIR, { recursive: true });

  const allPacks = agensiConfig.bundledSkillPacks || [];
  const flagshipPacks = allPacks.filter((p) => p.tier === 'flagship');
  if (flagshipPacks.length !== 9) {
    throw new Error(`Expected 9 flagship packs in config/agensiConfig.ts, found ${flagshipPacks.length}`);
  }

  const individualTotalUsd = flagshipPacks.reduce((sum, p) => sum + Number(p.priceUsd || 0), 0);
  const savingsUsd = Math.max(0, individualTotalUsd - SUITE_BUNDLE_PRICE_USD);
  const discountPct = individualTotalUsd > 0 ? Math.round((savingsUsd / individualTotalUsd) * 100) : 0;

  const suiteReadme = [
    '# PromptMatrix 2.0: 9 Flagship Open Agent Skills Suite',
    '',
    'Complete offline bundle of all 9 Flagship PromptMatrix Open Agent Skills (`SKILL.md`, `references/`, `templates/`, and deterministic Node.js `scripts/*.mjs` validators).',
    '',
    '## Compatible Runtimes (27+ Open Agent Skills Environments)',
    '',
    'Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, Cline, Roo Code, Goose, Zed, Aider, OpenCode, Devin, and any runtime supporting the Open Agent Skills `SKILL.md` standard.',
    '',
    '## Included Flagship Skill Folders',
    '',
    ...flagshipPacks.map(
      (p, idx) =>
        `${idx + 1}. \`${p.slug}/\` (${p.priceLabel} standalone) - ${cleanTextForDistribution(p.summaryEn)}`
    ),
    '',
    '## Quick Installation',
    '',
    '1. Unzip `promptmatrix-9-flagship-suite.zip`.',
    '2. Copy any `<slug>/` folder into your agent skills directory:',
    '   - **Project-scoped (Claude Code / Cursor / Antigravity):** `.claude/skills/<slug>/` or `.agents/skills/<slug>/`',
    '   - **Global user-scoped:** `~/.claude/skills/<slug>/`',
    '3. Run any bundled Node.js 18+ validator directly without external dependencies:',
    '',
    '```bash',
    ...flagshipPacks.map((p) => `node ${p.slug}/${p.includedFiles.find((f) => f.startsWith('scripts/')) || 'scripts/validate.mjs'} --help`),
    '```',
    '',
    '## Links & Support',
    '',
    `- **PromptMatrix 2.0 Web Studio (400 Frameworks):** ${PROMPTMATRIX_URL}`,
    `- **Agensi.io Official Storefront:** ${agensiConfig.affiliateUrl || 'https://www.agensi.io/r/SIGITADI'}`,
    '- **License:** Commercial single-seat / team workspace license included with purchase.',
    '',
  ].join('\n');

  const zipEntries = [
    {
      name: 'SUITE-README.md',
      data: Buffer.from(suiteReadme, 'utf8'),
      mtime: new Date('2026-11-18T00:00:00Z'),
    },
  ];

  for (const pack of flagshipPacks) {
    if (pack.slug === LEAD_MAGNET_SLUG) {
      throw new Error(`Lead-magnet pack "${LEAD_MAGNET_SLUG}" must not be included in paid storefront bundle`);
    }
    const skillDir = path.join(SKILLS_ROOT, pack.slug);
    if (!fs.existsSync(skillDir)) {
      throw new Error(`Missing flagship skill directory: agensi-skills/${pack.slug}`);
    }
    const files = collectFilesRecursive(skillDir);
    if (files.length === 0) {
      throw new Error(`No files found in agensi-skills/${pack.slug}`);
    }
    for (const file of files) {
      const stat = fs.statSync(file.absPath);
      zipEntries.push({
        name: `${pack.slug}/${file.relPosix}`,
        data: fs.readFileSync(file.absPath),
        mtime: stat.mtime,
      });
    }
  }

  const zipBuffer = buildPosixZip(zipEntries);
  if (zipBuffer.length >= MAX_ZIP_BYTES) {
    throw new Error(`Suite ZIP exceeds 50 MB limit (${zipBuffer.length} bytes)`);
  }

  const suiteZipPath = path.join(STOREFRONTS_DIR, 'promptmatrix-9-flagship-suite.zip');
  fs.writeFileSync(suiteZipPath, zipBuffer);

  // Read back Central Directory from disk to verify POSIX paths and SUITE-README.md at root
  const writtenZip = fs.readFileSync(suiteZipPath);
  const cdFilenames = readZipCentralDirectoryFilenames(writtenZip);
  if (!cdFilenames.includes('SUITE-README.md')) {
    throw new Error('Suite ZIP Central Directory missing root SUITE-README.md');
  }
  if (cdFilenames.some((n) => n.includes('\\') || n.startsWith('/'))) {
    throw new Error('Suite ZIP Central Directory contains non-POSIX paths');
  }
  for (const pack of flagshipPacks) {
    if (!cdFilenames.includes(`${pack.slug}/SKILL.md`)) {
      throw new Error(`Suite ZIP missing ${pack.slug}/SKILL.md in Central Directory`);
    }
  }
  if (cdFilenames.some((n) => n.startsWith(`${LEAD_MAGNET_SLUG}/`))) {
    throw new Error(`Suite ZIP unexpectedly contains lead magnet ${LEAD_MAGNET_SLUG}`);
  }

  const affiliateUrl = agensiConfig.affiliateUrl || 'https://www.agensi.io/r/SIGITADI';

  const manifestLines = [
    '# Global MoR Storefronts Manifest (PromptMatrix 2.0 Flagship Suite)',
    '',
    'Ready-to-paste product listings for **Lemon Squeezy**, **Creem.io**, **Gumroad**, **Whop**, and **Payhip**, paired with verified Indonesia payout architecture.',
    '',
    '## 1. Suite Bundle Archive Verification',
    '',
    `- **Archive:** \`dist-channels/storefronts/promptmatrix-9-flagship-suite.zip\` (${formatBytes(writtenZip.length)}, ${cdFilenames.length} POSIX entries)`,
    '- **Root README:** `SUITE-README.md` verified at ZIP root',
    `- **Included Packs:** 9 paid Flagship folders (\`${flagshipPacks.map((p) => p.slug).join('`, `')}\`)`,
    `- **Bundle Price:** \`$${SUITE_BUNDLE_PRICE_USD.toFixed(2)}\` USD (vs \`$${individualTotalUsd.toFixed(2)}\` individual total computed from \`config/agensiConfig.ts\`, saving \`$${savingsUsd.toFixed(2)}\` / \`${discountPct}%\` off)`,
    '',
    '---',
    '',
    '## 2. Indonesia Payout & Merchant-of-Record (MoR) Notes',
    '',
    '> **Critical Wise Indonesia Warning:** Do NOT rely on a Wise USD receiving account balance for Indonesia-registered profiles. Wise restricts USD local receiving account balances for Indonesia personal/business accounts. Use **Direct IDR Bank Payouts** (Lemon Squeezy, Gumroad), **Polygon USDC** (Creem.io), **Zoneless Solana USDC** (Agensi.io, PromptBase), or **Local IDR Gateways** (Payhip + Midtrans/Xendit).',
    '',
    '| Platform | Tax / MoR Role | Best Indonesia Payout Route | Typical Fee / Notes |',
    '| :--- | :--- | :--- | :--- |',
    '| **Lemon Squeezy** | Full Merchant of Record (handles global VAT/GST) | **Direct IDR Bank Transfer** (BCA/Mandiri/BRI/Jago) | ~1% currency conversion to IDR; zero foreign VAT filing |',
    '| **Creem.io** | Full Merchant of Record (handles global VAT/GST) | **USDC on Polygon** to self-custody wallet -> Pintu/Indodax | ~2% payout fee; fast crypto settlement |',
    '| **Gumroad** | Merchant of Record + Gumroad Discover | **Direct IDR Bank Transfer** | Built-in organic marketplace discovery; IDR bank wire |',
    '| **Whop** | Digital marketplace & access portal | **Stripe/Bank or Crypto payouts** (verify current ID bank support) | Good for bundle buyers & community gated updates |',
    '| **Payhip** | Direct checkout (or Payhip MoR EU/UK VAT) | **Midtrans / Xendit (IDR local)** + PayPal | Ideal for Indonesian domestic buyers paying via QRIS/VA |',
    '',
    '---',
    '',
    '## 3. Ready-to-Paste Suite Bundle Copy ($59.00)',
    '',
    '- **Product Title:** `PromptMatrix 2.0: 9 Flagship AI Agent Skills Suite (Claude Code, Cursor, Copilot)`',
    `- **Price:** \`$${SUITE_BUNDLE_PRICE_USD.toFixed(2)}\` USD (Compare at \`$${individualTotalUsd.toFixed(2)}\`, save \`$${savingsUsd.toFixed(2)}\` / \`${discountPct}%\`)`,
    '- **Upload File:** `dist-channels/storefronts/promptmatrix-9-flagship-suite.zip`',
    '- **Tags:** `claude-code`, `cursor-rules`, `agent-skills`, `skill-md`, `prompt-engineering`, `mcp-server`, `postgresql`, `playwright`, `owasp-security`',
    '- **Short Tagline:** `9 production SKILL.md engineering, security, SEO/GEO, and multimodal packs with zero-dependency Node.js validators.`',
    '',
    '### Product Description (Markdown)',
    '',
    '```markdown',
    `Ship faster with all **9 Flagship Open Agent Skills** from PromptMatrix 2.0 in one complete bundle ($${SUITE_BUNDLE_PRICE_USD.toFixed(2)} vs $${individualTotalUsd.toFixed(2)} individual value, saving $${savingsUsd.toFixed(2)}).`,
    '',
    'Every package follows the portable `SKILL.md` standard compatible with **Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity**, and 20+ agent runtimes. Each skill includes deep reference playbooks, production templates, and zero-dependency Node.js 18+ CLI validators.',
    '',
    '### What Is Inside (`promptmatrix-9-flagship-suite.zip`)',
    '',
    ...flagshipPacks.map(
      (p, idx) =>
        `${idx + 1}. **${p.title}** (${p.priceLabel} standalone): ${cleanTextForDistribution(p.summaryEn)}`
    ),
    '',
    '### Zero-Risk Local Execution',
    '- Runs 100% offline with Node.js 18+ (`node <slug>/scripts/*.mjs`).',
    '- Zero external network calls or telemetry.',
    `- Try the free 400-framework web studio at ${PROMPTMATRIX_URL} or browse individual packs on Agensi.io: ${affiliateUrl}`,
    '```',
    '',
    '---',
    '',
    '## 4. Individual Flagship Pack Listings (9 Standalone Products)',
    '',
    'Upload individual `.zip` files from `dist-agensi/<slug>.zip` (generated by `npm run package:skills`) when listing packs separately on Lemon Squeezy, Creem.io, Gumroad, Whop, or Payhip:',
    '',
    ...flagshipPacks.flatMap((p, idx) => [
      `### ${idx + 1}. ${p.title} (${p.priceLabel})`,
      `- **Archive:** \`dist-agensi/${p.slug}.zip\``,
      `- **Title:** ${p.title}`,
      `- **Price:** ${p.priceLabel}`,
      `- **Summary:** ${cleanTextForDistribution(p.summaryEn)}`,
      `- **Included Files:** ${p.includedFiles.map((f) => `\`${f}\``).join(', ')}`,
      '',
    ]),
  ];

  const manifestPath = path.join(STOREFRONTS_DIR, 'STOREFRONT-MANIFEST.md');
  writeCleanFile(manifestPath, `${manifestLines.join('\n')}\n`);

  return {
    outDir: STOREFRONTS_DIR,
    zipPath: suiteZipPath,
    zipBytes: writtenZip.length,
    zipEntriesCount: cdFilenames.length,
    individualTotalUsd,
    savingsUsd,
    textFiles: [manifestPath],
  };
}

/**
 * Normalizes a component label into a clean PromptBase [Variable] token.
 */
function buildVariableToken(label, fallbackName, usedTokens) {
  let cleaned = cleanTextForDistribution(label || fallbackName)
    .replace(/\[|\]/g, '')
    .replace(/[()]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9\s/_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    cleaned = fallbackName || 'Input Value';
  }
  if (cleaned.length > 42) {
    cleaned = cleaned.slice(0, 42).trim();
  }

  let candidate = `[${cleaned}]`;
  let counter = 2;
  while (usedTokens.has(candidate)) {
    candidate = `[${cleaned} ${counter}]`;
    counter++;
  }
  usedTokens.add(candidate);
  return candidate;
}

function formatSampleValue(rawSample, comp) {
  if (Array.isArray(rawSample)) {
    return cleanTextForDistribution(rawSample.join(', '));
  }
  if (typeof rawSample === 'boolean') {
    return rawSample
      ? `Yes, include full ${cleanTextForDistribution(comp.label || comp.name)} details`
      : 'No';
  }
  const str = cleanTextForDistribution(String(rawSample ?? ''));
  if (!str) {
    throw new Error(`Empty sample value generated for component "${comp.name}"`);
  }
  return str;
}

/**
 * Pillar 3: Compiles the 15 exact frameworks into PromptBase listings (Markdown + JSON).
 */
function buildPromptBasePillar({ PROMPT_FRAMEWORKS, locMod, sampleMod, agensiConfig }) {
  fs.rmSync(PROMPTBASE_DIR, { recursive: true, force: true });
  fs.mkdirSync(PROMPTBASE_DIR, { recursive: true });

  // Build flat lookup map from PROMPT_FRAMEWORKS
  const flatMap = new Map();
  for (const [category, subcategories] of Object.entries(PROMPT_FRAMEWORKS)) {
    for (const [subcategory, frameworks] of Object.entries(subcategories)) {
      for (const [fwName, fwObj] of Object.entries(frameworks)) {
        flatMap.set(fwName, { category, subcategory, framework: fwObj });
      }
    }
  }

  const compiledListings = [];

  for (let i = 0; i < PROMPTBASE_TARGET_SPECS.length; i++) {
    const spec = PROMPTBASE_TARGET_SPECS[i];
    const hit = flatMap.get(spec.frameworkKey);
    if (!hit) {
      throw new Error(`Missing required PromptBase framework in data/frameworks.ts: "${spec.frameworkKey}"`);
    }
    if (spec.title.length > 40) {
      throw new Error(`PromptBase title exceeds 40-char limit (${spec.title.length} chars): "${spec.title}"`);
    }
    if (spec.suggestedPriceUsd < 4.99 || spec.suggestedPriceUsd > 9.99) {
      throw new Error(`PromptBase price out of $4.99-$9.99 range for "${spec.title}": ${spec.suggestedPriceUsd}`);
    }

    const localized = locMod.getLocalizedFramework(spec.frameworkKey, hit.framework, 'en');
    const components = localized.components || [];
    if (components.length === 0) {
      throw new Error(`Framework "${spec.frameworkKey}" resolved 0 components`);
    }

    const usedTokens = new Set();
    const variables = [];
    for (const comp of components) {
      const token = buildVariableToken(comp.label, comp.name, usedTokens);
      const rawSample = sampleMod.getRealisticSampleForComponent(comp, localized.name, 'en');
      const sampleValue = formatSampleValue(rawSample, comp);
      variables.push({
        name: comp.name,
        label: cleanTextForDistribution(comp.label || comp.name),
        type: comp.type,
        token,
        sampleValue,
      });
    }

    const cleanPersona = cleanTextForDistribution(
      (localized.aiLogic || hit.framework.ai_logic_description || '').replace(/^AI Persona:\s*/i, '')
    );
    const cleanDesc = cleanTextForDistribution(localized.description || hit.framework.description);

    const templateLines = [
      `Role & Objective: ${cleanPersona}`,
      '',
      'Input Specification:',
      ...variables.map((v) => `- ${v.label}: ${v.token}`),
      '',
      'Execution Rules:',
      '1. Ground every recommendation strictly in the provided inputs above. Never invent missing specifications; list any missing assumptions explicitly.',
      '2. Deliver concrete, copy-ready artifacts (configs, schemas, code, shots, or structured copy) instead of high-level summaries.',
      '3. Respect target platform constraints and verify internal consistency before final output.',
    ];
    const promptTemplate = templateLines.join('\n');

    let testingExamplePrompt = promptTemplate;
    for (const v of variables) {
      testingExamplePrompt = testingExamplePrompt.split(v.token).join(v.sampleValue);
    }

    // Verify zero unpopulated [Variable] tokens remain in testingExamplePrompt
    for (const v of variables) {
      if (testingExamplePrompt.includes(v.token)) {
        throw new Error(`Unpopulated variable token "${v.token}" remained in testing example for "${spec.title}"`);
      }
    }

    const marketplaceDescription = [
      `${cleanDesc}`,
      '',
      `Built from PromptMatrix 2.0 (${spec.frameworkKey}), this structured system turns ${variables.length} guided input variable(s) into deterministic, production-ready outputs with zero guesswork.`,
      '',
      'What you get:',
      '- Structured system prompt with explicit role, execution rules, and verification steps',
      `- ${variables.length} clearly labeled [Variable] inputs (${variables.map((v) => v.token).join(', ')})`,
      '- Full populated testing example so you can verify output quality immediately',
    ].join('\n');

    const usageInstructions = [
      `1. Open ${spec.targetEngine} (${spec.engineSettings}).`,
      `2. Paste the Prompt Template and replace each bracketed variable (${variables.map((v) => v.token).join(', ')}) with your project details.`,
      '3. Run the prompt once to generate the complete deliverable, then iterate on individual sections if needed.',
      `4. Tip: Test variations interactively in PromptMatrix 2.0 (${PROMPTMATRIX_URL}) or upgrade to full Agent Skills on Agensi.io (${agensiConfig.affiliateUrl || 'https://www.agensi.io/r/SIGITADI'}).`,
    ].join('\n');

    compiledListings.push({
      index: i + 1,
      frameworkKey: spec.frameworkKey,
      category: hit.category,
      subcategory: hit.subcategory,
      toolType: hit.framework.toolType,
      title: spec.title,
      titleLength: spec.title.length,
      targetEngine: spec.targetEngine,
      engineSettings: spec.engineSettings,
      suggestedPriceUsd: spec.suggestedPriceUsd,
      suggestedPriceLabel: `$${spec.suggestedPriceUsd.toFixed(2)}`,
      marketplaceDescription,
      variables,
      promptTemplate,
      testingExamplePrompt,
      usageInstructions,
    });
  }

  const jsonPayload = {
    generatedAt: '2026-11-18',
    source: 'PromptMatrix 2.0 (data/frameworks.ts + localizationService.ts + sampleDataService.ts)',
    payoutSop: {
      provider: 'Zoneless USDC on Solana',
      minimumThresholdUsd: 0,
      payoutFrequency: 'Daily',
      walletRecommendation: 'Self-custody Phantom or Solflare Solana wallet -> off-ramp via Pintu (SPL-USDC) or Jupiter USDC->SOL -> Pintu/Tokocrypto/Indodax -> IDR bank',
      referralRule: 'Append ?via=<your-promptbase-handle> on shared PromptBase links to capture 0% marketplace fee (100% creator share vs standard 80%).',
    },
    listingsCount: compiledListings.length,
    listings: compiledListings,
  };

  const jsonPath = path.join(PROMPTBASE_DIR, 'promptbase-15-listings.json');
  writeCleanFile(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`);

  const mdLines = [
    '# PromptBase 15 Structured Prompt Systems (PromptMatrix 2.0)',
    '',
    'Compiled automatically from `data/frameworks.ts`, `services/localizationService.ts`, and `services/sampleDataService.ts` with verified `<= 40` char titles and populated testing examples.',
    '',
    '## 1. Indonesia Payout & 0% Fee Referral SOP (PromptBase)',
    '',
    '- **Payout Rail:** **Zoneless USDC on Solana**',
    '- **Minimum Payout:** **`$0` USD** (no minimum threshold)',
    '- **Payout Frequency:** **Daily** directly to your Solana wallet',
    '- **Safe Cashout Flow:** Receive SPL-USDC into **Phantom** or **Solflare** (never paste a CEX deposit address directly), then deposit SPL-USDC to **Pintu** or swap `USDC -> SOL` via **Jupiter (`jup.ag`)** and send SOL to **Pintu / Tokocrypto / Indodax** for IDR bank withdrawal.',
    '- **`?via=` 0% Fee Referral Link:** Share every PromptBase listing URL with `?via=<your-handle>` from your PromptMatrix site, blog, or social posts. PromptBase waives its 20% marketplace commission on self-referred sales (**0% fee, 100% payout to you**).',
    '',
    '---',
    '',
    '## 2. Portfolio Overview (15 Verified Listings)',
    '',
    '| # | PromptBase Title (`<= 40` chars) | Len | Target Engine | Price | Variables |',
    '| :--- | :--- | :--- | :--- | :--- | :--- |',
    ...compiledListings.map(
      (item) =>
        `| ${item.index} | **${item.title}** | ${item.titleLength} | ${item.targetEngine} | ${item.suggestedPriceLabel} | ${item.variables.length} |`
    ),
    '',
    '---',
    '',
    '## 3. Ready-to-Upload PromptBase Listings (1 to 15)',
    '',
    ...compiledListings.flatMap((item) => [
      `### ${item.index}. ${item.title}`,
      '',
      `- **Source Framework:** \`${item.frameworkKey}\``,
      `- **Title (${item.titleLength}/40 chars):** \`${item.title}\``,
      `- **Target Engine:** ${item.targetEngine} (${item.engineSettings})`,
      `- **Suggested Price:** ${item.suggestedPriceLabel}`,
      '',
      '**Marketplace Description:**',
      '```markdown',
      item.marketplaceDescription,
      '```',
      '',
      '**Prompt Template (`[Variable]` format):**',
      '```text',
      item.promptTemplate,
      '```',
      '',
      '**Testing Example Inputs:**',
      ...item.variables.map((v) => `- \`${v.token}\`: ${v.sampleValue}`),
      '',
      '**Populated Testing Example Output Input:**',
      '```text',
      item.testingExamplePrompt,
      '```',
      '',
      '**Usage Instructions:**',
      '```text',
      item.usageInstructions,
      '```',
      '',
    ]),
  ];

  const mdPath = path.join(PROMPTBASE_DIR, 'PROMPTBASE-15-LISTINGS.md');
  writeCleanFile(mdPath, `${mdLines.join('\n')}\n`);

  return {
    outDir: PROMPTBASE_DIR,
    listingsCount: compiledListings.length,
    textFiles: [jsonPath, mdPath],
  };
}

/**
 * Verifies every generated text file contains 0 em-dashes and 0 banned buzzwords.
 */
function assertCleanGeneratedOutputs(filePaths) {
  const violations = [];
  for (const absPath of filePaths) {
    const raw = fs.readFileSync(absPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    const rel = normalizePosixPath(path.relative(ROOT, absPath));
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(EMDASH)) {
        violations.push(`${rel}:${i + 1} contains em-dash (U+2014)`);
      }
      for (const bw of BANNED_BUZZWORDS) {
        bw.regex.lastIndex = 0;
        if (bw.regex.test(line)) {
          violations.push(`${rel}:${i + 1} contains banned buzzword "${bw.label}"`);
        }
      }
    }
  }
  if (violations.length > 0) {
    throw new Error(`Generated output quality check failed:\n  - ${violations.join('\n  - ')}`);
  }
}

async function main() {
  console.log('=== PromptMatrix 2.0 Multi-Channel Distribution Packager ===\n');

  const [agensiMod, frameworksMod, locMod, sampleMod] = await Promise.all([
    loadTsModule('config/agensiConfig.ts'),
    loadTsModule('data/frameworks.ts'),
    loadTsModule('services/localizationService.ts'),
    loadTsModule('services/sampleDataService.ts'),
  ]);

  const agensiConfig = agensiMod.AGENSI_CONFIG;
  const PROMPT_FRAMEWORKS = frameworksMod.PROMPT_FRAMEWORKS;

  const p1 = buildLeadMagnetPillar(agensiConfig);
  console.log(`[Pillar 1] dist-lead-magnet/ ready (${p1.filesCount} files, zero paid IP leak verified)`);

  const p2 = buildStorefrontPillar(agensiConfig);
  console.log(
    `[Pillar 2] dist-channels/storefronts/ ready (${formatBytes(p2.zipBytes)}, ${p2.zipEntriesCount} ZIP entries, $${SUITE_BUNDLE_PRICE_USD.toFixed(2)} vs $${p2.individualTotalUsd.toFixed(2)} individual total)`
  );

  const p3 = buildPromptBasePillar({
    PROMPT_FRAMEWORKS,
    locMod,
    sampleMod,
    agensiConfig,
  });
  console.log(`[Pillar 3] dist-channels/promptbase/ ready (${p3.listingsCount} compiled PromptBase listings)`);

  const allTextFiles = [...p1.textFiles, ...p2.textFiles, ...p3.textFiles];
  assertCleanGeneratedOutputs(allTextFiles);
  console.log(`\nQuality check passed across ${allTextFiles.length} generated text files (0 em-dashes, 0 banned buzzwords).`);
}

main().catch((err) => {
  console.error('Multi-channel packaging FAILED:', err);
  process.exit(1);
});
