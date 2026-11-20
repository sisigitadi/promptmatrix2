import {
  getStoredAISettings,
  AISettings,
  AI_PROVIDER_PRESETS,
  AIProviderId,
  sanitizeApiKey,
  detectKeyProviderMismatch,
} from './aiSettingsService';
import { BlankCanvasTargetMode, CanvasBlockType, Language } from '../types';
import {
  buildBlankCanvasAgentSkillSpec,
  compileBlankCanvasPrompt,
  createCanvasBlock,
  createEmptyCanvasState,
  detectUploadedContentKind,
} from './blankCanvasService';
import { formatAgentSkillMarkdown } from './agentSkillService';

export interface PromptAnalysisResult {
  clarityScore: number;
  specificityScore: number;
  overallScore: number;
  feedback: string;
  suggestions: string[];
}

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role?: string;
  parts: GeminiPart[];
}

interface GeminiPayload {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: GeminiPart[];
  };
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * Universal text generation dispatcher supporting Gemini, OpenAI, DeepSeek, OpenRouter, Groq, Anthropic, and Local Ollama/Custom Base URLs.
 */
export const generateTextWithUniversalAI = async (
  prompt: string,
  systemInstruction: string = '',
  overrideSettings?: AISettings,
  options?: GenerateOptions
): Promise<string> => {
  const settings = overrideSettings || getStoredAISettings();
  const { provider, apiKey, baseUrl } = settings;

  // Sanitize model: strip sentinel values and whitespace
  const model = (settings.model || '').trim();
  if (model === '__custom_empty__') {
    throw new Error('Harap pilih atau ketik nama model AI terlebih dahulu.');
  }

  // 1. Google Gemini Provider
  if (provider === 'gemini') {
    return generateWithGemini(prompt, systemInstruction, apiKey, model, baseUrl, options);
  }

  // 2. Anthropic Claude Provider (Official Direct)
  if (provider === 'anthropic' && (!baseUrl || baseUrl.includes('anthropic.com'))) {
    return generateWithAnthropic(prompt, systemInstruction, apiKey, baseUrl, model, options);
  }

  // 3. OpenAI, DeepSeek, OpenRouter, Groq, One API/New API Router, Ollama, and all OpenAI-compatible Custom endpoints
  return generateWithOpenAICompatible(prompt, systemInstruction, apiKey, baseUrl, model, options);
};

// --- GEMINI HANDLER ---
const generateWithGemini = async (
  prompt: string,
  systemInstruction: string,
  apiKey: string,
  model: string,
  baseUrl?: string,
  options?: GenerateOptions
): Promise<string> => {
  const cleanKey = sanitizeApiKey(apiKey);
  if (!cleanKey) throw new Error('API Key Google Gemini belum diisi. Silakan atur di menu Pengaturan AI ⚙️.');

  let cleanBase = (baseUrl || 'https://generativelanguage.googleapis.com').replace(/\/+$/, '');
  cleanBase = cleanBase.replace(/\/models$/, '').replace(/\/chat\/completions$/, '');
  const root = cleanBase.endsWith('/v1beta') ? cleanBase : `${cleanBase}/v1beta`;

  const payload: GeminiPayload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 2048,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const sendRequest = async (modelToUse: string): Promise<Response> => {
    const url = `${root}/models/${modelToUse}:generateContent?key=${encodeURIComponent(cleanKey)}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  let targetModel = model || 'gemini-4-carbon';
  let response = await sendRequest(targetModel);

  // Auto-fallback: If 404 (model not found on API), try sibling active models in the Gemini lineup
  if (response.status === 404) {
    const alternativeModels = ['gemini-4-argon', 'gemini-4-hydrogen', 'gemini-3.8-flash'].filter((m) => m !== targetModel);
    for (const alt of alternativeModels) {
      const altResponse = await sendRequest(alt);
      if (altResponse.ok) {
        response = altResponse;
        targetModel = alt;
        break;
      }
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({})) as { error?: { message?: string } };
    const msg = errData?.error?.message || response.statusText;
    let hint = '';
    if (response.status === 404) {
      hint = ' (Tips: Pastikan model aktif di Google AI Studio atau pilih gemini-4-carbon / gemini-4-argon / gemini-4-hydrogen)';
    }
    throw new Error(`Google Gemini Error (${response.status}): ${msg}${hint}`);
  }

  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidate) {
    throw new Error('Google Gemini tidak menghasilkan respons teks.');
  }

  return candidate.trim();
};

// --- OPENAI-COMPATIBLE & CUSTOM BASE URL HANDLER (WITH STREAM & SSE PARSER) ---
const generateWithOpenAICompatible = async (
  prompt: string,
  systemInstruction: string,
  apiKey: string,
  baseUrl: string,
  model: string,
  options?: GenerateOptions
): Promise<string> => {
  let cleanBase = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  let endpoint = cleanBase.endsWith('/chat/completions') ? cleanBase : `${cleanBase}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream'
  };

  const cleanKey = sanitizeApiKey(apiKey);
  if (cleanKey) {
    headers['Authorization'] = `Bearer ${cleanKey}`;
  }

  // OpenRouter additional header identification
  if (cleanBase.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = 'https://github.com/sisigitadi/promptmatrix';
    headers['X-Title'] = 'PromptMatrix';
  }

  const messages: OpenAIMessage[] = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const payload: Record<string, unknown> = {
    model: model || 'gpt-6.1-sol',
    messages,
    temperature: options?.temperature ?? 0.7,
    stream: options?.stream ?? false // Explicitly disable stream, though we also parse SSE chunks below
  };

  if (options?.maxTokens) {
    payload['max_tokens'] = options.maxTokens;
    payload['max_completion_tokens'] = options.maxTokens;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    let parsedMsg = '';
    try {
      const parsed = JSON.parse(responseText) as { error?: { message?: string }; message?: string };
      parsedMsg = parsed?.error?.message || parsed?.message || '';
    } catch {
      parsedMsg = responseText;
    }
    let hint = '';
    if (response.status === 401 || response.status === 403) {
      const keyLen = cleanKey.length;
      if (keyLen === 0) {
        hint = ` (Diagnostik: API Key kosong. Harap isi API Key dari dashboard provider Anda.)`;
      } else if (cleanBase.includes('intern-ai.org.cn')) {
        hint = ` (Diagnostik Intern-Discovery: API Key terdeteksi (${keyLen} karakter) namun ditolak server. Pastikan API Key disalin lengkap dari tab "API Key" di https://discovery.intern-ai.org.cn/ tanpa spasi tambahan. Model yang dikirim: "${model}")`;
      } else {
        hint = ` (Diagnostik: API Key terdeteksi (${keyLen} karakter) namun ditolak server. Pastikan key disalin lengkap tanpa spasi dari dashboard provider. Endpoint: ${endpoint}, Model: "${model}")`;
      }
    } else if (response.status === 404 && model.includes('gemini')) {
      hint = ' (Tips: Untuk router kustom / OpenAI-compatible, pastikan model terdaftar atau coba gunakan prefix seperti "google/gemini-4-carbon" atau "gemini-4-argon")';
    } else if (response.status === 404) {
      hint = ` (Tips: Model "${model}" tidak ditemukan di server endpoint ${cleanBase}. Pastikan nama model benar atau gunakan tombol "Muat Model" untuk melihat model yang tersedia.)`;
    } else if (response.status === 429) {
      if (cleanBase.includes('intern-ai.org.cn')) {
        hint = ' (Tips Intern-Discovery: Server terhubung & API Key valid, namun saldo kredit akun habis atau rate-limited. Silakan periksa sisa kredit di dashboard https://discovery.intern-ai.org.cn/ atau pilih model hemat seperti Agents-A1 atau Sage-A1.5)';
      } else {
        hint = ' (Tips: Server terhubung & API Key valid, namun kuota atau saldo kredit akun Anda di provider habis)';
      }
    }
    throw new Error(`AI Provider Error (${response.status}): ${parsedMsg || response.statusText}${hint}`);
  }

  // Case 1: Response is SSE Stream format (e.g. "data: {"id": ...}")
  if (responseText.trim().startsWith('data:')) {
    const lines = responseText.split('\n');
    let fullContent = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]' || trimmed === '[DONE]') continue;
      if (trimmed.startsWith('data:')) {
        const jsonString = trimmed.replace(/^data:\s*/, '');
        try {
          const chunk = JSON.parse(jsonString);
          const delta = chunk?.choices?.[0]?.delta?.content ||
            chunk?.choices?.[0]?.message?.content ||
            chunk?.choices?.[0]?.text || '';
          fullContent += delta;
        } catch {
          // ignore single chunk parse errors
        }
      }
    }
    if (fullContent.trim()) {
      return fullContent.trim();
    }
  }

  // Case 2: Standard JSON response
  try {
    const data = JSON.parse(responseText);
    const content = data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.content?.[0]?.text;
    if (content) {
      return content.trim();
    }
  } catch (err) {
    console.warn('Direct JSON parse failed, trying chunk extraction:', err);
  }

  // Case 3: Fallback raw text if valid
  if (responseText && !responseText.includes('{"error":')) {
    return responseText.trim();
  }

  throw new Error('Model AI tidak mengembalikan konten teks yang valid.');
};

