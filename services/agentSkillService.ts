import { Framework, FrameworkComponent } from '../data/frameworks';
import { Language } from '../types';
import { sanitizeString } from './jsonPromptService';
import {
  AI_LOGICS_MAP,
  translateCategoryName,
  translateComponentLabel,
  translateFrameworkDescription,
  translateFrameworkName,
  translateInfo,
  translateOption,
  translateSubcategoryName,
} from './localizationService';

export interface AgentSkillMetadata {
  author: string;
  version: string;
  source: string;
  category: string;
  language: Language;
  framework: string;
}

export interface AgentSkillSections {
  roleAndTrigger: string;
  inputParameters: string;
  executionSteps: string;
  verificationChecklist: string;
  fewShotReference?: string;
}

export interface AgentSkillSpec {
  name: string;
  description: string;
  license: string;
  compatibility: string;
  metadata: AgentSkillMetadata;
  body: string;
  sections: AgentSkillSections;
}

export interface SkillValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  nameLength: number;
  descriptionLength: number;
}

export interface SkillMarketAuditCheck {
  readonly id: string;
  readonly label: string;
  readonly passed: boolean;
  readonly detail: string;
}

export interface SkillMarketAuditOptions {
  readonly demoRequest?: string;
  readonly demoResult?: string;
  readonly tags?: readonly string[];
  readonly tagline?: string;
}

export interface SkillMarketAuditResult {
  readonly score: number;
  readonly passedCount: number;
  readonly totalCount: number;
  readonly checks: SkillMarketAuditCheck[];
}

export interface BuildAgentSkillInput {
  framework: Framework | null | undefined;
  frameworkName: string | null | undefined;
  category?: string | null;
  subcategory?: string | null;
  formValues: Record<string, string | number | boolean | string[]>;
  customOtherValues: Record<string, string>;
  compiledPrompt: string;
  language: Language;
  author?: string;
  version?: string;
}

const MAX_SKILL_NAME_LENGTH = 64;
const MAX_SKILL_DESCRIPTION_LENGTH = 1024;
const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Strips invisible chars, normalizes line breaks, and removes em dashes (R-02).
 */
const cleanSkillText = (text: string): string => {
  return sanitizeString(text)
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .trim();
};

/**
 * Truncates text cleanly on a word boundary so it never exceeds maxLength.
 */
const truncateCleanly = (text: string, maxLength: number): string => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  const slice = normalized.slice(0, Math.max(0, maxLength - 3));
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > Math.floor(maxLength * 0.6) ? slice.slice(0, lastSpace) : slice;
  return `${cut.trim()}...`;
};

/**
 * Escapes a string value as a safe single-line YAML scalar.
 */
const formatYamlString = (value: string): string => {
  const singleLine = cleanSkillText(value).replace(/\s+/g, ' ').trim();
  const escaped = singleLine.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
};

/**
 * Converts any framework or template title into an Open Agent Skills valid kebab-case name.
 * Allowed chars: a-z, 0-9, and single hyphens. Max 64 chars, no leading/trailing hyphen.
 */
export const toKebabCaseSkillName = (name: string): string => {
  const normalized = cleanSkillText(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalized) {
    return 'promptmatrix-agent-skill';
  }

  const sliced = normalized.slice(0, MAX_SKILL_NAME_LENGTH).replace(/-+$/g, '');
  return sliced || 'promptmatrix-agent-skill';
};

/**
 * Extracts active components including dynamic subcomponents from a framework.
 */
const collectFrameworkComponents = (
  framework: Framework | null | undefined,
  formValues: Record<string, string | number | boolean | string[]>
): FrameworkComponent[] => {
  if (!framework) return [];

  let comps: FrameworkComponent[] = framework.components ? [...framework.components] : [];
  if (comps.length === 0 && framework.komponen_prompt?.['VARIABEL INPUT']) {
    comps = Object.entries(framework.komponen_prompt['VARIABEL INPUT']).map(([key, comp]) => ({
      ...comp,
      name: comp.name || key,
    }));
  }

  if (framework.dynamicSubcomponents) {
    const triggerKey = framework.dynamicSubcomponents.trigger;
    const triggerVal = String(formValues[triggerKey] ?? '');
    const dynamicOptions = framework.dynamicSubcomponents.options[triggerVal];
    if (triggerVal && Array.isArray(dynamicOptions)) {
      comps = [...comps, ...dynamicOptions];
    }
  }

  return comps;
};

