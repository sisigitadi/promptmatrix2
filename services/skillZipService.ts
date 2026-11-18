import { Language } from '../types';
import { AgentSkillSpec } from './agentSkillService';
import { sanitizeString } from './jsonPromptService';

export interface ZipFileEntry {
  readonly name: string;
  readonly content: string | Uint8Array;
  readonly modifiedAt?: Date;
}

export interface BuildFormulaSkillZipBundleInput {
  readonly skillSpec: AgentSkillSpec;
  readonly skillMarkdown: string;
  readonly formValues: Record<string, string | number | boolean | string[]>;
  readonly customOtherValues: Record<string, string>;
  readonly compiledPrompt: string;
}

export interface FormulaSkillZipBundleResult {
  readonly filename: string;
  readonly entries: ZipFileEntry[];
  readonly archiveBytes: Uint8Array;
  readonly fileList: string[];
}

export interface BuildAgensiListingCopyInput {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly priceUsd?: number;
  readonly includedFiles: readonly string[];
  readonly language: Language;
}

export interface AgensiListingCopyResult {
  readonly recommendedPriceUsd: number;
  readonly title: string;
  readonly tagline: string;
  readonly tags: string[];
  readonly fullMarkdown: string;
}

interface PreparedZipRecord {
  readonly nameBytes: Uint8Array;
  readonly dataBytes: Uint8Array;
  readonly crc32: number;
  readonly dosTime: number;
  readonly dosDate: number;
  readonly localHeaderOffset: number;
}

const textEncoder = new TextEncoder();

const cleanOutputText = (value: string): string => {
  return sanitizeString(value)
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-');
};

const createCrc32Table = (): Uint32Array => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let crc = i;
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 1) !== 0) {
        crc = 0xedb88320 ^ (crc >>> 1);
      } else {
        crc = crc >>> 1;
      }
    }
    table[i] = crc >>> 0;
  }
  return table;
};

const CRC32_TABLE = createCrc32Table();

const computeCrc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    const lookupIndex = (crc ^ bytes[i]) & 0xff;
    crc = CRC32_TABLE[lookupIndex] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const toDosDateTime = (date: Date): { dosTime: number; dosDate: number } => {
  const safeYear = Math.max(1980, date.getFullYear());
  const dosTime =
    ((date.getHours() & 0x1f) << 11) |
    ((date.getMinutes() & 0x3f) << 5) |
    ((date.getSeconds() >> 1) & 0x1f);
  const dosDate =
    (((safeYear - 1980) & 0x7f) << 9) |
    (((date.getMonth() + 1) & 0x0f) << 5) |
    (date.getDate() & 0x1f);
  return { dosTime, dosDate };
};

/**
 * Normalizes a ZIP entry path to POSIX forward slashes with no leading slash or dot segments.
 */
export const normalizeZipEntryName = (rawName: string): string => {
  const normalized = rawName
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/+/, '');
  const safeSegments = normalized
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
  return safeSegments.join('/');
};

/**
 * Builds a standard Store (method 0) ZIP archive with CRC-32 checksums, Local File Headers,
 * Central Directory, and End of Central Directory record using zero external dependencies.
 */
