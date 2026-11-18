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
  readonly priceUsd: number;
  readonly priceLabel: string;
  readonly matchedCategories: readonly string[];
  readonly includedFiles: readonly string[];
  readonly summaryId: string;
  readonly summaryEn: string;
  readonly folderPath: string;
  readonly validatorScript?: string;
  readonly listingUrl?: string;
}

export interface AgensiConfig {
  readonly marketplaceBaseUrl: string;
  readonly affiliateUrl: string;
  readonly creatorStoreUrl: string;
  readonly affiliateRefCode?: string;
  readonly commissionInfo: AgensiCommissionInfo;
  readonly supportedAgents: readonly AgensiSupportedAgent[];
  readonly bundledSkillPacks: readonly AgensiSkillPackItem[];
}

export interface AgensiUrlOverrides {
  readonly affiliateUrl: string;
  readonly creatorStoreUrl: string;
  readonly affiliateRefCode: string;
}

export interface EffectiveAgensiUrls {
  readonly affiliateUrl: string;
  readonly creatorStoreUrl: string;
  readonly affiliateRefCode: string;
  readonly activeUrl: string;
}

export const AGENSI_URLS_STORAGE_KEY = 'pm_agensi_urls';

export const AGENSI_CONFIG: AgensiConfig = {
  marketplaceBaseUrl: 'https://agensi.io',
  // Configure these in production when your Agensi.io creator account is active.
  // Leave empty ('') when unconfigured so no placeholder link is shown in the UI.
  affiliateUrl: 'https://www.agensi.io/r/SIGITADI',
  creatorStoreUrl: 'https://www.agensi.io/users/sigitadi',
  affiliateRefCode: 'SIGITADI',
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
      priceUsd: 0,
      priceLabel: 'Free ($0)',
      matchedCategories: ['Koleksi & Inovasi', 'Prompt Ringkas', 'Teks & Konten', 'Prompt Proyek'],
      includedFiles: [
        'SKILL.md',
        'references/frameworks-cheatsheet.md',
        'scripts/validate-json-prompt.mjs',
      ],
      summaryId: 'Menyusun prompt LLM deterministik (RTF, CO-STAR, GCC, Few-Shot) dan kontrak JSON RFC 8259.',
      summaryEn: 'Structures deterministic LLM prompts (RTF, CO-STAR, GCC, Few-Shot) and RFC 8259 JSON contracts.',
      folderPath: 'agensi-skills/prompt-matrix-prompt-architect',
      validatorScript: 'node agensi-skills/prompt-matrix-prompt-architect/scripts/validate-json-prompt.mjs',
    },
    {
      slug: 'antislop-ui-and-copy-auditor',
      title: 'Antislop UI & Copy Auditor',
      tier: 'flagship',
      priceUsd: 12,
      priceLabel: '$12.00',
      matchedCategories: ['Teks & Konten', 'Kode & Pengembang', 'Gambar & Desain'],
      includedFiles: [
        'SKILL.md',
        'references/contrast-and-copy-rules.md',
        'scripts/audit-slop.mjs',
      ],
      summaryId: 'Audit kontras WCAG AA dark/light, reflow mobile 375px, focus ring keyboard, em-dash, dan kebersihan copy.',
      summaryEn: 'Audits WCAG AA dark/light contrast, 375px mobile reflow, keyboard focus rings, em dashes, and copy hygiene.',
      folderPath: 'agensi-skills/antislop-ui-and-copy-auditor',
      validatorScript: 'node agensi-skills/antislop-ui-and-copy-auditor/scripts/audit-slop.mjs',
    },
    {
      slug: 'fullstack-ts-nextjs-architect',
      title: 'Fullstack TS & Next.js Architect',
      tier: 'flagship',
      priceUsd: 14.99,
      priceLabel: '$14.99',
      matchedCategories: ['Kode & Pengembang', 'Prompt Proyek'],
      includedFiles: [
        'SKILL.md',
        'references/architecture-checklist.md',
        'scripts/check-strict-ts.mjs',
      ],
      summaryId: 'Arsitektur Next.js App Router, TypeScript strict zero-any, kontrak API Zod, dan migrasi SQL zero-downtime.',
      summaryEn: 'Next.js App Router architecture, strict zero-any TypeScript, Zod API contracts, and zero-downtime SQL migrations.',
      folderPath: 'agensi-skills/fullstack-ts-nextjs-architect',
      validatorScript: 'node agensi-skills/fullstack-ts-nextjs-architect/scripts/check-strict-ts.mjs',
    },
    {
      slug: 'mcp-server-production-builder',
      title: 'MCP Server Production Builder',
      tier: 'flagship',
      priceUsd: 14.99,
      priceLabel: '$14.99',
      matchedCategories: ['Kode & Pengembang', 'Koleksi & Inovasi'],
      includedFiles: [
        'SKILL.md',
        'references/mcp-transport-and-security.md',
        'scripts/validate-mcp-schema.mjs',
      ],
      summaryId: 'Merancang server MCP dengan skema Zod/JSON ketat, transport stdio & Streamable HTTP, serta redaksi secret.',
      summaryEn: 'Designs hardened MCP servers with strict Zod/JSON schemas, stdio/Streamable HTTP transports, and secret redaction.',
      folderPath: 'agensi-skills/mcp-server-production-builder',
      validatorScript: 'node agensi-skills/mcp-server-production-builder/scripts/validate-mcp-schema.mjs',
    },
    {
      slug: 'seo-geo-aeo-content-engine',
      title: 'SEO, GEO & AEO Content Engine',
      tier: 'flagship',
      priceUsd: 11.99,
      priceLabel: '$11.99',
      matchedCategories: ['Teks & Konten', 'Prompt Proyek', 'Prompt Ringkas'],
      includedFiles: [
        'SKILL.md',
        'references/schema-jsonld-templates.md',
        'scripts/validate-jsonld.mjs',
      ],
      summaryId: 'Konten pillar berbasis bukti untuk perayap SEO, sitasi AI (GEO), direct answer (AEO), dan validator JSON-LD.',
      summaryEn: 'Evidence-first pillar pages for SEO crawlers, GEO AI citations, AEO direct answers, and JSON-LD validation.',
      folderPath: 'agensi-skills/seo-geo-aeo-content-engine',
      validatorScript: 'node agensi-skills/seo-geo-aeo-content-engine/scripts/validate-jsonld.mjs',
    },
    {
      slug: 'multimodal-video-image-director',
      title: 'Multimodal Video & Image Director',
      tier: 'flagship',
      priceUsd: 9.99,
      priceLabel: '$9.99',
      matchedCategories: ['Gambar & Desain', 'Video & Animasi', 'Audio & Musik'],
      includedFiles: [
        'SKILL.md',
        'references/model-syntax-matrix.md',
        'scripts/validate-multimodal-params.mjs',
      ],
      summaryId: 'Kompiler prompt model-native untuk Midjourney v8.2, FLUX.3/FLUX.2, Veo 3.1, Kling 3.0, Runway Gen-4.5, dan Suno v6.',
      summaryEn: 'Model-native prompt compiler for Midjourney v8.2, FLUX.3/FLUX.2, Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6.',
      folderPath: 'agensi-skills/multimodal-video-image-director',
      validatorScript: 'node agensi-skills/multimodal-video-image-director/scripts/validate-multimodal-params.mjs',
    },
    {
      slug: 'owasp-api-and-cloud-security-auditor',
      title: 'OWASP API & Cloud Security Auditor',
      tier: 'flagship',
      priceUsd: 19.99,
      priceLabel: '$19.99',
      matchedCategories: ['Kode & Pengembang', 'Prompt Proyek'],
      includedFiles: [
        'SKILL.md',
        'references/owasp-cloud-security-checklist.md',
        'templates/security-audit-findings.json',
        'scripts/scan-security-risks.mjs',
      ],
      summaryId: 'Audit keamanan OWASP API Top 10, CORS, rahasia API hardcode, dan hardening IAM/cloud dengan scanner CLI.',
      summaryEn: 'Audits OWASP API Top 10, CORS, hardcoded API secrets, and cloud/IAM hardening with a deterministic CLI scanner.',
      folderPath: 'agensi-skills/owasp-api-and-cloud-security-auditor',
      validatorScript: 'node agensi-skills/owasp-api-and-cloud-security-auditor/scripts/scan-security-risks.mjs',
    },
    {
      slug: 'multi-agent-swarm-and-subagent-orchestrator',
      title: 'Multi-Agent Swarm & Subagent Orchestrator',
      tier: 'flagship',
      priceUsd: 19.99,
      priceLabel: '$19.99',
      matchedCategories: ['Koleksi & Inovasi', 'Kode & Pengembang'],
      includedFiles: [
        'SKILL.md',
        'references/subagent-handoff-patterns.md',
        'templates/swarm-task-contract.json',
        'scripts/validate-agent-workspace.mjs',
      ],
      summaryId: 'Orkestrasi subagent paralel, isolasi kepemilikan file, kontrak serah terima JSON, dan validator workspace agen.',
      summaryEn: 'Parallel subagent orchestration, strict file ownership isolation, JSON handoff contracts, and workspace validation.',
      folderPath: 'agensi-skills/multi-agent-swarm-and-subagent-orchestrator',
      validatorScript: 'node agensi-skills/multi-agent-swarm-and-subagent-orchestrator/scripts/validate-agent-workspace.mjs',
    },
    {
      slug: 'postgres-prisma-zero-downtime-sql-tuner',
      title: 'Postgres & Prisma Zero-Downtime SQL Tuner',
      tier: 'flagship',
      priceUsd: 14.99,
      priceLabel: '$14.99',
      matchedCategories: ['Kode & Pengembang'],
      includedFiles: [
        'SKILL.md',
        'references/rls-and-index-playbook.md',
        'templates/zero-downtime-migration.sql',
        'scripts/lint-sql-migrations.mjs',
      ],
      summaryId: 'Migrasi Postgres/Prisma aman tanpa lock, indeks CONCURRENTLY, kebijakan RLS, serta linter SQL otomatis.',
      summaryEn: 'Lock-safe Postgres/Prisma migrations, CONCURRENTLY indexing, RLS policy enforcement, and automated SQL linting.',
      folderPath: 'agensi-skills/postgres-prisma-zero-downtime-sql-tuner',
      validatorScript: 'node agensi-skills/postgres-prisma-zero-downtime-sql-tuner/scripts/lint-sql-migrations.mjs',
    },
    {
      slug: 'playwright-e2e-and-openapi-contract-suite',
      title: 'Playwright E2E & OpenAPI Contract Suite',
      tier: 'flagship',
      priceUsd: 14.99,
      priceLabel: '$14.99',
      matchedCategories: ['Kode & Pengembang', 'Prompt Proyek'],
      includedFiles: [
        'SKILL.md',
        'references/e2e-and-api-contract-matrix.md',
        'templates/openapi-contract-stub.json',
        'scripts/validate-openapi-and-e2e.mjs',
      ],
      summaryId: 'Pengujian E2E Playwright bebas flaky wait dan validasi skema OpenAPI 3.x dengan validator kontrak otomatis.',
      summaryEn: 'Flake-free Playwright E2E testing and OpenAPI 3.x schema contract validation with an automated CLI checker.',
      folderPath: 'agensi-skills/playwright-e2e-and-openapi-contract-suite',
      validatorScript: 'node agensi-skills/playwright-e2e-and-openapi-contract-suite/scripts/validate-openapi-and-e2e.mjs',
    },
  ],
};

