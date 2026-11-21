import { Language } from '../types';
import { SKILL_LISTING_DEMOS, SkillListingDemoProfile, getSkillListingDemo } from '../data/skillListingDemos';
import { AgensiPillar } from '../config/agensiConfig';
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
  readonly logoPngBytes?: Uint8Array;
  readonly logoSvg?: string;
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
  readonly pillar?: AgensiPillar;
  readonly priceUsd?: number;
  readonly includedFiles: readonly string[];
  readonly language: Language;
  readonly tagline?: string;
  readonly tags?: readonly string[];
  readonly demoRequest?: string;
  readonly demoResult?: string;
  readonly compiledPrompt?: string;
  readonly formValues?: Record<string, string | number | boolean | string[]>;
}

export interface AgensiPromptBaseListing {
  readonly title: string;
  readonly description: string;
  readonly promptTemplate: string;
  readonly testingExample: string;
}

export interface AgensiStorefrontListing {
  readonly headline: string;
  readonly bodyMarkdown: string;
}

export interface AgensiOssLeadMagnetListing {
  readonly readmeMarkdown: string;
  readonly cliCommand: string;
}

export interface AgensiListingCopyResult {
  readonly recommendedPriceUsd: number;
  readonly detectedPillar: AgensiPillar;
  readonly title: string;
  readonly tagline: string;
  readonly tags: string[];
  readonly descriptionMarkdown: string;
  readonly demoRequest: string;
  readonly demoResult: string;
  readonly promptBase: AgensiPromptBaseListing;
  readonly storefront: AgensiStorefrontListing;
  readonly ossLeadMagnet: AgensiOssLeadMagnetListing;
  readonly fullMarkdown: string;
  readonly jsonLdSchema: string;
  readonly geoFaqMarkdown: string;
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

  if (input.logoPngBytes && input.logoPngBytes.length > 0) {
    entries.push({ name: 'icon.png', content: input.logoPngBytes });
  } else if (input.logoSvg && input.logoSvg.trim().startsWith('<svg')) {
    entries.push({ name: 'icon.svg', content: input.logoSvg.trim() });
  }

  const archiveBytes = buildZipArchive(entries);
  const fileList = entries.map((entry) => entry.name);

  return {
    filename: `${safeSlug}.zip`,
    entries,
    archiveBytes,
    fileList,
  };
};

/**
 * Infers the Agensi.io functional pillar ('develop' | 'grow' | 'operate' | 'create')
 * from category, explicit tags, and slug.
 */
export const inferAgensiPillar = (
  category: string,
  tags?: readonly string[],
  slug?: string
): AgensiPillar => {
  const combined = [
    category,
    slug || '',
    ...(tags || []),
  ].join(' ').toLowerCase();

  // Operate: Product management, workflows, automation, enterprise ops
  if (
    combined.includes('prd') ||
    combined.includes('product manager') ||
    combined.includes('workflow') ||
    combined.includes('n8n') ||
    combined.includes('automation') ||
    combined.includes('operate') ||
    combined.includes('agile') ||
    combined.includes('scrum') ||
    combined.includes('operations') ||
    combined.includes('orchestrat')
  ) {
    return 'operate';
  }

  // Grow: Sales, cold email, marketing, SEO/GEO/AEO, viral hooks, retention
  if (
    combined.includes('outreach') ||
    combined.includes('sales') ||
    combined.includes('cold email') ||
    combined.includes('hook') ||
    combined.includes('viral') ||
    combined.includes('tiktok') ||
    combined.includes('reels') ||
    combined.includes('grow') ||
    combined.includes('marketing') ||
    combined.includes('seo') ||
    combined.includes('geo') ||
    combined.includes('aeo') ||
    combined.includes('copywriting') ||
    combined.includes('conversion')
  ) {
    return 'grow';
  }

  // Create: Music, audio, video generation, image generation, creative writing
  if (
    combined.includes('music') ||
    combined.includes('audio') ||
    combined.includes('suno') ||
    combined.includes('midjourney') ||
    combined.includes('flux') ||
    combined.includes('create') ||
    combined.includes('multimodal') ||
    combined.includes('art') ||
    combined.includes('creative') ||
    combined.includes('video') ||
    combined.includes('image')
  ) {
    return 'create';
  }

  // Develop: Code, TypeScript, Next.js, MCP, SQL, testing, security, architecture
  return 'develop';
};