/**
 * Converts active PromptMatrix framework state into an Open Agent Skills spec.
 */
export const buildAgentSkillSpec = (input: BuildAgentSkillInput): AgentSkillSpec => {
  const {
    framework,
    frameworkName,
    category,
    subcategory,
    formValues,
    customOtherValues,
    compiledPrompt,
    language,
    author = 'Sigit Adi (PromptMatrix)',
    version = '1.0.0',
  } = input;

  const rawFrameworkName = frameworkName || 'PromptMatrix Custom Skill';
  const displayFrameworkName = cleanSkillText(translateFrameworkName(rawFrameworkName, language));
  const skillName = toKebabCaseSkillName(rawFrameworkName);

  const rawCategory = category || 'General';
  const displayCategory = cleanSkillText(translateCategoryName(rawCategory, language));
  const displaySubcategory = subcategory
    ? cleanSkillText(translateSubcategoryName(subcategory, language))
    : '';

  // 1. Persona extraction
  let personaText = '';
  const rawLogic = framework?.ai_logic_description || framework?.logika_ai;
  if (rawLogic) {
    const strippedLogic = rawLogic
      .replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i, '')
      .trim();
    if (language === 'en') {
      personaText = cleanSkillText(
        AI_LOGICS_MAP[rawFrameworkName] || `AI Persona: ${translateInfo(strippedLogic, 'en')}`
      );
    } else {
      personaText = cleanSkillText(`Persona AI: ${strippedLogic}`);
    }
  }

  // 2. Framework description & discovery-optimized frontmatter description (<= 1024 chars)
  const rawDesc = framework?.description || '';
  const translatedDesc = cleanSkillText(
    translateFrameworkDescription(rawDesc, language, rawFrameworkName)
  );
  const categoryScope = displaySubcategory
    ? `${displayCategory} (${displaySubcategory})`
    : displayCategory;

  const triggerCue =
    language === 'id'
      ? `Gunakan skill ini saat pengguna membutuhkan workflow terstruktur untuk ${displayFrameworkName} pada domain ${categoryScope}.`
      : `Use this skill when the user needs a structured workflow for ${displayFrameworkName} in ${categoryScope}.`;

  const baseDesc = translatedDesc
    ? `${translatedDesc} ${triggerCue}`
    : `${displayFrameworkName} workflow skill. ${triggerCue}`;
  const description = truncateCleanly(cleanSkillText(baseDesc), MAX_SKILL_DESCRIPTION_LENGTH);

  // 3. Input parameters extraction (preserving filled values & custom "Other" inputs)
  const components = collectFrameworkComponents(framework, formValues);
  const paramLines: string[] = [];
  const seenKeys = new Set<string>();

  components.forEach((comp) => {
    seenKeys.add(comp.name);
    let val = formValues[comp.name];
    if (val === 'Lainnya...' || val === 'Other...') {
      const customVal = customOtherValues[comp.name];
      val = customVal ? `${val} (${customVal})` : val;
    }

    const label =
      language === 'en'
        ? cleanSkillText(translateComponentLabel(comp.label || comp.name, 'en'))
        : cleanSkillText(comp.label || comp.name);

    if (val !== undefined && val !== null && String(val).trim() !== '') {
      const formattedVal = Array.isArray(val)
        ? val.map((item) => cleanSkillText(String(item))).join(', ')
        : cleanSkillText(
            typeof val === 'string' && language === 'en' ? translateOption(val, 'en') : String(val)
          );
      paramLines.push(`- **${label}**: ${formattedVal}`);
    } else {
      const optionalTag = comp.optional
        ? language === 'id'
          ? 'opsional'
          : 'optional'
        : language === 'id'
          ? 'isi sesuai konteks'
          : 'provide per context';
      const placeholderHint = comp.placeholder ? ` (${cleanSkillText(comp.placeholder)})` : '';
      paramLines.push(`- **${label}**: _${optionalTag}_${placeholderHint}`);
    }
  });

  // Include any extra filled form keys not explicitly listed in components
  Object.entries(formValues).forEach(([key, val]) => {
    if (
      key === '__few_shot_input' ||
      key === '__few_shot_output' ||
      seenKeys.has(key) ||
      val === undefined ||
      val === null ||
      String(val).trim() === ''
    ) {
      return;
    }
    const formattedVal = Array.isArray(val)
      ? val.map((item) => cleanSkillText(String(item))).join(', ')
      : cleanSkillText(String(val));
    paramLines.push(`- **${cleanSkillText(key)}**: ${formattedVal}`);
  });

  // 4. Additional Instructions
  let additionalInstructions = '';
  if (framework?.konteks_tambahan_instruksi_khusus) {
    additionalInstructions = cleanSkillText(
      language === 'en'
        ? translateInfo(framework.konteks_tambahan_instruksi_khusus, 'en')
        : framework.konteks_tambahan_instruksi_khusus
    );
  }

  // 5. Few-Shot Reference
  const fewShotInput = formValues['__few_shot_input']
    ? cleanSkillText(String(formValues['__few_shot_input']))
    : '';
  const fewShotOutput = formValues['__few_shot_output']
    ? cleanSkillText(String(formValues['__few_shot_output']))
    : '';

  // 6. Build Playbook Sections
  const roleAndTriggerLines: string[] = [
    personaText ||
      (language === 'id'
        ? `Bertindak sebagai spesialis untuk menjalankan kerangka kerja ${displayFrameworkName}.`
        : `Act as a domain specialist executing the ${displayFrameworkName} workflow.`),
    '',
    language === 'id'
      ? `- **Pemicu Utama**: Aktifkan saat tugas berkaitan dengan ${displayFrameworkName} (${categoryScope}).`
      : `- **Trigger Condition**: Activate when the task involves ${displayFrameworkName} (${categoryScope}).`,
    language === 'id'
      ? `- **Format Keluaran Target**: ${framework?.output === 'json_prompt' ? 'JSON terstruktur sesuai kontrak' : 'Respons terstruktur sesuai parameter'}.`
      : `- **Target Output Format**: ${framework?.output === 'json_prompt' ? 'Structured JSON contract' : 'Structured response aligned with parameters'}.`,
  ];
  const roleAndTrigger = roleAndTriggerLines.join('\n');

  const inputParameters =
    paramLines.length > 0
      ? paramLines.join('\n')
      : language === 'id'
        ? '- Tidak ada parameter wajib; gunakan konteks permintaan pengguna secara langsung.'
        : '- No mandatory input variables; operate directly from the user request context.';

  const cleanCompiled = cleanSkillText(compiledPrompt);
  const executionStepsLines: string[] =
    language === 'id'
      ? [
          '1. Validasi seluruh parameter masukan dan klarifikasi bagian yang belum terisi jika krusial.',
          '2. Terapkan persona serta batasan instruksi di bawah ini secara konsisten.',
          '3. Susun keluaran akhir menggunakan struktur kerja berikut:',
        ]
      : [
          '1. Validate all input parameters and clarify missing critical constraints before proceeding.',
          '2. Apply the assigned role, constraints, and domain instructions consistently.',
          '3. Produce the final deliverable following the compiled prompt contract below:',
        ];

  if (additionalInstructions) {
    executionStepsLines.push('');
    executionStepsLines.push(
      language === 'id'
        ? `**Instruksi Khusus**: ${additionalInstructions}`
        : `**Additional Instructions**: ${additionalInstructions}`
    );
  }

  if (cleanCompiled) {
    executionStepsLines.push('');
    executionStepsLines.push('```text');
    executionStepsLines.push(cleanCompiled);
    executionStepsLines.push('```');
  }
  const executionSteps = executionStepsLines.join('\n');

  const verificationChecklist =
    language === 'id'
      ? [
          '- [ ] Seluruh parameter input utama telah tercermin pada hasil akhir.',
          '- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap pakai.',
          '- [ ] Batasan keamanan, privasi, dan konsistensi fakta telah diperiksa.',
        ].join('\n')
      : [
          '- [ ] Every filled input parameter is reflected accurately in the output.',
          '- [ ] Output format is clean, free of unresolved placeholders, and ready to use.',
          '- [ ] Constraints, edge cases, and factual accuracy have been verified.',
        ].join('\n');

  let fewShotReference: string | undefined;
  if (fewShotInput || fewShotOutput) {
    const fsParts: string[] = [];
    if (fewShotInput) {
      fsParts.push(language === 'id' ? '### Contoh Masukan' : '### Sample Input');
      fsParts.push('```text');
      fsParts.push(fewShotInput);
      fsParts.push('```');
    }
    if (fewShotOutput) {
      if (fsParts.length > 0) fsParts.push('');
      fsParts.push(language === 'id' ? '### Contoh Keluaran yang Diharapkan' : '### Expected Output');
      fsParts.push('```text');
      fsParts.push(fewShotOutput);
      fsParts.push('```');
    }
    fewShotReference = fsParts.join('\n');
  }

  const bodyParts: string[] = [
    `# ${displayFrameworkName}`,
    '',
    '## Role & Trigger',
    roleAndTrigger,
    '',
    '## Input Parameters',
    inputParameters,
    '',
    '## Execution Steps',
    executionSteps,
    '',
    '## Verification Checklist',
    verificationChecklist,
  ];

  if (fewShotReference) {
    bodyParts.push('', '## Few-Shot Reference', fewShotReference);
  }

  return {
    name: skillName,
    description,
    license: 'MIT',
    compatibility:
      'Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.',
    metadata: {
      author: cleanSkillText(author),
      version: cleanSkillText(version),
      source: 'PromptMatrix 2.0',
      category: displayCategory,
      language,
      framework: cleanSkillText(rawFrameworkName),
    },
    body: bodyParts.join('\n').trim(),
    sections: {
      roleAndTrigger,
      inputParameters,
      executionSteps,
      verificationChecklist,
      fewShotReference,
    },
  };
};