// --- ANTHROPIC CLAUDE HANDLER ---
const generateWithAnthropic = async (
  prompt: string,
  systemInstruction: string,
  apiKey: string,
  baseUrl: string,
  model: string,
  options?: GenerateOptions
): Promise<string> => {
  const cleanKey = sanitizeApiKey(apiKey);
  if (!cleanKey) throw new Error('API Key Anthropic Claude belum diisi.');

  const cleanBase = (baseUrl || 'https://api.anthropic.com/v1').replace(/\/+$/, '');
  const endpoint = cleanBase.endsWith('/messages') ? cleanBase : `${cleanBase}/messages`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': cleanKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  };

  const payload: {
    model: string;
    max_tokens: number;
    messages: Array<{ role: string; content: string }>;
    system?: string;
  } = {
    model: model || 'claude-sonnet-5-5',
    max_tokens: options?.maxTokens ?? 2048,
    messages: [
      { role: 'user', content: prompt }
    ]
  };

  if (systemInstruction) {
    payload.system = systemInstruction;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    let msg = '';
    try {
      const errData = JSON.parse(responseText);
      msg = errData?.error?.message || response.statusText;
    } catch {
      msg = responseText;
    }
    throw new Error(`Anthropic Error (${response.status}): ${msg}`);
  }

  try {
    const data = JSON.parse(responseText);
    const text = data?.content?.[0]?.text;
    if (text) return text.trim();
  } catch {
    // Fallback
  }

  return responseText.trim();
};

