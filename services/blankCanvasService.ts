import {
  BlankCanvasState,
  BlankCanvasTargetMode,
  CanvasBlock,
  CanvasBlockType,
  Language,
} from '../types';
import { CleanPromptPayload, sanitizeString } from './jsonPromptService';
import { AgentSkillSpec, toKebabCaseSkillName } from './agentSkillService';

export const BLANK_CANVAS_ID = '__blank_canvas__';
export const BLANK_CANVAS_STORAGE_KEY = 'pm_blank_canvas_draft';

const DEFAULT_SKILL_COMPATIBILITY =
  'Compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills runners.';
const MAX_SKILL_NAME_LENGTH = 64;
const MAX_SKILL_DESCRIPTION_LENGTH = 1024;

export interface CanvasBlockPreset {
  type: CanvasBlockType;
  labelId: string;
  labelEn: string;
  placeholderId: string;
  placeholderEn: string;
  hintId: string;
  hintEn: string;
  editableLabel: boolean;
}

export const CANVAS_BLOCK_PRESETS: ReadonlyArray<CanvasBlockPreset> = [
  {
    type: 'persona',
    labelId: 'Persona AI',
    labelEn: 'AI Persona',
    placeholderId: 'Contoh: Senior Software Architect dengan pengalaman 10 tahun di sistem terdistribusi...',
    placeholderEn: 'e.g. Senior Software Architect with 10 years of experience in distributed systems...',
    hintId: 'Tetapkan peran, keahlian, dan sudut pandang model AI.',
    hintEn: 'Define the role, expertise, and perspective of the AI model.',
    editableLabel: false,
  },
  {
    type: 'context',
    labelId: 'Konteks & Tujuan',
    labelEn: 'Context & Goal',
    placeholderId: 'Jelaskan latar belakang proyek, situasi saat ini, dan sasaran akhir yang ingin dicapai...',
    placeholderEn: 'Describe project background, current situation, and the end objective...',
    hintId: 'Berikan informasi situasi agar AI memahami ruang lingkup masalah.',
    hintEn: 'Provide situational context so the AI understands the problem scope.',
    editableLabel: false,
  },
  {
    type: 'task',
    labelId: 'Tugas Utama',
    labelEn: 'Core Task',
    placeholderId: 'Uraikan tugas spesifik yang harus dikerjakan AI langkah demi langkah...',
    placeholderEn: 'Specify the exact task the AI needs to execute step by step...',
    hintId: 'Fokus pada aksi konkret yang diharapkan dari model.',
    hintEn: 'Focus on the concrete action expected from the model.',
    editableLabel: false,
  },
  {
    type: 'constraints',
    labelId: 'Batasan & Kriteria',
    labelEn: 'Constraints & Rules',
    placeholderId: 'Contoh: Jangan mengarang fakta, hindari jargon berlebihan, maksimal 300 kata...',
    placeholderEn: 'e.g. Do not fabricate facts, avoid unnecessary jargon, max 300 words...',
    hintId: 'Tetapkan pagar pengaman, larangan, dan syarat kualitas.',
    hintEn: 'Set guardrails, exclusions, and quality criteria.',
    editableLabel: false,
  },
  {
    type: 'output_format',
    labelId: 'Format Output',
    labelEn: 'Output Format',
    placeholderId: 'Contoh: Tabel Markdown dengan 3 kolom, JSON valid, atau poin bernomor...',
    placeholderEn: 'e.g. 3-column Markdown table, valid JSON, or numbered action items...',
    hintId: 'Tentukan struktur visual atau format data dari hasil akhir.',
    hintEn: 'Specify the visual structure or data format of the final output.',
    editableLabel: false,
  },
  {
    type: 'audience',
    labelId: 'Target Audiens',
    labelEn: 'Target Audience',
    placeholderId: 'Contoh: Manajer produk non-teknis, developer pemula, atau eksekutif C-level...',
    placeholderEn: 'e.g. Non-technical product managers, junior developers, or C-level executives...',
    hintId: 'Sesuaikan tingkat kedalaman bahasa dengan pembaca akhir.',
    hintEn: 'Tailor vocabulary and depth to the intended reader.',
    editableLabel: false,
  },
  {
    type: 'variable',
    labelId: 'Variabel Input',
    labelEn: 'Input Variable',
    placeholderId: 'Masukkan nilai data, cuplikan teks, atau parameter khusus untuk diproses...',
    placeholderEn: 'Provide input data, source text snippet, or custom parameter to process...',
    hintId: 'Label dapat diubah sesuai nama variabel atau data masukan Anda.',
    hintEn: 'Label can be edited to match your custom input variable name.',
    editableLabel: true,
  },
  {
    type: 'custom',
    labelId: 'Bagian Kustom',
    labelEn: 'Custom Section',
    placeholderId: 'Isi instruksi atau referensi tambahan sesuai kebutuhan spesifik Anda...',
    placeholderEn: 'Enter additional instructions or references tailored to your workflow...',
    hintId: 'Label bebas disesuaikan untuk kebutuhan blok apa pun.',
    hintEn: 'Label can be freely customized for any section you need.',
    editableLabel: true,
  },
];

const VALID_BLOCK_TYPES = new Set<CanvasBlockType>(
  CANVAS_BLOCK_PRESETS.map((preset) => preset.type)
);

const cleanCanvasText = (text: string): string => {
  return sanitizeString(text)
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-');
};

const sanitizeOptionalPrice = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Number(value.toFixed(2));
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Number(parsed.toFixed(2));
    }
  }
  return undefined;
};

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

