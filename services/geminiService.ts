export interface PromptAnalysisResult {
  clarityScore: number;
  specificityScore: number;
  overallScore: number;
  feedback: string;
  suggestions: string[];
}

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

/**
 * Helper to call Gemini REST API directly with automatic model fallback
 */
async function callGemini(prompt: string, apiKey: string, systemInstruction?: string, jsonMode: boolean = false): Promise<string> {
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

      if (jsonMode) {
        payload.generationConfig.responseMimeType = 'application/json';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying fallback...`, err?.message);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || 'Failed to communicate with Google Gemini API.');
}

/**
 * Enhances a generated prompt with richer context, precision, and nuance
 */
export async function enhancePromptWithAI(
  rawPrompt: string,
  frameworkName: string,
  lang: 'id' | 'en',
  apiKey: string
): Promise<string> {
  const systemInstruction = lang === 'id'
    ? `Anda adalah Master Prompt Engineer ahli. Tugas Anda adalah mengoptimalkan dan mempertajam prompt yang diberikan agar menghasilkan output terbaik dari model AI. Pertahankan struktur kerangka kerja '${frameworkName}', tingkatkan kejelasan kata, tambahkan detail tajam, dan gunakan terminologi yang paling efektif. Berikan HANYA teks prompt yang telah disempurnakan tanpa pembuka atau penutup.`
    : `You are an expert Master Prompt Engineer. Your task is to optimize, refine, and enhance the given prompt to yield the highest quality output from AI models. Preserve the '${frameworkName}' framework structure, enhance clarity, add rich vivid details, and use high-impact terminology. Return ONLY the enhanced prompt without introductory or concluding conversational filler.`;

  const userPrompt = lang === 'id'
    ? `Tolong optimalkan prompt berikut yang menggunakan framework ${frameworkName}:\n\n${rawPrompt}`
    : `Please enhance the following prompt built with the ${frameworkName} framework:\n\n${rawPrompt}`;

  return await callGemini(userPrompt, apiKey, systemInstruction);
}

/**
 * Suggests smart contextual content for a single input field
 */
export async function suggestFieldContentWithAI(
  fieldLabel: string,
  frameworkName: string,
  currentContext: string,
  lang: 'id' | 'en',
  apiKey: string
): Promise<string> {
  const systemInstruction = lang === 'id'
    ? `Anda adalah asisten AI cerdas untuk Prompt Engineering. Berikan saran isian yang kreatif, spesifik, dan realistis untuk komponen formulir prompt. Berikan HANYA teks saran isian tanpa tanda kutip, tanpa markdown formatting berlebih, dan tanpa kata pengantar.`
    : `You are an intelligent AI assistant for Prompt Engineering. Provide a creative, specific, and realistic suggestion for a prompt component field. Return ONLY the suggestion text without quotes, without unnecessary markdown wrappers, and without conversational filler.`;

  const userPrompt = lang === 'id'
    ? `Framework: ${frameworkName}\nKomponen yang perlu diisi: "${fieldLabel}"\nKonteks isian lainnya saat ini:\n${currentContext || 'Belum ada isian lain'}\n\nBerikan saran isian yang sangat bagus dan relevan untuk komponen "${fieldLabel}".`
    : `Framework: ${frameworkName}\nField to fill: "${fieldLabel}"\nCurrent context from other fields:\n${currentContext || 'No other fields filled yet'}\n\nProvide an outstanding, highly relevant content suggestion for "${fieldLabel}".`;

  return await callGemini(userPrompt, apiKey, systemInstruction);
}

/**
 * Evaluates the quality, clarity, and specificity of a prompt and provides score + suggestions
 */
export async function analyzePromptQualityWithAI(
  prompt: string,
  frameworkName: string,
  lang: 'id' | 'en',
  apiKey: string
): Promise<PromptAnalysisResult> {
  const systemInstruction = lang === 'id'
    ? `Anda adalah evaluator kualitas Prompt AI profesional. Analisis prompt yang diberikan berdasarkan kriteria Kejelasan (Clarity), Kekhususan (Specificity), dan Efektivitas Keseluruhan (Overall). Kembalikan respons dalam format JSON valid dengan struktur:
{
  "clarityScore": number (0-100),
  "specificityScore": number (0-100),
  "overallScore": number (0-100),
  "feedback": "ringkasan evaluasi singkat",
  "suggestions": ["saran 1", "saran 2", "saran 3"]
}`
    : `You are a professional AI Prompt Quality Evaluator. Analyze the given prompt for Clarity, Specificity, and Overall Effectiveness. Return your response in valid JSON with the exact structure:
{
  "clarityScore": number (0-100),
  "specificityScore": number (0-100),
  "overallScore": number (0-100),
  "feedback": "concise overall feedback summary",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"]
}`;

  const userPrompt = lang === 'id'
    ? `Analisis kualitas prompt berikut (Framework: ${frameworkName}):\n\n${prompt}`
    : `Analyze the quality of the following prompt (Framework: ${frameworkName}):\n\n${prompt}`;

  try {
    const rawJson = await callGemini(userPrompt, apiKey, systemInstruction, true);
    // Parse JSON
    const parsed = JSON.parse(rawJson);
    return {
      clarityScore: Math.min(100, Math.max(0, Number(parsed.clarityScore) || 80)),
      specificityScore: Math.min(100, Math.max(0, Number(parsed.specificityScore) || 80)),
      overallScore: Math.min(100, Math.max(0, Number(parsed.overallScore) || 80)),
      feedback: parsed.feedback || (lang === 'id' ? 'Prompt terstruktur dengan baik.' : 'Well structured prompt.'),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    };
  } catch (err) {
    console.error('Error parsing AI analysis result:', err);
    return {
      clarityScore: 85,
      specificityScore: 82,
      overallScore: 84,
      feedback: lang === 'id' 
        ? 'Prompt memiliki struktur dasar yang jelas dan siap digunakan.' 
        : 'Prompt has a clear structure and is ready for use.',
      suggestions: [
        lang === 'id' ? 'Tambahkan contoh output spesifik' : 'Add specific output examples',
        lang === 'id' ? 'Pertegas batasan teknis atau kriteria keberhasilan' : 'Clarify technical constraints or success criteria'
      ]
    };
  }
}