// --- FETCH AVAILABLE MODELS FROM ENDPOINT ---
export const fetchModelsFromEndpoint = async (
  baseUrl: string,
  apiKey: string,
  provider?: AIProviderId
): Promise<string[]> => {
  let cleanBase = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');

  // Remove /chat/completions if included in base URL
  cleanBase = cleanBase.replace(/\/chat\/completions$/, '');

  // Intern-Discovery gateway blocks CORS on /v1/models (405 on OPTIONS / no Access-Control-Allow-Origin),
  // but /v1/chat/completions works with CORS in browser fetch.
  // Return verified official Intern-Discovery research models roster directly from https://discovery.intern-ai.org.cn/
  if (cleanBase.includes('intern-ai.org.cn') || provider === 'internai') {
    return [
      'Agents-A1',
      'Atria-Dawn',
      'Sage-A1.5',
      'Sage-A1.5-Taiyi',
      'Sage-S2.1-Flash',
      'deepseek-v4.1-flash-1017',
      'glm-5.3',
      'intern-decision-4b',
      'intern-s2',
      'kimi-k3.1-pro',
      'qwen3.8-27b',
    ];
  }

  const isGeminiEndpoint = provider === 'gemini' || cleanBase.includes('generativelanguage.googleapis.com');
  const isAnthropicEndpoint = provider === 'anthropic' || cleanBase.includes('api.anthropic.com');

  let endpoint = cleanBase.endsWith('/models') ? cleanBase : `${cleanBase}/models`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cleanKey = sanitizeApiKey(apiKey);
  if (isGeminiEndpoint) {
    if (!cleanKey) {
      throw new Error('API Key Google Gemini diperlukan untuk mengambil daftar model.');
    }
    const geminiRoot = cleanBase.endsWith('/v1beta') ? cleanBase : `${cleanBase}/v1beta`;
    endpoint = `${geminiRoot}/models?key=${encodeURIComponent(cleanKey)}`;
  } else if (isAnthropicEndpoint) {
    if (!cleanKey) {
      throw new Error('API Key Anthropic diperlukan untuk mengambil daftar model.');
    }
    headers['x-api-key'] = cleanKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  } else if (cleanKey) {
    headers['Authorization'] = `Bearer ${cleanKey}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers
    });

    const text = await response.text();

    if (!response.ok) {
      let msg = '';
      try {
        const parsed = JSON.parse(text);
        msg = parsed?.error?.message || parsed?.message || '';
      } catch {
        msg = text;
      }
      throw new Error(`Gagal mengambil model (${response.status}): ${msg || response.statusText}`);
    }

    const data = JSON.parse(text) as {
      data?: Array<{ id?: string; name?: string }>;
      models?: Array<{ id?: string; name?: string }>;
    } | Array<string | { id?: string; name?: string }>;

    if (!Array.isArray(data) && Array.isArray(data?.data)) {
      return data.data.map((item) => item.id || item.name || '').filter(Boolean);
    }
    if (!Array.isArray(data) && Array.isArray(data?.models)) {
      return data.models
        .map((item) => {
          const raw = item.id || item.name || '';
          return isGeminiEndpoint ? raw.replace(/^models\//, '') : raw;
        })
        .filter(Boolean);
    }
    if (Array.isArray(data)) {
      return data
        .map((item) => (typeof item === 'string' ? item : item.id || item.name || ''))
        .filter(Boolean);
    }
  } catch (err: unknown) {
    if (cleanBase.includes('intern-ai.org.cn')) {
      return [
        'Agents-A1',
        'Atria-Dawn',
        'Sage-A1.5',
        'Sage-A1.5-Taiyi',
        'Sage-S2.1-Flash',
        'deepseek-v4.1-flash-1017',
        'glm-5.3',
        'intern-decision-4b',
        'intern-s2',
        'kimi-k3.1-pro',
        'qwen3.8-27b',
      ];
    }
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      throw new Error('Koneksi ke endpoint /models terhalang kebijakan CORS browser atau server tidak aktif. Silakan pilih model dari daftar terkurasi atau ketik nama model secara manual.');
    }
    throw err;
  }

  return [];
};

// --- HIGH-LEVEL CAPABILITIES ---

/**
 * Ensures clean paragraph spacing and optimal visual readability for prompts:
 * - Normalizes Windows CRLF to standard LF (\n)
 * - Automatically ensures a blank line (\n\n) before major labeled headers (e.g. "Persona:", "Konteks:", "Tugas:", "Instruksi:", "Batasan:", etc.) if directly joined to a previous line
 * - Ensures stanza tags (e.g. [Intro], [Chorus]) have clean spacing
 * - Normalizes 3+ consecutive newlines down to 2
 */
export const formatPromptForReadability = (text: string): string => {
  if (!text) return '';
  let str = text.replace(/\r\n/g, '\n').trim();

  // Common labeled section patterns in Indonesian and English
  const sectionKeywords = [
    'Persona AI', 'AI Persona', 'Peran AI', 'Peran', 'Role', 'System Role',
    'Konteks & Tujuan', 'Konteks', 'Context', 'Background', 'Latar Belakang',
    'Tugas Utama', 'Tugas', 'Task', 'Objective', 'Tujuan', 'Goal',
    'Variabel Input', 'Detail Masukan', 'Input Details',
    'Instruksi Utama', 'Instruksi Khusus', 'Instruksi Tambahan', 'Instruksi', 'Instructions', 'Guidelines',
    'Batasan Mutlak', 'Batasan & Kriteria', 'Batasan', 'Constraints', 'Hard Constraints',
    'Format Output', 'Format Keluaran', 'Output Format', 'Deliverables',
    'Target Audiens', 'Audiens Target', 'Target Audience', 'Audience',
    'Nada Bicara', 'Gaya Bahasa', 'Tone of Voice', 'Tone & Style', 'Tone', 'Voice',
    'Attention', 'Interest', 'Desire', 'Action',
    'Hook', 'Story', 'Offer', 'Call to Action',
    'Pencahayaan', 'Sudut Kamera', 'Optik', 'Lighting', 'Camera',
    'Catatan Khusus', 'Important Notes', 'Catatan', 'Notes'
  ];

  // Insert a blank line before recognized section headers if they are glued to the previous line
  const keywordPattern = new RegExp(
    `([^\n])\n((?:[-*•#>]+\\s*)?(?:${sectionKeywords.join('|')}):)`,
    'gi'
  );
  str = str.replace(keywordPattern, '$1\n\n$2');

  // Also ensure blank line before numbered section steps like "1. Riset:", "Step 1:", "Langkah 1:"
  str = str.replace(/([^\n])\n((?:Step|Langkah|\d+\.)\s+[A-Za-z0-9\s()&/._-]{1,30}:)/gi, '$1\n\n$2');

  // Also ensure blank line before musical/audio structural tags like "[Intro]", "[Verse]", "[Chorus]"
  str = str.replace(/([^\n])\n(\[(?:Intro|Verse|Pre-Chorus|Chorus|Bridge|Guitar Solo|Outro|Drop|Hook|Build-up)[^\]]*\])/gi, '$1\n\n$2');

  // Collapse 3 or more consecutive newlines into 2
  str = str.replace(/\n{3,}/g, '\n\n');

  return str.trim();
};

/**
 * Utility to sanitize AI-generated prompt text from unwanted markdown artifacts:
 * - Code block fences (```markdown, ```text, ```)
 * - Bold asterisks (**label** -> label)
 * - AI conversational preambles ("Berikut adalah prompt...")
 * - Wrapping outer quotes
 * - Formats paragraphs for optimal visual readability
 */
export const sanitizePromptText = (text: string): string => {
  if (!text) return '';
  let cleaned = text.trim();

  // 1. Strip markdown code fence at the start (e.g. ```markdown, ```text, ```prompt, or ```)
  cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\s*\r?\n?/i, '');
  // Strip closing markdown code fence at the end
  cleaned = cleaned.replace(/\r?\n?```\s*$/g, '');

  // 2. Strip generic conversational preamble from AI
  cleaned = cleaned.replace(/^(?:Tentu,?\s*)?(?:Berikut\s+(?:adalah\s+)?(?:hasil\s+)?(?:versi\s+)?(?:prompt\s+)?(?:yang\s+)?(?:telah\s+)?(?:disempurnakan|dioptimalkan|ditingkatkan|diperbarui)?[^:\n]*:?\s*[\r\n]+)/i, '');
  cleaned = cleaned.replace(/^(?:Sure,?\s*)?(?:Here\s+(?:is|are)\s+(?:the\s+)?(?:enhanced|improved|refined|optimized)\s+prompt[^:\n]*:?\s*[\r\n]+)/i, '');

  // 3. Strip bold formatting (**text** -> text and __text__ -> text)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');

  // 4. Strip outer quotes if the model wrapped everything in "..."
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // 5. Ensure optimal paragraph spacing & readable visual structure
  return formatPromptForReadability(cleaned);
};

/**
 * 1. Auto-Suggest Content for Specific Form Field
 */
export const suggestFieldContentWithUniversalAI = async (
  fieldLabel: string,
  frameworkName: string,
  contextSoFar: string,
  language: 'en' | 'id' = 'id'
): Promise<string> => {
  const isIndonesian = language === 'id';
  const isFewShot = /few-shot|contoh masukan|contoh keluaran|sample input|expected output/i.test(fieldLabel);

  let systemInstruction = isIndonesian
    ? `Anda adalah seorang ahli prompt engineering handal. Tugas Anda adalah memberikan satu saran isian terbaik dan spesifik untuk kolom formulir yang diminta. Berikan HANYA nilai isian langsung tanpa pembuka, tanpa tanda kutip, tanpa format tebal (**), dan tanpa penjelasan tambahan.`
    : `You are an expert AI prompt engineer. Provide ONLY the direct, high-quality, specific value for the requested form field. Do not include markdown quotes, bold asterisks (**), pleasantries, or preamble.`;

  if (isFewShot) {
    systemInstruction = isIndonesian
      ? `Anda adalah Master Prompt Engineer spesialis Few-Shot In-Context Learning. Tugas Anda adalah menyusun contoh acuan (few-shot reference exemplar) yang konkret, realistis, dan mencerminkan standar emas. Berikan HANYA teks contoh acuan langsung tanpa kata pengantar ("Berikut adalah..."), tanpa tanda kutip pembungkus, dan tanpa format tebal berlebihan.`
      : `You are a Master Prompt Engineer specializing in Few-Shot In-Context Learning. Provide ONLY the direct, realistic, gold-standard reference exemplar text without introductory preamble or markdown quotes.`;
  }

  let userPrompt = isIndonesian
    ? `Kerangka Kerja: "${frameworkName}"
Kolom yang perlu diisi: "${fieldLabel}"
Konteks isian kolom lain yang sudah ada:
${contextSoFar || '(Belum ada kolom lain yang diisi)'}

Berikan satu saran isian teks biasa yang kreatif, kontekstual, dan bernilai tinggi:`
    : `Framework: "${frameworkName}"
Target Field: "${fieldLabel}"
Other Filled Context:
${contextSoFar || '(No other fields filled yet)'}

Provide one creative, highly specific, and relevant plain-text value for this field:`;

  if (isFewShot) {
    userPrompt = isIndonesian
      ? `Kerangka Kerja: "${frameworkName}"
Target Komponen Few-Shot: "${fieldLabel}"
Konteks parameter framework yang sudah terisi:
${contextSoFar || '(Gunakan konteks umum kerangka kerja)'}

Susun satu contoh ${fieldLabel} yang konkret, realistis, dan siap ditiru oleh model AI:`
      : `Framework: "${frameworkName}"
Target Few-Shot Component: "${fieldLabel}"
Existing Framework Context:
${contextSoFar || '(Use general framework context)'}

Draft one concrete, realistic ${fieldLabel} exemplar ready for in-context learning:`;
  }

  const raw = await generateTextWithUniversalAI(userPrompt, systemInstruction);
  return sanitizePromptText(raw);
};

/**
 * 2. One-Click Prompt Enhancer
 */
export const enhancePromptWithUniversalAI = async (
  currentPrompt: string,
  frameworkName: string,
  language: 'en' | 'id' = 'id'
): Promise<string> => {
  const isIndonesian = language === 'id';

  const systemInstruction = isIndonesian
    ? `Anda adalah Master Prompt Optimizer & AI Prompt Architect Kelas Dunia. Tugas Anda adalah menyempurnakan prompt yang diberikan agar lebih tajam, kaya konteks terarah, minim ambiguitas, dan menghasilkan output maksimal pada LLM modern.

ATURAN STRUKTUR & KETERBACAAN (MUTLAK):
1. Kembalikan HANYA teks prompt hasil perbaikan dalam bentuk teks polos (plain text) tanpa kata pengantar ("Berikut adalah...") dan tanpa penutup.
2. DILARANG KERAS menggunakan blok kode markdown (JANGAN gunakan \`\`\` atau \`\`\`markdown).
3. DILARANG KERAS menggunakan format tebal asterisks (JANGAN gunakan **teks**).
4. WAJIB BERIKAN SPASI KOSONG (DOUBLE NEWLINE / DUA KALI ENTER) ANTAR SETIAP BAGIAN DAN SETIAP PARAGRAF:
   - Pisahkan Persona AI, Konteks, Instruksi/Poin Tindakan, Batasan Keras, dan Format Output dengan 1 baris kosong di antaranya.
   - Jangan pernah menggabungkan beberapa instruksi berbeda ke dalam satu blok teks padat yang rapat.
   - Format setiap seksi dengan judul jelas diikuti titik dua, contoh:

     Persona AI: [deskripsi peran mendalam]

     Konteks & Tujuan: [latar belakang dan tujuan spesifik]

     Instruksi Utama:
     - [langkah/poin tindakan 1]
     - [langkah/poin tindakan 2]

     Batasan & Kriteria: [larangan dan batasan ketat]

     Format Output: [format hasil akhir yang diharapkan]`
    : `You are a World-Class Master Prompt Optimizer & AI Prompt Architect. Elevate and polish the prompt to be sharper, richer in clarity and constraints, and maximize output quality on modern AI models.

STRICT STRUCTURE & READABILITY RULES (MANDATORY):
1. Return ONLY the plain text enhanced prompt without any introductory or concluding remarks.
2. DO NOT use markdown code block fences (NO \`\`\` or \`\`\`markdown).
3. DO NOT use bold asterisks (NO **text**).
4. MANDATORY DOUBLE NEWLINE BETWEEN SECTIONS & PARAGRAPHS:
   - Separate AI Role, Context/Objective, Key Instructions, Hard Constraints, and Output Format with a blank line between each section.
   - Never compress distinct instructions into a single dense wall of text.
   - Format each section with clear labels followed by a colon, e.g.:

     AI Role: [detailed persona description]

     Context & Goal: [specific background and objective]

     Key Instructions:
     - [action point 1]
     - [action point 2]

     Constraints: [hard constraints and boundaries]

     Output Format: [deliverables specification]`;

  const userPrompt = isIndonesian
    ? `Kerangka Kerja: "${frameworkName}"
Prompt Awal:
"""
${currentPrompt}
"""

Tingkatkan dan poles prompt di atas menjadi versi paling optimal. Pastikan setiap bagian/paragraf dipisahkan oleh satu baris kosong agar sangat rapi, nyaman dibaca, dan mudah ditinjau sebelum disalin:`
    : `Framework: "${frameworkName}"
Initial Prompt:
"""
${currentPrompt}
"""

Enhance and refine the prompt above to the absolute highest standard. Ensure every section and paragraph is separated by an empty line so it is exceptionally clean, comfortable to read, and easy to review before copying:`;

  const raw = await generateTextWithUniversalAI(userPrompt, systemInstruction);
  return sanitizePromptText(raw);
};

/**
 * 3. AI Quality Assessment & Scoring
 */
export const analyzePromptQualityWithUniversalAI = async (
  promptToAnalyze: string,
  frameworkName: string,
  language: 'en' | 'id' = 'id'
): Promise<PromptAnalysisResult> => {
  const isIndonesian = language === 'id';

  const systemInstruction = isIndonesian
    ? `Anda adalah Evaluator Kualitas Prompt AI. Analisis prompt yang diberikan dan berikan penilaian dalam format JSON baku persis seperti berikut:
{
  "clarityScore": 85,
  "specificityScore": 90,
  "overallScore": 88,
  "feedback": "Evaluasi singkat 2-3 kalimat mengenai kekuatan prompt.",
  "suggestions": [
    "Saran perbaikan konkret 1",
    "Saran perbaikan konkret 2"
  ]
}
Skor berupa bilangan bulat 0 sampai 100. Kembalikan HANYA string JSON yang valid.`
    : `You are an AI Prompt Quality Evaluator. Analyze the prompt and return pure JSON format with clarityScore (0-100), specificityScore (0-100), overallScore (0-100), feedback (string), suggestions (string array). Return pure JSON only.`;

  const userPrompt = isIndonesian
    ? `Kerangka Kerja: "${frameworkName}"
Prompt yang dievaluasi:
"""
${promptToAnalyze}
"""`
    : `Framework: "${frameworkName}"
Prompt to evaluate:
"""
${promptToAnalyze}
"""`;

  try {
    const rawResult = await generateTextWithUniversalAI(userPrompt, systemInstruction);
    const cleaned = rawResult
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    return {
      clarityScore: typeof parsed.clarityScore === 'number' ? parsed.clarityScore : 80,
      specificityScore: typeof parsed.specificityScore === 'number' ? parsed.specificityScore : 85,
      overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : 83,
      feedback: parsed.feedback || (isIndonesian ? 'Prompt tersusun dengan baik dan jelas.' : 'Well-structured prompt.'),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    };
  } catch (error) {
    console.warn('Fallback parsing quality analysis result:', error);
    return {
      clarityScore: 82,
      specificityScore: 86,
      overallScore: 84,
      feedback: isIndonesian
        ? 'Prompt memiliki struktur yang cukup baik dan dapat dieksekusi dengan baik oleh AI.'
        : 'The prompt has solid clarity and structure.',
      suggestions: isIndonesian
        ? ['Pertimbangkan untuk menambahkan contoh keluaran (*few-shot example*) untuk hasil yang lebih spesifik.']
        : ['Consider adding an example output to guide the model further.']
    };
  }
};

/**
 * 4. Test Provider Connection
 */
export const testAIConnection = async (
  settings: AISettings
): Promise<{ success: boolean; message: string; isQuotaExceeded?: boolean; isAuthError?: boolean }> => {
  const sanitizedModel = (settings.model || '').trim();
  if (!sanitizedModel || sanitizedModel === '__custom_empty__') {
    return {
      success: false,
      message: 'Harap tentukan atau ketik nama model AI terlebih dahulu sebelum melakukan uji coba koneksi.'
    };
  }

  const preset = AI_PROVIDER_PRESETS[settings.provider] || AI_PROVIDER_PRESETS.custom;
  const cleanKey = sanitizeApiKey(settings.apiKey);

  // Pre-flight: Check if the key format belongs to a completely different provider
  const mismatchWarning = detectKeyProviderMismatch(cleanKey, settings.provider);
  if (mismatchWarning) {
    return {
      success: false,
      isAuthError: true,
      message: `Format API Key tidak cocok dengan ${preset.name}!\n\n⚠️ ${mismatchWarning}\n\nPastikan Anda menyalin kunci dari dashboard resmi yang sesuai (${preset.docUrl || 'dashboard provider'}).`
    };
  }

  // Pre-flight: validate API Key presence for providers that require it
  if (preset.requiresApiKey && !cleanKey) {
    return {
      success: false,
      isAuthError: true,
      message: `API Key untuk ${preset.name} belum diisi.\n\nHarap salin API Key dari dashboard provider dan tempel di kolom "API Key" sebelum melakukan uji coba koneksi.`
    };
  }

  // Build a clean settings copy to avoid sentinel model values and malformed keys
  const cleanSettings: AISettings = {
    ...settings,
    apiKey: cleanKey,
    model: sanitizedModel,
  };

  try {
    const res = await generateTextWithUniversalAI(
      'Ping',
      'Balas hanya kata "OK".',
      cleanSettings,
      { maxTokens: 8, temperature: 0.1 }
    );
    return { success: true, message: `Koneksi berhasil! Respons model: "${res.slice(0, 100)}"` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    // 429 Quota Exceeded
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
      const isInternAi = settings.baseUrl?.includes('intern-ai.org.cn') || settings.provider === 'internai';
      const diagnostic = isInternAi
        ? 'Endpoint & API Key BERHASIL terhubung dan terotentikasi oleh server Shanghai AI Lab! Namun akun Anda saat ini kehabisan saldo kredit (HTTP 429 Quota Exceeded). Silakan cek saldo kredit di dashboard https://discovery.intern-ai.org.cn/ (menu Usage/API Key) atau coba model hemat seperti Agents-A1 atau Sage-A1.5 yang membutuhkan hanya 4 kredit.'
        : 'Endpoint & API Key BERHASIL terhubung dan terotentikasi! Namun akun Anda di provider mengalami limitasi kuota atau saldo kredit habis (HTTP 429 Quota Exceeded). Silakan periksa sisa kuota/billing di dashboard provider Anda.';
      return {
        success: false,
        isQuotaExceeded: true,
        message: `${msg}\n\n--- Diagnostik: ${diagnostic}`
      };
    }

    // 401/403 Auth Error
    if (msg.includes('401') || msg.includes('403') || msg.toLowerCase().includes('invalid token') || msg.toLowerCase().includes('invalid_api_key') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('forbidden')) {
      const keyLen = cleanKey.length;
      const isInternAi = settings.baseUrl?.includes('intern-ai.org.cn') || settings.provider === 'internai';
      let authDiagnostic = '';
      if (keyLen === 0) {
        authDiagnostic = 'API Key kosong. Harap isi API Key dari dashboard provider Anda.';
      } else if (isInternAi) {
        authDiagnostic = `API Key terdeteksi (${keyLen} karakter) namun ditolak server Intern-Discovery (Shanghai AI Lab).\n\n📌 Mengapa error ini muncul di SEMUA model?\nKarena HTTP 401 adalah penolakan otentikasi token akun di gateway server, sebelum server mengecek nama model apa pun.\n\n💡 Panduan Perbaikan:\n1. Buka https://discovery.intern-ai.org.cn/ dan masuk ke akun Anda\n2. Klik tab "API Key" (di sebelah kiri tab "Models")\n3. Buat API Key baru jika belum ada, atau klik tombol salin (copy) pada API Key aktif\n4. Tempel di kolom API Key PromptMatrix (sistem otomatis membersihkan spasi/tanda kutip)\n5. Pastikan yang disalin adalah API Key, bukan Session ID atau Cookie peramban`;
      } else {
        authDiagnostic = `API Key terdeteksi (${keyLen} karakter) namun ditolak server.\n\n📌 Mengapa error ini muncul di SEMUA model?\nKarena HTTP 401 adalah penolakan otentikasi token pada tingkat server, sebelum server memproses permintaan ke model spesifik.\n\n💡 Panduan Perbaikan:\n1. Pastikan API Key disalin lengkap dari dashboard ${preset.name}\n2. Periksa apakah key belum expired, dinonaktifkan, atau memiliki batasan IP\n3. Pastikan Base API URL sesuai provider (saat ini: ${settings.baseUrl})\n4. Untuk gateway proxy/router (OneAPI/LiteLLM), pastikan token terdaftar di panel admin`;
      }
      return {
        success: false,
        isAuthError: true,
        message: `${msg}\n\n--- Diagnostik Autentikasi:\n${authDiagnostic}`
      };
    }

    // Network / CORS / generic errors
    if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror') || msg.toLowerCase().includes('cors')) {
      const isLocal = settings.baseUrl?.includes('localhost') || settings.baseUrl?.includes('127.0.0.1');
      let netDiagnostic = '';
      if (isLocal) {
        netDiagnostic = `Tidak dapat terhubung ke server lokal ${settings.baseUrl}.\n\nPastikan:\n1. Server AI lokal (Ollama / LM Studio / vLLM) sedang berjalan\n2. Port yang dikonfigurasi sudah benar\n3. Server mengizinkan koneksi dari browser (CORS)`;
      } else {
        netDiagnostic = `Tidak dapat terhubung ke endpoint ${settings.baseUrl}.\n\nKemungkinan penyebab:\n1. URL endpoint salah atau tidak aktif\n2. Server memblokir permintaan dari browser (CORS restriction)\n3. Jaringan internet terputus atau firewall memblokir`;
      }
      return {
        success: false,
        message: `${msg}\n\n--- Diagnostik Jaringan:\n${netDiagnostic}`
      };
    }

    return { success: false, message: msg || 'Gagal terhubung ke API endpoint.' };
  }
};

export interface CanvasAIDraftBlock {
  type: CanvasBlockType;
  label?: string;
  value: string;
}

export interface CanvasAIDraftResult {
  title: string;
  description: string;
  scratchpad: string;
  blocks: CanvasAIDraftBlock[];
  fewShotInput?: string;
  fewShotOutput?: string;
  skillName?: string;
  skillDescription?: string;
}

const VALID_CANVAS_BLOCK_TYPES = new Set<CanvasBlockType>([
  'persona',
  'context',
  'task',
  'constraints',
  'output_format',
  'audience',
  'variable',
  'custom',
]);

const cleanCanvasDraftText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return sanitizePromptText(value)
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .trim();
};

const extractJsonObjectString = (raw: string): string => {
  const stripped = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return stripped.slice(firstBrace, lastBrace + 1);
  }
  return stripped;
};

