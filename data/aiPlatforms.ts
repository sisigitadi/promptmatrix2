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
        info: "Kunci API untuk mengakses layanan Google Gemini.",
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
      { id: "gemini-3.7-flash", name: "gemini-3.7-flash" },
      { id: "gemini-3.1-pro", name: "gemini-3.1-pro" },
      { id: "gemini-3.5-flash-lite", name: "gemini-3.5-flash-lite" },
      { id: "gemini-2.5-pro", name: "gemini-2.5-pro" },
      { id: "gemini-2.5-flash", name: "gemini-2.5-flash" },
      {
        id: "gemini-2.5-flash-lite-preview",
        name: "gemini-2.5-flash-lite-preview",
      },
      { id: "gemini-pro", name: "gemini-pro" },
      { id: "gemini-pro-vision", name: "gemini-pro-vision" },
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
        info: "Kunci API untuk mengakses layanan OpenAI GPT-5 dan o3.",
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
      { id: "gpt-5", name: "gpt-5" },
      { id: "o3", name: "o3" },
      { id: "o4-mini", name: "o4-mini" },
      { id: "gpt-4.5-preview", name: "gpt-4.5-preview" },
      { id: "gpt-4o", name: "gpt-4o" },
      { id: "gpt-4o-mini", name: "gpt-4o-mini" },
      { id: "o3-mini", name: "o3-mini" },
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
        info: "Kunci API untuk mengakses layanan Anthropic Claude.",
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
      { id: "claude-sonnet-4-5", name: "claude-sonnet-4-5" },
      { id: "claude-opus-4", name: "claude-opus-4" },
      { id: "claude-haiku-4-5", name: "claude-haiku-4-5" },
      { id: "claude-3-7-sonnet-20250219", name: "claude-3-7-sonnet-20250219" },
      { id: "claude-3-5-sonnet-20241022", name: "claude-3-5-sonnet-20241022" },
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
        info: "Kunci API untuk mengakses DeepSeek-R1 dan DeepSeek-V3.",
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
      { id: "deepseek-reasoner", name: "deepseek-reasoner (DeepSeek-R1)" },
      { id: "deepseek-chat", name: "deepseek-chat (DeepSeek-V3)" },
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
        info: "Kunci API untuk mengakses Grok 4.6 dan seri Grok.",
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
      { id: "grok-4.6", name: "grok-4.6" },
      { id: "grok-4.5", name: "grok-4.5" },
      { id: "grok-4.1-fast", name: "grok-4.1-fast" },
      { id: "grok-2-latest", name: "grok-2-latest" },
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
        placeholder: "Masukkan API Key Hugging Face Anda",
        info: "Kunci API untuk mengakses layanan Hugging Face Inference API.",
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
      { id: "default", name: "Pilih Model" },
      {
        id: "meta-llama/Llama-3.3-70B-Instruct",
        name: "meta-llama/Llama-3.3-70B-Instruct",
      },
      {
        id: "deepseek-ai/DeepSeek-R1",
        name: "deepseek-ai/DeepSeek-R1",
      },
      {
        id: "HuggingFaceH4/zephyr-7b-beta",
        name: "HuggingFaceH4/zephyr-7b-beta",
      },
      {
        id: "mistralai/Mistral-7B-Instruct-v0.2",
        name: "mistralai/Mistral-7B-Instruct-v0.2",
      },
      { id: "google/gemma-7b-it", name: "google/gemma-7b-it" },
    ],
  },
];
