export interface AiPlatformSetting {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "password";
  placeholder?: string;
  info?: string;
  options?: string[];
  optional?: boolean;
  validation?: {
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    regex?: string;
  };
}

export interface AiPlatformConfig {
  id: string;
  name: string;
  settings: AiPlatformSetting[];
  models: { id: string; name: string }[];
}

export const AI_PLATFORMS: AiPlatformConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    settings: [
      {
        name: "apiKey",
        label: "API Key Gemini",
        type: "password",
        placeholder: "Masukkan API Key Anda",
        info: "Kunci API untuk mengakses layanan Google Gemini 4 & 3.8.",
        validation: { min_length: 10 },
      },
      {
        name: "selectedModel",
        label: "Pilih Model Gemini",
        type: "select",
        options: [],
        info: "Pilih model Gemini yang akan digunakan.",
      },
    ],
    models: [
      { id: "gemini-4-carbon", name: "gemini-4-carbon (Frontier Reasoning Flagship)" },
      { id: "gemini-4-argon", name: "gemini-4-argon (Optimized Frontier Intelligence)" },
      { id: "gemini-4-hydrogen", name: "gemini-4-hydrogen (Agentic & Daily Coding)" },
      { id: "gemini-3.8-flash", name: "gemini-3.8-flash (Workhorse Multimodal)" },
      { id: "gemini-3.7-flash", name: "gemini-3.7-flash (Low-Latency Multimodal)" },
      { id: "gemini-3.5-flash-lite", name: "gemini-3.5-flash-lite (Ultra-Fast Lite)" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    settings: [
      {
        name: "openaiApiKey",
        label: "API Key OpenAI",
        type: "password",
        placeholder: "sk-proj-...",
        info: "Kunci API untuk mengakses layanan OpenAI GPT-6 & GPT-5.",
        validation: { min_length: 10 },
      },
      {
        name: "selectedOpenAiModel",
        label: "Pilih Model OpenAI",
        type: "select",
        options: [],
        info: "Pilih model OpenAI yang akan digunakan.",
      },
    ],
    models: [
      { id: "gpt-6.1-sol", name: "gpt-6.1-sol (Workhorse Flagship)" },
      { id: "gpt-6-astra", name: "gpt-6-astra (Peak Intelligence)" },
      { id: "gpt-6.1-terra", name: "gpt-6.1-terra (Visual Reasoning)" },
      { id: "gpt-6.1-luna", name: "gpt-6.1-luna (Low-Latency)" },
      { id: "gpt-5.2-codex", name: "gpt-5.2-codex (Code Specialist)" },
      { id: "gpt-5", name: "gpt-5 (Enterprise Base)" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    settings: [
      {
        name: "anthropicApiKey",
        label: "API Key Anthropic",
        type: "password",
        placeholder: "sk-ant-...",
        info: "Kunci API untuk mengakses layanan Anthropic Claude 5.5 & Fable 5.2.",
        validation: { min_length: 10 },
      },
      {
        name: "selectedAnthropicModel",
        label: "Pilih Model Claude",
        type: "select",
        options: [],
        info: "Pilih model Claude yang akan digunakan.",
      },
    ],
    models: [
      { id: "claude-sonnet-5-5", name: "claude-sonnet-5-5 (Daily Flagship)" },
      { id: "claude-opus-5-5", name: "claude-opus-5-5 (Deep Research)" },
      { id: "claude-fable-5-2", name: "claude-fable-5-2 (Peak Reasoning)" },
      { id: "claude-haiku-5-5", name: "claude-haiku-5-5 (Fast Subagent)" },
      { id: "claude-sonnet-4-5", name: "claude-sonnet-4-5 (Legacy 4.5)" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek AI",
    settings: [
      {
        name: "deepseekApiKey",
        label: "API Key DeepSeek",
        type: "password",
        placeholder: "sk-...",
        info: "Kunci API untuk mengakses DeepSeek-V4 Pro, Flash & R1.",
        validation: { min_length: 10 },
      },
      {
        name: "selectedDeepSeekModel",
        label: "Pilih Model DeepSeek",
        type: "select",
        options: [],
        info: "Pilih model DeepSeek yang akan digunakan.",
      },
    ],
    models: [
      { id: "deepseek-v4-pro", name: "deepseek-v4-pro (DeepSeek-V4 Pro)" },
      { id: "deepseek-flash", name: "deepseek-flash (DeepSeek-V4.1 Flash)" },
      { id: "deepseek-reasoner", name: "deepseek-reasoner (DeepSeek-R1)" },
      { id: "deepseek-chat", name: "deepseek-chat (Alias Chat)" },
    ],
  },
  {
    id: "xai",
    name: "xAI Grok",
    settings: [
      {
        name: "xaiApiKey",
        label: "API Key xAI",
        type: "password",
        placeholder: "xai-...",
        info: "Kunci API untuk mengakses Grok 4.7 dan seri Grok Reasoning.",
        validation: { min_length: 10 },
      },
      {
        name: "selectedXaiModel",
        label: "Pilih Model Grok",
        type: "select",
        options: [],
        info: "Pilih model Grok yang akan digunakan.",
      },
    ],
    models: [
      { id: "grok-4.7", name: "grok-4.7" },
      { id: "grok-420-reasoning", name: "grok-420-reasoning" },
      { id: "grok-4.6", name: "grok-4.6" },
      { id: "grok-4.1-fast", name: "grok-4.1-fast" },
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    settings: [
      {
        name: "hfApiKey",
        label: "API Key Hugging Face",
        type: "password",
        placeholder: "hf_...",
        info: "Kunci API untuk mengakses layanan Hugging Face Inference Providers Router.",
        validation: { min_length: 10 },
      },
      {
        name: "selectedHfModel",
        label: "Pilih Model Hugging Face",
        type: "select",
        options: [],
        info: "Pilih model Hugging Face yang akan digunakan.",
      },
    ],
    models: [
      { id: "deepseek-ai/DeepSeek-V4.1-Flash:fastest", name: "deepseek-ai/DeepSeek-V4.1-Flash:fastest" },
      { id: "deepseek-ai/DeepSeek-R1", name: "deepseek-ai/DeepSeek-R1" },
      { id: "meta-llama/Llama-3.3-70B-Instruct", name: "meta-llama/Llama-3.3-70B-Instruct" },
      { id: "Qwen/Qwen3-Coder-30B-A3B-Instruct", name: "Qwen/Qwen3-Coder-30B-A3B-Instruct" },
    ],
  },
  {
    id: "custom",
    name: "OpenAI-Compatible / Kustom",
    settings: [
      {
        name: "customBaseUrl",
        label: "Base API URL",
        type: "text",
        placeholder: "http://localhost:1234/v1",
        info: "URL endpoint server lokal atau proxy router yang kompatibel dengan format OpenAI /chat/completions.",
      },
      {
        name: "customApiKey",
        label: "API Key Kustom (Opsional)",
        type: "password",
        placeholder: "sk-...",
        info: "Kunci API jika router atau server kustom Anda mewajibkan autentikasi Bearer token.",
        optional: true,
      },
      {
        name: "selectedCustomModel",
        label: "Pilih Model Kustom",
        type: "select",
        options: [],
        info: "Model yang aktif di server lokal atau router kustom.",
      },
    ],
    models: [
      { id: "local-model", name: "local-model (LM Studio / vLLM)" },
      { id: "gemini-4-carbon", name: "gemini-4-carbon (Gemini 4 Carbon Flagship)" },
      { id: "gemini-4-argon", name: "gemini-4-argon (Gemini 4 Argon Frontier)" },
      { id: "gemini-4-hydrogen", name: "gemini-4-hydrogen (Gemini 4 Hydrogen Agentic)" },
      { id: "gemini-3.8-flash", name: "gemini-3.8-flash (Gemini 3.8 Multimodal)" },
      { id: "gpt-6.1-sol", name: "gpt-6.1-sol (OpenAI GPT-6.1 Sol)" },
      { id: "gpt-6-astra", name: "gpt-6-astra (OpenAI GPT-6 Astra)" },
      { id: "claude-sonnet-5-5", name: "claude-sonnet-5-5 (Claude Sonnet 5.5)" },
      { id: "claude-opus-5-5", name: "claude-opus-5-5 (Claude Opus 5.5)" },
      { id: "deepseek-v4-pro", name: "deepseek-v4-pro (DeepSeek V4 Pro)" },
      { id: "default", name: "default (Server Default)" },
    ],
  },
];