/**
 * 5. Generate a structured Blank Canvas draft (Prompt or Agent Skill SKILL.md) from a short user idea.
 */
export const generateCanvasDraftWithUniversalAI = async (
  idea: string,
  targetMode: BlankCanvasTargetMode,
  language: Language = 'id'
): Promise<CanvasAIDraftResult> => {
  const isIndonesian = language === 'id';
  const trimmedIdea = idea.trim();

  const skillModeInstructions =
    targetMode === 'skill'
      ? isIndonesian
        ? `Target Mode adalah AGENT SKILL (SKILL.md). Anda WAJIB menyertakan:
  "skillName": "nama-skill-kebab-case-maks-64-karakter",
  "skillDescription": "deskripsi kapan AI agent harus mengaktifkan skill ini (maks 1024 karakter, jelas dan spesifik)",`
        : `Target Mode is AGENT SKILL (SKILL.md). You MUST include:
  "skillName": "kebab-case-skill-name-max-64-chars",
  "skillDescription": "clear trigger description explaining when an AI agent should invoke this skill (max 1024 chars)",`
      : isIndonesian
        ? `Target Mode adalah PROMPT STANDAR. Fokus pada kejelasan instruksi, batasan, dan format keluaran.`
        : `Target Mode is STANDARD PROMPT. Focus on instruction clarity, constraints, and output format.`;

  const systemInstruction = isIndonesian
    ? `Anda adalah Arsitek Prompt & Agent Skill Profesional. Tugas Anda mengubah ide singkat pengguna menjadi draft terstruktur untuk Blank Canvas.
${skillModeInstructions}

Kembalikan HANYA JSON murni yang valid tanpa markdown code fence, tanpa kata pengantar, dan TANPA karakter em dash.
Skema JSON wajib:
{
  "title": "Judul ringkas dan jelas",
  "description": "Deskripsi singkat 1-2 kalimat",
  "scratchpad": "Instruksi inti atau langkah kerja terstruktur",
  "blocks": [
    {
      "type": "persona | context | task | constraints | output_format | audience | variable | custom",
      "label": "Nama label bagian",
      "value": "Isi detail bagian ini"
    }
  ],
  "fewShotInput": "Contoh input singkat (opsional, kosongkan string jika tidak perlu)",
  "fewShotOutput": "Contoh output ideal (opsional, kosongkan string jika tidak perlu)"${targetMode === 'skill'
      ? `,
  "skillName": "nama-skill-kebab-case",
  "skillDescription": "Gunakan skill ini saat..."`
      : ''
    }
}
Gunakan 3 sampai 5 blok yang paling relevan dari daftar type yang tersedia.`
    : `You are a Principal Prompt & Agent Skill Architect. Transform the user's brief idea into a structured Blank Canvas draft.
${skillModeInstructions}

Return ONLY pure valid JSON with no markdown code fences, no preamble, and NO em dash characters.
Required JSON schema:
{
  "title": "Concise, clear title",
  "description": "Short 1-2 sentence description",
  "scratchpad": "Core instructions or structured execution workflow",
  "blocks": [
    {
      "type": "persona | context | task | constraints | output_format | audience | variable | custom",
      "label": "Section label name",
      "value": "Detailed content for this section"
    }
  ],
  "fewShotInput": "Brief sample input (optional, empty string if unnecessary)",
  "fewShotOutput": "Ideal expected output (optional, empty string if unnecessary)"${targetMode === 'skill'
      ? `,
  "skillName": "kebab-case-skill-name",
  "skillDescription": "Use this skill when..."`
      : ''
    }
}
Select 3 to 5 of the most relevant block types.`;

  const userPrompt = isIndonesian
    ? `Ide pengguna:\n"""\n${trimmedIdea}\n"""\nSusun JSON draft Blank Canvas dalam Bahasa Indonesia.`
    : `User idea:\n"""\n${trimmedIdea}\n"""\nCompose the Blank Canvas draft JSON in English.`;

  const rawResult = await generateTextWithUniversalAI(userPrompt, systemInstruction);

  try {
    const jsonCandidate = extractJsonObjectString(rawResult);
    const parsed: unknown = JSON.parse(jsonCandidate);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed draft is not an object.');
    }

    const record = parsed as Record<string, unknown>;
    const rawBlocks = Array.isArray(record.blocks) ? record.blocks : [];

    const blocks: CanvasAIDraftBlock[] = rawBlocks
      .map((item): CanvasAIDraftBlock | null => {
        if (!item || typeof item !== 'object') return null;
        const blockObj = item as Record<string, unknown>;
        const rawType = typeof blockObj.type === 'string' ? blockObj.type.trim() : 'custom';
        const resolvedType: CanvasBlockType = VALID_CANVAS_BLOCK_TYPES.has(
          rawType as CanvasBlockType
        )
          ? (rawType as CanvasBlockType)
          : 'custom';
        const value = cleanCanvasDraftText(blockObj.value);
        if (!value) return null;
        const label = cleanCanvasDraftText(blockObj.label);
        return {
          type: resolvedType,
          label: label || undefined,
          value,
        };
      })
      .filter((item): item is CanvasAIDraftBlock => item !== null);

    const title =
      cleanCanvasDraftText(record.title) ||
      cleanCanvasDraftText(trimmedIdea).slice(0, 60) ||
      (isIndonesian ? 'Draft Canvas AI' : 'AI Canvas Draft');
    const description = cleanCanvasDraftText(record.description);
    const scratchpad = cleanCanvasDraftText(record.scratchpad);
    const fewShotInput = cleanCanvasDraftText(record.fewShotInput) || undefined;
    const fewShotOutput = cleanCanvasDraftText(record.fewShotOutput) || undefined;
    const skillName = cleanCanvasDraftText(record.skillName) || undefined;
    const skillDescription = cleanCanvasDraftText(record.skillDescription) || undefined;

    return {
      title,
      description,
      scratchpad,
      blocks,
      fewShotInput,
      fewShotOutput,
      skillName,
      skillDescription,
    };
  } catch (err) {
    console.warn('Fallback parsing Canvas AI draft JSON:', err);
    const rawCleaned = cleanCanvasDraftText(rawResult);
    const fallbackTitle =
      cleanCanvasDraftText(trimmedIdea).slice(0, 60) ||
      (isIndonesian ? 'Draft Canvas AI' : 'AI Canvas Draft');
    return {
      title: fallbackTitle,
      description: isIndonesian
        ? 'Draft disusun otomatis dari ide pengguna.'
        : 'Draft generated automatically from user idea.',
      scratchpad: rawCleaned,
      blocks: [],
    };
  }
};

