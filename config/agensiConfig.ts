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

export interface AgensiConfig {
  readonly marketplaceBaseUrl: string;
  readonly affiliateUrl: string;
  readonly creatorStoreUrl: string;
  readonly commissionInfo: AgensiCommissionInfo;
  readonly supportedAgents: readonly AgensiSupportedAgent[];
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
};
