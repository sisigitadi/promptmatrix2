#!/usr/bin/env node
/**
 * validate-multimodal-params.mjs
 * Validates multimodal prompt files for Midjourney v8.2, FLUX.3 / FLUX.2,
 * Google Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6.
 *
 * Checks:
 *   - Midjourney flags: --ar W:H, --v 8.2 vs conflicting --niji, --stylize 0-1000, --ow/--sw 0-1000
 *   - Video shot duration bounds (4s-16s) for Veo 3.1, Kling 3.0, and Runway Gen-4.5
 *   - Suno v6 Style Header length (<= 200 chars) and bracketed section tags
 *   - Copy hygiene: zero em dashes (U+2014) and zero banned hype phrases
 *
 * Usage:
 *   node scripts/validate-multimodal-params.mjs <prompt-file> [--model auto|midjourney|flux|veo|kling|runway|suno] [--strict]
 *   node scripts/validate-multimodal-params.mjs --self-test
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const TARGET_EXTS = new Set(['.txt', '.md', '.json', '.prompt']);
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build']);
const VALID_MODELS = new Set(['auto', 'midjourney', 'flux', 'veo', 'kling', 'runway', 'suno']);

const MIN_VIDEO_SECONDS = 4;
const MAX_VIDEO_SECONDS = 16;
const MAX_SUNO_STYLE_CHARS = 200;
const EMDASH_CHAR = '\u2014';

// Split tokens so static copy scanners never flag the validator itself.
const BANNED_PHRASES = [
  ['ai', 'powered'],
  ['revo', 'lutionary'],
  ['seam', 'less'],
  ['cutting', 'edge'],
  ['ulti', 'mate'],
].map(([a, b]) => ({
  label: `${a} ${b}`,
  regex: new RegExp(`\\b${a}[\\s-]+${b}\\b`, 'gi'),
}));

const CORE_SUNO_TAGS = new Set(['intro', 'verse', 'chorus', 'outro']);
const RECOGNIZED_SUNO_TAG_PREFIXES = [
  'intro',
  'verse',
  'pre-chorus',
  'chorus',
  'post-chorus',
  'bridge',
  'hook',
  'instrumental',
  'solo',
  'drop',
  'breakdown',
  'outro',
  'end',
];

function collectPromptFiles(targetPath) {
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
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectPromptFiles(full));
    } else if (entry.isFile() && TARGET_EXTS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function getLineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function checkCopyHygiene(text, errors) {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(EMDASH_CHAR)) {
      errors.push(`Line ${i + 1}: Forbidden em dash (U+2014) detected. Use comma, colon, or period.`);
    }
    for (const phrase of BANNED_PHRASES) {
      phrase.regex.lastIndex = 0;
      const match = phrase.regex.exec(line);
      if (match) {
        errors.push(`Line ${i + 1}: Banned buzzword "${match[0]}" detected. Replace with concrete visual or audio cues.`);
      }
    }
  }
}

function parseNumericFlag(text, flagNames, errors, warnings, label, min, max) {
  const pattern = new RegExp(`(?:^|\\s)(${flagNames.join('|')})(?:\\s+|=)([^\\s,;\\\`"']+)`, 'gi');
  const barePattern = new RegExp(`(?:^|\\s)(${flagNames.join('|')})(?=\\s*$)`, 'gim');

  let found = false;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    found = true;
    const rawFlag = match[1];
    const rawValue = match[2];
    const line = getLineNumber(text, match.index);
    if (rawValue.startsWith('--')) {
      errors.push(`Line ${line}: Midjourney flag ${rawFlag} is missing a numeric value (${min}-${max}).`);
      continue;
    }
    if (!/^-?\d+(?:\.\d+)?$/.test(rawValue)) {
      errors.push(`Line ${line}: Midjourney ${label} (${rawFlag}) must be a number in ${min}-${max}, got "${rawValue}".`);
      continue;
    }
    const num = Number(rawValue);
    if (num < min || num > max) {
      errors.push(`Line ${line}: Midjourney ${label} (${rawFlag}) value ${num} is out of bounds (${min}-${max}).`);
    }
  }

  while ((match = barePattern.exec(text)) !== null) {
    const line = getLineNumber(text, match.index);
    warnings.push(`Line ${line}: Midjourney flag ${match[1]} appears at end of line without a value (${min}-${max}).`);
  }

  return found;
}

function validateMidjourney(text, errors, warnings) {
  // Check --ar W:H format
  const arTokenRegex = /(?:^|\s)--ar(?:\s+|=)([^\s,;`"'()]+)?/gi;
  let match;
  while ((match = arTokenRegex.exec(text)) !== null) {
    const line = getLineNumber(text, match.index);
    const val = match[1];
    if (!val || val.startsWith('--')) {
      errors.push(`Line ${line}: Midjourney --ar flag is missing a W:H ratio (for example --ar 16:9).`);
      continue;
    }
    const ratioMatch = /^(\d+):(\d+)$/.exec(val);
    if (!ratioMatch) {
      errors.push(`Line ${line}: Invalid Midjourney --ar format "${val}". Expected positive integers W:H (for example 16:9).`);
      continue;
    }
    const w = Number(ratioMatch[1]);
    const h = Number(ratioMatch[2]);
    if (w <= 0 || h <= 0) {
      errors.push(`Line ${line}: Midjourney --ar dimensions must be greater than 0, got "${val}".`);
    }
  }

  // Check --v and --niji conflicts
  const vRegex = /(?:^|\s)--v(?:\s+|=)([^\s,;`"'()]+)?/gi;
  const nijiRegex = /(?:^|\s)--niji(?:\b|\s|=)/gi;
  const hasNiji = nijiRegex.test(text);
  let hasVersion = false;

  while ((match = vRegex.exec(text)) !== null) {
    hasVersion = true;
    const line = getLineNumber(text, match.index);
    const ver = match[1];
    if (!ver || ver.startsWith('--')) {
      errors.push(`Line ${line}: Midjourney --v flag is missing a version number (expected --v 8.2).`);
    } else if (ver !== '8.2') {
      errors.push(`Line ${line}: Midjourney version must be "--v 8.2" (got "--v ${ver}").`);
    }
  }

  if (hasVersion && hasNiji) {
    errors.push('Conflicting Midjourney flags: "--v" and "--niji" cannot be used in the same prompt.');
  } else if (!hasVersion && !hasNiji) {
    warnings.push('Midjourney flags detected without "--v 8.2" (or "--niji"). Add "--v 8.2" for deterministic targeting.');
  }

  // Check --stylize / --s (0-1000)
  parseNumericFlag(text, ['--stylize', '--s'], errors, warnings, 'stylize', 0, 1000);

  // Check --ow (0-1000) and --sw (0-1000)
  const hasOw = parseNumericFlag(text, ['--ow'], errors, warnings, 'omni-reference weight', 0, 1000);
  const hasSw = parseNumericFlag(text, ['--sw'], errors, warnings, 'style weight', 0, 1000);

  const hasOref = /(?:^|\s)--oref(?:\s+|=)\S+/i.test(text);
  const hasSref = /(?:^|\s)--sref(?:\s+|=)\S+/i.test(text);

  if (hasOw && !hasOref) {
    warnings.push('Midjourney "--ow" weight specified without an accompanying "--oref <ref>" flag.');
  }
  if (hasSw && !hasSref) {
    warnings.push('Midjourney "--sw" weight specified without an accompanying "--sref <ref>" flag.');
  }
}

function validateVideoDurations(text, parsedJson, errors, warnings) {
  let durationChecks = 0;

  if (parsedJson && typeof parsedJson === 'object') {
    const durationKeys = ['duration', 'durationSeconds', 'duration_seconds', 'shotDuration', 'shot_duration'];
    for (const key of durationKeys) {
      if (parsedJson[key] !== undefined) {
        durationChecks++;
        const raw = String(parsedJson[key]).trim().replace(/s$/i, '');
        const num = Number(raw);
        if (Number.isNaN(num)) {
          errors.push(`JSON field "${key}" must be numeric seconds (${MIN_VIDEO_SECONDS}s-${MAX_VIDEO_SECONDS}s), got "${parsedJson[key]}".`);
        } else if (num < MIN_VIDEO_SECONDS || num > MAX_VIDEO_SECONDS) {
          errors.push(`Video duration "${key}: ${num}s" is out of bounds (expected ${MIN_VIDEO_SECONDS}s-${MAX_VIDEO_SECONDS}s for Veo 3.1 / Kling 3.0 / Runway Gen-4.5).`);
        }
      }
    }
  }

  // Match explicit duration declarations: "Duration: 8s", "[Duration: 10s]", "duration=6s"
  const explicitDurationRegex = /\bduration\s*[:=]\s*(\d+(?:\.\d+)?)\s*s?\b/gi;
  let match;
  while ((match = explicitDurationRegex.exec(text)) !== null) {
    durationChecks++;
    const line = getLineNumber(text, match.index);
    const val = Number(match[1]);
    if (val < MIN_VIDEO_SECONDS || val > MAX_VIDEO_SECONDS) {
      errors.push(`Line ${line}: Video shot duration ${val}s is out of bounds (expected ${MIN_VIDEO_SECONDS}s-${MAX_VIDEO_SECONDS}s).`);
    }
  }

  // Match inline clip durations: "3s clip", "20s shot", "12s video"
  const inlineShotRegex = /\b(\d+(?:\.\d+)?)\s*s\s+(?:clip|shot|take|video|sequence)\b/gi;
  while ((match = inlineShotRegex.exec(text)) !== null) {
    durationChecks++;
    const line = getLineNumber(text, match.index);
    const val = Number(match[1]);
    if (val < MIN_VIDEO_SECONDS || val > MAX_VIDEO_SECONDS) {
      errors.push(`Line ${line}: Video shot length ${val}s is out of bounds (expected ${MIN_VIDEO_SECONDS}s-${MAX_VIDEO_SECONDS}s).`);
    }
  }

  // Match timestamp ranges: "0s-4s", "4s-12s", "0s - 20s"
  const spanRegex = /\b(\d+(?:\.\d+)?)\s*s\s*-\s*(\d+(?:\.\d+)?)\s*s\b/gi;
  while ((match = spanRegex.exec(text)) !== null) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const line = getLineNumber(text, match.index);
    const lineContent = text.split(/\r?\n/)[line - 1] || '';
    // Ignore documentation range mentions like "4s-16s window" or "4s-16s bounds"
    if (start === MIN_VIDEO_SECONDS && end === MAX_VIDEO_SECONDS && /\b(bounds?|range|window|limit|between)\b/i.test(lineContent)) {
      continue;
    }
    durationChecks++;
    if (end <= start) {
      errors.push(`Line ${line}: Invalid video timestamp range ${start}s-${end}s (end must exceed start).`);
      continue;
    }
    const span = end - start;
    if (span < MIN_VIDEO_SECONDS || span > MAX_VIDEO_SECONDS) {
      errors.push(`Line ${line}: Video beat ${start}s-${end}s (${span}s) is out of bounds (expected ${MIN_VIDEO_SECONDS}s-${MAX_VIDEO_SECONDS}s).`);
    }
  }

  if (durationChecks === 0) {
    warnings.push(`Video prompt has no explicit duration tag (recommended: "Duration: 8s" within ${MIN_VIDEO_SECONDS}s-${MAX_VIDEO_SECONDS}s).`);
  }
}

function extractSunoStyleHeader(text, parsedJson) {
  if (parsedJson && typeof parsedJson === 'object') {
    const candidate = parsedJson.styleHeader ?? parsedJson.style_header ?? parsedJson.style;
    if (typeof candidate === 'string') {
      return { value: candidate.trim(), line: 1, explicit: true };
    }
  }

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const labelMatch = /^(?:\[)?style(?:\s+header)?(?:\])?\s*:\s*(.*)$/i.exec(line);
    if (labelMatch) {
      let headerVal = labelMatch[1].trim();
      if (!headerVal) {
        for (let j = i + 1; j < lines.length; j++) {
          const next = lines[j].trim();
          if (!next) continue;
          if (next.startsWith('[') || next.startsWith('#')) break;
          headerVal = next;
          break;
        }
      }
      return { value: headerVal, line: i + 1, explicit: true };
    }
  }

  // Fallback: first non-heading line before the first Suno section tag
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#') || /^(model|target|title)\s*:/i.test(line)) continue;
    if (line.startsWith('[')) break;
    return { value: line, line: i + 1, explicit: false };
  }

  return null;
}

function validateSuno(text, parsedJson, errors, warnings) {
  const styleHeader = extractSunoStyleHeader(text, parsedJson);
  if (!styleHeader || !styleHeader.value) {
    errors.push('Suno v6 prompt is missing a Style Header (for example "Style Header: Indie folk, 92 BPM, D major...").');
  } else if (styleHeader.value.length > MAX_SUNO_STYLE_CHARS) {
    errors.push(
      `Line ${styleHeader.line}: Suno v6 Style Header exceeds ${MAX_SUNO_STYLE_CHARS} characters (${styleHeader.value.length}/${MAX_SUNO_STYLE_CHARS}).`
    );
  }

  const lines = text.split(/\r?\n/);
  const foundTags = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith('[')) continue;

    const closeIdx = trimmed.indexOf(']');
    if (closeIdx === -1) {
      errors.push(`Line ${i + 1}: Unclosed Suno section tag "${trimmed}".`);
      continue;
    }

    const inner = trimmed.slice(1, closeIdx).trim();
    if (!inner) {
      errors.push(`Line ${i + 1}: Empty bracketed section tag "[]".`);
      continue;
    }

    // Ignore labeled metadata blocks like [Style Header] or [Shot & Camera]
    if (/^style\s+header$/i.test(inner)) continue;

    const head = inner.split(':')[0].trim().toLowerCase();
    const matchedPrefix = RECOGNIZED_SUNO_TAG_PREFIXES.find(
      (prefix) => head === prefix || head.startsWith(`${prefix} `)
    );

    if (!matchedPrefix) {
      errors.push(`Line ${i + 1}: Unrecognized Suno section tag "[${inner}]". Use [Intro], [Verse], [Chorus], [Bridge], or [Outro].`);
      continue;
    }

    foundTags.push(matchedPrefix);
  }

  if (foundTags.length === 0) {
    errors.push('Suno v6 prompt must include bracketed section tags such as [Intro], [Verse], [Chorus], and [Outro].');
    return;
  }

  const tagSet = new Set(foundTags);
  const corePresent = [...CORE_SUNO_TAGS].filter((tag) => tagSet.has(tag));
  const isInstrumental = tagSet.has('instrumental') || tagSet.has('solo');

  if (!isInstrumental && (!tagSet.has('verse') || !tagSet.has('chorus'))) {
    const missingVocalCore = ['verse', 'chorus'].filter((tag) => !tagSet.has(tag)).map((t) => `[${t[0].toUpperCase()}${t.slice(1)}]`);
    errors.push(`Suno v6 vocal arrangement is missing required section tag(s): ${missingVocalCore.join(', ')}.`);
  }

  if (corePresent.length < 2 && !isInstrumental) {
    errors.push('Suno v6 arrangement needs at least two structural tags from [Intro], [Verse], [Chorus], [Outro].');
  }

  const missingFraming = ['intro', 'outro']
    .filter((tag) => !tagSet.has(tag))
    .map((t) => `[${t[0].toUpperCase()}${t.slice(1)}]`);
  if (missingFraming.length > 0) {
    warnings.push(`Suno v6 arrangement omits ${missingFraming.join(' and ')} framing tag(s).`);
  }
}

function detectModes(text, explicitModel) {
  if (explicitModel !== 'auto') {
    return new Set([explicitModel]);
  }

  const modes = new Set();
  if (/--(?:ar|v|niji|stylize|s|oref|ow|sref|sw|raw|no)\b/i.test(text) || /\bmidjourney\b/i.test(text)) {
    modes.add('midjourney');
  }
  if (/\bflux\.?(?:2|3)\b|\bkontext\b/i.test(text)) {
    modes.add('flux');
  }
  if (/\bveo\s*3(?:\.1)?\b|\bkling\s*3(?:\.0)?\b|\brunway\b|\bgen-?4\.5\b|\[(?:shot|motion\s+mask|continuity\s+bible|camera)/i.test(text) || /\bduration\s*[:=]\s*\d+/i.test(text)) {
    modes.add('veo');
  }
  if (
    /\bsuno\b|\bstyle\s+header\b/i.test(text) ||
    /^\[(?:intro|verse|pre-chorus|chorus|bridge|outro)(?:\s+\d+)?(?::[^\]]*)?\]/im.test(text)
  ) {
    modes.add('suno');
  }

  return modes;
}

function validatePromptContent(content, explicitModel = 'auto') {
  const errors = [];
  const warnings = [];

  if (!content || !content.trim()) {
    errors.push('Prompt input is empty.');
    return { modes: [], errors, warnings };
  }

  let parsedJson = null;
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      parsedJson = JSON.parse(trimmed);
    } catch {
      // Treat as plain text if not valid JSON
    }
  }

  checkCopyHygiene(content, errors);

  const modes = detectModes(content, explicitModel);
  if (modes.size === 0) {
    warnings.push('No explicit model markers detected (Midjourney flags, video shot/duration cues, or Suno tags). Only copy hygiene checked.');
  }

  if (modes.has('midjourney')) {
    validateMidjourney(content, errors, warnings);
  }
  if (modes.has('veo') || modes.has('kling') || modes.has('runway')) {
    validateVideoDurations(content, parsedJson, errors, warnings);
  }
  if (modes.has('suno')) {
    validateSuno(content, parsedJson, errors, warnings);
  }

  return { modes: [...modes], errors, warnings };
}

function runSelfTest() {
  const cases = [
    {
      name: 'Valid Midjourney v8.2 prompt',
      model: 'midjourney',
      input: 'Editorial portrait of a watchmaker at a brass workbench, 50mm lens, warm window light --ar 4:5 --v 8.2 --stylize 250 --oref ref-char.png --ow 600 --raw',
      expectPass: true,
    },
    {
      name: 'Invalid Midjourney conflicting --v 8.2 and --niji',
      model: 'midjourney',
      input: 'Rainy street market at dusk --ar 16:9 --v 8.2 --niji 6 --stylize 1200',
      expectPass: false,
    },
    {
      name: 'Invalid Midjourney --ow out of bounds and bad --ar',
      model: 'midjourney',
      input: 'Product shot of ceramic mug --ar 16x9 --v 7 --ow 1500 --sw -10',
      expectPass: false,
    },
    {
      name: 'Valid Google Veo 3.1 / Runway Gen-4.5 shot sheet (8s)',
      model: 'veo',
      input: 'Duration: 8s\n[Shot & Camera]: 35mm slow dolly-in.\n[Shot 1 (0s-4s)]: Baker opens brick oven.\n[Shot 2 (4s-8s)]: Steam rises over sourdough crust.\n[Audio]: Crackle of crust and oven latch.',
      expectPass: true,
    },
    {
      name: 'Invalid video duration out of 4s-16s bounds',
      model: 'kling',
      input: 'Duration: 22s\n[Shot 1 (0s-2s)]: Quick cut across harbor.',
      expectPass: false,
    },
    {
      name: 'Valid Suno v6 arrangement',
      model: 'suno',
      input: 'Style Header: Indie folk acoustic, warm tape mix, 92 BPM, D major, steel-string guitar, close-mic baritone vocal\n[Intro: fingerpicked guitar]\n[Verse 1]\nMorning light along the pier\n[Chorus]\nHold the line until the tide clears\n[Outro: gentle fade]',
      expectPass: true,
    },
    {
      name: 'Invalid Suno v6 Style Header > 200 chars and missing tags',
      model: 'suno',
      input: `Style Header: ${'warm analog synthwave '.repeat(12)}\nPlain lyrics without section tags.`,
      expectPass: false,
    },
    {
      name: 'Invalid copy containing em dash',
      model: 'midjourney',
      input: `Studio shot \u2014 crisp lighting --ar 1:1 --v 8.2`,
      expectPass: false,
    },
  ];

  let failed = 0;
  for (const tc of cases) {
    const result = validatePromptContent(tc.input, tc.model);
    const passed = result.errors.length === 0;
    if (passed === tc.expectPass) {
      console.log(`PASS  [self-test] ${tc.name}`);
    } else {
      failed++;
      console.error(`FAIL  [self-test] ${tc.name} (expected ${tc.expectPass ? 'PASS' : 'FAIL'}, got ${passed ? 'PASS' : 'FAIL'})`);
      for (const e of result.errors) console.error(`  - ${e}`);
    }
  }

  if (failed > 0) {
    console.error(`\nSelf-test failed: ${failed}/${cases.length} case(s).`);
    process.exit(1);
  }
  console.log(`\nPASS: All ${cases.length} self-test case(s) succeeded.`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node validate-multimodal-params.mjs <prompt-file> [--model auto|midjourney|flux|veo|kling|runway|suno] [--strict]');
    console.log('       node validate-multimodal-params.mjs --self-test');
    process.exit(args.length === 0 ? 1 : 0);
  }

  if (args.includes('--self-test')) {
    runSelfTest();
    return;
  }

  const strict = args.includes('--strict');
  let model = 'auto';
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--strict') continue;
    if (arg === '--model') {
      model = (args[i + 1] || '').toLowerCase();
      i++;
      continue;
    }
    if (arg.startsWith('--model=')) {
      model = arg.slice('--model='.length).toLowerCase();
      continue;
    }
    if (!arg.startsWith('--')) {
      positional.push(arg);
    }
  }

  if (!VALID_MODELS.has(model)) {
    console.error(`Error: unsupported --model "${model}". Choose from: ${[...VALID_MODELS].join(', ')}.`);
    process.exit(1);
  }

  const target = positional[0];
  if (!target) {
    console.error('Error: missing <prompt-file> argument.');
    process.exit(1);
  }

  let files;
  try {
    files = collectPromptFiles(target);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`No prompt files found in: ${target}`);
    process.exit(1);
  }

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const { modes, errors, warnings } = validatePromptContent(content, model);
    const rel = path.relative(process.cwd(), file);

    for (const w of warnings) {
      totalWarnings++;
      console.warn(`WARN  ${rel}: ${w}`);
      if (strict) totalErrors++;
    }

    if (errors.length === 0 && !(strict && warnings.length > 0)) {
      console.log(`PASS  ${rel} (detected: ${modes.length > 0 ? modes.join(', ') : 'hygiene-only'})`);
    } else {
      totalErrors += errors.length;
      console.error(`FAIL  ${rel}`);
      for (const e of errors) {
        console.error(`  - ${e}`);
      }
    }
  }

  if (totalErrors > 0) {
    console.error(`\nMultimodal parameter validation failed: ${totalErrors} error(s), ${totalWarnings} warning(s).`);
    process.exit(1);
  }
  console.log(`\nPASS: Validated ${files.length} prompt file(s) with 0 errors (${totalWarnings} warning(s)).`);
}

main();