export interface UploadedContentAnalysisScores {
  clarity: number;
  specificity: number;
  structure: number;
  overall: number;
}

export interface UploadedContentUpgradeResult {
  detectedKind: BlankCanvasTargetMode;
  scores: UploadedContentAnalysisScores;
  strengths: string[];
  weaknesses: string[];
  upgradeSummary: string;
  upgradedDraft: CanvasAIDraftResult;
  upgradedFullText: string;
}

const clampScore = (val: unknown, fallback: number): number => {
  if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
  return Math.max(0, Math.min(100, Math.round(val)));
};

const cleanUpgradeFullText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  let text = value
    .replace(/\r\n/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .trim();

  if (/^```[a-zA-Z0-9_-]*\s*\n/.test(text) && /\n```$/.test(text)) {
    text = text.replace(/^```[a-zA-Z0-9_-]*\s*\n/, '').replace(/\n```$/, '').trim();
  }
  return text;
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanCanvasDraftText(item))
    .filter((item) => item.length > 0);
};

const buildFallbackFullTextFromDraft = (
  draft: CanvasAIDraftResult,
  mode: BlankCanvasTargetMode,
  language: Language
): string => {
  const canvasState = createEmptyCanvasState();
  canvasState.title = draft.title;
  canvasState.description = draft.description;
  canvasState.targetMode = mode;
  canvasState.scratchpad = draft.scratchpad;
  canvasState.fewShotInput = draft.fewShotInput || '';
  canvasState.fewShotOutput = draft.fewShotOutput || '';
  canvasState.skillName = draft.skillName || '';
  canvasState.skillDescription = draft.skillDescription || '';
  canvasState.blocks = draft.blocks.map((block) =>
    createCanvasBlock(block.type, language, block.label, block.value)
  );

  const compiled = compileBlankCanvasPrompt(canvasState, language);
  if (mode === 'skill') {
    const spec = buildBlankCanvasAgentSkillSpec(canvasState, compiled, language);
    return cleanUpgradeFullText(formatAgentSkillMarkdown(spec));
  }
  return cleanUpgradeFullText(compiled || draft.scratchpad);
};

/**
 * 6. Analyze an uploaded Prompt or Agent Skill (SKILL.md), score its quality, diagnose gaps, and produce an upgraded version.
 */