const getPresetForType = (type: CanvasBlockType): CanvasBlockPreset => {
  const found = CANVAS_BLOCK_PRESETS.find((preset) => preset.type === type);
  return found ?? CANVAS_BLOCK_PRESETS[CANVAS_BLOCK_PRESETS.length - 1];
};

const generateBlockId = (type: CanvasBlockType): string => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timePart = Date.now().toString(36);
  return `canvas_${type}_${timePart}_${randomPart}`;
};

/**
 * Creates a new modular canvas block with a unique ID and sanitized text.
 */
export const createCanvasBlock = (
  type: CanvasBlockType,
  language: Language,
  customLabel?: string,
  initialValue?: string
): CanvasBlock => {
  const preset = getPresetForType(type);
  const defaultLabel = language === 'id' ? preset.labelId : preset.labelEn;
  const resolvedLabel =
    customLabel && customLabel.trim()
      ? cleanCanvasText(customLabel.trim())
      : defaultLabel;

  return {
    id: generateBlockId(type),
    type,
    label: resolvedLabel,
    value: initialValue ? cleanCanvasText(initialValue) : '',
    isCustomLabel: preset.editableLabel,
  };
};

/**
 * Returns a fresh, empty Blank Canvas state with default settings.
 */
export const createEmptyCanvasState = (): BlankCanvasState => ({
  title: '',
  description: '',
  targetMode: 'prompt',
  scratchpad: '',
  blocks: [],
  fewShotInput: '',
  fewShotOutput: '',
  skillName: '',
  skillDescription: '',
  skillCompatibility: DEFAULT_SKILL_COMPATIBILITY,
  skillTagline: '',
  skillPriceUsd: undefined,
  skillTags: '',
  skillDemoRequest: '',
  skillDemoResult: '',
  updatedAt: Date.now(),
});

const sanitizeLoadedBlock = (raw: unknown): CanvasBlock | null => {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const rawType = typeof candidate.type === 'string' ? candidate.type : 'custom';
  const type: CanvasBlockType = VALID_BLOCK_TYPES.has(rawType as CanvasBlockType)
    ? (rawType as CanvasBlockType)
    : 'custom';
  const preset = getPresetForType(type);
  const id =
    typeof candidate.id === 'string' && candidate.id.trim()
      ? cleanCanvasText(candidate.id.trim())
      : generateBlockId(type);
  const label =
    typeof candidate.label === 'string' && candidate.label.trim()
      ? cleanCanvasText(candidate.label)
      : preset.labelId;
  const value = typeof candidate.value === 'string' ? cleanCanvasText(candidate.value) : '';
  const isCustomLabel =
    typeof candidate.isCustomLabel === 'boolean' ? candidate.isCustomLabel : preset.editableLabel;

  return {
    id,
    type,
    label,
    value,
    isCustomLabel,
  };
};

/**
 * Loads the persisted Blank Canvas draft from localStorage safely.
 */
export const loadBlankCanvasDraft = (): BlankCanvasState => {
  const fallback = createEmptyCanvasState();
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(BLANK_CANVAS_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;

    const obj = parsed as Record<string, unknown>;
    const targetMode: BlankCanvasTargetMode =
      obj.targetMode === 'skill' ? 'skill' : 'prompt';

    const blocks: CanvasBlock[] = Array.isArray(obj.blocks)
      ? obj.blocks
          .map((item) => sanitizeLoadedBlock(item))
          .filter((item): item is CanvasBlock => item !== null)
      : [];

    return {
      title: typeof obj.title === 'string' ? cleanCanvasText(obj.title) : '',
      description: typeof obj.description === 'string' ? cleanCanvasText(obj.description) : '',
      targetMode,
      scratchpad: typeof obj.scratchpad === 'string' ? cleanCanvasText(obj.scratchpad) : '',
      blocks,
      fewShotInput: typeof obj.fewShotInput === 'string' ? cleanCanvasText(obj.fewShotInput) : '',
      fewShotOutput:
        typeof obj.fewShotOutput === 'string' ? cleanCanvasText(obj.fewShotOutput) : '',
      skillName: typeof obj.skillName === 'string' ? cleanCanvasText(obj.skillName) : '',
      skillDescription:
        typeof obj.skillDescription === 'string' ? cleanCanvasText(obj.skillDescription) : '',
      skillCompatibility:
        typeof obj.skillCompatibility === 'string' && obj.skillCompatibility.trim()
          ? cleanCanvasText(obj.skillCompatibility)
          : DEFAULT_SKILL_COMPATIBILITY,
      skillTagline:
        typeof obj.skillTagline === 'string' ? cleanCanvasText(obj.skillTagline) : '',
      skillPriceUsd: sanitizeOptionalPrice(obj.skillPriceUsd),
      skillTags: typeof obj.skillTags === 'string' ? cleanCanvasText(obj.skillTags) : '',
      skillDemoRequest:
        typeof obj.skillDemoRequest === 'string' ? cleanCanvasText(obj.skillDemoRequest) : '',
      skillDemoResult:
        typeof obj.skillDemoResult === 'string' ? cleanCanvasText(obj.skillDemoResult) : '',
      updatedAt:
        typeof obj.updatedAt === 'number' && Number.isFinite(obj.updatedAt)
          ? obj.updatedAt
          : Date.now(),
    };
  } catch (err) {
    console.warn('Failed to load Blank Canvas draft from localStorage:', err);
    return fallback;
  }
};

/**
 * Persists the current Blank Canvas draft to localStorage safely.
 */