/**
 * Validates an AgentSkillSpec against Open Agent Skills frontmatter and body constraints.
 */
export const validateAgentSkillSpec = (spec: AgentSkillSpec): SkillValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const trimmedName = spec.name.trim();
  const trimmedDesc = spec.description.trim();
  const trimmedBody = spec.body.trim();

  if (!trimmedName) {
    errors.push('Skill name is required.');
  } else {
    if (trimmedName.length > MAX_SKILL_NAME_LENGTH) {
      errors.push(`Skill name exceeds ${MAX_SKILL_NAME_LENGTH} characters (${trimmedName.length}).`);
    }
    if (!KEBAB_CASE_REGEX.test(trimmedName)) {
      errors.push('Skill name must be lowercase kebab-case (a-z, 0-9, single hyphens only).');
    }
  }

  if (!trimmedDesc) {
    errors.push('Skill description is required.');
  } else if (trimmedDesc.length > MAX_SKILL_DESCRIPTION_LENGTH) {
    errors.push(
      `Skill description exceeds ${MAX_SKILL_DESCRIPTION_LENGTH} characters (${trimmedDesc.length}).`
    );
  }

  if (!trimmedBody) {
    errors.push('Skill Markdown body cannot be empty.');
  }

  if (!spec.license.trim()) {
    warnings.push('License field is empty; MIT is recommended.');
  }

  if (trimmedDesc.length > 0 && trimmedDesc.length < 40) {
    warnings.push('Description is short; include clearer trigger conditions for agent discovery.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    nameLength: trimmedName.length,
    descriptionLength: trimmedDesc.length,
  };
};

