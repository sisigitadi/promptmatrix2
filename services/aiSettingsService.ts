export type AIProviderId = 
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'deepseek'
  | 'openrouter'
  | 'groq'
  | 'perplexity'
  | 'together'
  | 'cerebras'
  | 'sambanova'
  | 'xai'
  | 'mistral'
  | 'cohere'
  | 'huggingface'
  | 'ollama'
  | 'custom';

export interface AIProviderPreset {
  id: AIProviderId;
  name: string;
  defaultBaseUrl: string;
  defaultModel: string;
  models: { id: string; label: string; description: string }[];
  requiresApiKey: boolean;
  docUrl: string;
  placeholderKey: string;
  icon: string;
}

export const AI_PROVIDER_PRESETS: Record<AIProviderId, AIProviderPreset> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (AI Studio)',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-3.7-flash',
    models: [
      { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash', description: 'Flagship terbaru 2026, penalaran mutakhir & latensi super rendah (Rekomendasi Utama)' },
      { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro', description: 'Model penalaran kompleks, coding tingkat lanjut & analisis mendalam' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', description: 'Model ultra-ringan, super cepat & hemat kuota token' },
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', description: 'Kecepatan tinggi multimodal untuk generasi teks & analisis data' },
      { id: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro', description: 'Kemampuan penalaran matematika & logika instruksi panjang' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Versi stabil performa tinggi generasi 2.5' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Versi stabil penalaran dalam generasi 2.5' },
    ],
    requiresApiKey: true,
    docUrl: 'https://aistudio.google.com/app/apikey',
    placeholderKey: 'AIzaSy...',
    icon: '✨'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (ChatGPT & Reasoning)',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4.5-preview',
    models: [
      { id: 'gpt-4.5-preview', label: 'GPT-4.5 Preview', description: 'Model frontier terbesar & paling komprehensif OpenAI 2026 (Rekomendasi)' },
      { id: 'gpt-4o', label: 'GPT-4o (Omni)', description: 'Flagship cerdas multimodal serbaguna' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Cepat, murah, dan sangat efisien' },
      { id: 'o3-mini', label: 'o3-mini (Reasoning)', description: 'Model penalaran STEM & coding tercepat (Reasoning Effort)' },
      { id: 'o1', label: 'o1 (Master Reasoning)', description: 'Penalaran kompleks mendalam (Chain of Thought)' },
      { id: 'o1-pro', label: 'o1 Pro Mode', description: 'Penalaran intensif komputasi tinggi untuk masalah rumit' },
      { id: 'o1-mini', label: 'o1-mini', description: 'Penalaran terarah cepat' },
      { id: 'chatgpt-4o-latest', label: 'ChatGPT-4o Latest', description: 'Versi dinamis ChatGPT terkini' },
    ],
    requiresApiKey: true,
    docUrl: 'https://platform.openai.com/api-keys',
    placeholderKey: 'sk-proj-...',
    icon: '🟢'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude 3.7 & 3.5)',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-7-sonnet-20250219',
    models: [
      { id: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet', description: 'Flagship hybrid reasoning & coding paling mutakhir 2026 (Rekomendasi Utama)' },
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (v2)', description: 'Standar emas industri untuk pemahaman teks, logika & coding' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', description: 'Kecepatan kilat dengan kecerdasan setara Opus lama' },
      { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', description: 'Analisis mendalam untuk tugas bernuansa dan penulisan kreatif' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.anthropic.com/settings/keys',
    placeholderKey: 'sk-ant-...',
    icon: '🟧'
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek AI (V3 & R1)',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-reasoner',
    models: [
      { id: 'deepseek-reasoner', label: 'DeepSeek-R1 (Reasoning)', description: 'Penalaran rantai pemikiran (Chain of Thought) 671B frontier (Rekomendasi)' },
      { id: 'deepseek-chat', label: 'DeepSeek-V3 (Chat)', description: 'Model 671B MoE ultra-cerdas, responsif & sangat hemat biaya' },
    ],
    requiresApiKey: true,
    docUrl: 'https://platform.deepseek.com/api_keys',
    placeholderKey: 'sk-...',
    icon: '🔵'
  },
  xai: {
    id: 'xai',
    name: 'xAI (Grok 4.6 & Grok Series)',
    defaultBaseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-4.6',
    models: [
      { id: 'grok-4.6', label: 'Grok 4.6', description: 'Flagship xAI generasi ke-4, optimal untuk reasoning, coding & tugas kompleks (Rekomendasi)' },
      { id: 'grok-4.5', label: 'Grok 4.5', description: 'Performa tinggi untuk analisis teks dan percakapan' },
      { id: 'grok-4.1-fast', label: 'Grok 4.1 Fast', description: 'Model cepat dan hemat biaya untuk pemrosesan volume tinggi' },
      { id: 'grok-2-latest', label: 'Grok 2 (Latest)', description: 'Versi stabil Grok 2 terkini' },
      { id: 'grok-2-vision-1212', label: 'Grok 2 Vision', description: 'Model multimodal visi dan citra' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.x.ai/',
    placeholderKey: 'xai-...',
    icon: '🖤'
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI (La Plateforme)',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large 3 (Latest)', description: 'Flagship multimodal eropa untuk penalaran kompleks & multilingual (Rekomendasi)' },
      { id: 'mistral-small-latest', label: 'Mistral Small 4 (Latest)', description: 'Model hybrid mutakhir menggabungkan instruct, reasoning & coding' },
      { id: 'mistral-medium-3.5', label: 'Mistral Medium 3.5', description: 'Performa tinggi untuk use-case agentic dan coding' },
      { id: 'codestral-latest', label: 'Codestral (Latest)', description: 'Model spesialis sintesis kode dan refactoring' },
      { id: 'pixtral-large-latest', label: 'Pixtral Large', description: 'Multimodal frontier model untuk dokumen & gambar' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.mistral.ai/api-keys/',
    placeholderKey: 'mis_...',
    icon: '🌪️'
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud (LPU Ultra-Fast Inference)',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', description: '70B model dengan kecepatan 300+ token/detik (Rekomendasi)' },
      { id: 'llama-3.3-70b-specdec', label: 'Llama 3.3 70B SpecDec', description: 'Speculative decoding untuk latensi ultra rendah' },
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B', description: 'Penalaran R1 di atas hardware Groq LPU' },
      { id: 'deepseek-r1-distill-qwen-32b', label: 'DeepSeek R1 Distill Qwen 32B', description: 'Penalaran R1 berbasis Qwen 32B' },
      { id: 'qwen-3.8-27b', label: 'Qwen 3.8 27B', description: 'Multimodal dual-mode (thinking & instruct)' },
      { id: 'qwen-3-32b', label: 'Qwen 3 32B', description: 'Kecepatan respon kilat dan tool-use cerdas' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', description: 'Respons instan sub-detik' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.groq.com/keys',
    placeholderKey: 'gsk_...',
    icon: '⚡'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Universal Model Aggregator)',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-3.7-sonnet',
    models: [
      { id: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet', description: 'Flagship Anthropic hybrid reasoning' },
      { id: 'google/gemini-3.7-flash', label: 'Gemini 3.7 Flash', description: 'Flagship Google 2026 terbaru' },
      { id: 'openai/gpt-4.5-preview', label: 'OpenAI GPT-4.5 Preview', description: 'Model frontier OpenAI terbaru' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1', description: 'State-of-the-art open reasoning' },
      { id: 'deepseek/deepseek-chat', label: 'DeepSeek V3', description: 'Chat & coding 671B MoE' },
      { id: 'openai/o3-mini', label: 'OpenAI o3-mini', description: 'Fast STEM reasoning' },
      { id: 'openai/gpt-4o', label: 'OpenAI GPT-4o', description: 'Flagship OpenAI multimodal' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct', description: 'Flagship open-weights Meta' },
      { id: 'qwen/qwen-2.5-coder-32b-instruct', label: 'Qwen 2.5 Coder 32B', description: 'Spesialis coding open-weights' },
      { id: 'qwen/qwq-32b-preview', label: 'QwQ 32B Preview', description: 'Penalaran matematika & logika Qwen' },
      { id: 'mistralai/mistral-large-2411', label: 'Mistral Large 2411', description: 'Flagship Eropa multilingual' },
    ],
    requiresApiKey: true,
    docUrl: 'https://openrouter.ai/keys',
    placeholderKey: 'sk-or-v1-...',
    icon: '🟣'
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI (Live Web Search & Reasoning)',
    defaultBaseUrl: 'https://api.perplexity.ai',
    defaultModel: 'sonar-reasoning-pro',
    models: [
      { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro', description: 'Penalaran DeepSeek R1 dengan live web citations (Rekomendasi)' },
      { id: 'sonar-reasoning', label: 'Sonar Reasoning', description: 'Pencarian web bernalar cepat' },
      { id: 'sonar-pro', label: 'Sonar Pro', description: 'Model pencarian internet mendalam 200k konteks' },
      { id: 'sonar', label: 'Sonar', description: 'Pencarian web ringan dan cepat' },
      { id: 'r1-1776', label: 'R1-1776', description: 'DeepSeek R1 tanpa bias sensor' },
    ],
    requiresApiKey: true,
    docUrl: 'https://www.perplexity.ai/settings/api',
    placeholderKey: 'pplx-...',
    icon: '🌐'
  },
  together: {
    id: 'together',
    name: 'Together AI (Open-Source Frontier)',
    defaultBaseUrl: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo', description: 'Inferensi Llama tercepat dengan serverless scaling' },
      { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1 (Full 671B)', description: 'Model penalaran penuh DeepSeek R1' },
      { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3', description: 'Model chat general purpose 671B' },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen 2.5 72B Turbo', description: 'Flagship multilingual & math master' },
      { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B', description: 'Coding open-weights terbaik' },
      { id: 'Qwen/QwQ-32B-Preview', label: 'QwQ 32B Preview', description: 'Reasoning model dari Qwen' },
    ],
    requiresApiKey: true,
    docUrl: 'https://api.together.ai/settings/api-keys',
    placeholderKey: 'tog-...',
    icon: '🤝'
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras Cloud (World-Record WSE Speed)',
    defaultBaseUrl: 'https://api.cerebras.ai/v1',
    defaultModel: 'llama-3.3-70b',
    models: [
      { id: 'llama-3.3-70b', label: 'Llama 3.3 70B (2000+ tps)', description: 'Rekor dunia kecepatan 2000+ token per detik' },
      { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B', description: 'Penalaran R1 instan tanpa waktu tunggu' },
      { id: 'llama3.1-8b', label: 'Llama 3.1 8B', description: 'Eksekusi ultra instan' },
    ],
    requiresApiKey: true,
    docUrl: 'https://cloud.cerebras.ai/',
    placeholderKey: 'csk-...',
    icon: '🚀'
  },
  sambanova: {
    id: 'sambanova',
    name: 'SambaNova Cloud (Full Precision SN40L)',
    defaultBaseUrl: 'https://api.sambanova.ai/v1',
    defaultModel: 'Meta-Llama-3.3-70B-Instruct',
    models: [
      { id: 'Meta-Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B (Full Precision)', description: 'Kualitas FP16 murni dengan kecepatan tinggi' },
      { id: 'DeepSeek-R1', label: 'DeepSeek R1 (Full 671B)', description: 'Penalaran penuh 671B di atas cluster SambaNova' },
      { id: 'Qwen2.5-72B-Instruct', label: 'Qwen 2.5 72B Instruct', description: 'Multilingual and reasoning powerhouse' },
    ],
    requiresApiKey: true,
    docUrl: 'https://cloud.sambanova.ai/',
    placeholderKey: 'samba-...',
    icon: '⚡'
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere (Command R+ Enterprise)',
    defaultBaseUrl: 'https://api.cohere.com/v2',
    defaultModel: 'command-r-plus-08-2024',
    models: [
      { id: 'command-r-plus-08-2024', label: 'Command R+ (Latest)', description: 'Model enterprise untuk RAG dan instruksi bisnis rumit' },
      { id: 'command-r-08-2024', label: 'Command R', description: 'Efisien, cepat untuk penalaran multi-step' },
      { id: 'command-a-03-2025', label: 'Command A (Preview)', description: 'Model generasi berikutnya dari Cohere' },
      { id: 'command-r7b-12-2024', label: 'Command R 7B', description: 'Versi ringan berkecepatan tinggi' },
    ],
    requiresApiKey: true,
    docUrl: 'https://dashboard.cohere.com/api-keys',
    placeholderKey: 'coh-...',
    icon: '🏛️'
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face (Serverless Inference API)',
    defaultBaseUrl: 'https://api-inference.huggingface.co/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B Instruct', description: 'Meta Flagship open weights di HF' },
      { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1', description: 'Reasoning model di HF Serverless' },
      { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B', description: 'State of the art open coder' },
    ],
    requiresApiKey: true,
    docUrl: 'https://huggingface.co/settings/tokens',
    placeholderKey: 'hf_...',
    icon: '🤗'
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local Offline AI)',
    defaultBaseUrl: 'http://localhost:11434/v1',
    defaultModel: 'deepseek-r1:latest',
    models: [
      { id: 'deepseek-r1:latest', label: 'DeepSeek-R1 (Latest)', description: 'Penalaran reasoning lokal resmi DeepSeek R1' },
      { id: 'deepseek-r1:70b', label: 'DeepSeek-R1:70b', description: 'Penalaran penuh 70B untuk GPU besar' },
      { id: 'deepseek-r1:32b', label: 'DeepSeek-R1:32b', description: 'Keseimbangan akurasi dan kecepatan reasoning' },
      { id: 'deepseek-r1:14b', label: 'DeepSeek-R1:14b', description: 'R1 reasoning optimal di 16GB RAM/VRAM' },
      { id: 'deepseek-r1:8b', label: 'DeepSeek-R1:8b', description: 'Distilasi Llama-3.1 8B dengan penalaran R1' },
      { id: 'llama3.3:70b', label: 'Llama 3.3:70b', description: 'Model open-source terbesar Meta untuk GPU 24GB+' },
      { id: 'llama3.2:3b', label: 'Llama 3.2:3b', description: 'Ultra-ringan untuk laptop & CPU' },
      { id: 'qwen2.5-coder:32b', label: 'Qwen 2.5 Coder:32b', description: 'Coding master class open-weights' },
      { id: 'qwen2.5-coder:7b', label: 'Qwen 2.5 Coder:7b', description: 'Spesialis koding lokal ringan' },
      { id: 'qwq:latest', label: 'QwQ (Latest)', description: 'Model penalaran dari Qwen' },
      { id: 'phi4:latest', label: 'Phi-4 (14B)', description: 'Model matematika & penalaran sintetis Microsoft' },
    ],
    requiresApiKey: false,
    docUrl: 'https://ollama.com/',
    placeholderKey: 'Opsional (tidak wajib untuk Ollama)',
    icon: '🦙'
  },
  custom: {
    id: 'custom',
    name: 'Kustom / OpenAI-Compatible (LM Studio, vLLM, LiteLLM, Cloudflare AI)',
    defaultBaseUrl: 'http://localhost:1234/v1',
    defaultModel: 'local-model',
    models: [
      { id: 'local-model', label: 'local-model', description: 'Model aktif di LM Studio / Local Host' },
      { id: 'default', label: 'default', description: 'Default fallback model' },
    ],
    requiresApiKey: false,
    docUrl: 'https://platform.openai.com/docs/api-reference',
    placeholderKey: 'API key kustom Anda (jika diperlukan)',
    icon: '⚙️'
  }
};

export interface AISettings {
  provider: AIProviderId;
  apiKey: string;
  baseUrl: string;
  model: string;
  customHeaders?: Record<string, string>;
}

const SETTINGS_STORAGE_KEY = 'promptmatrix_ai_unified_settings';
const LEGACY_GEMINI_KEY = 'promptmatrix_gemini_api_key';

export const getDefaultSettings = (): AISettings => ({
  provider: 'gemini',
  apiKey: '',
  baseUrl: AI_PROVIDER_PRESETS.gemini.defaultBaseUrl,
  model: AI_PROVIDER_PRESETS.gemini.defaultModel
});

export const getStoredAISettings = (): AISettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed: AISettings = JSON.parse(raw);
      return {
        ...getDefaultSettings(),
        ...parsed
      };
    }

    // Check legacy Gemini key
    const legacyKey = localStorage.getItem(LEGACY_GEMINI_KEY);
    if (legacyKey && legacyKey.trim()) {
      return {
        ...getDefaultSettings(),
        apiKey: legacyKey.trim()
      };
    }

    // Check env vars
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY) {
        return {
          ...getDefaultSettings(),
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY
        };
      }
    }
  } catch (e) {
    console.warn('Error reading AI settings from storage:', e);
  }

  return getDefaultSettings();
};

export const saveAISettings = (settings: AISettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    if (settings.provider === 'gemini') {
      localStorage.setItem(LEGACY_GEMINI_KEY, settings.apiKey);
    }
  } catch (e) {
    console.error('Error saving AI settings:', e);
  }
};

export const removeAISettings = (): void => {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    localStorage.removeItem(LEGACY_GEMINI_KEY);
  } catch (e) {
    console.error('Error removing AI settings:', e);
  }
};

export const isAIConfigured = (): boolean => {
  const settings = getStoredAISettings();
  const preset = AI_PROVIDER_PRESETS[settings.provider] || AI_PROVIDER_PRESETS.custom;
  if (!preset.requiresApiKey) return true; // e.g. Ollama or local endpoint
  return Boolean(settings.apiKey && settings.apiKey.trim().length > 0);
};