export const saveBlankCanvasDraft = (state: BlankCanvasState): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    const payload: BlankCanvasState = {
      ...state,
      skillTagline: typeof state.skillTagline === 'string' ? cleanCanvasText(state.skillTagline) : '',
      skillPriceUsd: sanitizeOptionalPrice(state.skillPriceUsd),
      skillTags: typeof state.skillTags === 'string' ? cleanCanvasText(state.skillTags) : '',
      skillDemoRequest:
        typeof state.skillDemoRequest === 'string' ? cleanCanvasText(state.skillDemoRequest) : '',
      skillDemoResult:
        typeof state.skillDemoResult === 'string' ? cleanCanvasText(state.skillDemoResult) : '',
      updatedAt: state.updatedAt || Date.now(),
    };
    localStorage.setItem(BLANK_CANVAS_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save Blank Canvas draft to localStorage:', err);
  }
};

/**
 * Removes the Blank Canvas draft from localStorage safely.
 */
export const clearBlankCanvasDraft = (): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(BLANK_CANVAS_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear Blank Canvas draft from localStorage:', err);
  }
};

/**
 * Checks whether the Blank Canvas contains any user-entered content.
 */
export const hasBlankCanvasContent = (state: BlankCanvasState): boolean => {
  return Boolean(
    state.title.trim() ||
      state.description.trim() ||
      state.scratchpad.trim() ||
      state.fewShotInput.trim() ||
      state.fewShotOutput.trim() ||
      state.skillName.trim() ||
      state.skillDescription.trim() ||
      (state.skillTagline || '').trim() ||
      typeof state.skillPriceUsd === 'number' ||
      (state.skillTags || '').trim() ||
      (state.skillDemoRequest || '').trim() ||
      (state.skillDemoResult || '').trim() ||
      state.blocks.length > 0
  );
};

/**
 * Compiles filled modular blocks, scratchpad, and few-shot examples into a single clean prompt string.
 */
export const compileBlankCanvasPrompt = (
  state: BlankCanvasState,
  language: Language
): string => {
  const sections: string[] = [];

  const filledBlocks = state.blocks.filter((block) => block.value.trim().length > 0);
  filledBlocks.forEach((block) => {
    const preset = getPresetForType(block.type);
    const defaultLabel = language === 'id' ? preset.labelId : preset.labelEn;
    const label = cleanCanvasText(block.label.trim()) || defaultLabel;
    const value = cleanCanvasText(block.value.trim());
    sections.push(`${label}: ${value}`);
  });

  const cleanScratchpad = cleanCanvasText(state.scratchpad.trim());
  if (cleanScratchpad) {
    if (filledBlocks.length > 0) {
      const header = language === 'id' ? 'Instruksi Utama' : 'Core Instructions';
      sections.push(`${header}:\n${cleanScratchpad}`);
    } else {
      sections.push(cleanScratchpad);
    }
  }

  const cleanFewShotInput = cleanCanvasText(state.fewShotInput.trim());
  const cleanFewShotOutput = cleanCanvasText(state.fewShotOutput.trim());
  if (cleanFewShotInput) {
    const inputLabel = language === 'id' ? 'Contoh Masukan' : 'Sample Input';
    sections.push(`${inputLabel}:\n${cleanFewShotInput}`);
  }
  if (cleanFewShotOutput) {
    const outputLabel =
      language === 'id' ? 'Contoh Keluaran yang Diharapkan' : 'Expected Output';
    sections.push(`${outputLabel}:\n${cleanFewShotOutput}`);
  }

  return cleanCanvasText(sections.join('\n\n'));
};

/**
 * Builds a clean, decode-error-free JSON payload from Blank Canvas state.
 */
export const buildBlankCanvasJsonPayload = (
  state: BlankCanvasState,
  compiledPrompt: string,
  language: Language
): CleanPromptPayload => {
  const templateName =
    cleanCanvasText(state.title.trim()) ||
    (language === 'id' ? 'Canvas Kosong' : 'Blank Canvas');
  const categoryName = language === 'id' ? 'Canvas Kosong' : 'Blank Canvas';
  const subcategoryName = state.targetMode === 'skill' ? 'Agent Skill (SKILL.md)' : 'Custom Prompt';

  const filledBlocks = state.blocks.filter((block) => block.value.trim().length > 0);
  const personaBlocks = filledBlocks.filter((block) => block.type === 'persona');
  const personaText = cleanCanvasText(
    personaBlocks.map((block) => block.value.trim()).join('\n\n')
  );

  const parameters: Record<string, string | number | boolean | string[]> = {};
  const userContentLines: string[] = [];

  filledBlocks.forEach((block) => {
    const preset = getPresetForType(block.type);
    const defaultLabel = language === 'id' ? preset.labelId : preset.labelEn;
    const baseLabel = cleanCanvasText(block.label.trim()) || defaultLabel;
    const val = cleanCanvasText(block.value.trim());

    let paramKey = baseLabel;
    let suffix = 2;
    while (Object.prototype.hasOwnProperty.call(parameters, paramKey)) {
      paramKey = `${baseLabel} (${suffix})`;
      suffix += 1;
    }
    parameters[paramKey] = val;

    if (block.type !== 'persona') {
      userContentLines.push(`${baseLabel}: ${val}`);
    }
  });

  const cleanScratchpad = cleanCanvasText(state.scratchpad.trim());
  if (cleanScratchpad) {
    const label = language === 'id' ? 'Instruksi Utama' : 'Core Instructions';
    userContentLines.push(`${label}:\n${cleanScratchpad}`);
  }

  const cleanFewShotInput = cleanCanvasText(state.fewShotInput.trim());
  const cleanFewShotOutput = cleanCanvasText(state.fewShotOutput.trim());
  const fewShot =
    cleanFewShotInput || cleanFewShotOutput
      ? {
          sample_input: cleanFewShotInput || undefined,
          expected_output: cleanFewShotOutput || undefined,
        }
      : undefined;

  const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
  if (personaText) {
    messages.push({
      role: 'system',
      content: personaText,
    });
  }

  const cleanCompiled = cleanCanvasText(compiledPrompt.trim());
  const fallbackUserMsg =
    language === 'id'
      ? 'Jalankan instruksi sesuai spesifikasi Canvas Kosong.'
      : 'Execute task according to Blank Canvas specifications.';

  messages.push({
    role: 'user',
    content:
      userContentLines.length > 0
        ? userContentLines.join('\n\n')
        : cleanCompiled || fallbackUserMsg,
  });

  return {
    template: templateName,
    category: categoryName,
    subcategory: subcategoryName,
    language,
    persona: personaText,
    parameters,
    additional_instructions: cleanScratchpad || undefined,
    few_shot: fewShot,
    prompt: cleanCompiled,
    messages,
  };
};