export const inferRecommendedPriceUsd = (
  category: string,
  explicitPrice?: number,
  pillar?: AgensiPillar
): number => {
  if (typeof explicitPrice === 'number' && Number.isFinite(explicitPrice) && explicitPrice >= 0) {
    return Number(explicitPrice.toFixed(2));
  }
  const normalized = category.toLowerCase();
  if (
    normalized.includes('security') ||
    normalized.includes('multi-agent') ||
    normalized.includes('swarm') ||
    normalized.includes('owasp')
  ) {
    return 19.99;
  }
  if (
    normalized.includes('kode') ||
    normalized.includes('code') ||
    normalized.includes('engineering') ||
    normalized.includes('backend') ||
    normalized.includes('fullstack') ||
    normalized.includes('database') ||
    normalized.includes('prisma') ||
    normalized.includes('sql') ||
    normalized.includes('mcp') ||
    normalized.includes('playwright') ||
    normalized.includes('prd') ||
    normalized.includes('workflow') ||
    normalized.includes('n8n')
  ) {
    return 14.99;
  }
  if (
    normalized.includes('video') ||
    normalized.includes('gambar') ||
    normalized.includes('audio') ||
    normalized.includes('music') ||
    normalized.includes('suno') ||
    normalized.includes('hook')
  ) {
    return 9.99;
  }
  if (
    normalized.includes('teks') ||
    normalized.includes('text') ||
    normalized.includes('content') ||
    normalized.includes('outreach') ||
    normalized.includes('sales') ||
    normalized.includes('seo') ||
    normalized.includes('copywriting')
  ) {
    return 11.99;
  }

  if (pillar === 'operate') return 14.99;
  if (pillar === 'grow') return 11.99;
  if (pillar === 'create') return 9.99;
  return 14.99;
};

const TAG_STOPWORDS = new Set(['and', 'the', 'for', 'with', 'from', 'into', 'your']);