export const buildZipArchive = (entries: readonly ZipFileEntry[]): Uint8Array => {
  const uniqueEntries = new Map<string, ZipFileEntry>();
  for (const entry of entries) {
    const cleanName = normalizeZipEntryName(entry.name);
    if (!cleanName) {
      continue;
    }
    uniqueEntries.set(cleanName, {
      name: cleanName,
      content: entry.content,
      modifiedAt: entry.modifiedAt,
    });
  }

  const normalizedList = Array.from(uniqueEntries.values());
  const records: PreparedZipRecord[] = [];
  let localSectionSize = 0;
  let centralDirSize = 0;

  for (const entry of normalizedList) {
    const nameBytes = textEncoder.encode(entry.name);
    const dataBytes =
      typeof entry.content === 'string'
        ? textEncoder.encode(entry.content)
        : new Uint8Array(entry.content);
    const crc32 = computeCrc32(dataBytes);
    const { dosTime, dosDate } = toDosDateTime(entry.modifiedAt ?? new Date());

    records.push({
      nameBytes,
      dataBytes,
      crc32,
      dosTime,
      dosDate,
      localHeaderOffset: localSectionSize,
    });

    localSectionSize += 30 + nameBytes.length + dataBytes.length;
    centralDirSize += 46 + nameBytes.length;
  }

  const eocdSize = 22;
  const totalSize = localSectionSize + centralDirSize + eocdSize;
  const output = new Uint8Array(totalSize);
  const view = new DataView(output.buffer);

  let offset = 0;

  // 1. Write Local File Headers + File Payloads
  for (const rec of records) {
    view.setUint32(offset, 0x04034b50, true); // Local file header signature
    view.setUint16(offset + 4, 20, true); // Version needed to extract (2.0)
    view.setUint16(offset + 6, 0x0800, true); // UTF-8 filename flag (bit 11)
    view.setUint16(offset + 8, 0, true); // Compression method 0 (Store)
    view.setUint16(offset + 10, rec.dosTime, true);
    view.setUint16(offset + 12, rec.dosDate, true);
    view.setUint32(offset + 14, rec.crc32, true);
    view.setUint32(offset + 18, rec.dataBytes.length, true);
    view.setUint32(offset + 22, rec.dataBytes.length, true);
    view.setUint16(offset + 26, rec.nameBytes.length, true);
    view.setUint16(offset + 28, 0, true); // Extra field length
    offset += 30;

    output.set(rec.nameBytes, offset);
    offset += rec.nameBytes.length;

    output.set(rec.dataBytes, offset);
    offset += rec.dataBytes.length;
  }

  const centralDirOffset = offset;

  // 2. Write Central Directory File Headers
  for (const rec of records) {
    view.setUint32(offset, 0x02014b50, true); // Central directory signature
    view.setUint16(offset + 4, (3 << 8) | 20, true); // Version made by (UNIX, 2.0)
    view.setUint16(offset + 6, 20, true); // Version needed to extract (2.0)
    view.setUint16(offset + 8, 0x0800, true); // UTF-8 filename flag (bit 11)
    view.setUint16(offset + 10, 0, true); // Compression method 0 (Store)
    view.setUint16(offset + 12, rec.dosTime, true);
    view.setUint16(offset + 14, rec.dosDate, true);
    view.setUint32(offset + 16, rec.crc32, true);
    view.setUint32(offset + 20, rec.dataBytes.length, true);
    view.setUint32(offset + 24, rec.dataBytes.length, true);
    view.setUint16(offset + 28, rec.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true); // Extra field length
    view.setUint16(offset + 32, 0, true); // File comment length
    view.setUint16(offset + 34, 0, true); // Disk number start
    view.setUint16(offset + 36, 0, true); // Internal file attributes
    view.setUint32(offset + 38, 0x81a40000, true); // External file attributes (-rw-r--r--)
    view.setUint32(offset + 42, rec.localHeaderOffset, true);
    offset += 46;

    output.set(rec.nameBytes, offset);
    offset += rec.nameBytes.length;
  }

  // 3. Write End of Central Directory Record (EOCD)
  view.setUint32(offset, 0x06054b50, true); // EOCD signature
  view.setUint16(offset + 4, 0, true); // Number of this disk
  view.setUint16(offset + 6, 0, true); // Disk where central directory starts
  view.setUint16(offset + 8, records.length, true); // Entries on this disk
  view.setUint16(offset + 10, records.length, true); // Total entries
  view.setUint32(offset + 12, centralDirSize, true);
  view.setUint32(offset + 16, centralDirOffset, true);
  view.setUint16(offset + 20, 0, true); // ZIP comment length

  return output;
};