/**
 * Builds an Open Agent Skills specification (SKILL.md) from Blank Canvas state.
 */
export const buildBlankCanvasAgentSkillSpec = (
  state: BlankCanvasState,
  compiledPrompt: string,
  language: Language
): AgentSkillSpec => {
  const displayTitle =
    cleanCanvasText(state.title.trim()) ||
    (language === 'id' ? 'Skill Canvas Kustom' : 'Custom Canvas Skill');

  const rawSkillName =
    state.skillName.trim() || state.title.trim() || 'custom-canvas-skill';
  const skillName = toKebabCaseSkillName(rawSkillName).slice(0, MAX_SKILL_NAME_LENGTH);

  const rawShortDesc = cleanCanvasText(state.description.trim());
  const rawSkillDesc = cleanCanvasText(state.skillDescription.trim());
  const fallbackTrigger =
    language === 'id'
      ? `Gunakan skill ini saat pengguna membutuhkan alur kerja terstruktur untuk ${displayTitle}.`
      : `Use this skill when the user needs a structured workflow for ${displayTitle}.`;

  const combinedDesc = rawSkillDesc || (rawShortDesc ? `${rawShortDesc} ${fallbackTrigger}` : fallbackTrigger);
  const description = truncateCleanly(cleanCanvasText(combinedDesc), MAX_SKILL_DESCRIPTION_LENGTH);

  const compatibility =
    cleanCanvasText(state.skillCompatibility.trim()) || DEFAULT_SKILL_COMPATIBILITY;

  const filledBlocks = state.blocks.filter((block) => block.value.trim().length > 0);
  const personaBlocks = filledBlocks.filter((block) => block.type === 'persona');
  const outputFormatBlocks = filledBlocks.filter((block) => block.type === 'output_format');
  const constraintBlocks = filledBlocks.filter((block) => block.type === 'constraints');

  const personaLine =
    personaBlocks.length > 0
      ? cleanCanvasText(personaBlocks.map((block) => block.value.trim()).join(' '))
      : language === 'id'
        ? `Bertindak sebagai spesialis domain untuk menjalankan skill ${displayTitle}.`
        : `Act as a domain specialist executing the ${displayTitle} skill.`;

  const triggerLine = rawSkillDesc || rawShortDesc || displayTitle;
  const targetFormatLine =
    outputFormatBlocks.length > 0
      ? cleanCanvasText(outputFormatBlocks.map((block) => block.value.trim()).join('; '))
      : language === 'id'
        ? 'Respons terstruktur sesuai parameter dan instruksi.'
        : 'Structured response aligned with parameters and instructions.';

  const roleAndTrigger = [
    personaLine,
    '',
    language === 'id'
      ? `- **Pemicu Utama**: ${triggerLine}`
      : `- **Trigger Condition**: ${triggerLine}`,
    language === 'id'
      ? `- **Format Keluaran Target**: ${targetFormatLine}`
      : `- **Target Output Format**: ${targetFormatLine}`,
  ].join('\n');

  const paramLines = filledBlocks.map((block) => {
    const preset = getPresetForType(block.type);
    const defaultLabel = language === 'id' ? preset.labelId : preset.labelEn;
    const label = cleanCanvasText(block.label.trim()) || defaultLabel;
    const val = cleanCanvasText(block.value.trim());
    return `- **${label}**: ${val}`;
  });

  const inputParameters =
    paramLines.length > 0
      ? paramLines.join('\n')
      : language === 'id'
        ? '- Tidak ada blok parameter khusus; jalankan langsung berdasarkan konteks permintaan pengguna.'
        : '- No dedicated parameter blocks defined; operate directly from the user request context.';

  const cleanScratchpad = cleanCanvasText(state.scratchpad.trim());
  const cleanCompiled = cleanCanvasText(compiledPrompt.trim());

  const executionLines: string[] =
    language === 'id'
      ? [
          '1. Tinjau seluruh konteks, variabel masukan, dan batasan yang ditetapkan.',
          '2. Ikuti instruksi inti secara berurutan tanpa melewati langkah verifikasi.',
          '3. Hasilkan keluaran akhir mengikuti spesifikasi prompt di bawah ini:',
        ]
      : [
          '1. Review all context, input variables, and constraints defined in this skill.',
          '2. Follow the core instructions sequentially without skipping verification steps.',
          '3. Produce the final deliverable matching the prompt specification below:',
        ];

  if (cleanScratchpad && filledBlocks.length > 0) {
    executionLines.push('');
    executionLines.push(
      language === 'id'
        ? `**Instruksi Scratchpad**: ${cleanScratchpad}`
        : `**Scratchpad Instructions**: ${cleanScratchpad}`
    );
  }

  if (cleanCompiled) {
    executionLines.push('');
    executionLines.push('```text');
    executionLines.push(cleanCompiled);
    executionLines.push('```');
  }
  const executionSteps = executionLines.join('\n');

  const checklistLines: string[] =
    language === 'id'
      ? [
          '- [ ] Seluruh blok parameter dan instruksi inti telah dipenuhi.',
          '- [ ] Format keluaran bersih, bebas placeholder kosong, dan siap digunakan.',
          '- [ ] Fakta, konsistensi, serta keamanan informasi telah divalidasi.',
        ]
      : [
          '- [ ] Every defined parameter block and core instruction is satisfied.',
          '- [ ] Output format is clean, free of unresolved placeholders, and ready to use.',
          '- [ ] Factual accuracy, consistency, and safety constraints are verified.',
        ];

  if (constraintBlocks.length > 0) {
    const constraintNote = cleanCanvasText(
      constraintBlocks.map((block) => block.value.trim()).join('; ')
    );
    checklistLines.push(
      language === 'id'
        ? `- [ ] Batasan khusus dipatuhi: ${constraintNote}`
        : `- [ ] Custom constraints honored: ${constraintNote}`
    );
  }
  const verificationChecklist = checklistLines.join('\n');

  const cleanFewShotInput = cleanCanvasText(state.fewShotInput.trim());
  const cleanFewShotOutput = cleanCanvasText(state.fewShotOutput.trim());
  let fewShotReference: string | undefined;
  if (cleanFewShotInput || cleanFewShotOutput) {
    const fsParts: string[] = [];
    if (cleanFewShotInput) {
      fsParts.push(language === 'id' ? '### Contoh Masukan' : '### Sample Input');
      fsParts.push('```text');
      fsParts.push(cleanFewShotInput);
      fsParts.push('```');
    }
    if (cleanFewShotOutput) {
      if (fsParts.length > 0) fsParts.push('');
      fsParts.push(
        language === 'id' ? '### Contoh Keluaran yang Diharapkan' : '### Expected Output'
      );
      fsParts.push('```text');
      fsParts.push(cleanFewShotOutput);
      fsParts.push('```');
    }
    fewShotReference = fsParts.join('\n');
  }

  const bodyParts: string[] = [
    `# ${displayTitle}`,
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
    compatibility,
    metadata: {
      author: 'Sigit Adi (PromptMatrix)',
      version: '1.0.0',
      source: 'PromptMatrix 2.0 (Blank Canvas)',
      category: language === 'id' ? 'Canvas Kosong' : 'Blank Canvas',
      language,
      framework: displayTitle,
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

const stripFileExtension = (filename?: string): string => {
  if (!filename) return '';
  const baseName = filename.trim().replace(/^.*[\\/]/, '');
  return cleanCanvasText(baseName.replace(/\.[^.]+$/, ''));
};

const deriveTitleFromFirstLine = (text: string): string => {
  const lines = text.split('\n');
  for (const line of lines) {
    const cleaned = cleanCanvasText(
      line
        .replace(/^#+\s*/, '')
        .replace(/^[-*]\s*/, '')
        .trim()
    );
    if (cleaned && cleaned !== '---') {
      return truncateCleanly(cleaned, 60);
    }
  }
  return '';
};

const mapLabelToBlockType = (rawLabel: string): CanvasBlockType | 'scratchpad' | 'few_shot_input' | 'few_shot_output' => {
  const normalized = rawLabel.trim().toLowerCase();

  if (/^(?:few[\s-]*shot.*input|sample\s+input|contoh\s+masukan)$/.test(normalized)) {
    return 'few_shot_input';
  }
  if (/^(?:few[\s-]*shot.*output|expected\s+output|contoh\s+keluaran(?:\s+yang\s+diharapkan)?)$/.test(normalized)) {
    return 'few_shot_output';
  }
  if (/^(?:core\s+instructions?|instructions?|instruksi\s+utama|scratchpad)$/.test(normalized)) {
    return 'scratchpad';
  }
  if (/(?:persona|role|peran)/.test(normalized)) {
    return 'persona';
  }
  if (/(?:context|konteks|background|latar\s+belakang|goal|tujuan)/.test(normalized)) {
    return 'context';
  }
  if (/(?:input\s*parameters?|parameters?|variable|variabel|inputs?)/.test(normalized)) {
    return 'variable';
  }
  if (/(?:constraints?|rules?|batasan|kriteria|guardrails?)/.test(normalized)) {
    return 'constraints';
  }
  if (/(?:output\s*format|format\s*(?:output|keluaran)|deliverables?|^output$)/.test(normalized)) {
    return 'output_format';
  }
  if (/(?:audience|audiens)/.test(normalized)) {
    return 'audience';
  }
  if (/(?:execution\s*steps?|steps?|task|tugas|workflow|langkah)/.test(normalized)) {
    return 'task';
  }
  return 'custom';
};

const parseYamlFrontmatterBlock = (
  rawFrontmatter: string
): { name: string; description: string; compatibility: string } => {
  const lines = rawFrontmatter.split('\n');
  let name = '';
  let description = '';
  let compatibility = '';

  const unquoteYaml = (val: string): string => {
    const trimmed = val.trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed
        .slice(1, -1)
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\\\/g, '\\')
        .trim();
    }
    return trimmed;
  };

  for (const line of lines) {
    const match = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const val = cleanCanvasText(unquoteYaml(match[2]));
    if (key === 'name' && val) {
      name = val;
    } else if (key === 'description' && val) {
      description = val;
    } else if (key === 'compatibility' && val) {
      compatibility = val;
    }
  }

  return { name, description, compatibility };
};

const extractFewShotFromSection = (
  sectionBody: string
): { input: string; output: string } => {
  const cleanSection = sectionBody.trim();
  const stripCodeFences = (text: string): string =>
    cleanCanvasText(
      text
        .replace(/^```[a-zA-Z0-9_-]*\s*\n?/gm, '')
        .replace(/\n?```\s*$/gm, '')
        .trim()
    );

  const inputMatch = cleanSection.match(
    /(?:###\s*(?:Sample\s+Input|Contoh\s+Masukan)|(?:Sample\s+Input|Contoh\s+Masukan)\s*:)\s*\n?([\s\S]*?)(?=(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran)|(?:Expected\s+Output|Contoh\s+Keluaran)[^\n]*:)|$)/i
  );
  const outputMatch = cleanSection.match(
    /(?:###\s*(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)|(?:Expected\s+Output|Contoh\s+Keluaran[^\n]*)\s*:)\s*\n?([\s\S]*)$/i
  );

  const input = inputMatch ? stripCodeFences(inputMatch[1]) : '';
  const output = outputMatch ? stripCodeFences(outputMatch[1]) : '';
  if (!input && !output && cleanSection) {
    return { input: stripCodeFences(cleanSection), output: '' };
  }
  return { input, output };
};

const extractDemoFromSection = (
  sectionBody: string
): { request: string; result: string } => {
  const cleanSection = sectionBody.trim();
  const requestMatch = cleanSection.match(
    /###\s*The\s+Request\s*\n([\s\S]*?)(?=###\s*The\s+Result\b|$)/i
  );
  const resultMatch = cleanSection.match(/###\s*The\s+Result\s*\n([\s\S]*)$/i);
  return {
    request: requestMatch ? cleanCanvasText(requestMatch[1].trim()) : '',
    result: resultMatch ? cleanCanvasText(resultMatch[1].trim()) : '',
  };
};

const parseMarkdownSections = (
  bodyText: string,
  language: Language
): {
  headingTitle: string;
  blocks: CanvasBlock[];
  scratchpadParts: string[];
  fewShotInput: string;
  fewShotOutput: string;
  demoRequest: string;
  demoResult: string;
} => {
  const lines = bodyText.split('\n');
  let headingTitle = '';
  const preambleLines: string[] = [];
  const sections: Array<{ heading: string; lines: string[] }> = [];
  let currentSection: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    const h1Match = !headingTitle && !currentSection ? line.match(/^#\s+(.+)$/) : null;
    if (h1Match) {
      headingTitle = cleanCanvasText(h1Match[1].trim());
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { heading: cleanCanvasText(h2Match[1].trim()), lines: [] };
      continue;
    }

    if (currentSection) {
      currentSection.lines.push(line);
    } else {
      preambleLines.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  const blocks: CanvasBlock[] = [];
  const scratchpadParts: string[] = [];
  let fewShotInput = '';
  let fewShotOutput = '';
  let demoRequest = '';
  let demoResult = '';

  const preamble = cleanCanvasText(preambleLines.join('\n').trim());
  if (preamble) {
    scratchpadParts.push(preamble);
  }

  for (const section of sections) {
    const rawContent = section.lines.join('\n').trim();
    const cleanedContent = cleanCanvasText(rawContent);
    if (!cleanedContent) continue;

    if (/see\s+it\s+in\s+action/i.test(section.heading)) {
      const parsedDemo = extractDemoFromSection(rawContent);
      if (parsedDemo.request && !demoRequest) demoRequest = parsedDemo.request;
      if (parsedDemo.result && !demoResult) demoResult = parsedDemo.result;
      continue;
    }

    if (/few[\s-]*shot/i.test(section.heading)) {
      const parsedFewShot = extractFewShotFromSection(rawContent);
      if (parsedFewShot.input && !fewShotInput) fewShotInput = parsedFewShot.input;
      if (parsedFewShot.output && !fewShotOutput) fewShotOutput = parsedFewShot.output;
      continue;
    }

    const mapped = mapLabelToBlockType(section.heading);
    if (mapped === 'scratchpad') {
      scratchpadParts.push(cleanedContent);
    } else if (mapped === 'few_shot_input') {
      fewShotInput = fewShotInput || cleanedContent;
    } else if (mapped === 'few_shot_output') {
      fewShotOutput = fewShotOutput || cleanedContent;
    } else if (mapped === 'custom') {
      blocks.push(createCanvasBlock('custom', language, section.heading, cleanedContent));
    } else {
      blocks.push(createCanvasBlock(mapped, language, section.heading, cleanedContent));
    }
  }

  return {
    headingTitle,
    blocks,
    scratchpadParts,
    fewShotInput,
    fewShotOutput,
    demoRequest,
    demoResult,
  };
};

const formatUnknownValue = (value: unknown): string => {
  if (typeof value === 'string') return cleanCanvasText(value.trim());
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return cleanCanvasText(
      value
        .map((item) => (typeof item === 'string' ? item.trim() : JSON.stringify(item)))
        .filter(Boolean)
        .join(', ')
    );
  }
  if (value && typeof value === 'object') {
    return cleanCanvasText(JSON.stringify(value));
  }
  return '';
};

/**
 * Detects whether an uploaded prompt or markdown document is an Open Agent Skill (SKILL.md) or a standard Prompt.
 */
export const detectUploadedContentKind = (
  rawText: string,
  filename?: string
): BlankCanvasTargetMode => {
  if (filename && /skill\.md$/i.test(filename.trim())) {
    return 'skill';
  }

  const normalized = rawText.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return 'prompt';
  }

  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (frontmatterMatch && /^\s*(?:name|description)\s*:/im.test(frontmatterMatch[1])) {
    return 'skill';
  }

  if (/^##\s+(?:Role\s*&\s*Trigger|Execution\s+Steps|Verification\s+Checklist)\b/im.test(normalized)) {
    return 'skill';
  }

  return 'prompt';
};

/**
 * Parses uploaded .md, SKILL.md, .txt, or .json content cleanly client-side into a BlankCanvasState.
 */
export const parseUploadedPromptOrSkill = (
  rawText: string,
  filename?: string,
  language: Language = 'id'
): BlankCanvasState => {
  const state = createEmptyCanvasState();
  const normalized = rawText.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    if (filename) {
      state.title = stripFileExtension(filename);
    }
    state.targetMode = detectUploadedContentKind(rawText, filename);
    return state;
  }

  const fileBaseTitle = stripFileExtension(filename);

  // 1. JSON Object Parsing
  if (normalized.startsWith('{') || (filename && /\.json$/i.test(filename.trim()))) {
    try {
      const parsed: unknown = JSON.parse(normalized);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        const jsonTitle =
          formatUnknownValue(obj.template) ||
          formatUnknownValue(obj.title) ||
          formatUnknownValue(obj.name) ||
          fileBaseTitle ||
          (language === 'id' ? 'Prompt Impor JSON' : 'Imported JSON Prompt');

        const jsonDesc = formatUnknownValue(obj.description);
        const blocks: CanvasBlock[] = [];

        const personaVal = formatUnknownValue(obj.persona);
        if (personaVal) {
          blocks.push(createCanvasBlock('persona', language, undefined, personaVal));
        }

        if (Array.isArray(obj.blocks)) {
          obj.blocks.forEach((rawBlock) => {
            const loaded = sanitizeLoadedBlock(rawBlock);
            if (loaded && loaded.value.trim()) {
              blocks.push(loaded);
            }
          });
        }

        if (obj.parameters && typeof obj.parameters === 'object' && !Array.isArray(obj.parameters)) {
          Object.entries(obj.parameters as Record<string, unknown>).forEach(([key, val]) => {
            const formattedVal = formatUnknownValue(val);
            if (!formattedVal) return;
            const mapped = mapLabelToBlockType(key);
            if (mapped === 'persona' && personaVal && formattedVal === personaVal) {
              return;
            }
            if (mapped === 'scratchpad') {
              if (!state.scratchpad) {
                state.scratchpad = formattedVal;
              }
              return;
            }
            if (mapped === 'few_shot_input') {
              state.fewShotInput = state.fewShotInput || formattedVal;
              return;
            }
            if (mapped === 'few_shot_output') {
              state.fewShotOutput = state.fewShotOutput || formattedVal;
              return;
            }
            const resolvedType: CanvasBlockType = mapped === 'custom' ? 'variable' : mapped;
            blocks.push(createCanvasBlock(resolvedType, language, cleanCanvasText(key), formattedVal));
          });
        }

        const scratchpadVal =
          formatUnknownValue(obj.scratchpad) ||
          formatUnknownValue(obj.additional_instructions) ||
          formatUnknownValue(obj.prompt);

        if (scratchpadVal) {
          state.scratchpad = state.scratchpad
            ? `${state.scratchpad}\n\n${scratchpadVal}`
            : scratchpadVal;
        }

        if (obj.few_shot && typeof obj.few_shot === 'object' && !Array.isArray(obj.few_shot)) {
          const fs = obj.few_shot as Record<string, unknown>;
          state.fewShotInput = formatUnknownValue(fs.sample_input) || state.fewShotInput;
          state.fewShotOutput = formatUnknownValue(fs.expected_output) || state.fewShotOutput;
        } else {
          state.fewShotInput = formatUnknownValue(obj.fewShotInput) || state.fewShotInput;
          state.fewShotOutput = formatUnknownValue(obj.fewShotOutput) || state.fewShotOutput;
        }

        const isSkillJson =
          obj.targetMode === 'skill' ||
          (typeof obj.subcategory === 'string' && /skill/i.test(obj.subcategory)) ||
          Boolean(filename && /skill/i.test(filename));

        state.title = jsonTitle;
        state.description = jsonDesc;
        state.blocks = blocks;
        state.targetMode = isSkillJson ? 'skill' : 'prompt';
        if (state.targetMode === 'skill') {
          const rawSkillName = formatUnknownValue(obj.skillName) || jsonTitle;
          state.skillName = toKebabCaseSkillName(rawSkillName).slice(0, MAX_SKILL_NAME_LENGTH);
          state.skillDescription = cleanCanvasText(
            formatUnknownValue(obj.skillDescription) || jsonDesc
          ).slice(0, MAX_SKILL_DESCRIPTION_LENGTH);
          state.skillTagline = formatUnknownValue(obj.skillTagline);
          state.skillPriceUsd = sanitizeOptionalPrice(obj.skillPriceUsd);
          state.skillTags = formatUnknownValue(obj.skillTags);
          state.skillDemoRequest = formatUnknownValue(obj.skillDemoRequest);
          state.skillDemoResult = formatUnknownValue(obj.skillDemoResult);
        }
        state.updatedAt = Date.now();
        return state;
      }
    } catch {
      // Fall through to markdown / plain text parsing if not valid JSON
    }
  }

  // 2. YAML Frontmatter + Markdown Sections Parsing
  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/);
  if (frontmatterMatch) {
    const meta = parseYamlFrontmatterBlock(frontmatterMatch[1]);
    const bodyText = (frontmatterMatch[2] ?? '').trim();
    const parsedMd = parseMarkdownSections(bodyText, language);

    state.targetMode = 'skill';
    state.skillName = meta.name
      ? toKebabCaseSkillName(meta.name).slice(0, MAX_SKILL_NAME_LENGTH)
      : toKebabCaseSkillName(parsedMd.headingTitle || fileBaseTitle || 'custom-skill');
    state.skillDescription = truncateCleanly(
      cleanCanvasText(meta.description),
      MAX_SKILL_DESCRIPTION_LENGTH
    );
    if (meta.compatibility) {
      state.skillCompatibility = meta.compatibility;
    }

    state.title =
      parsedMd.headingTitle ||
      cleanCanvasText(meta.name) ||
      fileBaseTitle ||
      deriveTitleFromFirstLine(bodyText) ||
      (language === 'id' ? 'Agent Skill Impor' : 'Imported Agent Skill');
    state.description = state.skillDescription;
    state.blocks = parsedMd.blocks;
    state.scratchpad = cleanCanvasText(parsedMd.scratchpadParts.join('\n\n'));
    state.fewShotInput = parsedMd.fewShotInput;
    state.fewShotOutput = parsedMd.fewShotOutput;
    if (parsedMd.demoRequest) {
      state.skillDemoRequest = parsedMd.demoRequest;
    }
    if (parsedMd.demoResult) {
      state.skillDemoResult = parsedMd.demoResult;
    }
    state.updatedAt = Date.now();
    return state;
  }

  // 3. Markdown without frontmatter (when skill headings or >= 2 ## headings exist)
  const detectedKind = detectUploadedContentKind(normalized, filename);
  const hasH2Sections = (normalized.match(/^##\s+.+$/gm) || []).length >= 2;
  if (detectedKind === 'skill' || hasH2Sections) {
    const parsedMd = parseMarkdownSections(normalized, language);
    if (parsedMd.blocks.length > 0 || parsedMd.scratchpadParts.length > 0) {
      state.targetMode = detectedKind;
      state.title =
        parsedMd.headingTitle ||
        fileBaseTitle ||
        deriveTitleFromFirstLine(normalized) ||
        (language === 'id' ? 'Prompt Impor' : 'Imported Prompt');
      state.blocks = parsedMd.blocks;
      state.scratchpad = cleanCanvasText(parsedMd.scratchpadParts.join('\n\n'));
      state.fewShotInput = parsedMd.fewShotInput;
      state.fewShotOutput = parsedMd.fewShotOutput;
      if (detectedKind === 'skill') {
        state.skillName = toKebabCaseSkillName(state.title).slice(0, MAX_SKILL_NAME_LENGTH);
      }
      state.updatedAt = Date.now();
      return state;
    }
  }

  // 4. Plain Text Label: value Chunk Parsing or Scratchpad Fallback
  const chunks = normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const structuredBlocks: CanvasBlock[] = [];
  const plainScratchpadChunks: string[] = [];
  let structuredMatchCount = 0;

  for (const chunk of chunks) {
    const labelMatch = chunk.match(/^([A-Za-z0-9 &/_()-]{2,40}):\s*([\s\S]+)$/);
    const rawLabel = labelMatch ? labelMatch[1].trim() : '';
    const isUrlPrefix = /^https?$/i.test(rawLabel) || (labelMatch && labelMatch[2].startsWith('//'));

    if (labelMatch && !isUrlPrefix) {
      structuredMatchCount += 1;
      const cleanLabel = cleanCanvasText(rawLabel);
      const cleanValue = cleanCanvasText(labelMatch[2].trim());
      const mapped = mapLabelToBlockType(cleanLabel);

      if (mapped === 'scratchpad') {
        plainScratchpadChunks.push(cleanValue);
      } else if (mapped === 'few_shot_input') {
        state.fewShotInput = state.fewShotInput || cleanValue;
      } else if (mapped === 'few_shot_output') {
        state.fewShotOutput = state.fewShotOutput || cleanValue;
      } else {
        structuredBlocks.push(createCanvasBlock(mapped, language, cleanLabel, cleanValue));
      }
    } else {
      plainScratchpadChunks.push(cleanCanvasText(chunk));
    }
  }

  state.targetMode = detectedKind;
  state.title =
    fileBaseTitle ||
    deriveTitleFromFirstLine(normalized) ||
    (language === 'id' ? 'Prompt Impor' : 'Imported Prompt');

  if (structuredMatchCount >= 2) {
    state.blocks = structuredBlocks;
    state.scratchpad = cleanCanvasText(plainScratchpadChunks.join('\n\n'));
  } else {
    state.blocks = [];
    state.scratchpad = cleanCanvasText(normalized);
  }

  if (state.targetMode === 'skill') {
    state.skillName = toKebabCaseSkillName(state.title).slice(0, MAX_SKILL_NAME_LENGTH);
  }
  state.updatedAt = Date.now();
  return state;
};
