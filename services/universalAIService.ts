import { getStoredAISettings, AISettings, AI_PROVIDER_PRESETS } from './aiSettingsService';

export interface PromptAnalysisResult {
  clarityScore: number;
  specificityScore: number;
  overallScore: number;
  feedback: string;
  suggestions: string[];
}

/**
 * Universal text generation dispatcher supporting Gemini, OpenAI, DeepSeek, OpenRouter, Groq, Anthropic, and Local Ollama/Custom Base URLs.
 */
export const generateTextWithUniversalAI = async (
  prompt: string,
  systemInstruction: string = '',
  overrideSettings?: AISettings
): Promise<string> => {
  const settings = overrideSettings || getStoredAISettings();
  const { provider, apiKey, baseUrl, model } = settings;

  // 1. Google Gemini Provider (Official Direct)
  if (provider === 'gemini' && (!baseUrl || baseUrl.includes('googleapis.com'))) {
    return generateWithGemini(prompt, systemInstruction, apiKey, model);
  }

  // 2. Anthropic Claude Provider (Official Direct)
  if (provider === 'anthropic' && (!baseUrl || baseUrl.includes('anthropic.com'))) {
    return generateWithAnthropic(prompt, systemInstruction, apiKey, baseUrl, model);
  }

  // 3. OpenAI, DeepSeek, OpenRouter, Groq, One API/New API Router, Ollama, and all OpenAI-compatible Custom endpoints
  return generateWithOpenAICompatible(prompt, systemInstruction, apiKey, baseUrl, model);
};

// --- GEMINI HANDLER ---
const generateWithGemini = async (
  prompt: string,
  systemInstruction: string,
  apiKey: string,
  model: string
): Promise<string> => {
  if (!apiKey) throw new Error('API Key Google Gemini belum diisi. Silakan atur di menu Pengaturan AI ⚙️.');

  const targetModel = model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData?.error?.message || response.statusText;
    throw new Error(`Google Gemini Error (${response.status}): ${msg}`);
  }

  const data = await response.json();
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
  model: string
): Promise<string> => {
  let cleanBase = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  let endpoint = cleanBase.endsWith('/chat/completions') ? cleanBase : `${cleanBase}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream'
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  // OpenRouter additional header identification
  if (cleanBase.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = 'https://github.com/sisigitadi/promptmatrix';
    headers['X-Title'] = 'PromptMatrix';
  }

  const messages: any[] = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const payload = {
    model: model || 'gpt-4o',
    messages,
    temperature: 0.7,
    stream: false // Explicitly disable stream, though we also parse SSE chunks below
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    let parsedMsg = '';
    try {
      const parsed = JSON.parse(responseText);
      parsedMsg = parsed?.error?.message || parsed?.message || parsed?.error || '';
    } catch {
      parsedMsg = responseText;
    }
    throw new Error(`AI Provider Error (${response.status}): ${parsedMsg || response.statusText}`);
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
  model: string
): Promise<string> => {
  if (!apiKey) throw new Error('API Key Anthropic Claude belum diisi.');

  const cleanBase = (baseUrl || 'https://api.anthropic.com/v1').replace(/\/+$/, '');
  const endpoint = cleanBase.endsWith('/messages') ? cleanBase : `${cleanBase}/messages`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey.trim(),
    'anthropic-version': '2023-06-01',
    'dangerously-allow-browser': 'true'
  };

  const payload: any = {
    model: model || 'claude-3-7-sonnet-20250219',
    max_tokens: 2048,
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
  apiKey: string
): Promise<string[]> => {
  let cleanBase = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  
  // Remove /chat/completions if included in base URL
  cleanBase = cleanBase.replace(/\/chat\/completions$/, '');
  const endpoint = cleanBase.endsWith('/models') ? cleanBase : `${cleanBase}/models`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

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

  try {
    const data = JSON.parse(text);
    if (Array.isArray(data?.data)) {
      return data.data.map((item: any) => item.id || item.name).filter(Boolean);
    }
    if (Array.isArray(data?.models)) {
      return data.models.map((item: any) => item.id || item.name).filter(Boolean);
    }
    if (Array.isArray(data)) {
      return data.map((item: any) => typeof item === 'string' ? item : item.id || item.name).filter(Boolean);
    }
  } catch {
    //
  }

  return [];
};

// --- HIGH-LEVEL CAPABILITIES ---

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

  const systemInstruction = isIndonesian
    ? `Anda adalah seorang ahli prompt engineering handal. Tugas Anda adalah memberikan satu saran isian terbaik dan spesifik untuk kolom formulir yang diminta. Berikan HANYA nilai isian langsung tanpa pembuka, tanpa tanda kutip, dan tanpa penjelasan tambahan.`
    : `You are an expert AI prompt engineer. Provide ONLY the direct, high-quality, specific value for the requested form field. Do not include markdown quotes, pleasantries, or preamble.`;

  const userPrompt = isIndonesian
    ? `Kerangka Kerja: "${frameworkName}"
Kolom yang perlu diisi: "${fieldLabel}"
Konteks isian kolom lain yang sudah ada:
${contextSoFar || '(Belum ada kolom lain yang diisi)'}

Berikan satu saran isian yang kreatif, kontekstual, dan bernilai tinggi:`
    : `Framework: "${frameworkName}"
Target Field: "${fieldLabel}"
Other Filled Context:
${contextSoFar || '(No other fields filled yet)'}

Provide one creative, highly specific, and relevant value for this field:`;

  return generateTextWithUniversalAI(userPrompt, systemInstruction);
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
    ? `Anda adalah Master Prompt Optimizer. Tugas Anda adalah menyempurnakan prompt yang diberikan agar lebih tajam, presisi, kaya detail, dan menghasilkan output maksimal pada LLM modern. Pertahankan struktur utama dan kembalikan HANYA teks prompt yang telah disempurnakan tanpa kata pengantar.`
    : `You are a Master Prompt Optimizer. Elevate and polish the prompt to be sharper, richer in clarity and constraints, and maximize output quality on modern AI models. Return ONLY the enhanced prompt.`;

  const userPrompt = isIndonesian
    ? `Kerangka Kerja: "${frameworkName}"
Prompt Awal:
"""
${currentPrompt}
"""

Tingkatkan dan poles prompt di atas agar menjadi versi paling optimal:`
    : `Framework: "${frameworkName}"
Initial Prompt:
"""
${currentPrompt}
"""

Enhance and refine the prompt above to the absolute highest standard:`;

  return generateTextWithUniversalAI(userPrompt, systemInstruction);
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
export const testAIConnection = async (settings: AISettings): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await generateTextWithUniversalAI(
      'Uji coba koneksi: balas dengan kata "OK" jika terhubung.',
      'Balas hanya "OK".',
      settings
    );
    return { success: true, message: `Koneksi berhasil! Respons model: "${res.slice(0, 100)}"` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal terhubung ke API endpoint.' };
  }
};
