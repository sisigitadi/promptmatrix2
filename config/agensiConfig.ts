export interface AgensiSupportedAgent {
  readonly id: string;
  readonly name: string;
  readonly category: 'cli' | 'ide' | 'cloud' | 'desktop';
  readonly featured?: boolean;
}

export interface AgensiCommissionInfo {
  readonly standardSharePercent: number;
  readonly affiliateNewBuyerSharePercent: number;
  readonly affiliateRecurringCommissionPercent: number;
  readonly affiliateWindowMonths: number;
  readonly listingModel: string;
  readonly paymentFeesCovered: boolean;
}

export interface AgensiSkillPackItem {
  readonly slug: string;
  readonly title: string;
  readonly tier: 'lead-magnet' | 'flagship';
  readonly summaryId: string;
  readonly summaryEn: string;
  readonly folderPath: string;
  readonly validatorScript?: string;
}

export interface AgensiConfig {
  readonly marketplaceBaseUrl: string;
  readonly affiliateUrl: string;
  readonly creatorStoreUrl: string;
  readonly commissionInfo: AgensiCommissionInfo;
  readonly supportedAgents: readonly AgensiSupportedAgent[];
  readonly bundledSkillPacks: readonly AgensiSkillPackItem[];
}

export const AGENSI_CONFIG: AgensiConfig = {
  marketplaceBaseUrl: 'https://agensi.io',
  // Configure these in production when your Agensi.io creator account is active.
  // Leave empty ('') when unconfigured so no placeholder link is shown in the UI.
  affiliateUrl: '',
  creatorStoreUrl: '',
  commissionInfo: {
    standardSharePercent: 70,
    affiliateNewBuyerSharePercent: 90,
    affiliateRecurringCommissionPercent: 20,
    affiliateWindowMonths: 6,
    listingModel: 'Free, Non-Exclusive',
    paymentFeesCovered: true,
  },
  supportedAgents: [
    { id: 'claude-code', name: 'Claude Code', category: 'cli', featured: true },
    { id: 'cursor', name: 'Cursor', category: 'ide', featured: true },
    { id: 'github-copilot', name: 'GitHub Copilot', category: 'ide', featured: true },
    { id: 'gemini-cli', name: 'Gemini CLI', category: 'cli', featured: true },
    { id: 'windsurf', name: 'Windsurf', category: 'ide', featured: true },
    { id: 'codex', name: 'OpenAI Codex', category: 'cli', featured: true },
    { id: 'antigravity', name: 'Antigravity', category: 'ide' },
    { id: 'cline', name: 'Cline', category: 'ide' },
    { id: 'roo-code', name: 'Roo Code', category: 'ide' },
    { id: 'goose', name: 'Goose', category: 'cli' },
    { id: 'amp', name: 'Amp', category: 'cli' },
    { id: 'trae', name: 'Trae', category: 'ide' },
    { id: 'kiro', name: 'Kiro', category: 'ide' },
    { id: 'continue', name: 'Continue', category: 'ide' },
    { id: 'zed', name: 'Zed', category: 'ide' },
    { id: 'aider', name: 'Aider', category: 'cli' },
    { id: 'opencode', name: 'OpenCode', category: 'cli' },
    { id: 'junie', name: 'JetBrains Junie', category: 'ide' },
    { id: 'augment', name: 'Augment Code', category: 'ide' },
    { id: 'factory-droid', name: 'Factory Droid', category: 'cli' },
    { id: 'amazon-q', name: 'Amazon Q Developer', category: 'ide' },
    { id: 'kilo-code', name: 'Kilo Code', category: 'ide' },
    { id: 'qwen-code', name: 'Qwen Code', category: 'cli' },
    { id: 'mistral-vibe', name: 'Mistral Vibe', category: 'cli' },
    { id: 'devin', name: 'Devin', category: 'cloud' },
    { id: 'pi-agent', name: 'Pi Agent', category: 'cli' },
    { id: 'letta', name: 'Letta', category: 'desktop' },
  ],
  bundledSkillPacks: [
    {
      slug: 'prompt-matrix-prompt-architect',
      title: 'PromptMatrix Prompt Architect',
      tier: 'lead-magnet',
      summaryId: 'Menyusun prompt LLM deterministik (RTF, CO-STAR, GCC, Few-Shot) dan kontrak JSON RFC 8259.',
      summaryEn: 'Structures deterministic LLM prompts (RTF, CO-STAR, GCC, Few-Shot) and RFC 8259 JSON contracts.',
      folderPath: 'agensi-skills/prompt-matrix-prompt-architect',
      validatorScript: 'node agensi-skills/prompt-matrix-prompt-architect/scripts/validate-json-prompt.mjs',
    },
    {
      slug: 'fullstack-ts-nextjs-architect',
      title: 'Fullstack TS & Next.js Architect',
      tier: 'flagship',
      summaryId: 'Arsitektur Next.js App Router, TypeScript strict zero-any, kontrak API Zod, dan migrasi SQL zero-downtime.',
      summaryEn: 'Next.js App Router architecture, strict zero-any TypeScript, Zod API contracts, and zero-downtime SQL migrations.',
      folderPath: 'agensi-skills/fullstack-ts-nextjs-architect',
      validatorScript: 'node agensi-skills/fullstack-ts-nextjs-architect/scripts/check-strict-ts.mjs',
    },
    {
      slug: 'mcp-server-production-builder',
      title: 'MCP Server Production Builder',
      tier: 'flagship',
      summaryId: 'Merancang server MCP dengan skema Zod/JSON ketat, transport stdio & Streamable HTTP, serta redaksi secret.',
      summaryEn: 'Designs hardened MCP servers with strict Zod/JSON schemas, stdio/Streamable HTTP transports, and secret redaction.',
      folderPath: 'agensi-skills/mcp-server-production-builder',
      validatorScript: 'node agensi-skills/mcp-server-production-builder/scripts/validate-mcp-schema.mjs',
    },
    {
      slug: 'antislop-ui-and-copy-auditor',
      title: 'Antislop UI & Copy Auditor',
      tier: 'flagship',
      summaryId: 'Audit kontras WCAG AA dark/light, reflow mobile 375px, focus ring keyboard, em-dash, dan kebersihan copy.',
      summaryEn: 'Audits WCAG AA dark/light contrast, 375px mobile reflow, keyboard focus rings, em dashes, and copy hygiene.',
      folderPath: 'agensi-skills/antislop-ui-and-copy-auditor',
      validatorScript: 'node agensi-skills/antislop-ui-and-copy-auditor/scripts/audit-slop.mjs',
    },
    {
      slug: 'seo-geo-aeo-content-engine',
      title: 'SEO, GEO & AEO Content Engine',
      tier: 'flagship',
      summaryId: 'Konten pillar berbasis bukti untuk perayap SEO, sitasi AI (GEO), direct answer (AEO), dan validator JSON-LD.',
      summaryEn: 'Evidence-first pillar pages for SEO crawlers, GEO AI citations, AEO direct answers, and JSON-LD validation.',
      folderPath: 'agensi-skills/seo-geo-aeo-content-engine',
      validatorScript: 'node agensi-skills/seo-geo-aeo-content-engine/scripts/validate-jsonld.mjs',
    },
    {
      slug: 'multimodal-video-image-director',
      title: 'Multimodal Video & Image Director',
      tier: 'flagship',
      summaryId: 'Kompiler prompt model-native untuk Midjourney v8.2, FLUX.3/FLUX.2, Veo 3.1, Kling 3.0, Runway Gen-4.5, dan Suno v6.',
      summaryEn: 'Model-native prompt compiler for Midjourney v8.2, FLUX.3/FLUX.2, Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6.',
      folderPath: 'agensi-skills/multimodal-video-image-director',
    },
  ],
};
