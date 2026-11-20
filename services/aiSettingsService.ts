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
  | 'internai'
  | 'custom';

export interface AIModelOption {
  id: string;
  label: string;
  description: string;
}

export interface AIProviderPreset {
  id: AIProviderId;
  name: string;
  shortLabel?: string;
  badge?: string;
  defaultBaseUrl: string;
  defaultModel: string;
  models: AIModelOption[];
  requiresApiKey: boolean;
  docUrl: string;
  placeholderKey: string;
  icon: string;
}

export const AI_PROVIDER_PRESETS: Record<AIProviderId, AIProviderPreset> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (AI Studio)',
    shortLabel: 'Gemini',
    badge: 'GOOGLE',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-4-carbon',
    models: [
      { id: 'gemini-4-carbon', label: 'Gemini 4 Carbon', description: 'Flagship frontier penalaran mendalam, rekayasa software kompleks & arsitektur sistem (1M+ konteks, Rekomendasi Utama)' },
      { id: 'gemini-4-argon', label: 'Gemini 4 Argon', description: 'Model frontier penalaran cepat, tajam & efisiensi tinggi untuk alur kerja produksi' },
      { id: 'gemini-4-hydrogen', label: 'Gemini 4 Hydrogen', description: 'Workhorse agentic & coding harian berefisiensi tinggi, konteks 1M token' },
      { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', description: 'Model multimodal produksi latensi ultra-rendah dengan thinking budget adaptif' },
      { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash', description: 'Model multimodal cepat untuk pemrosesan volume tinggi' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', description: 'Model ultra-ringan, super cepat & paling hemat kuota token' },
    ],
    requiresApiKey: true,
    docUrl: 'https://aistudio.google.com/app/apikey',
    placeholderKey: 'AIzaSy...',
    icon: '✨'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (GPT-6 & Reasoning)',
    shortLabel: 'OpenAI',
    badge: 'OPENAI',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-6.1-sol',
    models: [
      { id: 'gpt-6.1-sol', label: 'GPT-6.1 Sol', description: 'Workhorse optimal menyeimbangkan kecerdasan frontier dan efisiensi biaya (Rekomendasi Utama)' },
      { id: 'gpt-6-astra', label: 'GPT-6 Astra', description: 'Flagship kecerdasan tertinggi OpenAI untuk coding berat, arsitektur & penalaran ilmiah' },
      { id: 'gpt-6.1-terra', label: 'GPT-6.1 Terra', description: 'Spesialis penalaran visual, audit dokumen & analisis mendalam' },
      { id: 'gpt-6.1-luna', label: 'GPT-6.1 Luna', description: 'Latensi sub-detik untuk pemrosesan volume tinggi & otomasi harian' },
      { id: 'gpt-5.2-codex', label: 'GPT-5.2 Codex', description: 'Model spesialis rekayasa perangkat lunak & refactoring kode kompleks' },
      { id: 'gpt-5', label: 'GPT-5', description: 'Flagship enterprise stabil generasi GPT-5' },
    ],
    requiresApiKey: true,
    docUrl: 'https://platform.openai.com/api-keys',
    placeholderKey: 'sk-proj-...',
    icon: '🟢'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude 5.5 & Fable 5.2)',
    shortLabel: 'Claude',
    badge: 'ANTHROPIC',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-sonnet-5-5',
    models: [
      { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', description: 'Flagship keseimbangan kecepatan, coding & penulisan terstruktur (Rekomendasi Utama)' },
      { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', description: 'Model kelas proyek kompleks, riset mendalam & long-running agentic coding' },
      { id: 'claude-fable-5-2', label: 'Claude Fable 5.2', description: 'Model penalaran puncak untuk orkestrator sistem & tugas agen jangka panjang' },
      { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', description: 'Eksekusi ultra-cepat & paling ekonomis untuk subagent dan volume tinggi' },
      { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', description: 'Generasi 4.5 stabil untuk kompatibilitas router legacy' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.anthropic.com/settings/keys',
    placeholderKey: 'sk-ant-...',
    icon: '🟧'
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek AI (V4 & R1)',
    shortLabel: 'DeepSeek',
    badge: 'DEEPSEEK',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek-Chat (V3 / V4)', description: 'Endpoint chat standar teruji untuk tugas umum, coding & penulisan (Rekomendasi Utama Produksi)' },
      { id: 'deepseek-reasoner', label: 'DeepSeek-R1 (Reasoner)', description: 'Penalaran Chain of Thought 671B untuk logika murni & matematika' },
      { id: 'deepseek-v4-pro', label: 'DeepSeek-V4 Pro', description: 'Flagship V4 Pro 1M konteks untuk agentic workflow & coding berat (Preset Generasi 4)' },
      { id: 'deepseek-flash', label: 'DeepSeek-V4.1 Flash', description: 'Model V4.1 Flash super cepat dan sangat hemat biaya' },
    ],
    requiresApiKey: true,
    docUrl: 'https://platform.deepseek.com/api_keys',
    placeholderKey: 'sk-...',
    icon: '🔵'
  },
  xai: {
    id: 'xai',
    name: 'xAI (Grok 4.7 & Reasoning)',
    shortLabel: 'xAI Grok',
    badge: 'XAI',
    defaultBaseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-4.7',
    models: [
      { id: 'grok-4.7', label: 'Grok 4.7', description: 'Flagship xAI 500K+ konteks untuk reasoning, coding, agentic & visi (Rekomendasi)' },
      { id: 'grok-420-reasoning', label: 'Grok 420 Reasoning', description: 'Model penalaran multi-langkah untuk logika, matematika & audit kode' },
      { id: 'grok-4.6', label: 'Grok 4.6', description: 'Generasi 4.6 stabil untuk tugas kompleks' },
      { id: 'grok-4.1-fast', label: 'Grok 4.1 Fast', description: 'Model cepat dan hemat biaya untuk pemrosesan volume tinggi' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.x.ai/',
    placeholderKey: 'xai-...',
    icon: '🖤'
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI (La Plateforme)',
    shortLabel: 'Mistral',
    badge: 'MISTRAL',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large 4 (Latest)', description: 'Flagship multimodal 1M konteks untuk penalaran kompleks & tool-use (Rekomendasi)' },
      { id: 'mistral-small-latest', label: 'Mistral Small 4 (Latest)', description: 'Model hybrid efisien menyatukan instruct, reasoning & coding' },
      { id: 'codestral-latest', label: 'Codestral (Latest)', description: 'Model spesialis sintesis kode dan refactoring' },
      { id: 'ministral-3b-latest', label: 'Ministral 3B (Latest)', description: 'Model ringan latensi ultra rendah untuk tugas terarah' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.mistral.ai/api-keys/',
    placeholderKey: 'mis_...',
    icon: '🌪️'
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud (LPU Ultra-Fast Inference)',
    shortLabel: 'Groq',
    badge: 'LPU',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', description: 'Model 70B stabil 300+ token/detik (Rekomendasi Utama Produksi)' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', description: 'Respons instan sub-detik untuk tugas ringan' },
      { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Llama 4 Maverick (128E)', description: 'Flagship Llama 4 MoE di Groq LPU dengan kecepatan ekstrem' },
      { id: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout (16E)', description: 'Llama 4 Scout cepat dengan dukungan konteks panjang' },
      { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B', description: 'Model multimodal & penalaran cepat generasi Qwen 3.8' },
      { id: 'openai/gpt-oss-20b', label: 'OpenAI GPT-OSS 20B', description: 'Model open-weights OpenAI berlatensi sub-detik' },
    ],
    requiresApiKey: true,
    docUrl: 'https://console.groq.com/keys',
    placeholderKey: 'gsk_...',
    icon: '⚡'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Universal Model Aggregator)',
    shortLabel: 'OpenRouter',
    badge: 'ROUTER',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-sonnet-5.5',
    models: [
      { id: 'anthropic/claude-sonnet-5.5', label: 'Claude Sonnet 5.5', description: 'Flagship Anthropic 1M konteks untuk coding & penulisan (Rekomendasi Utama)' },
      { id: 'anthropic/claude-opus-5.5', label: 'Claude Opus 5.5', description: 'Flagship Anthropic untuk proyek kompleks & riset mendalam' },
      { id: 'anthropic/claude-fable-5.2', label: 'Claude Fable 5.2', description: 'Model penalaran puncak Anthropic untuk alur kerja jangka panjang' },
      { id: 'google/gemini-4-carbon', label: 'Gemini 4 Carbon', description: 'Flagship Google Gemini 4 penalaran mendalam & rekayasa sistem' },
      { id: 'google/gemini-4-argon', label: 'Gemini 4 Argon', description: 'Frontier reasoning cepat & efisiensi tinggi Google' },
      { id: 'google/gemini-4-hydrogen', label: 'Gemini 4 Hydrogen', description: 'Workhorse agentic & coding harian Google' },
      { id: 'google/gemini-3.8-flash', label: 'Gemini 3.8 Flash', description: 'Workhorse multimodal cepat generasi 3.8' },
      { id: 'openai/gpt-6-astra', label: 'OpenAI GPT-6 Astra', description: 'Flagship tertinggi OpenAI GPT-6 untuk penalaran berat' },
      { id: 'openai/gpt-6.1-sol', label: 'OpenAI GPT-6.1 Sol', description: 'GPT-6 keseimbangan kecerdasan dan efisiensi biaya' },
      { id: 'deepseek/deepseek-v4-pro', label: 'DeepSeek V4 Pro', description: 'Flagship open-frontier DeepSeek 1M konteks' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1', description: 'Reasoning 671B Chain of Thought' },
      { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Llama 4 Maverick', description: 'Flagship open-weights MoE Meta generasi 4' },
      { id: 'x-ai/grok-4.7', label: 'xAI Grok 4.7', description: 'Flagship xAI 500K+ konteks' },
    ],
    requiresApiKey: true,
    docUrl: 'https://openrouter.ai/keys',
    placeholderKey: 'sk-or-v1-...',
    icon: '🟣'
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI (Live Web Search & Reasoning)',
    shortLabel: 'Perplexity',
    badge: 'SEARCH',
    defaultBaseUrl: 'https://api.perplexity.ai',
    defaultModel: 'sonar-reasoning-pro',
    models: [
      { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro', description: 'Penalaran multi-langkah dengan sitasi web real-time (Rekomendasi)' },
      { id: 'sonar-deep-research', label: 'Sonar Deep Research', description: 'Riset agen komprehensif lintas banyak sumber web' },
      { id: 'sonar-pro', label: 'Sonar Pro', description: 'Pencarian internet mendalam multi-sumber' },
      { id: 'sonar', label: 'Sonar', description: 'Pencarian web ringan dan cepat' },
    ],
    requiresApiKey: true,
    docUrl: 'https://www.perplexity.ai/settings/api',
    placeholderKey: 'pplx-...',
    icon: '🌐'
  },
  together: {
    id: 'together',
    name: 'Together AI (Open-Source Frontier)',
    shortLabel: 'Together AI',
    badge: 'CLOUD',
    defaultBaseUrl: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo', description: 'Model 70B berlatensi sangat cepat & teruji (Rekomendasi)' },
      { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1 (Full 671B)', description: 'Model penalaran rantai pemikiran DeepSeek R1' },
      { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3', description: 'Model general chat 671B efisien' },
      { id: 'deepseek-ai/DeepSeek-V4-Pro', label: 'DeepSeek V4 Pro', description: 'Flagship DeepSeek V4 Pro serverless (Preset)' },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen 2.5 72B Turbo', description: 'Model penalaran & multilingual kuat dari Qwen' },
    ],
    requiresApiKey: true,
    docUrl: 'https://api.together.ai/settings/api-keys',
    placeholderKey: 'tog-...',
    icon: '🤝'
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras Cloud (World-Record WSE Speed)',
    shortLabel: 'Cerebras',
    badge: 'WSE',
    defaultBaseUrl: 'https://api.cerebras.ai/v1',
    defaultModel: 'llama-3.3-70b',
    models: [
      { id: 'llama-3.3-70b', label: 'Llama 3.3 70B (2000+ tps)', description: 'Model 70B dengan kecepatan instan wafer-scale engine (Rekomendasi)' },
      { id: 'llama3.1-8b', label: 'Llama 3.1 8B', description: 'Eksekusi ultra instan' },
      { id: 'gpt-oss-120b', label: 'GPT-OSS 120B (~3000 tps)', description: 'Model open-weights 120B berkecepatan ~3.000 token/detik' },
      { id: 'qwen-3.8-27b', label: 'Qwen 3.8 27B (~1850 tps)', description: 'Qwen 3.8 berkecepatan ~1.850 token/detik' },
    ],
    requiresApiKey: true,
    docUrl: 'https://cloud.cerebras.ai/',
    placeholderKey: 'csk-...',
    icon: '🚀'
  },
  sambanova: {
    id: 'sambanova',
    name: 'SambaNova Cloud (Full Precision RDU)',
    shortLabel: 'SambaNova',
    badge: 'RDU',
    defaultBaseUrl: 'https://api.sambanova.ai/v1',
    defaultModel: 'Meta-Llama-3.3-70B-Instruct',
    models: [
      { id: 'Meta-Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B (Full Precision)', description: 'Kualitas FP16 murni berkecepatan tinggi di SambaNova RDU (Rekomendasi)' },
      { id: 'DeepSeek-R1', label: 'DeepSeek R1 (Full 671B)', description: 'Penalaran penuh 671B di atas cluster SambaNova RDU' },
      { id: 'DeepSeek-V3', label: 'DeepSeek V3', description: 'Model chat general-purpose throughput tinggi' },
      { id: 'gemma-4-31B-it', label: 'Gemma 4 31B Instruct', description: 'Model terbuka terbaru Google Gemma 4 presisi tinggi' },
    ],
    requiresApiKey: true,
    docUrl: 'https://cloud.sambanova.ai/',
    placeholderKey: 'samba-...',
    icon: '⚡'
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere (Command A Enterprise)',
    shortLabel: 'Cohere',
    badge: 'COMMAND',
    defaultBaseUrl: 'https://api.cohere.ai/compatibility/v1',
    defaultModel: 'command-r-plus-08-2024',
    models: [
      { id: 'command-r-plus-08-2024', label: 'Command R+ (Enterprise Live)', description: 'Model enterprise stabil untuk RAG, penalaran bisnis & tool-use (Rekomendasi)' },
      { id: 'command-r7b-12-2024', label: 'Command R 7B', description: 'Versi ringan berkecepatan tinggi' },
      { id: 'command-a-plus-05-2026', label: 'Command A+ (MoE Multimodal)', description: 'Flagship enterprise MoE generasi Command A (Preset Next-Gen)' },
      { id: 'command-a-reasoning-08-2025', label: 'Command A Reasoning', description: 'Varian penalaran mendalam untuk analisis bisnis kompleks' },
      { id: 'command-a-03-2025', label: 'Command A (Base)', description: 'Model utama generasi Command A untuk instruksi terstruktur' },
    ],
    requiresApiKey: true,
    docUrl: 'https://dashboard.cohere.com/api-keys',
    placeholderKey: 'coh-...',
    icon: '🏛️'
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face (Inference Providers Router)',
    shortLabel: 'Hugging Face',
    badge: 'HF',
    defaultBaseUrl: 'https://router.huggingface.co/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B Instruct', description: 'Open-weights stabil Meta di HF Router (Rekomendasi)' },
      { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1', description: 'Model penalaran frontier di HF Router' },
      { id: 'deepseek-ai/DeepSeek-V4.1-Flash:fastest', label: 'DeepSeek V4.1 Flash (:fastest)', description: 'Auto-routed tercepat melalui HF Inference Providers' },
      { id: 'Qwen/Qwen3-Coder-30B-A3B-Instruct', label: 'Qwen3 Coder 30B A3B', description: 'Spesialis coding MoE efisien di HF Router' },
    ],
    requiresApiKey: true,
    docUrl: 'https://huggingface.co/settings/tokens',
    placeholderKey: 'hf_...',
    icon: '🤗'
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local Offline AI)',
    shortLabel: 'Ollama',
    badge: 'LOCAL',
    defaultBaseUrl: 'http://localhost:11434/v1',
    defaultModel: 'qwen3.8:27b',
    models: [
      { id: 'qwen3.8:27b', label: 'Qwen 3.8 (27B)', description: 'Workhorse penalaran & chat lokal terbaik untuk 24GB VRAM (Rekomendasi)' },
      { id: 'qwen3-coder:30b', label: 'Qwen3 Coder (30B MoE)', description: 'Standar emas coding lokal & RAG cepat (24GB VRAM)' },
      { id: 'gemma4:12b', label: 'Gemma 4 (12B)', description: 'Model multimodal Google Gemma 4 optimal di 16GB RAM/VRAM' },
      { id: 'gemma4:31b', label: 'Gemma 4 (31B)', description: 'Model workstation presisi tinggi untuk 32-48GB VRAM' },
      { id: 'llama4:16x17b', label: 'Llama 4 (Scout MoE)', description: 'Model multimodal & konteks masif Meta Llama 4 lokal' },
      { id: 'qwen3.5:9b', label: 'Qwen 3.5 (9B)', description: 'Daily driver ringan dan tajam untuk 16GB RAM/VRAM' },
      { id: 'deepseek-r1:14b', label: 'DeepSeek-R1 (14B)', description: 'Penalaran R1 optimal di 16GB RAM/VRAM' },
      { id: 'deepseek-r1:8b', label: 'DeepSeek-R1 (8B)', description: 'Penalaran R1 ringkas untuk 8GB VRAM' },
      { id: 'deepseek-r1:latest', label: 'DeepSeek-R1 (Latest)', description: 'Tag default resmi DeepSeek R1 di Ollama' },
    ],
    requiresApiKey: false,
    docUrl: 'https://ollama.com/',
    placeholderKey: 'Opsional (tidak wajib untuk Ollama)',
    icon: '🦙'
  },
  internai: {
    id: 'internai',
    name: 'Intern-Discovery / 书生·端砚 (Shanghai AI Lab)',
    shortLabel: 'Intern-AI',
    badge: 'INTERN-AI',
    defaultBaseUrl: 'https://discovery-api.intern-ai.org.cn/v1',
    defaultModel: 'intern-s2',
    models: [
      { id: 'Agents-A1', label: 'Agents-A1 (Multimodal 256K · Hot)', description: 'Shanghai AI Lab Agents-A1 multimodal (Input 4 / Output 16 credits)' },
      { id: 'Atria-Dawn', label: 'Atria-Dawn (LLM 512K · Hot)', description: 'Shanghai AI Lab Atria-Dawn 512K long-context LLM (Input 80 / Output 280 credits)' },
      { id: 'Sage-A1.5', label: 'Sage-A1.5 (Multimodal 512K · Hot)', description: 'Shanghai AI Lab Sage-A1.5 multimodal (Input 4 / Output 16 credits)' },
      { id: 'Sage-A1.5-Taiyi', label: 'Sage-A1.5-Taiyi (Agent 512K)', description: 'Shanghai AI Lab Sage-A1.5-Taiyi specialized reasoning agent (Input 32 / Output 128 credits)' },
      { id: 'Sage-S2.1-Flash', label: 'Sage-S2.1-Flash (Multimodal 512K · New)', description: 'Shanghai AI Lab Sage-S2.1-Flash high-speed multimodal (Input 8 / Output 28 credits)' },
      { id: 'deepseek-v4.1-flash-1017', label: 'DeepSeek-V4.1-Flash-1017 (Multimodal 1M)', description: 'DeepSeek V4.1 Flash 1M context via Intern-Discovery' },
      { id: 'glm-5.3', label: 'GLM-5.3 (LLM 1M)', description: 'GLM-5.3 1M context via Intern-Discovery' },
      { id: 'intern-decision-4b', label: '书生·Decision-4B (Decision 8K)', description: 'Shanghai AI Lab Decision-4B model (SystemOne protocol)' },
      { id: 'intern-s2', label: '书生·S2 (Multimodal 256K · Flagship)', description: 'Shanghai AI Lab Intern-S2 flagship multimodal (Input 30 / Output 180 credits)' },
      { id: 'kimi-k3.1-pro', label: 'Kimi-K3.1-Pro (Multimodal 1M · New)', description: 'Moonshot Kimi K3.1 Pro 1M context via Intern-Discovery' },
      { id: 'qwen3.8-27b', label: 'Qwen3.8-27B (Multimodal 256K)', description: 'Qwen 3.8 27B multimodal via Intern-Discovery' },
    ],
    requiresApiKey: true,
    docUrl: 'https://discovery.intern-ai.org.cn/',
    placeholderKey: 'API key dari https://discovery.intern-ai.org.cn/',
    icon: '🧪'
  },
  custom: {
    id: 'custom',
    name: 'OpenAI-Compatible / Kustom (LM Studio, vLLM, LiteLLM, Cloudflare AI)',
    shortLabel: 'OpenAI-Comp',
    badge: 'OPENAI-COMP',
    defaultBaseUrl: 'http://localhost:1234/v1',
    defaultModel: 'local-model',
    models: [
      { id: '__custom_empty__', label: '✍️ [Kustom] Ketik Model Sendiri (Kosong)', description: 'Pilihan kosong untuk mengetik model AI kustom Anda sendiri' },
      { id: 'local-model', label: 'local-model', description: 'Model aktif di LM Studio / vLLM / Local Host' },
      { id: 'intern-s2', label: 'intern-s2', description: 'Intern-Discovery Flagship Multimodal (Shanghai AI Lab)' },
      { id: 'Sage-S2.1-Flash', label: 'Sage-S2.1-Flash', description: 'Intern-Discovery Sage-S2.1-Flash Multimodal 512K (New)' },
      { id: 'Agents-A1', label: 'Agents-A1', description: 'Intern-Discovery Agents-A1 Multimodal 256K (Hot)' },
      { id: 'Atria-Dawn', label: 'Atria-Dawn', description: 'Intern-Discovery Atria-Dawn LLM 512K (Hot)' },
      { id: 'Sage-A1.5', label: 'Sage-A1.5', description: 'Intern-Discovery Sage-A1.5 Multimodal 512K (Hot)' },
      { id: 'Sage-A1.5-Taiyi', label: 'Sage-A1.5-Taiyi', description: 'Intern-Discovery Sage-A1.5-Taiyi Agent 512K' },
      { id: 'deepseek-v4.1-flash-1017', label: 'deepseek-v4.1-flash-1017', description: 'DeepSeek V4.1 Flash 1M via Intern-Discovery' },
      { id: 'glm-5.3', label: 'glm-5.3', description: 'GLM-5.3 1M via Intern-Discovery' },
      { id: 'intern-decision-4b', label: 'intern-decision-4b', description: 'Shanghai AI Lab Decision-4B (SystemOne)' },
      { id: 'kimi-k3.1-pro', label: 'kimi-k3.1-pro', description: 'Moonshot Kimi K3.1 Pro 1M via Intern-Discovery' },
      { id: 'qwen3.8-27b', label: 'qwen3.8-27b', description: 'Qwen 3.8 27B via Intern-Discovery' },
      { id: 'gemini-4-carbon', label: 'gemini-4-carbon', description: 'Google Gemini 4 Carbon (Frontier Reasoning Flagship)' },
      { id: 'gemini-4-argon', label: 'gemini-4-argon', description: 'Google Gemini 4 Argon (Optimized Frontier Intelligence)' },
      { id: 'gemini-4-hydrogen', label: 'gemini-4-hydrogen', description: 'Google Gemini 4 Hydrogen (Agentic & Daily Coding)' },
      { id: 'gemini-3.8-flash', label: 'gemini-3.8-flash', description: 'Google Gemini 3.8 Flash (Multimodal Cepat Produksi)' },
      { id: 'google/gemini-4-carbon', label: 'google/gemini-4-carbon', description: 'Prefix Google untuk OpenRouter / LiteLLM / OneAPI' },
      { id: 'google/gemini-4-argon', label: 'google/gemini-4-argon', description: 'Prefix Google untuk OpenRouter / LiteLLM / OneAPI' },
      { id: 'google/gemini-4-hydrogen', label: 'google/gemini-4-hydrogen', description: 'Prefix Google untuk OpenRouter / LiteLLM / OneAPI' },
      { id: 'gpt-6-astra', label: 'gpt-6-astra', description: 'OpenAI GPT-6 Astra Flagship' },
      { id: 'gpt-6.1-sol', label: 'gpt-6.1-sol', description: 'OpenAI GPT-6.1 Sol Workhorse' },
      { id: 'claude-sonnet-5-5', label: 'claude-sonnet-5-5', description: 'Anthropic Claude Sonnet 5.5' },
      { id: 'claude-opus-5-5', label: 'claude-opus-5-5', description: 'Anthropic Claude Opus 5.5' },
      { id: 'claude-fable-5-2', label: 'claude-fable-5-2', description: 'Anthropic Claude Fable 5.2 Reasoning' },
      { id: 'deepseek-v4-pro', label: 'deepseek-v4-pro', description: 'DeepSeek V4 Pro 1M Konteks' },
      { id: 'deepseek-reasoner', label: 'deepseek-reasoner', description: 'DeepSeek R1 CoT Reasoner via Proxy' },
      { id: 'deepseek-chat', label: 'deepseek-chat', description: 'DeepSeek Chat (V4 / V3 Alias)' },
      { id: 'grok-4.7', label: 'grok-4.7', description: 'xAI Grok 4.7 Flagship via Proxy' },
      { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'llama-4-maverick', description: 'Meta Llama 4 Maverick MoE' },
      { id: 'qwen3.8:27b', label: 'qwen3.8:27b', description: 'Qwen 3.8 27B via Local / Proxy' },
      { id: 'default', label: 'default', description: 'Model default fallback server' },
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
  providerKeys?: Partial<Record<AIProviderId, string>>;
}

const SETTINGS_STORAGE_KEY = 'promptmatrix_ai_unified_settings';
const LEGACY_GEMINI_KEY = 'promptmatrix_gemini_api_key';

/**
 * Thoroughly sanitizes an AI API Key by stripping surrounding quotes,
 * accidental "Bearer " prefixes, zero-width unicode characters, carriage returns,
 * and surrounding whitespace.
 */
export const sanitizeApiKey = (key: string): string => {
  if (!key) return '';
  let clean = key.trim();
  // Strip zero-width unicode spaces, BOM, non-breaking spaces
  clean = clean.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '');
  // Strip carriage returns, newlines, tabs
  clean = clean.replace(/[\r\n\t]/g, '');
  // Strip surrounding double or single quotes
  clean = clean.replace(/^["']+|["']+$/g, '');
  // Strip accidental "Bearer " or "bearer " prefix
  clean = clean.replace(/^bearer\s+/i, '');
  return clean.trim();
};

/**
 * Detects if a provided API key appears to belong to a completely different provider,
 * such as pasting a Google Gemini key into an OpenAI or Intern-Discovery configuration.
 */
export const detectKeyProviderMismatch = (key: string, provider: AIProviderId): string | null => {
  const clean = sanitizeApiKey(key);
  if (!clean || clean.length < 10) return null;

  // Google Gemini API keys start with "AIzaSy"
  if (clean.startsWith('AIzaSy') && provider !== 'gemini') {
    return 'Kunci ini berformat Google Gemini (AIzaSy...). Anda saat ini memilih provider lain. Harap gunakan API Key resmi dari provider yang dipilih.';
  }

  // Anthropic API keys start with "sk-ant-"
  if (clean.startsWith('sk-ant-') && provider !== 'anthropic') {
    return 'Kunci ini berformat Anthropic Claude (sk-ant-...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.';
  }

  // Groq API keys start with "gsk_"
  if (clean.startsWith('gsk_') && provider !== 'groq') {
    return 'Kunci ini berformat Groq (gsk_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.';
  }

  // Hugging Face tokens start with "hf_"
  if (clean.startsWith('hf_') && provider !== 'huggingface') {
    return 'Kunci ini berformat Hugging Face (hf_...). Harap gunakan API Key yang sesuai dengan provider yang dipilih.';
  }

  return null;
};

export const getDefaultSettings = (): AISettings => ({
  provider: 'gemini',
  apiKey: '',
  baseUrl: AI_PROVIDER_PRESETS.gemini.defaultBaseUrl,
  model: AI_PROVIDER_PRESETS.gemini.defaultModel,
  providerKeys: {},
});

export const getStoredAISettings = (): AISettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed: AISettings = JSON.parse(raw);
      const provider = parsed.provider || 'gemini';
      const providerKeys: Partial<Record<AIProviderId, string>> = parsed.providerKeys || {};

      if (parsed.apiKey && !providerKeys[provider]) {
        providerKeys[provider] = sanitizeApiKey(parsed.apiKey);
      }

      return {
        ...getDefaultSettings(),
        ...parsed,
        apiKey: sanitizeApiKey(parsed.apiKey || providerKeys[provider] || ''),
        providerKeys,
      };
    }

    // Check legacy Gemini key
    const legacyKey = localStorage.getItem(LEGACY_GEMINI_KEY);
    if (legacyKey && legacyKey.trim()) {
      const cleanLegacy = sanitizeApiKey(legacyKey);
      return {
        ...getDefaultSettings(),
        apiKey: cleanLegacy,
        providerKeys: { gemini: cleanLegacy },
      };
    }

    // Check env vars
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY) {
        const envKey = sanitizeApiKey(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY);
        return {
          ...getDefaultSettings(),
          apiKey: envKey,
          providerKeys: { gemini: envKey },
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
    const cleanKey = sanitizeApiKey(settings.apiKey);
    const providerKeys: Partial<Record<AIProviderId, string>> = {
      ...(settings.providerKeys || {}),
      [settings.provider]: cleanKey,
    };
    const sanitized: AISettings = {
      ...settings,
      apiKey: cleanKey,
      baseUrl: (settings.baseUrl || '').trim(),
      model: (settings.model || '').trim(),
      providerKeys,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(sanitized));
    if (sanitized.provider === 'gemini') {
      localStorage.setItem(LEGACY_GEMINI_KEY, sanitized.apiKey);
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
  return Boolean(settings.apiKey && sanitizeApiKey(settings.apiKey).length > 0);
};