const EMPTY_OVERRIDES: AgensiUrlOverrides = {
  affiliateUrl: 'https://www.agensi.io/r/SIGITADI',
  creatorStoreUrl: 'https://www.agensi.io/users/sigitadi',
  affiliateRefCode: 'SIGITADI',
};

const isBrowserStorageAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

const normalizeStoredString = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

/**
 * Reads user-configured Agensi.io URL overrides from localStorage (`pm_agensi_urls`).
 */
export const getStoredAgensiUrlOverrides = (): AgensiUrlOverrides => {
  if (!isBrowserStorageAvailable()) {
    return { ...EMPTY_OVERRIDES };
  }

  try {
    const raw = window.localStorage.getItem(AGENSI_URLS_STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_OVERRIDES };
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...EMPTY_OVERRIDES };
    }
    const record = parsed as Record<string, unknown>;
    return {
      affiliateUrl: normalizeStoredString(record.affiliateUrl),
      creatorStoreUrl: normalizeStoredString(record.creatorStoreUrl),
      affiliateRefCode: normalizeStoredString(record.affiliateRefCode),
    };
  } catch {
    return { ...EMPTY_OVERRIDES };
  }
};

/**
 * Persists user-configured Agensi.io URL overrides into localStorage (`pm_agensi_urls`).
 */