/**
 * Formats an AgentSkillSpec into a complete, valid SKILL.md document string.
 */
export const formatAgentSkillMarkdown = (spec: AgentSkillSpec): string => {
  const frontmatterLines = [
    '---',
    `name: ${spec.name}`,
    `description: ${formatYamlString(spec.description)}`,
    `license: ${spec.license || 'MIT'}`,
    `compatibility: ${formatYamlString(spec.compatibility)}`,
    'metadata:',
    `  author: ${formatYamlString(spec.metadata.author)}`,
    `  version: ${formatYamlString(spec.metadata.version)}`,
    `  source: ${formatYamlString(spec.metadata.source)}`,
    `  category: ${formatYamlString(spec.metadata.category)}`,
    `  language: ${formatYamlString(spec.metadata.language)}`,
    `  framework: ${formatYamlString(spec.metadata.framework)}`,
    '---',
  ];

  return `${frontmatterLines.join('\n')}\n\n${spec.body.trim()}\n`;
};

const MARKET_STOPWORD_TAGS = new Set(['and', 'the', 'for', 'with', 'from', 'into', 'your']);
const BANNED_AI_BUZZWORDS: readonly string[] = [
  'unlock',
  'elevate',
  'empower',
  'delve',
  'showcase',
  'testament',
  'landscape',
  'journey',
  'robust',
  'game-' + 'changer',
  'next-' + 'level',
  'next-' + 'generation',
  'seamless',
  'seamlessly',
  'cutting-' + 'edge',
  'revolutionary',
  'revolutionizing',
  'ultimate',
  'unleash',
  'tapestry',
];
const BANNED_AI_BUZZWORD_REGEX = new RegExp(`\\b(${BANNED_AI_BUZZWORDS.join('|')})\\b`, 'gi');

