#!/usr/bin/env node
/**
 * audit-frameworks.mjs
 * Programmatic verification gate for PromptMatrix 2.0 (V7.2.0):
 *   1. Validates exact 400 frameworks across 8 categories in data/frameworks.ts
 *   2. Checks zero duplicate framework names, valid toolType, non-empty ai_logic_description
 *   3. Verifies 100% localization coverage in services/localizationService.ts
 *   4. Validates all 10 Open Agent Skills in agensi-skills/<pkg>/SKILL.md
 *   5. Audits zero em-dashes ('\u2014'), banned buzzwords, and stale '360' counts
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const ROOT = process.cwd();
const EMDASH = '\u2014';

const VALID_TOOL_TYPES = new Set([
  'text',
  'code',
  'music-composition',
  'music-generation',
  'audio-generation',
  'image-generation',
  'image-editing',
  'planning',
  'video',
]);

const EXPECTED_CATEGORY_COUNTS = {
  'Kode & Pengembang': 50,
  'Koleksi & Inovasi': 36,
  'Teks & Konten': 98,
  'Prompt Proyek': 36,
  'Gambar & Desain': 54,
  'Video & Animasi': 35,
  'Audio & Musik': 37,
  'Prompt Ringkas': 54,
};

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

function loadTsModule(relPath) {
  const absPath = path.join(ROOT, relPath);
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

function collectFilesRecursive(dirPath, exts) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesRecursive(full, exts));
    } else if (entry.isFile() && (!exts || exts.has(path.extname(entry.name).toLowerCase()))) {
      results.push(full);
    }
  }
  return results;
}

function findLineViolations(filePath, checkFn) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const res = checkFn(lines[i], i + 1);
    if (res) {
      hits.push({ line: i + 1, detail: res });
    }
  }
  return hits;
}

async function main() {
  const failures = [];
  const warnings = [];

  console.log('=== PromptMatrix 2.0 Verification Audit ===\n');

  // 1. Load data/frameworks.ts and services/localizationService.ts
  const frameworksMod = await loadTsModule('data/frameworks.ts');
  const locMod = await loadTsModule('services/localizationService.ts');

  const PROMPT_FRAMEWORKS = frameworksMod.PROMPT_FRAMEWORKS;
  const FRAMEWORK_NAMES_MAP = locMod.FRAMEWORK_NAMES_MAP || {};
  const EN_TO_ID_FRAMEWORK_NAMES_MAP = locMod.EN_TO_ID_FRAMEWORK_NAMES_MAP || {};
  const FRAMEWORK_DESCRIPTIONS_MAP = locMod.FRAMEWORK_DESCRIPTIONS_MAP || {};
  const AI_LOGICS_MAP = locMod.AI_LOGICS_MAP || {};

  const categories = Object.keys(PROMPT_FRAMEWORKS);
  let totalFrameworks = 0;
  let totalSubcategories = 0;
  const seenNames = new Map();
  const categoryCounts = {};

  const invalidToolTypes = [];
  const emptyAiLogic = [];
  const missingFwNames = [];
  const missingEnToIdNames = [];
  const missingDescriptions = [];
  const missingAiLogicsMap = [];
  const duplicateNames = [];

  for (const cat of categories) {
    const subcats = PROMPT_FRAMEWORKS[cat];
    const subcatKeys = Object.keys(subcats);
    totalSubcategories += subcatKeys.length;
    let catCount = 0;

    for (const subcat of subcatKeys) {
      const fws = subcats[subcat];
      for (const [fwName, fw] of Object.entries(fws)) {
        totalFrameworks++;
        catCount++;

        if (seenNames.has(fwName)) {
          duplicateNames.push(`${fwName} (in "${cat} > ${subcat}" and "${seenNames.get(fwName)}")`);
        } else {
          seenNames.set(fwName, `${cat} > ${subcat}`);
        }

        if (!fw.toolType || !VALID_TOOL_TYPES.has(fw.toolType)) {
          invalidToolTypes.push(`${fwName}: toolType="${fw.toolType}"`);
        }

        if (typeof fw.ai_logic_description !== 'string' || fw.ai_logic_description.trim().length === 0) {
          emptyAiLogic.push(fwName);
        }

        const enName = FRAMEWORK_NAMES_MAP[fwName];
        if (!enName) {
          missingFwNames.push(fwName);
        } else if (!EN_TO_ID_FRAMEWORK_NAMES_MAP[enName] && !EN_TO_ID_FRAMEWORK_NAMES_MAP[fwName]) {
          missingEnToIdNames.push(`${fwName} -> ${enName}`);
        }

        if (!FRAMEWORK_DESCRIPTIONS_MAP[fwName] && !FRAMEWORK_DESCRIPTIONS_MAP[fw.description]) {
          missingDescriptions.push(fwName);
        }

        if (!AI_LOGICS_MAP[fwName] && (!enName || !AI_LOGICS_MAP[enName])) {
          missingAiLogicsMap.push(fwName);
        }
      }
    }
    categoryCounts[cat] = catCount;
  }

  console.log(`Categories: ${categories.length} | Subcategories: ${totalSubcategories} | Frameworks: ${totalFrameworks}`);
  for (const [cat, count] of Object.entries(categoryCounts)) {
    const expected = EXPECTED_CATEGORY_COUNTS[cat];
    const status = expected === count ? 'OK' : `MISMATCH (expected ${expected})`;
    console.log(`  - ${cat}: ${count} [${status}]`);
    if (expected !== undefined && expected !== count) {
      failures.push(`Category "${cat}" count is ${count}, expected ${expected}`);
    }
  }

  if (categories.length !== 8) {
    failures.push(`Expected 8 categories, found ${categories.length}`);
  }
  if (totalFrameworks !== 400) {
    failures.push(`Expected 400 total frameworks, found ${totalFrameworks}`);
  }
  if (duplicateNames.length > 0) {
    failures.push(`Duplicate framework names (${duplicateNames.length}): ${duplicateNames.join('; ')}`);
  }
  if (invalidToolTypes.length > 0) {
    failures.push(`Invalid toolType (${invalidToolTypes.length}): ${invalidToolTypes.join('; ')}`);
  }
  if (emptyAiLogic.length > 0) {
    failures.push(`Empty ai_logic_description (${emptyAiLogic.length}): ${emptyAiLogic.slice(0, 10).join('; ')}`);
  }
  if (missingFwNames.length > 0) {
    failures.push(`Missing in FRAMEWORK_NAMES_MAP (${missingFwNames.length}): ${missingFwNames.slice(0, 10).join('; ')}`);
  }
  if (missingEnToIdNames.length > 0) {
    warnings.push(`Missing in EN_TO_ID_FRAMEWORK_NAMES_MAP (${missingEnToIdNames.length}): ${missingEnToIdNames.slice(0, 5).join('; ')}`);
  }
  if (missingDescriptions.length > 0) {
    failures.push(`Missing in FRAMEWORK_DESCRIPTIONS_MAP (${missingDescriptions.length}): ${missingDescriptions.slice(0, 10).join('; ')}`);
  }
  if (missingAiLogicsMap.length > 0) {
    warnings.push(`Missing explicit AI_LOGICS_MAP entry (${missingAiLogicsMap.length}): ${missingAiLogicsMap.slice(0, 5).join('; ')}`);
  }

  // 2. Validate agensi-skills/*/SKILL.md
  console.log('\n--- Agensi Skills Frontmatter Audit ---');
  const skillsRoot = path.join(ROOT, 'agensi-skills');
  if (!fs.existsSync(skillsRoot)) {
    failures.push('Missing agensi-skills/ directory');
  } else {
    const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true }).filter(d => d.isDirectory());
    if (skillDirs.length !== 10) {
      failures.push(`Expected 10 packages in agensi-skills/, found ${skillDirs.length}`);
    }
    const nameRegex = /^[a-z0-9-]+$/;
    for (const dir of skillDirs) {
      const skillMdPath = path.join(skillsRoot, dir.name, 'SKILL.md');
      if (!fs.existsSync(skillMdPath)) {
        failures.push(`Missing SKILL.md in agensi-skills/${dir.name}`);
        continue;
      }
      const raw = fs.readFileSync(skillMdPath, 'utf8');
      const parsed = parseSimpleYamlFrontmatter(raw);
      if (!parsed) {
        failures.push(`Invalid or missing YAML frontmatter in agensi-skills/${dir.name}/SKILL.md`);
        continue;
      }
      const { frontmatter, body } = parsed;
      const skillName = frontmatter.name || '';
      const desc = frontmatter.description || '';
      const license = frontmatter.license || '';
      const metadata = frontmatter.metadata;

      const skillErrs = [];
      if (!skillName || !nameRegex.test(skillName) || skillName.length > 64 || skillName.startsWith('-') || skillName.endsWith('-')) {
        skillErrs.push(`invalid name "${skillName}"`);
      }
      if (skillName !== dir.name) {
        skillErrs.push(`name "${skillName}" does not match folder "${dir.name}"`);
      }
      if (!desc || desc.length > 1024) {
        skillErrs.push(`invalid description length ${desc.length}`);
      }
      if (!license) {
        skillErrs.push('missing license');
      }
      if (!metadata || typeof metadata !== 'object' || !metadata.author || !metadata.version) {
        skillErrs.push('missing metadata.author or metadata.version');
      }
      if (!body || body.trim().length < 50) {
        skillErrs.push('empty or overly short markdown body');
      }

      if (skillErrs.length > 0) {
        failures.push(`agensi-skills/${dir.name}/SKILL.md: ${skillErrs.join(', ')}`);
        console.log(`  [FAIL] ${dir.name}: ${skillErrs.join(', ')}`);
      } else {
        console.log(`  [PASS] ${dir.name} (name=${skillName}, desc=${desc.length} chars, license=${license}, v=${metadata.version})`);
      }
    }
  }

  // 3. Em-dash ('\u2014') check across agensi-skills/ and UI/service files
  console.log('\n--- Em-Dash, Buzzword & Stale Count Audit ---');
  const emDashFilesToScan = [
    ...collectFilesRecursive(path.join(ROOT, 'agensi-skills')),
    path.join(ROOT, 'config', 'agensiConfig.ts'),
    path.join(ROOT, 'services', 'agentSkillService.ts'),
    path.join(ROOT, 'services', 'aiSettingsService.ts'),
    path.join(ROOT, 'services', 'localizationService.ts'),
    path.join(ROOT, 'services', 'sampleDataService.ts'),
    path.join(ROOT, 'services', 'skillZipService.ts'),
    path.join(ROOT, 'services', 'visualBenchmarkService.ts'),
    path.join(ROOT, 'components', 'AgentSkillViewer.tsx'),
    path.join(ROOT, 'components', 'AgensiCatalogModal.tsx'),
    path.join(ROOT, 'components', 'AgensiSkillPromoCard.tsx'),
    path.join(ROOT, 'components', 'AISettingsModal.tsx'),
    path.join(ROOT, 'components', 'CleanJsonViewer.tsx'),
    path.join(ROOT, 'components', 'TemplateGallery.tsx'),
    path.join(ROOT, 'data', 'aiPlatforms.ts'),
    path.join(ROOT, 'data', 'frameworks.ts'),
    path.join(ROOT, 'scripts', 'package-agensi-skills.mjs'),
    path.join(ROOT, 'scripts', 'package-multi-channels.mjs'),
    path.join(ROOT, 'translations.ts'),
    path.join(ROOT, 'App.tsx'),
    path.join(ROOT, 'docs', 'AgensiMarketplacePlaybook.md'),
  ];

  let emDashHits = 0;
  for (const filePath of emDashFilesToScan) {
    if (!fs.existsSync(filePath)) {
      failures.push(`Expected file missing: ${path.relative(ROOT, filePath)}`);
      continue;
    }
    const hits = findLineViolations(filePath, (line) =>
      line.includes(EMDASH) ? 'Contains em-dash (U+2014)' : null
    );
    if (hits.length > 0) {
      emDashHits += hits.length;
      const rel = path.relative(ROOT, filePath);
      failures.push(`${rel} has ${hits.length} em-dash line(s): lines ${hits.map(h => h.line).join(', ')}`);
    }
  }
  console.log(`  Em-dash violations across ${emDashFilesToScan.length} scanned files: ${emDashHits}`);

  // 4. Buzzwords & stale 360 counts in key UI/SEO/docs files
  const uiSeoFiles = [
    'App.tsx',
    'components/TemplateGallery.tsx',
    'components/AgentSkillViewer.tsx',
    'components/AgensiCatalogModal.tsx',
    'components/AgensiSkillPromoCard.tsx',
    'components/AISettingsModal.tsx',
    'components/CleanJsonViewer.tsx',
    'services/skillZipService.ts',
    'scripts/package-agensi-skills.mjs',
    'scripts/package-multi-channels.mjs',
    'translations.ts',
    'index.html',
    'README.md',
    'prd.md',
    'docs/AgensiMarketplacePlaybook.md',
    'public/manifest.json',
    'public/og-preview.svg',
    'CHANGELOG.md',
    'updates.md',
    'release-notes.md',
  ];

  let buzzwordHits = 0;
  let stale360Hits = 0;
  for (const rel of uiSeoFiles) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      failures.push(`Expected UI/SEO/doc file missing: ${rel}`);
      continue;
    }
    const raw = fs.readFileSync(abs, 'utf8');
    const lines = raw.split(/\r?\n/);
    const isReleaseLog = rel === 'CHANGELOG.md' || rel === 'updates.md' || rel === 'release-notes.md';
    let inLegacyLogSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isReleaseLog && /^##\s+(\[?V?7\.[01]\.0\]?|\[?V?[1-6]\.)/i.test(line.trim())) {
        inLegacyLogSection = true;
      }
      if (inLegacyLogSection) continue;

      for (const bw of BANNED_BUZZWORDS) {
        bw.regex.lastIndex = 0;
        if (bw.regex.test(line)) {
          buzzwordHits++;
          failures.push(`${rel}:${i + 1} contains banned buzzword "${bw.label}"`);
        }
      }
      // Check for stale "360" framework counts (exclude historical expansion phrasing in prd/release logs)
      const isHistoricalExpansion =
        (rel === 'prd.md' || isReleaseLog) &&
        /V7\.[01]|V6\.|270\s*->\s*360|360\s*->\s*400|dari 360 menjadi 400|from 360 to \*{0,2}400/i.test(line);
      if (!isHistoricalExpansion && /\b360\b/.test(line)) {
        stale360Hits++;
        failures.push(`${rel}:${i + 1} contains stale "360": ${line.trim().slice(0, 100)}`);
      }
      if (
        line.includes(EMDASH) &&
        (rel === 'index.html' ||
          rel === 'README.md' ||
          rel === 'prd.md' ||
          rel === 'public/manifest.json' ||
          rel === 'public/og-preview.svg' ||
          isReleaseLog)
      ) {
        failures.push(`${rel}:${i + 1} contains em-dash (U+2014)`);
      }
    }
  }

  // 5. Verify package.json version, public/sw.js cache version, and synced catalog docs
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (pkg.version !== '7.2.1') {
    failures.push(`package.json version is "${pkg.version}", expected "7.2.1"`);
  }
  const swContent = fs.readFileSync(path.join(ROOT, 'public/sw.js'), 'utf8');
  if (!swContent.includes('promptmatrix-v7.2.1')) {
    failures.push('public/sw.js missing CACHE_NAME "promptmatrix-v7.2.1"');
  }
  for (const catalogRel of ['docs/DaftarKerangkaKerja.md', 'public/docs/DaftarKerangkaKerja.md']) {
    const catalogAbs = path.join(ROOT, catalogRel);
    if (!fs.existsSync(catalogAbs)) {
      failures.push(`Missing catalog doc: ${catalogRel}`);
    } else {
      const catText = fs.readFileSync(catalogAbs, 'utf8');
      if (!catText.includes('400')) {
        failures.push(`${catalogRel} does not reference 400 frameworks`);
      }
    }
  }
  console.log(`  Banned buzzword violations: ${buzzwordHits}`);
  console.log(`  Stale '360' references: ${stale360Hits}`);

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const w of warnings) console.log(`  [WARN] ${w}`);
  }

  console.log('\n=== Summary ===');
  if (failures.length > 0) {
    console.error(`FAILED with ${failures.length} error(s):`);
    for (const f of failures) console.error(`  [FAIL] ${f}`);
    process.exit(1);
  } else {
    console.log('ALL CHECKS PASSED (400 frameworks, 8 categories, 100% localization, 10 valid SKILL.md packages, 0 em-dashes, 0 buzzwords, 0 stale 360 counts).');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