const resolveFormParameters = (
  formValues: Record<string, string | number | boolean | string[]>,
  customOtherValues: Record<string, string>
): Record<string, string | number | boolean | string[]> => {
  const resolved: Record<string, string | number | boolean | string[]> = {};

  for (const [key, rawValue] of Object.entries(formValues)) {
    if (key === '__few_shot_input' || key === '__few_shot_output') {
      continue;
    }

    if (Array.isArray(rawValue)) {
      const cleanedItems = rawValue.map((item) => cleanOutputText(String(item)).trim()).filter(Boolean);
      if (cleanedItems.length > 0) {
        resolved[key] = cleanedItems;
      }
      continue;
    }

    if (typeof rawValue === 'string') {
      const trimmed = rawValue.trim();
      if (!trimmed) {
        continue;
      }
      if (trimmed === 'Lainnya...' || trimmed === 'Other...') {
        const customValue = cleanOutputText(customOtherValues[key] || '').trim();
        resolved[key] = customValue || cleanOutputText(trimmed);
      } else {
        resolved[key] = cleanOutputText(trimmed);
      }
      continue;
    }

    resolved[key] = rawValue;
  }

  return resolved;
};

const buildFrameworkGuideMarkdown = (skillSpec: AgentSkillSpec): string => {
  const isIndonesian = skillSpec.metadata.language === 'id';
  const heading = isIndonesian ? 'Panduan Referensi Kerangka Kerja' : 'Framework Reference Guide';
  const overviewTitle = isIndonesian ? 'Metadata Skill' : 'Skill Metadata';
  const roleTitle = isIndonesian ? 'Peran & Kondisi Pemicu' : 'Role & Trigger Conditions';
  const paramsTitle = isIndonesian ? 'Skema Parameter Input' : 'Input Parameter Schema';
  const verifyTitle = isIndonesian ? 'Daftar Periksa Verifikasi' : 'Verification Checklist';
  const runnerTitle = isIndonesian ? 'Validasi Lokal (CLI)' : 'Local Validation (CLI)';

  const lines: string[] = [
    `# ${cleanOutputText(skillSpec.metadata.framework)}: ${heading}`,
    '',
    `## ${overviewTitle}`,
    `- **Skill Slug**: \`${skillSpec.name}\``,
    `- **Category**: ${cleanOutputText(skillSpec.metadata.category)}`,
    `- **Language**: ${skillSpec.metadata.language}`,
    `- **Author**: ${cleanOutputText(skillSpec.metadata.author)}`,
    `- **Version**: ${cleanOutputText(skillSpec.metadata.version)}`,
    `- **Compatibility**: ${cleanOutputText(skillSpec.compatibility)}`,
    '',
    `## ${roleTitle}`,
    cleanOutputText(skillSpec.sections.roleAndTrigger),
    '',
    `## ${paramsTitle}`,
    cleanOutputText(skillSpec.sections.inputParameters),
    '',
    `## ${verifyTitle}`,
    cleanOutputText(skillSpec.sections.verificationChecklist),
    '',
    `## ${runnerTitle}`,
    isIndonesian
      ? 'Jalankan validator lokal berikut menggunakan Node.js (>= 18) untuk memeriksa integritas `SKILL.md` dan `templates/sample-input.json`:'
      : 'Run the local validator below using Node.js (>= 18) to verify `SKILL.md` and `templates/sample-input.json` integrity:',
    '',
    '```bash',
    'node scripts/validate-output.mjs',
    'node scripts/validate-output.mjs templates/sample-input.json',
    '```',
  ];

  return `${lines.join('\n').trim()}\n`;
};