export const saveAgensiUrlOverrides = (overrides: AgensiUrlOverrides): void => {
  if (!isBrowserStorageAvailable()) {
    return;
  }

  const sanitized: AgensiUrlOverrides = {
    affiliateUrl: overrides.affiliateUrl.trim(),
    creatorStoreUrl: overrides.creatorStoreUrl.trim(),
    affiliateRefCode: overrides.affiliateRefCode.trim(),
  };

  try {
    window.localStorage.setItem(AGENSI_URLS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    // Ignore storage quota or private-mode errors safely.
  }
};

/**
 * Resolves effective Agensi.io URLs by merging stored localStorage overrides over AGENSI_CONFIG defaults.
 */
export const getEffectiveAgensiUrls = (): EffectiveAgensiUrls => {
  const stored = getStoredAgensiUrlOverrides();
  const affiliateUrl = stored.affiliateUrl || AGENSI_CONFIG.affiliateUrl.trim();
  const creatorStoreUrl = stored.creatorStoreUrl || AGENSI_CONFIG.creatorStoreUrl.trim();
  const affiliateRefCode = stored.affiliateRefCode || (AGENSI_CONFIG.affiliateRefCode || '').trim();
  const activeUrl = affiliateUrl || creatorStoreUrl;

  return {
    affiliateUrl,
    creatorStoreUrl,
    affiliateRefCode,
    activeUrl,
  };
};

const appendAffiliateRef = (baseUrl: string, refCode: string): string => {
  const trimmedUrl = baseUrl.trim();
  const trimmedRef = refCode.trim();
  if (!trimmedUrl) {
    return '';
  }
  if (!trimmedRef) {
    return trimmedUrl;
  }

  try {
    const parsed = new URL(trimmedUrl);
    if (parsed.pathname.startsWith('/r/')) {
      return trimmedUrl;
    }
    if (!parsed.searchParams.has('ref')) {
      parsed.searchParams.set('ref', trimmedRef);
    }
    return parsed.toString();
  } catch {
    const separator = trimmedUrl.includes('?') ? '&' : '?';
    if (/[?&]ref=/.test(trimmedUrl)) {
      return trimmedUrl;
    }
    return `${trimmedUrl}${separator}ref=${encodeURIComponent(trimmedRef)}`;
  }
};

/**
 * Builds the outbound Agensi.io CTA URL for a specific skill pack.
 * Returns empty string ('') when no listing, store, or affiliate reference has been configured.
 */
export const buildAgensiPackCtaUrl = (pack: AgensiSkillPackItem): string => {
  const effective = getEffectiveAgensiUrls();
  const listingUrl = (pack.listingUrl || '').trim();

  if (listingUrl) {
    return appendAffiliateRef(listingUrl, effective.affiliateRefCode);
  }

  if (effective.activeUrl) {
    return appendAffiliateRef(effective.activeUrl, effective.affiliateRefCode);
  }

  if (effective.affiliateRefCode) {
    return appendAffiliateRef(AGENSI_CONFIG.marketplaceBaseUrl, effective.affiliateRefCode);
  }

  return '';
};

/**
 * Returns top matching flagship skill packs for the active framework category
 * plus the free lead-magnet pack `prompt-matrix-prompt-architect`.
 */
export const getContextualSkillPacksForCategory = (
  categoryName?: string | null
): readonly AgensiSkillPackItem[] => {
  const leadMagnet = AGENSI_CONFIG.bundledSkillPacks.find(
    (pack) => pack.slug === 'prompt-matrix-prompt-architect'
  );
  const flagshipPacks = AGENSI_CONFIG.bundledSkillPacks.filter(
    (pack) => pack.tier === 'flagship'
  );

  const normalizedCategory = (categoryName || '').trim().toLowerCase();
  const matchedFlagships = normalizedCategory
    ? flagshipPacks.filter((pack) =>
        pack.matchedCategories.some((cat) => cat.trim().toLowerCase() === normalizedCategory)
      )
    : [];

  const selectedFlagships =
    matchedFlagships.length > 0 ? matchedFlagships.slice(0, 3) : flagshipPacks.slice(0, 2);

  return leadMagnet ? [...selectedFlagships, leadMagnet] : selectedFlagships;
};