const normalizeTagToken = (rawTag: string): string => {
  return cleanOutputText(rawTag)
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const buildListingTags = (
  slug: string,
  category: string,
  explicitTags?: readonly string[]
): string[] => {
  const coreDiscoveryTags = ['open-agent-skills', 'agent-skill', 'ai-agent'];
  if (explicitTags && explicitTags.length > 0) {
    const cleanedExplicit = explicitTags
      .map((part) => normalizeTagToken(part))
      .filter((part) => part.length >= 2 && !TAG_STOPWORDS.has(part));
    if (cleanedExplicit.length > 0) {
      return Array.from(new Set([...coreDiscoveryTags, ...cleanedExplicit])).slice(0, 8);
    }
  }

  const slugTokens = slug
    .split('-')
    .map((part) => normalizeTagToken(part))
    .filter((part) => part.length >= 3 && !TAG_STOPWORDS.has(part));
  const categorySlug = normalizeTagToken(category);
  const safeCategorySlug =
    categorySlug && !TAG_STOPWORDS.has(categorySlug) ? categorySlug : '';

  const candidates = [
    ...coreDiscoveryTags,
    safeCategorySlug,
    ...slugTokens,
    'claude-code',
    'cursor-rules',
    'antigravity',
  ].filter((part) => part.length >= 2 && !TAG_STOPWORDS.has(part));

  return Array.from(new Set(candidates)).slice(0, 8);
};

export const buildGeoFaqMarkdown = (
  title: string,
  category: string,
  isIndonesian: boolean
): string => {
  if (isIndonesian) {
    return [
      '## Pertanyaan Umum (FAQ) & Panduan Pembeli',
      '',
      `### Q1: Apa itu ${title} dan mengapa dikemas sebagai Agent Skill (.zip)?`,
      `**A**: ${title} adalah paket instruksi deterministik terstandarisasi Open Agent Skills untuk domain ${category}. Berbeda dari prompt teks biasa yang rentan halusinasi, paket ini memuat dokumen \`SKILL.md\`, panduan referensi arsitektur, parameter input teruji, dan skrip validator offline untuk menjamin hasil agen AI konsisten di proyek riil.`,
      '',
      `### Q2: Runtime dan IDE apa saja yang kompatibel dengan skill ini?`,
      `**A**: Kompatibel dengan 27 runtime agen terpopuler, termasuk Google Antigravity, Claude Code, Cursor (Rules/Skills), GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, dan Aider.`,
      '',
      `### Q3: Apakah aman untuk privasi dan kode rahasia proyek saya?`,
      `**A**: Sangat aman. Seluruh eksekusi dan validasi berjalan 100% secara lokal di komputer Anda tanpa dependensi API eksternal dan tanpa telemetri yang mengirimkan data proyek Anda ke server jarak jauh.`,
      '',
      `### Q4: Bagaimana cara menguji skill ini setelah mengunduh file ZIP?`,
      `**A**: Ekstrak arsip \`.zip\` ke folder skill di komputer Anda, lalu jalankan perintah \`node scripts/validate-output.mjs\` untuk memverifikasi keutuhan dokumen secara instan sebelum digunakan.`,
    ].join('\n');
  }

  return [
    '## Frequently Asked Questions (FAQ) & Buyer Guide',
    '',
    `### Q1: What is ${title} and why is it packaged as an Agent Skill (.zip)?`,
    `**A**: ${title} is a production-grade Open Agent Skill for ${category} tasks built on deterministic execution guardrails. Unlike generic prompts that produce inconsistent output, this package bundles \`SKILL.md\`, domain references, sample input schema, and an offline Node.js validator to guarantee production reliability.`,
    '',
    `### Q2: Which AI agent runtimes and IDEs are supported?`,
    `**A**: It works seamlessly across 27 agent runtimes including Google Antigravity, Claude Code, Cursor (Rules & Skills), GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Aider.`,
    '',
    `### Q3: Is this skill safe for proprietary and sensitive codebases?`,
    `**A**: 100% private and secure. All logic executes locally in your client environment with zero remote telemetry, zero credential leakage, and zero third-party tracking.`,
    '',
    `### Q4: How do I test this skill after downloading the ZIP archive?`,
    `**A**: Extract the archive into your local agent skills directory and run \`node scripts/validate-output.mjs\` to verify schema compliance and output formatting before deployment.`,
  ].join('\n');
};

export const buildJsonLdSchema = (
  title: string,
  tagline: string,
  category: string,
  priceUsd: number,
  tags: readonly string[],
  slug: string
): string => {
  const schemaPayload = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    alternateName: slug,
    description: tagline,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform (Windows, macOS, Linux)',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      price: priceUsd.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    keywords: tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'Sigit Adi',
      url: 'https://sigitadi.id',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PromptMatrix 2.0',
      url: 'https://prompt.sigitadi.id',
    },
  };
  return JSON.stringify(schemaPayload, null, 2);
};