const buildValidatorScriptSource = (expectedSkillName: string): string => {
  const safeName = expectedSkillName.replace(/[^a-z0-9-]/g, '') || 'promptmatrix-skill';
  return [
    '#!/usr/bin/env node',
    '/**',
    ` * Local deterministic output validator for ${safeName}.`,
    ' * Zero external dependencies, zero network calls, zero dynamic code execution.',
    ' */',
    "import fs from 'node:fs';",
    "import path from 'node:path';",
    "import process from 'node:process';",
    '',
    "const EMDASH = '\\u2014';",
    'const ZERO_WIDTH_REGEX = /[\\u200B-\\u200D\\uFEFF]/;',
    'const PLACEHOLDER_REGEX = /\\{\\{[^{}]+\\}\\}/;',
    'const KEBAB_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;',
    '',
    'function printHelp() {',
    `  console.log('Usage: node scripts/validate-output.mjs [target-file]');`,
    `  console.log('Defaults to validating SKILL.md and templates/sample-input.json in the skill bundle.');`,
    '}',
    '',
    'function checkTextHygiene(content, label, errors) {',
    '  if (!content || content.trim().length === 0) {',
    '    errors.push(`${label}: file is empty`);',
    '    return;',
    '  }',
    '  if (ZERO_WIDTH_REGEX.test(content)) {',
    '    errors.push(`${label}: contains invisible zero-width Unicode characters`);',
    '  }',
    '  if (content.includes(EMDASH)) {',
    '    errors.push(`${label}: contains disallowed em-dash (U+2014)`);',
    '  }',
    '  if (PLACEHOLDER_REGEX.test(content)) {',
    '    errors.push(`${label}: contains unresolved {{placeholder}} tokens`);',
    '  }',
    '}',
    '',
    'function validateSkillMarkdown(filePath, errors) {',
    "  const raw = fs.readFileSync(filePath, 'utf8');",
    "  checkTextHygiene(raw, 'SKILL.md', errors);",
    '  const fmMatch = raw.match(/^---\\r?\\n([\\s\\S]*?)\\r?\\n---/);',
    '  if (!fmMatch) {',
    "    errors.push('SKILL.md: missing YAML frontmatter block');",
    '    return;',
    '  }',
    '  const yaml = fmMatch[1];',
    '  const nameMatch = yaml.match(/^name:\\s*(.+)$/m);',
    '  const descMatch = yaml.match(/^description:\\s*(.+)$/m);',
    "  const skillName = nameMatch ? nameMatch[1].trim().replace(/^[\"']|[\"']$/g, '') : '';",
    "  const skillDesc = descMatch ? descMatch[1].trim().replace(/^[\"']|[\"']$/g, '') : '';",
    '  if (!skillName || skillName.length > 64 || !KEBAB_REGEX.test(skillName)) {',
    "    errors.push('SKILL.md: invalid frontmatter name (must be kebab-case, <= 64 chars)');",
    '  }',
    '  if (!skillDesc || skillDesc.length > 1024) {',
    "    errors.push('SKILL.md: invalid frontmatter description (must be 1..1024 chars)');",
    '  }',
    '}',
    '',
    'function validateJsonFile(filePath, label, errors) {',
    "  const raw = fs.readFileSync(filePath, 'utf8');",
    '  checkTextHygiene(raw, label, errors);',
    '  try {',
    '    JSON.parse(raw);',
    '  } catch (err) {',
    '    const msg = err instanceof Error ? err.message : String(err);',
    '    errors.push(`${label}: invalid JSON (${msg})`);',
    '  }',
    '}',
    '',
    'function main() {',
    '  const args = process.argv.slice(2);',
    "  if (args.includes('--help') || args.includes('-h')) {",
    '    printHelp();',
    '    process.exit(0);',
    '  }',
    '',
    '  const errors = [];',
    '  const targetArg = args[0];',
    '  if (targetArg) {',
    '    const resolved = path.resolve(process.cwd(), targetArg);',
    '    if (!fs.existsSync(resolved)) {',
    '      console.error(`Target file not found: ${resolved}`);',
    '      process.exit(1);',
    '    }',
    "    if (resolved.endsWith('.json')) {",
    '      validateJsonFile(resolved, path.basename(resolved), errors);',
    "    } else if (path.basename(resolved) === 'SKILL.md') {",
    '      validateSkillMarkdown(resolved, errors);',
    '    } else {',
    "      const raw = fs.readFileSync(resolved, 'utf8');",
    '      checkTextHygiene(raw, path.basename(resolved), errors);',
    '    }',
    '  } else {',
    "    const skillPath = path.resolve(process.cwd(), 'SKILL.md');",
    "    const samplePath = path.resolve(process.cwd(), 'templates/sample-input.json');",
    '    if (fs.existsSync(skillPath)) {',
    '      validateSkillMarkdown(skillPath, errors);',
    '    } else {',
    "      errors.push('Missing SKILL.md in current working directory');",
    '    }',
    '    if (fs.existsSync(samplePath)) {',
    "      validateJsonFile(samplePath, 'templates/sample-input.json', errors);",
    '    }',
    '  }',
    '',
    '  if (errors.length > 0) {',
    "    console.error('Validation failed:');",
    '    for (const err of errors) {',
    '      console.error(`- ${err}`);',
    '    }',
    '    process.exit(1);',
    '  }',
    '',
    `  console.log('PASS: ${safeName} output validation succeeded.');`,
    '}',
    '',
    'main();',
    '',
  ].join('\n');
};