const REQUIRED_MARKET_SECTIONS: ReadonlyArray<{
  readonly heading: string;
  readonly pattern: RegExp;
}> = [
  { heading: 'Role & Trigger', pattern: /^##\s+Role\s*&\s*Trigger\b/im },
  { heading: 'Input Parameters', pattern: /^##\s+Input\s+Parameters\b/im },
  { heading: 'Execution Steps', pattern: /^##\s+Execution\s+Steps\b/im },
  { heading: 'Verification Checklist', pattern: /^##\s+Verification\s+Checklist\b/im },
];

/**
 * Audits an AgentSkillSpec and optional Agensi.io marketplace metadata for listing readiness.
 */
export const auditSkillMarketReadiness = (
  spec: AgentSkillSpec,
  options?: SkillMarketAuditOptions
): SkillMarketAuditResult => {
  const trimmedName = spec.name.trim();
  const trimmedDesc = spec.description.trim();
  const trimmedBody = spec.body.trim();
  const tagline = (options?.tagline ?? '').trim();
  const demoRequest = (options?.demoRequest ?? '').trim();
  const demoResult = (options?.demoResult ?? '').trim();
  const tags = options?.tags ?? [];

  const nameValid =
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_SKILL_NAME_LENGTH &&
    KEBAB_CASE_REGEX.test(trimmedName);

  const descValid = trimmedDesc.length >= 40 && trimmedDesc.length <= MAX_SKILL_DESCRIPTION_LENGTH;

  const missingSections = REQUIRED_MARKET_SECTIONS.filter(
    (section) => !section.pattern.test(trimmedBody)
  ).map((section) => section.heading);
  const sectionsValid = missingSections.length === 0;

  const combinedText = [
    trimmedName,
    trimmedDesc,
    spec.compatibility,
    trimmedBody,
    tagline,
    demoRequest,
    demoResult,
    tags.join(' '),
  ].join('\n');

  const emDashCount = (combinedText.match(/\u2014/g) || []).length;
  const zeroEmDashes = emDashCount === 0;

  const buzzwordMatches = Array.from(
    new Set(
      (combinedText.match(BANNED_AI_BUZZWORD_REGEX) || []).map((word) => word.toLowerCase())
    )
  );
  const zeroAiBuzzwords = buzzwordMatches.length === 0;

  const invalidTags = tags.filter((rawTag) => {
    const tag = rawTag.trim();
    return (
      !tag ||
      tag.startsWith('#') ||
      MARKET_STOPWORD_TAGS.has(tag.toLowerCase()) ||
      !KEBAB_CASE_REGEX.test(tag)
    );
  });
  const tagsCountValid = tags.length >= 3 && tags.length <= 7;
  const cleanTagsValid = tagsCountValid && invalidTags.length === 0;

  const taglinePresent = tagline.length > 0;
  const demoRequestValid = demoRequest.length >= 25;
  const hasSummaryHeading = /^##\s+Summary\b/im.test(demoResult);
  const demoResultValid = demoResult.length >= 700 && hasSummaryHeading;

  const checks: SkillMarketAuditCheck[] = [
    {
      id: 'valid-name',
      label: 'Valid kebab-case slug (<= 64 chars)',
      passed: nameValid,
      detail: nameValid
        ? `${trimmedName} (${trimmedName.length}/${MAX_SKILL_NAME_LENGTH} chars)`
        : 'Skill name must be non-empty lowercase kebab-case and at most 64 characters.',
    },
    {
      id: 'valid-description',
      label: 'Discovery description (40-1024 chars)',
      passed: descValid,
      detail: descValid
        ? `${trimmedDesc.length} chars (within 40-1024 limit)`
        : `Description is ${trimmedDesc.length} chars; target 40-1024 chars.`,
    },
    {
      id: 'required-sections',
      label: 'Required SKILL.md playbook sections',
      passed: sectionsValid,
      detail: sectionsValid
        ? 'All 4 sections present (Role & Trigger, Input Parameters, Execution Steps, Verification Checklist).'
        : `Missing sections: ${missingSections.join(', ')}`,
    },
    {
      id: 'zero-em-dashes',
      label: 'Zero em-dash characters (U+2014)',
      passed: zeroEmDashes,
      detail: zeroEmDashes
        ? 'No em-dash characters found.'
        : `Found ${emDashCount} em-dash character(s); replace with commas, colons, or parentheses.`,
    },
    {
      id: 'zero-ai-buzzwords',
      label: 'Zero banned AI marketing buzzwords',
      passed: zeroAiBuzzwords,
      detail: zeroAiBuzzwords
        ? 'Copy passes anti-buzzword check.'
        : `Remove buzzwords: ${buzzwordMatches.join(', ')}`,
    },
    {
      id: 'clean-tags',
      label: 'Clean marketplace tags (3-7 kebab-case, no # or stopwords)',
      passed: cleanTagsValid,
      detail: cleanTagsValid
        ? `${tags.length} clean tags: ${tags.join(', ')}`
        : !tagsCountValid
          ? `Expected 3-7 tags; received ${tags.length}.`
          : `Invalid tag(s): ${invalidTags.join(', ')}`,
    },
    {
      id: 'tagline-present',
      label: 'Marketplace tagline present',
      passed: taglinePresent,
      detail: taglinePresent
        ? `${tagline.length} chars`
        : 'Add a concise 1-sentence tagline describing the concrete skill outcome.',
    },
    {
      id: 'demo-request',
      label: 'Step 3 demo request (>= 25 chars)',
      passed: demoRequestValid,
      detail: demoRequestValid
        ? `${demoRequest.length} chars`
        : `Demo request is ${demoRequest.length} chars (minimum 25 chars).`,
    },
    {
      id: 'demo-result',
      label: 'Step 3 demo result (>= 700 chars + ## Summary)',
      passed: demoResultValid,
      detail: demoResultValid
        ? `${demoResult.length} chars with ## Summary section`
        : `Demo result is ${demoResult.length} chars (need >= 700 chars and a ## Summary heading).`,
    },
  ];

  const totalCount = checks.length;
  const passedCount = checks.filter((check) => check.passed).length;
  const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  return {
    score,
    passedCount,
    totalCount,
    checks,
  };
};
