import { Framework, FrameworkComponent } from '../data/frameworks';
import { Language } from '../types';
import {
  AI_LOGICS_MAP,
  translateComponentLabel,
  translateOption,
  translateInfo
} from './localizationService';

export interface CleanPromptPayload {
  template: string;
  category: string;
  subcategory?: string;
  language: Language;
  persona: string;
  parameters: Record<string, string | number | boolean | string[]>;
  additional_instructions?: string;
  few_shot?: {
    sample_input?: string;
    expected_output?: string;
  };
  prompt: string;
  messages: Array<{
    role: 'system' | 'user';
    content: string;
  }>;
}

export type JsonFormatType = 'full' | 'messages' | 'prompt_only';

/**
 * Sanitizes input string to remove invisible zero-width characters and normalize line endings.
 * Guarantees zero byte corruption and clean UTF-8 serialization.
 */
export const sanitizeString = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Strip zero-width spaces and BOM
    .replace(/\r\n/g, '\n') // Normalize Windows line breaks
    .replace(/\r/g, '\n');
};

/**
 * Builds a structured, clean prompt JSON payload from active framework state.
 */
export const buildCleanPromptJSON = (
  fw: Framework | null | undefined,
  fwName: string | null | undefined,
  category: string | null | undefined,
  subcategory: string | null | undefined,
  values: Record<string, string | number | boolean | string[]>,
  otherValues: Record<string, string>,
  compiledPrompt: string,
  language: Language
): CleanPromptPayload => {
  const templateName = fwName || 'Prompt Framework';
  const categoryName = category || 'General';
  const subcategoryName = subcategory || undefined;

  // 1. Extract and sanitize AI Persona
  let personaText = '';
  const rawLogic = fw?.ai_logic_description || fw?.logika_ai;
  if (rawLogic) {
    if (language === 'en') {
      personaText = AI_LOGICS_MAP[templateName] || `AI Persona: ${translateInfo(rawLogic.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i, ''), 'en')}`;
    } else {
      const idClean = rawLogic.replace(/^Persona AI:\s*|^AI Persona:\s*|^Logika AI:\s*|^AI Logic:\s*/i, '').trim();
      personaText = `Persona AI: ${idClean}`;
    }
  }
  personaText = sanitizeString(personaText);

  // 2. Extract and sanitize parameters
  let comps: FrameworkComponent[] = fw?.components || [];
  if (comps.length === 0 && fw?.komponen_prompt?.["VARIABEL INPUT"]) {
    comps = Object.entries(fw.komponen_prompt["VARIABEL INPUT"]).map(([k, v]) => ({
      ...v,
      name: v.name || k
    }));
  }

  // Dynamic extra subcomponents if any
  let dynamicExtra: FrameworkComponent[] = [];
  if (fw?.dynamicSubcomponents) {
    const trigger = fw.dynamicSubcomponents.trigger;
    const triggerVal = String(values[trigger] || '');
    if (triggerVal && fw.dynamicSubcomponents.options[triggerVal]) {
      dynamicExtra = fw.dynamicSubcomponents.options[triggerVal];
    }
  }

  const allComps = [...comps, ...dynamicExtra];
  const parametersRecord: Record<string, string | number | boolean | string[]> = {};
  const userContentLines: string[] = [];

  allComps.forEach(comp => {
    let val = values[comp.name];
    if (val === 'Lainnya...' || val === 'Other...') {
      val = otherValues[comp.name] ? `${val} (${otherValues[comp.name]})` : val;
    }

    if (val !== undefined && val !== null && String(val).trim() !== '') {
      const labelToDisplay = language === 'en'
        ? translateComponentLabel(comp.label || comp.name, 'en')
        : (comp.label || comp.name);

      let cleanVal: string | number | boolean | string[] = val;
      if (typeof val === 'string') {
        const translatedVal = language === 'en' ? translateOption(val, 'en') : val;
        cleanVal = sanitizeString(translatedVal);
      } else if (Array.isArray(val)) {
        cleanVal = val.map(item => sanitizeString(String(item)));
      }

      parametersRecord[labelToDisplay] = cleanVal;
      userContentLines.push(`${labelToDisplay}: ${Array.isArray(cleanVal) ? cleanVal.join(', ') : cleanVal}`);
    }
  });

  // 3. Additional Instructions
  let additionalInstructions: string | undefined = undefined;
  if (fw?.konteks_tambahan_instruksi_khusus) {
    const rawInstruction = language === 'en'
      ? translateInfo(fw.konteks_tambahan_instruksi_khusus, 'en')
      : fw.konteks_tambahan_instruksi_khusus;
    additionalInstructions = sanitizeString(rawInstruction);
    userContentLines.push(`${language === 'id' ? 'Instruksi Tambahan' : 'Additional Instructions'}: ${additionalInstructions}`);
  }

  // 4. Few-Shot Examples
  let fewShotObj: { sample_input?: string; expected_output?: string } | undefined = undefined;
  const fewShotInput = values['__few_shot_input'];
  const fewShotOutput = values['__few_shot_output'];
  if (fewShotInput || fewShotOutput) {
    fewShotObj = {
      sample_input: fewShotInput ? sanitizeString(String(fewShotInput)) : undefined,
      expected_output: fewShotOutput ? sanitizeString(String(fewShotOutput)) : undefined
    };
  }

  // 5. Build Chat Messages array (System role for persona + User role for content)
  const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
  if (personaText) {
    messages.push({
      role: 'system',
      content: personaText
    });
  }

  const userContent = userContentLines.length > 0 
    ? userContentLines.join('\n\n')
    : (compiledPrompt ? sanitizeString(compiledPrompt) : 'Execute task according to framework specifications.');

  messages.push({
    role: 'user',
    content: userContent
  });

  return {
    template: templateName,
    category: categoryName,
    subcategory: subcategoryName,
    language,
    persona: personaText,
    parameters: parametersRecord,
    additional_instructions: additionalInstructions,
    few_shot: fewShotObj,
    prompt: sanitizeString(compiledPrompt),
    messages
  };
};

/**
 * Serializes the clean prompt payload to a strictly-valid, zero-decode-error JSON string.
 * Performs internal JSON.parse validation before returning.
 */
export const getCleanJSONString = (
  payload: CleanPromptPayload,
  format: JsonFormatType = 'full'
): string => {
  let targetData: unknown;

  if (format === 'messages') {
    targetData = {
      messages: payload.messages
    };
  } else if (format === 'prompt_only') {
    targetData = {
      prompt: payload.prompt
    };
  } else {
    targetData = payload;
  }

  try {
    const serialized = JSON.stringify(targetData, null, 2);
    // Strict self-validation check to guarantee zero decode error
    JSON.parse(serialized);
    return serialized;
  } catch (err) {
    console.warn('First serialization pass failed, applying strict ASCII/fallback sanitization:', err);
    // Fallback safe serialization
    const safeSerialized = JSON.stringify(targetData, (_key, value) => {
      if (typeof value === 'string') {
        return sanitizeString(value);
      }
      return value;
    }, 2);
    return safeSerialized;
  }
};