/**
 * Packages a compiled PromptMatrix formula into an Agensi.io-compliant `.zip` bundle
 * with `SKILL.md` at the root plus references, templates, and a deterministic Node.js validator.
 */
export const buildFormulaSkillZipBundle = (
  input: BuildFormulaSkillZipBundleInput
): FormulaSkillZipBundleResult => {
  const safeSlug =
    input.skillSpec.name
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'promptmatrix-skill';

  const normalizedSkillMd = `${cleanOutputText(input.skillMarkdown).trim()}\n`;
  const frameworkGuideMd = buildFrameworkGuideMarkdown(input.skillSpec);

  const sampleInputPayload = {
    skillName: input.skillSpec.name,
    framework: cleanOutputText(input.skillSpec.metadata.framework),
    category: cleanOutputText(input.skillSpec.metadata.category),
    language: input.skillSpec.metadata.language,
    parameters: resolveFormParameters(input.formValues, input.customOtherValues),
    compiledPrompt: cleanOutputText(input.compiledPrompt),
  };
  const sampleInputJson = `${JSON.stringify(sampleInputPayload, null, 2)}\n`;
  const validatorScript = buildValidatorScriptSource(safeSlug);

  const entries: ZipFileEntry[] = [
    { name: 'SKILL.md', content: normalizedSkillMd },
    { name: 'references/framework-guide.md', content: frameworkGuideMd },
    { name: 'templates/sample-input.json', content: sampleInputJson },
    { name: 'scripts/validate-output.mjs', content: validatorScript },
  ];

  const archiveBytes = buildZipArchive(entries);
  const fileList = entries.map((entry) => entry.name);

  return {
    filename: `${safeSlug}.zip`,
    entries,
    archiveBytes,
    fileList,
  };
};

const inferRecommendedPriceUsd = (category: string, explicitPrice?: number): number => {
  if (typeof explicitPrice === 'number' && Number.isFinite(explicitPrice) && explicitPrice >= 0) {
    return Number(explicitPrice.toFixed(2));
  }
  const normalized = category.toLowerCase();
  if (normalized.includes('kode') || normalized.includes('code') || normalized.includes('security')) {
    return 14.99;
  }
  if (normalized.includes('video') || normalized.includes('gambar') || normalized.includes('audio')) {
    return 9.99;
  }
  if (normalized.includes('teks') || normalized.includes('text') || normalized.includes('content')) {
    return 11.99;
  }
  return 12;
};

const buildListingTags = (slug: string, category: string): string[] => {
  const slugTokens = slug
    .split('-')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length >= 3);
  const categorySlug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const candidates = [
    'open-agent-skills',
    'promptmatrix',
    categorySlug,
    ...slugTokens.slice(0, 3),
  ].filter(Boolean);

  return Array.from(new Set(candidates)).slice(0, 6);
};