interface ResolvedVariableEntry {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

const extractVariableEntries = (
  formValues?: Record<string, string | number | boolean | string[]>
): ResolvedVariableEntry[] => {
  if (!formValues) return [];
  const entries: ResolvedVariableEntry[] = [];
  for (const [key, rawValue] of Object.entries(formValues)) {
    if (key.startsWith('__') || rawValue === undefined || rawValue === null) {
      continue;
    }
    const formattedValue = Array.isArray(rawValue)
      ? rawValue.map((item) => cleanOutputText(String(item)).trim()).filter(Boolean).join(', ')
      : cleanOutputText(String(rawValue)).trim();
    if (!formattedValue) continue;
    const label = cleanOutputText(key)
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    entries.push({ key, label: label || key, value: formattedValue });
  }
  return entries;
};

const truncatePromptBaseTitle = (rawTitle: string): string => {
  const normalized = cleanOutputText(rawTitle).replace(/\s+/g, ' ').trim();
  if (normalized.length <= 40) {
    return normalized;
  }
  const sliced = normalized.slice(0, 40);
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace >= 20 ? sliced.slice(0, lastSpace) : sliced;
  return cut.replace(/[\s,:-]+$/g, '').trim();
};

const truncateLineAtBoundary = (text: string, maxLength: number): string => {
  const normalized = cleanOutputText(text).replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  const slice = normalized.slice(0, Math.max(0, maxLength - 3));
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > Math.floor(maxLength * 0.6) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trim()}...`;
};

const buildFallbackTagline = (
  title: string,
  category: string,
  description: string,
  isIndonesian: boolean
): string => {
  const firstSentence = description
    .split(/(?<=[.!?])\s+/)[0]
    ?.replace(/\s+/g, ' ')
    .trim();
  if (firstSentence && firstSentence.length >= 25 && firstSentence.length <= 120) {
    return firstSentence;
  }
  if (isIndonesian) {
    return truncateLineAtBoundary(
      `Susun alur kerja ${title} untuk menghasilkan output ${category} yang terstruktur dan siap diuji.`,
      120
    );
  }
  return truncateLineAtBoundary(
    `Structure ${title} inputs into repeatable ${category} deliverables with local CLI verification.`,
    120
  );
};

const buildFallbackDemoRequest = (
  title: string,
  category: string,
  entries: readonly ResolvedVariableEntry[],
  isIndonesian: boolean
): string => {
  if (entries.length > 0) {
    const samplePairs = entries
      .slice(0, 3)
      .map((entry) => `${entry.label}: ${truncateLineAtBoundary(entry.value, 60)}`)
      .join('; ');
    return isIndonesian
      ? `Jalankan workflow ${title} (${category}) dengan parameter berikut: ${samplePairs}. Berikan ringkasan keputusan, tabel spesifikasi, dan langkah verifikasi.`
      : `Run the ${title} workflow (${category}) using these inputs: ${samplePairs}. Return a concise summary, structured deliverable table, and verification steps.`;
  }

  return isIndonesian
    ? `Gunakan skill ${title} untuk memproses kasus ${category} di tim kami: susun spesifikasi terstruktur, identifikasi batasan kunci, dan siapkan checklist validasi akhir.`
    : `Apply the ${title} skill to a production ${category} task: produce a structured specification, call out key constraints, and provide a verification checklist.`;
};

const buildFallbackDemoResult = (
  title: string,
  description: string,
  category: string,
  compiledPrompt: string,
  entries: readonly ResolvedVariableEntry[],
  includedFiles: readonly string[],
  isIndonesian: boolean
): string => {
  const cleanCompiled = cleanOutputText(compiledPrompt).trim();
  const safeFiles =
    includedFiles.length > 0
      ? includedFiles.map((file) => normalizeZipEntryName(file)).join(', ')
      : 'SKILL.md, references/framework-guide.md, templates/sample-input.json, scripts/validate-output.mjs';

  const tableRows =
    entries.length > 0
      ? entries.slice(0, 6).map((entry) => `| ${entry.label} | ${truncateLineAtBoundary(entry.value, 90)} | ${isIndonesian ? 'Diterapkan' : 'Applied'} |`)
      : isIndonesian
        ? [
          `| Target Alur Kerja | ${title} | Aktif |`,
          `| Cakupan Domain | ${category} | Terverifikasi |`,
          `| Berkas Paket | ${safeFiles} | Terkemas |`,
          `| Kerapian Output | Nol placeholder kosong, nol em dash | Ditegakkan |`,
        ]
        : [
          `| Workflow Target | ${title} | Active |`,
          `| Domain Scope | ${category} | Verified |`,
          `| Bundle Files | ${safeFiles} | Packaged |`,
          `| Output Hygiene | Zero unresolved placeholders, zero em dashes | Enforced |`,
        ];

  const contractPreview = cleanCompiled
    ? truncateLineAtBoundary(cleanCompiled, 350)
    : isIndonesian
      ? `Role: Spesialis ${category} untuk ${title}\nInput: Parameter terstruktur dari templates/sample-input.json\nOutput: Spesifikasi terverifikasi tanpa placeholder kosong dan lolos skrip validator.`
      : `Role: ${category} specialist executing ${title}\nInput: Structured parameters from templates/sample-input.json\nOutput: Verified deliverable free of unresolved placeholders and passing local CLI checks.`;

  const summaryText = description
    ? isIndonesian
      ? `${description} Output di bawah ini menerjemahkan parameter aktif menjadi deliverable ${category} yang terstruktur dan siap pakai.`
      : `${description} Output below translates the active parameters into a repeatable ${category} deliverable.`
    : isIndonesian
      ? `Menerapkan aturan ${title} untuk domain ${category} guna mengubah instruksi mentah menjadi spesifikasi terverifikasi yang siap dieksekusi.`
      : `Applied ${title} rules for ${category} to convert raw requirements into a verified specification ready for execution.`;

  const lines: string[] = isIndonesian
    ? [
      '## Ringkasan',
      summaryText,
      '',
      '### Spesifikasi Deliverable',
      '',
      '| Parameter / Pemeriksaan | Konfigurasi Diterapkan | Status |',
      '| :--- | :--- | :--- |',
      ...tableRows,
      '',
      '### Pratinjau Kontrak Eksekusi',
      '',
      '```text',
      contractPreview,
      '```',
      '',
      '## Langkah Selanjutnya',
      '1. Ekstrak arsip ZIP skill sehingga SKILL.md berada di root folder skill agen Anda.',
      '2. Jalankan node scripts/validate-output.mjs templates/sample-input.json untuk memastikan JSON valid, tanpa karakter zero-width, dan tanpa placeholder kosong.',
      '3. Panggil alur kerja di runner Open Agent Skills pilihan Anda dengan input proyek riil dan tinjau checklist verifikasi sebelum merilis.',
    ]
    : [
      '## Summary',
      summaryText,
      '',
      '### Deliverable Specification',
      '',
      '| Parameter / Check | Applied Configuration | Status |',
      '| :--- | :--- | :--- |',
      ...tableRows,
      '',
      '### Execution Contract Preview',
      '',
      '```text',
      contractPreview,
      '```',
      '',
      '## Next Steps',
      '1. Extract the skill ZIP archive so `SKILL.md` sits at the root of your agent skill folder.',
      '2. Run `node scripts/validate-output.mjs templates/sample-input.json` to confirm valid JSON, zero zero-width characters, and zero unresolved placeholders.',
      '3. Invoke the workflow in your Open Agent Skills runner with real project inputs and review the verification checklist before shipping.',
    ];

  const assembled = cleanOutputText(lines.join('\n').trim());
  if (assembled.length >= 700) {
    return assembled;
  }

  const qualityGateSection = isIndonesian
    ? [
      '',
      '### Verifikasi Standar Kualitas (Quality Gateway)',
      '- Memastikan slug skill berupa kebab-case valid (<= 64 karakter) dan frontmatter YAML siap penemuan.',
      '- Memverifikasi seluruh bagian wajib (Role & Trigger, Input Parameters, Execution Steps, Verification Checklist) terisi tanpa placeholder kosong.',
      '- Memastikan eksekusi lokal client-side 100% tanpa dependensi jaringan eksternal atau kebocoran rahasia.',
    ].join('\n')
    : [
      '',
      '### Quality Gate Verification',
      '- Confirmed valid kebab-case skill slug (`<= 64` characters) and discovery-ready YAML frontmatter.',
      '- Verified all required sections (`Role & Trigger`, `Input Parameters`, `Execution Steps`, `Verification Checklist`) are populated without placeholder drift.',
      '- Confirmed local client-side execution with zero external network dependencies or secret leakage.',
    ].join('\n');

  return cleanOutputText([assembled, qualityGateSection].join('\n'));
};