export const analyzeAndUpgradeUploadedContentWithUniversalAI = async (
  rawContent: string,
  targetKind: 'auto' | BlankCanvasTargetMode,
  upgradeGoal: string,
  language: Language = 'id'
): Promise<UploadedContentUpgradeResult> => {
  const isIndonesian = language === 'id';
  const trimmedContent = rawContent.trim();
  const autoDetected = detectUploadedContentKind(trimmedContent);
  const effectiveTarget: BlankCanvasTargetMode =
    targetKind === 'auto' ? autoDetected : targetKind;

  const skillChecklistPrompt =
    effectiveTarget === 'skill'
      ? isIndonesian
        ? `Karena target adalah AGENT SKILL (SKILL.md), evaluasi juga standar Open Agent Skills:
- YAML frontmatter wajib memiliki "name" (kebab-case, huruf kecil/angka/tanda hubung, maksimal 64 karakter) dan "description" pemicu yang jelas (maksimal 1024 karakter).
- Struktur bagian markdown harus jelas: ## Role & Trigger, ## Input Parameters, ## Execution Steps, dan ## Verification Checklist.
- Pastikan "upgradedDraft" menyertakan "skillName" dan "skillDescription", serta "upgradedFullText" adalah dokumen SKILL.md lengkap dengan YAML frontmatter (--- ... ---) dan isi markdown.`
        : `Because the target is AGENT SKILL (SKILL.md), also evaluate Open Agent Skills compliance:
- YAML frontmatter must include "name" (lowercase kebab-case, max 64 chars) and a clear trigger "description" (max 1024 chars).
- Markdown sections should clearly cover: ## Role & Trigger, ## Input Parameters, ## Execution Steps, and ## Verification Checklist.
- Ensure "upgradedDraft" includes "skillName" and "skillDescription", and "upgradedFullText" is a complete SKILL.md document with YAML frontmatter (--- ... ---) and markdown body.`
      : isIndonesian
        ? `Target adalah PROMPT STANDAR. Pastikan "upgradedFullText" adalah teks prompt siap pakai yang terstruktur rapi (pisahkan bagian dengan baris kosong ganda, tanpa markdown code fence pembungkus).`
        : `Target is STANDARD PROMPT. Ensure "upgradedFullText" is a complete, ready-to-use prompt with clear sections separated by blank lines (no outer markdown code fence).`;

  const systemInstruction = isIndonesian
    ? `Anda adalah Auditor & Arsitek Prompt/Agent Skill Senior. Tugas Anda:
1. Analisis konten unggahan pengguna berdasarkan kejelasan (clarity), kekhususan (specificity), dan struktur (structure) dengan skor 0-100.
2. Identifikasi kekuatan utama (strengths) dan kelemahan/celah (weaknesses).
3. Tingkatkan konten tersebut menjadi versi yang jauh lebih presisi, terstruktur, dan siap pakai sesuai tujuan peningkatan dari pengguna.
${skillChecklistPrompt}

ATURAN FORMAT MUTLAK:
- Kembalikan HANYA objek JSON murni yang valid tanpa pembuka, tanpa penutup, tanpa code fence \`\`\`json, dan TANPA karakter em dash.
- Seluruh teks penjelasan (strengths, weaknesses, upgradeSummary, dan isi upgradedDraft) ditulis dalam Bahasa Indonesia.

Skema JSON wajib:
{
  "detectedKind": "${effectiveTarget}",
  "scores": {
    "clarity": 75,
    "specificity": 70,
    "structure": 65,
    "overall": 70
  },
  "strengths": ["Kekuatan 1", "Kekuatan 2"],
  "weaknesses": ["Celah atau kelemahan 1", "Celah atau kelemahan 2"],
  "upgradeSummary": "Ringkasan 1-3 kalimat mengenai perbaikan yang diterapkan.",
  "upgradedDraft": {
    "title": "Judul ringkas dan jelas",
    "description": "Deskripsi singkat 1-2 kalimat",
    "scratchpad": "Instruksi inti lengkap",
    "blocks": [
      {
        "type": "persona | context | task | constraints | output_format | audience | variable | custom",
        "label": "Nama label bagian",
        "value": "Isi bagian yang sudah ditingkatkan"
      }
    ],
    "fewShotInput": "Contoh masukan (opsional, string kosong jika tidak perlu)",
    "fewShotOutput": "Contoh keluaran ideal (opsional, string kosong jika tidak perlu)"${effectiveTarget === 'skill'
      ? `,
    "skillName": "nama-skill-kebab-case",
    "skillDescription": "Gunakan skill ini saat..."`
      : ''
    }
  },
  "upgradedFullText": "Teks lengkap prompt hasil upgrade atau dokumen SKILL.md lengkap dengan YAML frontmatter"
}`
    : `You are a Principal Prompt & Agent Skill Auditor and Architect. Your job:
1. Analyze the uploaded content across clarity, specificity, and structure on a 0-100 scale.
2. List concrete strengths and weaknesses/gaps.
3. Upgrade the content into a sharper, well-structured, production-ready version aligned with the user's upgrade goal.
${skillChecklistPrompt}

STRICT FORMAT RULES:
- Return ONLY a single valid JSON object with no preamble, no closing remarks, no \`\`\`json code fences, and NO em dash characters.
- Write all diagnostic text (strengths, weaknesses, upgradeSummary, and upgradedDraft content) in English.

Required JSON schema:
{
  "detectedKind": "${effectiveTarget}",
  "scores": {
    "clarity": 75,
    "specificity": 70,
    "structure": 65,
    "overall": 70
  },
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness or gap 1", "Weakness or gap 2"],
  "upgradeSummary": "1-3 sentence summary of key upgrades applied.",
  "upgradedDraft": {
    "title": "Concise clear title",
    "description": "Short 1-2 sentence description",
    "scratchpad": "Complete core instructions",
    "blocks": [
      {
        "type": "persona | context | task | constraints | output_format | audience | variable | custom",
        "label": "Section label",
        "value": "Upgraded section content"
      }
    ],
    "fewShotInput": "Sample input (optional, empty string if unnecessary)",
    "fewShotOutput": "Ideal expected output (optional, empty string if unnecessary)"${effectiveTarget === 'skill'
      ? `,
    "skillName": "kebab-case-skill-name",
    "skillDescription": "Use this skill when..."`
      : ''
    }
  },
  "upgradedFullText": "Complete upgraded prompt text or full SKILL.md document with YAML frontmatter"
}`;

  const goalLine = upgradeGoal.trim()
    ? upgradeGoal.trim()
    : isIndonesian
      ? 'Tingkatkan kejelasan instruksi, batasan kualitas, dan struktur agar siap pakai.'
      : 'Improve instruction clarity, quality guardrails, and structure for production use.';

  const userPrompt = isIndonesian
    ? `Mode Target: ${targetKind === 'auto' ? `Otomatis (terdeteksi awal: ${autoDetected})` : effectiveTarget}
Tujuan Upgrade: ${goalLine}

Konten yang diunggah:
"""
${trimmedContent}
"""`
    : `Target Mode: ${targetKind === 'auto' ? `Auto (initial detection: ${autoDetected})` : effectiveTarget}
Upgrade Goal: ${goalLine}

Uploaded Content:
"""
${trimmedContent}
"""`;

  const rawResult = await generateTextWithUniversalAI(userPrompt, systemInstruction);

  try {
    const jsonCandidate = extractJsonObjectString(rawResult);
    const parsed: unknown = JSON.parse(jsonCandidate);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed upgrade analysis is not an object.');
    }

    const record = parsed as Record<string, unknown>;
    const rawKind = record.detectedKind;
    const resolvedKind: BlankCanvasTargetMode =
      targetKind !== 'auto'
        ? targetKind
        : rawKind === 'skill' || rawKind === 'prompt'
          ? rawKind
          : effectiveTarget;

    const rawScores =
      record.scores && typeof record.scores === 'object'
        ? (record.scores as Record<string, unknown>)
        : {};
    const clarity = clampScore(rawScores.clarity, 75);
    const specificity = clampScore(rawScores.specificity, 72);
    const structure = clampScore(rawScores.structure, 74);
    const avgOverall = Math.round((clarity + specificity + structure) / 3);
    const overall = clampScore(rawScores.overall, avgOverall);

    const strengths = sanitizeStringArray(record.strengths);
    const weaknesses = sanitizeStringArray(record.weaknesses);
    const upgradeSummary =
      cleanCanvasDraftText(record.upgradeSummary) ||
      (isIndonesian
        ? 'Struktur instruksi, kejelasan peran, dan batasan kualitas telah ditingkatkan.'
        : 'Instruction structure, role clarity, and quality constraints have been upgraded.');

    const rawDraft =
      record.upgradedDraft && typeof record.upgradedDraft === 'object'
        ? (record.upgradedDraft as Record<string, unknown>)
        : {};
    const rawBlocks = Array.isArray(rawDraft.blocks) ? rawDraft.blocks : [];

    const blocks: CanvasAIDraftBlock[] = rawBlocks
      .map((item): CanvasAIDraftBlock | null => {
        if (!item || typeof item !== 'object') return null;
        const blockObj = item as Record<string, unknown>;
        const rawType = typeof blockObj.type === 'string' ? blockObj.type.trim() : 'custom';
        const resolvedType: CanvasBlockType = VALID_CANVAS_BLOCK_TYPES.has(
          rawType as CanvasBlockType
        )
          ? (rawType as CanvasBlockType)
          : 'custom';
        const value = cleanCanvasDraftText(blockObj.value);
        if (!value) return null;
        const label = cleanCanvasDraftText(blockObj.label);
        return {
          type: resolvedType,
          label: label || undefined,
          value,
        };
      })
      .filter((item): item is CanvasAIDraftBlock => item !== null);

    const upgradedDraft: CanvasAIDraftResult = {
      title:
        cleanCanvasDraftText(rawDraft.title) ||
        (isIndonesian ? 'Hasil Upgrade Canvas' : 'Upgraded Canvas Draft'),
      description: cleanCanvasDraftText(rawDraft.description),
      scratchpad: cleanCanvasDraftText(rawDraft.scratchpad),
      blocks,
      fewShotInput: cleanCanvasDraftText(rawDraft.fewShotInput) || undefined,
      fewShotOutput: cleanCanvasDraftText(rawDraft.fewShotOutput) || undefined,
      skillName: cleanCanvasDraftText(rawDraft.skillName) || undefined,
      skillDescription: cleanCanvasDraftText(rawDraft.skillDescription) || undefined,
    };

    let upgradedFullText = cleanUpgradeFullText(record.upgradedFullText);
    const needsSkillFrontmatter =
      resolvedKind === 'skill' && !/^---\n[\s\S]*?\n---/.test(upgradedFullText);

    if (!upgradedFullText || needsSkillFrontmatter) {
      upgradedFullText = buildFallbackFullTextFromDraft(upgradedDraft, resolvedKind, language);
    }

    return {
      detectedKind: resolvedKind,
      scores: { clarity, specificity, structure, overall },
      strengths:
        strengths.length > 0
          ? strengths
          : [
            isIndonesian
              ? 'Memiliki maksud dan arah tugas dasar yang dapat dikenali.'
              : 'Has an identifiable core objective and direction.',
          ],
      weaknesses:
        weaknesses.length > 0
          ? weaknesses
          : [
            isIndonesian
              ? 'Dapat diperkuat dengan batasan eksplisit dan format keluaran yang lebih terstruktur.'
              : 'Can be strengthened with explicit constraints and a stricter output format.',
          ],
      upgradeSummary,
      upgradedDraft,
      upgradedFullText,
    };
  } catch (err) {
    console.warn('Fallback parsing uploaded content upgrade JSON:', err);
    const rawCleaned = cleanUpgradeFullText(rawResult);
    const fallbackDraft: CanvasAIDraftResult = {
      title: isIndonesian ? 'Hasil Upgrade AI' : 'AI Upgraded Draft',
      description: isIndonesian
        ? 'Hasil analisis dan peningkatan otomatis dari konten unggahan.'
        : 'Automated analysis and upgrade generated from uploaded content.',
      scratchpad: cleanCanvasDraftText(rawCleaned || trimmedContent),
      blocks: [],
    };
    const fallbackFullText =
      effectiveTarget === 'skill' && !/^---\n[\s\S]*?\n---/.test(rawCleaned)
        ? buildFallbackFullTextFromDraft(fallbackDraft, 'skill', language)
        : rawCleaned || buildFallbackFullTextFromDraft(fallbackDraft, effectiveTarget, language);

    return {
      detectedKind: effectiveTarget,
      scores: {
        clarity: 74,
        specificity: 70,
        structure: 72,
        overall: 72,
      },
      strengths: [
        isIndonesian
          ? 'Konten awal memiliki topik utama yang jelas untuk ditingkatkan.'
          : 'Original content has a clear core topic ready for refinement.',
      ],
      weaknesses: [
        isIndonesian
          ? 'Struktur blok dan batasan eksplisit masih dapat diperkuat.'
          : 'Block structure and explicit guardrails can be further reinforced.',
      ],
      upgradeSummary: isIndonesian
        ? 'Konten telah diproses ulang menjadi draf yang lebih rapi dan siap disunting di Canvas.'
        : 'Content has been refined into a cleaner draft ready for editing in Canvas.',
      upgradedDraft: fallbackDraft,
      upgradedFullText: fallbackFullText,
    };
  }
};