/**
 * Generates ready-to-paste Agensi.io marketplace listing copy and metadata for a skill pack.
 */
export const buildAgensiListingCopy = (
  input: BuildAgensiListingCopyInput
): AgensiListingCopyResult => {
  const recommendedPriceUsd = inferRecommendedPriceUsd(input.category, input.priceUsd);
  const cleanTitle = cleanOutputText(input.title).trim();
  const cleanDesc = cleanOutputText(input.description).trim();
  const cleanCategory = cleanOutputText(input.category).trim() || 'General';
  const cleanSlug = input.slug.trim() || 'promptmatrix-skill';
  const tags = buildListingTags(cleanSlug, cleanCategory);
  const priceDisplay =
    recommendedPriceUsd === 0 ? 'Free ($0)' : `$${recommendedPriceUsd.toFixed(2)} USD`;

  const isIndonesian = input.language === 'id';
  const tagline = isIndonesian
    ? `Paket Agent Skill deterministik untuk ${cleanTitle} pada alur kerja ${cleanCategory}.`
    : `Deterministic Agent Skill pack for ${cleanTitle} across ${cleanCategory} workflows.`;

  const includedFilesList =
    input.includedFiles.length > 0
      ? input.includedFiles.map((file) => `- \`${normalizeZipEntryName(file)}\``).join('\n')
      : '- `SKILL.md`';

  const sections: string[] = isIndonesian
    ? [
        `# ${cleanTitle}`,
        '',
        `> ${tagline}`,
        '',
        `- **Slug**: \`${cleanSlug}\``,
        `- **Kategori**: ${cleanCategory}`,
        `- **Harga Rekomendasi**: ${priceDisplay}`,
        `- **Tags**: ${tags.map((tag) => `\`#${tag}\``).join(', ')}`,
        '',
        '## Ringkasan',
        cleanDesc,
        '',
        '## Isi Paket ZIP',
        includedFilesList,
        '',
        '## Kompatibilitas Runner',
        'Kompatibel dengan Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, dan 27+ runtime Open Agent Skills.',
        '',
        '## Cara Pakai Cepat',
        '1. Ekstrak arsip `.zip` dengan `SKILL.md` berada di root folder skill.',
        '2. Muat skill di agent runner pilihan Anda dan isi parameter input yang diminta.',
        '3. Jalankan skrip validator di folder `scripts/` (jika tersedia) sebelum merilis output.',
      ]
    : [
        `# ${cleanTitle}`,
        '',
        `> ${tagline}`,
        '',
        `- **Slug**: \`${cleanSlug}\``,
        `- **Category**: ${cleanCategory}`,
        `- **Recommended Price**: ${priceDisplay}`,
        `- **Tags**: ${tags.map((tag) => `\`#${tag}\``).join(', ')}`,
        '',
        '## Overview',
        cleanDesc,
        '',
        '## Included in the ZIP Bundle',
        includedFilesList,
        '',
        '## Runner Compatibility',
        'Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 27+ Open Agent Skills runtimes.',
        '',
        '## Quick Start',
        '1. Extract the `.zip` archive so `SKILL.md` sits at the root of the skill directory.',
        '2. Load the skill in your preferred coding agent or CLI runner and provide the input context.',
        '3. Run the bundled validator in `scripts/` (when included) to verify output constraints.',
      ];

  return {
    recommendedPriceUsd,
    title: cleanTitle,
    tagline,
    tags,
    fullMarkdown: `${sections.join('\n').trim()}\n`,
  };
};

/**
 * Triggers a client-side browser download for a generated ZIP byte buffer.
 */
export const triggerZipDownload = (filename: string, bytes: Uint8Array): void => {
  if (typeof document === 'undefined' || typeof URL === 'undefined') {
    return;
  }

  const safeFilename = filename.toLowerCase().endsWith('.zip') ? filename : `${filename}.zip`;
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(arrayBuffer).set(bytes);
  const blob = new Blob([arrayBuffer], { type: 'application/zip' });
  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = safeFilename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
};