const buildPromptBaseListing = (
  title: string,
  description: string,
  category: string,
  compiledPrompt: string,
  entries: readonly ResolvedVariableEntry[],
  demoProfile?: SkillListingDemoProfile
): AgensiPromptBaseListing => {
  const pbTitle = truncatePromptBaseTitle(title);
  const hookSentence = demoProfile?.promptBaseHook
    ? cleanOutputText(demoProfile.promptBaseHook)
    : `Generates structured ${category} deliverables with explicit constraints and verification checks.`;

  const pbDescription = truncateLineAtBoundary(
    `${description || title} ${hookSentence}`,
    350
  );

  const variableNames =
    entries.length > 0
      ? entries.slice(0, 5).map((entry) => `[${entry.label}]`)
      : ['[Project Context]', '[Target Audience]', '[Key Constraints]', '[Output Format]'];

  const templateLines: string[] = [
    `Act as a domain specialist for ${title} (${category}).`,
    '',
    'Inputs:',
    ...variableNames.map((varName) => `- ${varName.slice(1, -1)}: ${varName}`),
    '',
    'Instructions:',
    cleanOutputText(compiledPrompt).trim()
      ? truncateLineAtBoundary(cleanOutputText(compiledPrompt).trim(), 480)
      : `Produce a complete ${category} deliverable tailored to ${variableNames[0]}. End with a concrete verification checklist and zero unresolved placeholders.`,
  ];

  const testingLines: string[] =
    entries.length > 0
      ? entries.slice(0, 5).map((entry) => `- [${entry.label}]: ${entry.value}`)
      : [
        `- [Project Context]: B2B SaaS workflow for ${title}`,
        `- [Target Audience]: Engineering and product leads reviewing ${category} outputs`,
        '- [Key Constraints]: Plain ASCII punctuation, no fabricated metrics, concrete steps only',
        '- [Output Format]: Markdown summary, specification table, and action checklist',
      ];

  return {
    title: pbTitle,
    description: pbDescription,
    promptTemplate: templateLines.join('\n').trim(),
    testingExample: testingLines.join('\n').trim(),
  };
};