/**
 * 6. AI Suggest for Agent Skill & Creator Hub (Product Profile, Tagline, Demo Request & Result)
 */
export interface SkillAiSuggestionInput {
  skillName: string;
  frameworkName?: string;
  compiledPrompt?: string;
  field: 'all' | 'title' | 'tagline' | 'tags' | 'description' | 'demoRequest' | 'demoResult' | 'name';
  existingTitle?: string;
  existingTagline?: string;
  existingDemoRequest?: string;
  language?: 'id' | 'en';
}

export interface SkillAiSuggestionOutput {
  name?: string;
  title?: string;
  tagline?: string;
  tags?: string[];
  description?: string;
  demoRequest?: string;
  demoResult?: string;
  priceUsd?: number;
}

export const suggestSkillMetadataWithUniversalAI = async (
  input: SkillAiSuggestionInput
): Promise<SkillAiSuggestionOutput> => {
  const {
    skillName,
    frameworkName = 'Custom Agent Skill',
    compiledPrompt = '',
    field,
    existingTitle = '',
    existingTagline = '',
    existingDemoRequest = '',
    language = 'id',
  } = input;

  const isIndonesian = language === 'id';

  const systemInstruction = isIndonesian
    ? `Anda adalah Principal Product Architect & Spesialis Optimasi SEO & GEO (Generative Engine Optimization) untuk AI Agent Skills. Tugas Anda adalah merancang profil produk dan live demo berkualitas tinggi yang mudah ditemukan oleh mesin pencari web (Google, Bing) dan mesin jawaban AI (Perplexity, ChatGPT Search, Claude, Google AI Overviews) serta calon pembeli di marketplace digital.
ATURAN MUTLAK:
1. DILARANG menggunakan tanda em-dash (—). Gunakan koma, strip (-), atau tanda kurung.
2. DILARANG menggunakan kata klise generik AI seperti "Revolusioner", "Unleash", "Game-changer", "Delve", "Transformasi tanpa batas".
3. Gunakan kata kunci pencarian berniat tinggi (search intent): production agent skill, verified workflow, cross-runtime, deterministic, zero hallucination.
4. Buat kalimat padat, bernilai tinggi, dan memiliki definisi konkret (answer capsule) yang dapat dikutip langsung oleh LLM dan mesin pencari.`
    : `You are a Principal Product Architect and SEO/GEO (Generative Engine Optimization) Specialist for AI Agent Skills. Your mission is to craft commercial, discoverable product copy and real-world demo exemplars (Request and Result) optimized for web search engines (Google, Bing) and AI answer engines (Perplexity, ChatGPT Search, Claude, Google AI Overviews).
STRICT RULES:
1. NEVER use em-dashes (—). Use commas, hyphens (-), or parentheses.
2. NEVER use generic AI cliches such as "Revolutionary", "Unleash", "Game-changer", "Delve", "Tapestry".
3. Incorporate high-intent search keywords: production agent skill, deterministic workflow, cross-runtime, zero hallucination.
4. Provide concrete, quotable definition capsules and structured deliverables that search engines and AI agents can cite as authoritative sources.`;

  if (field === 'name') {
    const prompt = isIndonesian
      ? `Nama Judul Skill: "${existingTitle || frameworkName || skillName}"
Konteks Prompt:
${compiledPrompt ? compiledPrompt.slice(0, 1000) : '(Kompiler otomatis)'}

Buat SATU nama identifier skill standar Open Agent Skills dalam format KEBAB-CASE murni (hanya huruf kecil a-z, angka 0-9, dan tanda hubung '-', maksimal 64 karakter, contoh: "nextjs-fullstack-architect" atau "seo-geo-content-engine").
HANYA kembalikan teks kebab-case saja tanpa tanda kutip, tanpa spasi, dan tanpa penjelasan:`
      : `Skill Title: "${existingTitle || frameworkName || skillName}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 1000) : '(Auto-compiled)'}

Generate ONE clean Open Agent Skills identifier name in pure KEBAB-CASE format (lowercase a-z, numbers 0-9, and '-' only, max 64 chars, e.g. "nextjs-fullstack-architect" or "seo-geo-content-engine").
Return ONLY the kebab-case identifier without quotes, without spaces, and without explanation:`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    const cleaned = sanitizePromptText(raw)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 64);
    return { name: cleaned || 'custom-agent-skill' };
  }

  if (field === 'title') {
    const prompt = isIndonesian
      ? `Nama Kebab-Case Skill: "${skillName}"
Kerangka Kerja Terkait: "${frameworkName}"
Konteks Prompt Bawaan:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : '(Kompiler prompt otomatis)'}

Buat SATU judul produk komersial ramah SEO yang mengandung kata kunci pencarian berniat tinggi (maksimal 60 karakter, contoh: "Next.js Fullstack Production Agent Skill").
HANYA kembalikan teks judul saja tanpa tanda kutip dan tanpa penjelasan:`
      : `Kebab-Case Skill Name: "${skillName}"
Related Framework: "${frameworkName}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : '(Auto-compiled prompt)'}

Generate ONE high-intent, SEO-friendly commercial title for an agent skill marketplace (max 60 chars, e.g. "Next.js Fullstack Production Agent Skill").
Return ONLY the title text without quotes or explanations:`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    return { title: sanitizePromptText(raw).replace(/^["']|["']$/g, '').trim() };
  }

  if (field === 'tagline') {
    const prompt = isIndonesian
      ? `Nama Skill: "${existingTitle || skillName}"
Kerangka Kerja: "${frameworkName}"
Konteks Prompt:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : ''}

Buat SATU kalimat tagline bernilai tinggi dan ramah GEO (answer capsule, maksimal 120 karakter, fokus pada hasil kerja konkret yang diotomasi).
HANYA kembalikan teks tagline saja tanpa tanda kutip:`
      : `Skill Name: "${existingTitle || skillName}"
Framework: "${frameworkName}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : ''}

Create ONE punchy value-proposition tagline and GEO answer capsule stating the concrete buyer outcome (max 120 chars).
Return ONLY the tagline text without quotes:`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    return { tagline: sanitizePromptText(raw).replace(/^["']|["']$/g, '').trim() };
  }

  if (field === 'tags') {
    const prompt = isIndonesian
      ? `Nama Skill: "${existingTitle || skillName}"
Kerangka Kerja: "${frameworkName}"

Berikan 5 hingga 7 tag penemuan SEO & marketplace tanpa tanda pagar (#), dipisahkan dengan koma.
Sertakan tag format ('open-agent-skills', 'agent-skill'), runtime ('claude-code', 'cursor-rules', 'antigravity'), serta kata kunci domain teknis.
HANYA kembalikan teks tag dipisahkan koma:`
      : `Skill Name: "${existingTitle || skillName}"
Framework: "${frameworkName}"

Provide 5 to 7 high-intent SEO & marketplace discovery tags without hash symbols (#), separated by commas.
Include format tags ('open-agent-skills', 'agent-skill'), runtime keywords ('claude-code', 'cursor-rules', 'antigravity'), and specific technical domain keywords.
Return ONLY comma-separated tags:`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    const cleaned = sanitizePromptText(raw).replace(/^["']|["']$/g, '').trim();
    const tags = cleaned
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);
    return { tags };
  }

  if (field === 'description') {
    const prompt = isIndonesian
      ? `Nama Produk Skill: "${existingTitle || skillName}"
Tagline: "${existingTagline || ''}"
Kerangka Kerja: "${frameworkName}"
Konteks Prompt:
${compiledPrompt ? compiledPrompt.slice(0, 2000) : ''}

Susun draf deskripsi produk Markdown listing SEO & GEO friendly dengan format terstruktur:
## Definisi Produk & Ringkasan Eksekutif
(Satu paragraf padat 40-60 kata menjelaskan fungsi spesifik skill dan masalah konkret yang diotomasi, siap dikutip oleh Perplexity & Google AI Overviews)

## Kemampuan Utama & Alur Kerja
- Fitur teknis konkret 1
- Fitur teknis konkret 2
- Fitur teknis konkret 3
- Fitur teknis konkret 4

## Sasaran Pengguna & Nilai Tambah
(Siapa yang membutuhkan skill ini dan perbandingannya dengan prompt biasa)

## Kompatibilitas Runner
Didukung penuh pada 27 runtime Open Agent Skills termasuk Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, dan OpenCode.`
      : `Skill Product Name: "${existingTitle || skillName}"
Tagline: "${existingTagline || ''}"
Framework: "${frameworkName}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 2000) : ''}

Draft an SEO & GEO-optimized Markdown listing description formatted as:
## Product Overview & Executive Summary
(One concise 40-60 word quotable answer capsule explaining what this skill automates, ready for Perplexity & Google AI citation)

## Key Capabilities & Workflow
- Concrete technical capability 1
- Concrete technical capability 2
- Concrete technical capability 3
- Concrete technical capability 4

## Target Audience & Value Proposition
(Who needs this skill and why it outperforms generic prompt templates)

## Runner Compatibility
Supported across 27 Open Agent Skills runtimes including Google Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot, Codex, and OpenCode.`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    return { description: sanitizePromptText(raw).trim() };
  }

  if (field === 'demoRequest') {
    const prompt = isIndonesian
      ? `Nama Skill: "${existingTitle || skillName}"
Kerangka Kerja: "${frameworkName}"
Konteks Prompt:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : ''}

Susun SATU contoh permintaan nyata (Demo Request) yang realistis, menantang, dan mencerminkan kueri pencarian pembeli potensial (high-intent user search query).
Permintaan harus spesifik, memberikan konteks masalah nyata, dan meminta solusi teknis lengkap.
HANYA kembalikan teks prompt permintaan tanpa kata pengantar:`
      : `Skill Name: "${existingTitle || skillName}"
Framework: "${frameworkName}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : ''}

Draft ONE realistic, high-intent demo request (the user prompt) that mirrors real customer search queries when looking for an agent solution.
It should provide realistic task context and request complete deliverables.
Return ONLY the prompt request text without preamble:`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    return { demoRequest: sanitizePromptText(raw).trim() };
  }

  if (field === 'demoResult') {
    const prompt = isIndonesian
      ? `Nama Skill: "${existingTitle || skillName}"
Kerangka Kerja: "${frameworkName}"
Permintaan Pengguna (Demo Request):
"${existingDemoRequest || 'Lakukan audit dan implementasi solusi sesuai standar arsitektur terbaik.'}"
Konteks Prompt:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : ''}

Susun SATU contoh hasil eksekusi (Demo Result) berstandar emas yang diberikan oleh AI Agent.
Hasil harus ramah GEO (mudah dikutip oleh Perplexity / SearchGPT) dan mencakup:
## Ringkasan Eksekutif
## Hasil Eksekusi / Spesifikasi Solusi
## Langkah Penerapan & Verifikasi Mutu
Minimal 700 karakter, terstruktur rapi, deterministik, dan konkret.
HANYA kembalikan teks output hasil tanpa kata pengantar:`
      : `Skill Name: "${existingTitle || skillName}"
Framework: "${frameworkName}"
User Request (Demo Request):
"${existingDemoRequest || 'Perform an audit and deliver the production solution following architecture best practices.'}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 1500) : ''}

Draft ONE gold-standard execution result (Demo Result) delivered by the AI Agent.
It must be GEO-friendly (quotable by Perplexity / SearchGPT) and include:
## Executive Summary
## Deliverable / Solution Specification
## Quality Gate & Verification Steps
At least 700 characters, structured, concrete.
Return ONLY the output result markdown without preamble:`;

    const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
    return { demoResult: sanitizePromptText(raw).trim() };
  }

  // field === 'all'
  const allPrompt = isIndonesian
    ? `Nama Kebab-Case Skill: "${skillName}"
Kerangka Kerja: "${frameworkName}"
Konteks Prompt:
${compiledPrompt ? compiledPrompt.slice(0, 2000) : ''}

Susun paket lengkap listing komersial berstandar SEO & GEO (mudah ditemukan di Google Search, marketplace, dan dikutip oleh AI Answer Engines) dalam format JSON murni:
{
  "title": "Judul Komersial Berkata Kunci (maksimal 60 karakter, contoh: Next.js Fullstack Production Agent Skill)",
  "tagline": "Satu kalimat manfaat utama konkret bernada pasti (maksimal 120 karakter)",
  "tags": ["open-agent-skills", "agent-skill", "claude-code", "cursor-rules", "antigravity", "TagDomain"],
  "priceUsd": 14.99,
  "description": "Deskripsi lengkap Markdown dengan ## Definisi Produk & Ringkasan, ## Kemampuan Utama, ## Nilai Tambah, dan ## Kompatibilitas Runner",
  "demoRequest": "Contoh pertanyaan/tugas teknis realistis dan berniat tinggi dari pengguna (The Request)",
  "demoResult": "Contoh hasil eksekusi agen yang berstandar emas, terstruktur dengan ## Executive Summary, ## Solution Deliverable, ## Verification Checklist, minimal 700 karakter (The Result)"
}
Kembalikan HANYA format JSON valid tanpa tanda pembungkus markdown quotes (\`\`\`json):`
    : `Kebab-Case Skill Name: "${skillName}"
Framework: "${frameworkName}"
Prompt Context:
${compiledPrompt ? compiledPrompt.slice(0, 2000) : ''}

Generate a complete commercial listing package and demo exemplar adhering to SEO & GEO standards in pure JSON format:
{
  "title": "Keyword-Rich Commercial Title (max 60 chars, e.g. Next.js Fullstack Production Agent Skill)",
  "tagline": "One clear sentence stating concrete outcome in answer-capsule style (max 120 chars)",
  "tags": ["open-agent-skills", "agent-skill", "claude-code", "cursor-rules", "antigravity", "DomainTag"],
  "priceUsd": 14.99,
  "description": "Full Markdown description with ## Product Overview & Summary, ## Key Capabilities, ## Value Proposition, and ## Runner Compatibility",
  "demoRequest": "Realistic, high-intent user task prompt mirroring real search queries (The Request)",
  "demoResult": "Comprehensive, structured agent execution result with ## Executive Summary, ## Deliverable Specification, ## Verification Steps, at least 700 characters (The Result)"
}
Return ONLY valid JSON without markdown codeblock wrapper (\`\`\`json):`;

  const raw = await generateTextWithUniversalAI(allPrompt, systemInstruction);
  const cleanJson = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/\s*```$/, '')
    .trim();

  try {
    const parsed = JSON.parse(cleanJson);
    return {
      title: typeof parsed.title === 'string' ? parsed.title.trim() : undefined,
      tagline: typeof parsed.tagline === 'string' ? parsed.tagline.trim() : undefined,
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : undefined,
      priceUsd: typeof parsed.priceUsd === 'number' ? parsed.priceUsd : 14.99,
      description: typeof parsed.description === 'string' ? parsed.description.trim() : undefined,
      demoRequest: typeof parsed.demoRequest === 'string' ? parsed.demoRequest.trim() : undefined,
      demoResult: typeof parsed.demoResult === 'string' ? parsed.demoResult.trim() : undefined,
    };
  } catch {
    return {
      title: isIndonesian ? `Paket Spesialis ${frameworkName}` : `${frameworkName} Specialist Pack`,
      tagline: isIndonesian
        ? 'Otomasi alur kerja prompt cerdas dan deterministik dengan panduan teruji.'
        : 'Automates intelligent, deterministic prompt workflows with production guardrails.',
      tags: ['AI Agent', 'Prompt Engineering', 'Productivity'],
      priceUsd: 14.99,
      description: raw,
    };
  }
};

/**
 * 8. Agent Skill Pack Pitch Hook Generator
 * Generates an engaging, high-converting social media promotional pitch or listing hook
 * for any agent skill pack or active formula.
 */
export const generatePackPitchWithUniversalAI = async (
  packTitle: string,
  packSummary: string,
  language: 'id' | 'en' = 'id'
): Promise<string> => {
  const isId = language === 'id';
  const systemInstruction = isId
    ? `Anda adalah Copywriter Produk AI dan Penjualan Agent Skills berstandar tinggi. Buat teks promosi singkat, menarik, dan bernilai tinggi untuk mempromosikan paket skill ini kepada praktisi AI, kreator, dan engineer.
DILARANG menggunakan kata-kata klise seperti "Revolusioner", "Game-changer", "Unleash", atau tanda em-dash (—). Gunakan kalimat lugas, profesional, dan tajam.`
    : `You are an elite AI Product and Agent Skills copywriter. Create a concise, compelling, high-converting promotional post for this skill pack targeting AI practitioners, creators, and engineers.
DO NOT use overused AI cliches like "Revolutionary", "Game-changer", "Unleash", or em-dashes (—). Keep it crisp, professional, and punchy.`;

  const prompt = isId
    ? `Nama Paket Skill: "${packTitle}"
Ringkasan Kemampuan: "${packSummary}"

Susun 1 draft posting promosi / pitch singkat (X / LinkedIn / Komunitas):
1. Hook pembuka yang menyorot masalah nyata (pain point) yang sering dihadapi.
2. Solusi konkret yang diberikan oleh paket skill ini dalam format 3 poin ringkas.
3. Call to Action (CTA) yang jelas.

Format teks polos yang rapi dan siap disalin:`
    : `Skill Pack Name: "${packTitle}"
Capability Summary: "${packSummary}"

Draft 1 concise promotional post / pitch hook (for X / LinkedIn / Communities):
1. Opening hook highlighting a real workflow pain point.
2. Concrete solution delivered by this skill pack in 3 bullet points.
3. Clear Call to Action (CTA).

Plain text format, cleanly formatted and ready to copy:`;

  const raw = await generateTextWithUniversalAI(prompt, systemInstruction);
  return sanitizePromptText(raw).trim();
};