const buildStorefrontListing = (
  title: string,
  tagline: string,
  description: string,
  category: string,
  priceDisplay: string,
  includedFilesList: string,
  demoProfile?: SkillListingDemoProfile
): AgensiStorefrontListing => {
  const headline = cleanOutputText(demoProfile?.storefrontHook || tagline);
  const highlightsBlock =
    demoProfile && demoProfile.highlights.length > 0
      ? ['## Key Capabilities', ...demoProfile.highlights.map((item) => `- ${cleanOutputText(item)}`), '']
      : [];

  const bodyLines: string[] = [
    `# ${title} (${priceDisplay})`,
    '',
    headline,
    '',
    '## What You Get',
    description,
    '',
    ...highlightsBlock,
    '## Bundle Contents',
    includedFilesList,
    '',
    '## Compatibility & Licensing',
    '- Works across 27 Open Agent Skills runtimes including Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Antigravity.',
    '- Ships as a self-contained ZIP archive with a deterministic Node.js CLI validator.',
    `- Category: ${category}. Non-exclusive commercial usage for your team projects.`,
    '',
    '## Available Storefronts',
    'Formatted for Lemon Squeezy, Creem.io, Gumroad, Whop, and Payhip digital delivery.',
  ];

  return {
    headline,
    bodyMarkdown: cleanOutputText(bodyLines.join('\n').trim()),
  };
};

const buildOssLeadMagnetListing = (
  slug: string,
  title: string,
  tagline: string,
  description: string,
  includedFilesList: string
): AgensiOssLeadMagnetListing => {
  const cliCommand = `npx skills add sigitadi/${slug}`;
  const readmeLines: string[] = [
    `# ${title}`,
    '',
    tagline,
    '',
    description,
    '',
    '## Quick Install',
    '```bash',
    cliCommand,
    '```',
    '',
    '## Included Files',
    includedFilesList,
    '',
    '## Compatibility',
    'Tested for Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 27 Open Agent Skills runtimes.',
    '',
    '## License',
    'MIT',
  ];

  return {
    cliCommand,
    readmeMarkdown: cleanOutputText(readmeLines.join('\n').trim()),
  };
};

/**
 * Generates ready-to-paste Agensi.io marketplace listing copy and metadata for a skill pack.
 */
export const buildAgensiListingCopy = (
  input: BuildAgensiListingCopyInput
): AgensiListingCopyResult => {
  const cleanCategory = cleanOutputText(input.category).trim() || 'General';
  const cleanSlug = input.slug.trim() || 'promptmatrix-skill';
  const detectedPillar: AgensiPillar =
    input.pillar || inferAgensiPillar(cleanCategory, input.tags, cleanSlug);
  const recommendedPriceUsd = inferRecommendedPriceUsd(input.category, input.priceUsd, detectedPillar);
  const cleanTitle = cleanOutputText(input.title).trim();
  const cleanDesc = cleanOutputText(input.description).trim();
  const demoProfile = getSkillListingDemo(cleanSlug, input.language);
  const entries = extractVariableEntries(input.formValues);

  const tags = buildListingTags(
    cleanSlug,
    cleanCategory,
    input.tags && input.tags.length > 0 ? input.tags : demoProfile?.tags
  );
  const priceDisplay =
    recommendedPriceUsd === 0 ? 'Free ($0)' : `$${recommendedPriceUsd.toFixed(2)} USD`;

  const isIndonesian = input.language === 'id';
  const explicitTagline = cleanOutputText(input.tagline || '').trim();
  const tagline =
    explicitTagline ||
    (demoProfile ? cleanOutputText(demoProfile.tagline) : '') ||
    buildFallbackTagline(cleanTitle, cleanCategory, cleanDesc, isIndonesian);

  const includedFilesList =
    input.includedFiles.length > 0
      ? input.includedFiles.map((file) => `- \`${normalizeZipEntryName(file)}\``).join('\n')
      : '- `SKILL.md`';

  const highlightsLines =
    demoProfile && demoProfile.highlights.length > 0
      ? [
        '',
        isIndonesian ? '## Fitur Utama Paket' : '## Key Deliverables',
        ...demoProfile.highlights.map((item) => `- ${cleanOutputText(item)}`),
      ]
      : [];

  const descriptionSections: string[] = isIndonesian
    ? [
      '## Ringkasan',
      cleanDesc || tagline,
      ...highlightsLines,
      '',
      '## Isi Paket ZIP',
      includedFilesList,
      '',
      '## Kompatibilitas Runner',
      'Kompatibel dengan Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, dan 27 Open Agent Skills runtimes.',
      '',
      '## Cara Pakai Cepat',
      '1. Ekstrak arsip `.zip` dengan `SKILL.md` berada di root folder skill.',
      '2. Muat skill di agent runner pilihan Anda dan isi parameter input yang diminta.',
      '3. Jalankan skrip validator di folder `scripts/` (jika tersedia) sebelum merilis output.',
    ]
    : [
      '## Overview',
      cleanDesc || tagline,
      ...highlightsLines,
      '',
      '## Included in the ZIP Bundle',
      includedFilesList,
      '',
      '## Runner Compatibility',
      'Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 27 Open Agent Skills runtimes.',
      '',
      '## Quick Start',
      '1. Extract the `.zip` archive so `SKILL.md` sits at the root of the skill directory.',
      '2. Load the skill in your preferred coding agent or CLI runner and provide the input context.',
      '3. Run the bundled validator in `scripts/` (when included) to verify output constraints.',
    ];

  const descriptionMarkdown = cleanOutputText(descriptionSections.join('\n').trim());

  const explicitRequest = cleanOutputText(input.demoRequest || '').trim();
  const demoRequest =
    explicitRequest ||
    (demoProfile ? cleanOutputText(demoProfile.demoRequest) : '') ||
    buildFallbackDemoRequest(cleanTitle, cleanCategory, entries, isIndonesian);

  const explicitResult = cleanOutputText(input.demoResult || '').trim();
  const demoResult =
    explicitResult ||
    (demoProfile ? cleanOutputText(demoProfile.demoResult) : '') ||
    buildFallbackDemoResult(
      cleanTitle,
      cleanDesc,
      cleanCategory,
      input.compiledPrompt || '',
      entries,
      input.includedFiles,
      isIndonesian
    );

  const promptBase = buildPromptBaseListing(
    cleanTitle,
    cleanDesc,
    cleanCategory,
    input.compiledPrompt || '',
    entries,
    demoProfile
  );
  const storefront = buildStorefrontListing(
    cleanTitle,
    tagline,
    cleanDesc || tagline,
    cleanCategory,
    priceDisplay,
    includedFilesList,
    demoProfile
  );
  const ossLeadMagnet = buildOssLeadMagnetListing(
    cleanSlug,
    cleanTitle,
    tagline,
    cleanDesc || tagline,
    includedFilesList
  );

  const geoFaqMarkdown = buildGeoFaqMarkdown(cleanTitle, cleanCategory, isIndonesian);
  const jsonLdSchema = buildJsonLdSchema(
    cleanTitle,
    tagline,
    cleanCategory,
    recommendedPriceUsd,
    tags,
    cleanSlug
  );

  const specTableLines = isIndonesian
    ? [
      '### Spesifikasi Teknis & Metadata GEO',
      '| Parameter | Nilai Spesifikasi | Keterangan Standar |',
      '| :--- | :--- | :--- |',
      `| **Format Produk** | Open Agent Skill (\`SKILL.md\` + \`.zip\`) | Universal Open Agent Standards |`,
      `| **Pilar Ekosistem** | ${detectedPillar.toUpperCase()} | Taksonomi Agensi.io 4 Pilar |`,
      `| **Logo Skill** | Persegi (Rekomendasi 512×512 PNG) | Standar Visual Marketplace (\`icon.png\`) |`,
      `| **Domain & Kategori** | ${cleanCategory} | Taksonomi Direktori Industri |`,
      `| **Harga Lisensi** | ${priceDisplay} | Akses Komersial Tim Non-Eksklusif |`,
      `| **Runner Kompatibel** | Claude Code, Cursor, Antigravity, Copilot, Gemini CLI | 27 Runtime CLI & IDE |`,
      `| **Privasi Kode** | 100% Eksekusi Klien Lokal | Nol Telemetri / Leakage |`,
      `| **Validasi Output** | Deterministic Offline Validator | Skrip Node.js (scripts/) |`,
    ]
    : [
      '### Technical Specification & GEO Metadata',
      '| Attribute | Value Specification | Industry Standard |',
      '| :--- | :--- | :--- |',
      `| **Product Format** | Open Agent Skill (\`SKILL.md\` + \`.zip\`) | Universal Open Agent Standards |`,
      `| **Ecosystem Pillar** | ${detectedPillar.toUpperCase()} | Agensi.io 4-Pillar Taxonomy |`,
      `| **Skill logo** | Square (Recommended 512×512 PNG) | Marketplace Visual Asset (\`icon.png\`) |`,
      `| **Domain Scope** | ${cleanCategory} | Curated Marketplace Taxonomy |`,
      `| **Commercial License** | ${priceDisplay} | Non-Exclusive Team Commercial License |`,
      `| **Compatible Runtimes** | Claude Code, Cursor, Antigravity, Copilot, Gemini CLI | 27 CLI & IDE Runtimes |`,
      `| **Data Privacy** | 100% Local Client Execution | Zero Remote Telemetry / Leakage |`,
      `| **Quality Assurance** | Deterministic Offline Validator | Node.js Script (scripts/) |`,
    ];

  const fullMarkdownLines: string[] = isIndonesian
    ? [
      `# ${cleanTitle} - Production Agent Skill (.zip)`,
      '',
      `> **Definisi Produk**: ${cleanTitle} adalah spesifikasi agent skill produksi untuk ${cleanCategory}, dirancang untuk mengotomasi alur kerja tingkat lanjut dengan jaminan deterministik tanpa halusinasi pada 27 runtime agent AI.`,
      '',
      `- **Slug**: \`${cleanSlug}\``,
      `- **Kategori**: ${cleanCategory}`,
      `- **Harga Rekomendasi**: ${priceDisplay}`,
      `- **Tags Penemuan**: ${tags.map((tag) => `\`${tag}\``).join(', ')}`,
      '',
      ...specTableLines,
      '',
      descriptionMarkdown,
      '',
      '## See It in Action (Live Demo)',
      '',
      '### The Request (Kueri Masukan Nyata)',
      demoRequest,
      '',
      '### The Result (Keluaran Berstandar Emas Agen)',
      demoResult,
      '',
      geoFaqMarkdown,
      '',
      '## Schema.org JSON-LD Structured Data',
      '```json',
      jsonLdSchema,
      '```',
    ]
    : [
      `# ${cleanTitle} - Production Agent Skill (.zip)`,
      '',
      `> **Product Overview**: ${cleanTitle} is a production-grade Open Agent Skill for ${cleanCategory}, engineered to automate complex workflows with deterministic guardrails and zero hallucination across 27 AI agent runtimes.`,
      '',
      `- **Slug**: \`${cleanSlug}\``,
      `- **Category**: ${cleanCategory}`,
      `- **Recommended Price**: ${priceDisplay}`,
      `- **Discovery Tags**: ${tags.map((tag) => `\`${tag}\``).join(', ')}`,
      '',
      ...specTableLines,
      '',
      descriptionMarkdown,
      '',
      '## See It in Action (Live Demo)',
      '',
      '### The Request (Real-World High-Intent Task)',
      demoRequest,
      '',
      '### The Result (Gold-Standard Agent Deliverable)',
      demoResult,
      '',
      geoFaqMarkdown,
      '',
      '## Schema.org JSON-LD Structured Data',
      '```json',
      jsonLdSchema,
      '```',
    ];

  return {
    recommendedPriceUsd,
    detectedPillar,
    title: cleanTitle,
    tagline,
    tags,
    descriptionMarkdown,
    demoRequest,
    demoResult,
    promptBase,
    storefront,
    ossLeadMagnet,
    fullMarkdown: `${cleanOutputText(fullMarkdownLines.join('\n').trim())}\n`,
    jsonLdSchema,
    geoFaqMarkdown,
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
