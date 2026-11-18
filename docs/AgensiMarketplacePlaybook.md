# Agensi.io Marketplace Playbook for PromptMatrix 2.0

A practical commercialization guide for packaging, pricing, listing, and distributing the 10 PromptMatrix Open Agent Skills on [Agensi.io](https://agensi.io), paired with the Hybrid Public Storefront and 9-Tap Creator Studio inside `https://prompt.sigitadi.id`.

---

## 1. Economic Breakdown & Creator Revenue Model

Agensi.io is a marketplace for portable Agent Skills (`SKILL.md` bundles) compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 20+ other Open Agent Skills runtimes.

| Term | Value | Operational Impact |
| :--- | :--- | :--- |
| **Listing Fee** | $0 (Free) | Zero upfront cost to publish all 10 packages. |
| **Exclusivity** | Non-exclusive | You retain full IP ownership and can distribute freely on GitHub, sigitadi.id, or PromptMatrix 2.0. |
| **Standard Revenue Share** | **70% to creator** | Payment processing fees are absorbed by Agensi.io; buyers discovered organically via Agensi search yield 70% net. |
| **Affiliate Signup Share** | **90% to creator** | When a new buyer registers through your PromptMatrix affiliate link and buys your skill, you keep 90%. |
| **Cross-Marketplace Referral** | **20% commission (6 months)** | You earn 20% on any other creator's skills that your referred buyer purchases during their first 6 months. |

### Net Payout Math (Per Single Sale)

| Tier | List Price (USD) | Standard 70% Net | Affiliate 90% Net |
| :--- | :--- | :--- | :--- |
| Lead Magnet (`prompt-matrix-prompt-architect`) | $0.00 (Free) | $0.00 | $0.00 (locks 6-month 20% affiliate cookie & store follows) |
| Entry Flagship (`multimodal-video-image-director`) | $9.99 | $6.99 | $8.99 |
| Content Engine (`seo-geo-aeo-content-engine`) | $11.99 | $8.39 | $10.79 |
| UI & Copy Auditor (`antislop-ui-and-copy-auditor`) | $12.00 | $8.40 | $10.80 |
| Core Engineering Flagships (4 packs) | $14.99 | $10.49 | $13.49 |
| Security & Multi-Agent Pro Flagships (2 packs) | $19.99 | $13.99 | $17.99 |

---

## 2. Catalog & Pricing Architecture (10 Verified Packages)

All 10 skill directories live in `agensi-skills/` and ship with `SKILL.md`, deep `references/`, runnable offline `scripts/*.mjs` validators, and drop-in `templates/` where applicable.

1. **`prompt-matrix-prompt-architect` ($0 Free - Lead Magnet):**
   - Deliverables: `SKILL.md`, `references/frameworks-cheatsheet.md`, `scripts/validate-json-prompt.mjs`
   - Purpose: Zero-friction onboarding for developers and PromptMatrix visitors; establishes creator trust and activates the 6-month 20% affiliate cookie on signup.
2. **`multimodal-video-image-director` ($9.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/model-syntax-matrix.md`, `scripts/validate-multimodal-params.mjs`
   - Purpose: Model-native prompt compiler for Midjourney v8.2, FLUX.3 / FLUX.2, Google Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6 with offline parameter validation.
3. **`seo-geo-aeo-content-engine` ($11.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/schema-jsonld-templates.md`, `scripts/validate-jsonld.mjs`
   - Purpose: Evidence-first SEO pillar pages, AI synthesis citation blocks (GEO), AEO 40-60 word direct answers, and Schema.org JSON-LD validation.
4. **`antislop-ui-and-copy-auditor` ($12.00 - Flagship):**
   - Deliverables: `SKILL.md`, `references/contrast-and-copy-rules.md`, `scripts/audit-slop.mjs`
   - Purpose: Audits WCAG AA dark/light contrast, 375px mobile reflow, keyboard focus rings, `U+2014` em-dashes, and banned marketing buzzwords.
5. **`fullstack-ts-nextjs-architect` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/architecture-checklist.md`, `scripts/check-strict-ts.mjs`
   - Purpose: Enforces Next.js App Router server/client boundaries, zero-`any` TypeScript, Zod API contracts, and lock-safe SQL migrations.
6. **`mcp-server-production-builder` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/mcp-transport-and-security.md`, `scripts/validate-mcp-schema.mjs`
   - Purpose: Hardened Model Context Protocol server design for `stdio` and Streamable HTTP transports with strict Zod/JSON Schemas and secret redaction.
7. **`postgres-prisma-zero-downtime-sql-tuner` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/rls-and-index-playbook.md`, `templates/zero-downtime-migration.sql`, `scripts/lint-sql-migrations.mjs`
   - Purpose: Lock-safe PostgreSQL and Prisma migrations, `CONCURRENTLY` index enforcement, and Row-Level Security (RLS) policy auditing.
8. **`playwright-e2e-and-openapi-contract-suite` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/e2e-and-api-contract-matrix.md`, `templates/openapi-contract-stub.json`, `scripts/validate-openapi-and-e2e.mjs`
   - Purpose: Flake-free Playwright E2E testing (flagging `waitForTimeout` anti-patterns) paired with OpenAPI 3.x schema contract validation.
9. **`owasp-api-and-cloud-security-auditor` ($19.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/owasp-cloud-security-checklist.md`, `templates/security-audit-findings.json`, `scripts/scan-security-risks.mjs`
   - Purpose: Static security risk scanner for hardcoded API keys, dynamic `eval`/`Function`, wildcard CORS, unsafe HTML sinks, and insecure TLS flags.
10. **`multi-agent-swarm-and-subagent-orchestrator` ($19.99 - Flagship):**
    - Deliverables: `SKILL.md`, `references/subagent-handoff-patterns.md`, `templates/swarm-task-contract.json`, `scripts/validate-agent-workspace.mjs`
    - Purpose: Parallel subagent delegation, strict file ownership boundaries, JSON handoff contracts, and `AGENTS.md`/`SKILL.md` workspace verification.

---

## 3. Packaging Requirements & Automated CLI Workflow

Agensi.io enforces strict archive rules during automated security scanning and manual review:

- **One `.zip` per skill** with `SKILL.md` placed **directly at the archive root** (never nested inside `<slug>/SKILL.md`).
- **POSIX forward-slash (`/`) paths** in all ZIP Local File Headers and Central Directory entries.
- **Upload size limit:** Strictly `< 50 MB` per `.zip` archive.
- **Clean security scan:** Bundled `scripts/*.mjs` files must pass `node --check` and contain zero network calls (`fetch(`, `http.`, `https.`), dynamic code execution (`eval(`, `new Function`), `process.env` reads, or `child_process` invocations.

> **Do NOT use Windows PowerShell `Compress-Archive`:** `Compress-Archive -Path "agensi-skills/$skill"` nests `<skill>/SKILL.md` inside a parent folder and writes Windows backslash (`\`) separators that fail Linux-based ZIP extractors.

Use the built-in zero-dependency POSIX packager instead:

```bash
# 1. Validate all 10 packages, build dist-agensi/<slug>.zip, and generate upload copy
npm run package:skills

# 2. Run the full PromptMatrix verification audit (400 formulas, 10 skills, 0 em-dashes, 0 buzzwords)
npm run audit
```

`npm run package:skills` writes:
- `dist-agensi/<slug>.zip` (10 verified archives with root `SKILL.md` and POSIX paths, git-ignored via `.gitignore`)
- `dist-agensi/AGENSI-LISTING-MANIFEST.md` (complete upload checklist, Indonesia payout SOP, and ready-to-copy title/price/tagline/description/tags for all 10 skills)

---

## 4. Indonesia Payout Setup SOP (Zoneless USDC on Solana)

### Why Zoneless Instead of Stripe Connect
Agensi.io restricts Stripe Connect instant payouts to the US, Canada, UK, EEA, and Switzerland. For creators based in **Indonesia**, Agensi.io routes creator earnings through **Zoneless (USDC on Solana)**:
- **Minimum payout threshold:** `$3.50 USD`
- **Settlement window:** Within **72 hours** of sale (Agensi acts as Merchant of Record and absorbs buyer card/Stripe processing fees).
- **Network:** USDC (SPL token) on the Solana blockchain.

### Two-Stage Cashout Architecture (Zero Lost Funds)
> **Critical Exchange Rule:** Never paste a centralized exchange (CEX) deposit address directly into Zoneless. Exchanges rotate deposit addresses, occasionally pause SPL-USDC maintenance, and may reject smart-contract payouts. Sending SPL-USDC to an ERC-20 or BEP-20 address results in permanent fund loss.

1. **Stage 1: Self-Custody Solana Vault (Phantom or Solflare)**
   - Install **Phantom** (`phantom.app`) or **Solflare** (`solflare.com`) and record your recovery phrase offline.
   - Register your Phantom/Solflare Solana address inside **Agensi.io Creator Studio -> Payouts (Zoneless)**.
   - Keep `~0.05 SOL` in the wallet to cover Solana network fees (`< $0.005` per transfer).
2. **Stage 2A: Direct SPL-USDC Off-Ramp (Fastest via Pintu)**
   - Open **Pintu** -> **Deposit USDC** -> explicitly select the **Solana (SPL)** network.
   - Transfer USDC from Phantom/Solflare to Pintu's Solana USDC address.
   - Convert USDC to IDR and withdraw to BCA, Mandiri, BRI, or Bank Jago.
3. **Stage 2B: Universal Fallback via Jupiter -> SOL (Pintu, Tokocrypto, Indodax)**
   - If SPL-USDC deposits are temporarily paused on your exchange, open **Jupiter (`jup.ag`)** inside Phantom/Solflare and swap **USDC -> SOL**.
   - Send **SOL** via the native Solana network to **Pintu**, **Tokocrypto**, or **Indodax** (all major Indonesian Bappebti/OJK-registered exchanges natively support SOL deposits).
   - Sell SOL to IDR on the spot market and withdraw to your Indonesian bank account.

---

## 5. Multi-Marketplace Expansion (3 Pillars)

Beyond Agensi.io individual listings, `npm run package:channels` compiles three ready-to-publish distribution channels directly from `agensi-skills/`, `config/agensiConfig.ts`, `data/frameworks.ts`, `services/localizationService.ts`, and `services/sampleDataService.ts`:

```bash
npm run package:channels
```

1. **Pillar 1: Public OSS Lead Magnet (`dist-lead-magnet/`)**
   - Exports ONLY the free `prompt-matrix-prompt-architect` pack (`SKILL.md`, `references/frameworks-cheatsheet.md`, `scripts/validate-json-prompt.mjs`) with an automated guard ensuring zero paid flagship files leak into the public repo.
   - Generates `.cursor/rules/prompt-matrix-architect.mdc` (for `cursor.directory`), `CLAUDE.md` (for Claude Code and `claudemarketplaces.com`), `README.md` (`npx skills add <github-user>/prompt-matrix-skill` plus upgrade table linking `https://prompt.sigitadi.id` and `https://www.agensi.io/r/SIGITADI`), and `SUBMISSION-CHECKLIST.md` (`skills.sh`, `skillsmp.com` requiring `>= 2` GitHub stars, `clawhub.ai`, `lobehub.com`, `claudemarketplaces.com`, `cursor.directory`, `futuretools.io`, and `Product Hunt`).
2. **Pillar 2: Global MoR Storefront Suite (`dist-channels/storefronts/`)**
   - Bundles all 9 paid flagship folders into `promptmatrix-9-flagship-suite.zip` (POSIX `/` paths, `SUITE-README.md` at ZIP root, `< 50 MB`) and generates `STOREFRONT-MANIFEST.md` with ready-to-paste copy for **Lemon Squeezy**, **Creem.io**, **Gumroad**, **Whop**, and **Payhip** ($59.00 bundle vs individual total computed from `config/agensiConfig.ts`).
3. **Pillar 3: PromptBase 15 Structured Systems (`dist-channels/promptbase/`)**
   - Extracts 15 high-intent frameworks across Agent Engineering, SaaS/SEO, and Multimodal (Midjourney v7, FLUX.2, Veo 3, Sora 2, Suno v4.5/v5) and outputs `PROMPTBASE-15-LISTINGS.md` and `promptbase-15-listings.json` with `<= 40` char titles, `[Variable]` prompt templates, populated testing examples, and `?via=` 0% fee referral instructions.

### Verified Indonesia Payout & MoR Matrix

> **Wise Indonesia USD Balance Warning:** Indonesian-registered Wise accounts cannot open or hold a general commercial USD receiving account balance. Never route marketplace USD payouts to a non-existent Wise USD balance; use the verified rails below instead.

| Channel | Tax / MoR Model | Verified Indonesia Payout Rail | Fee, Minimum & Settlement Notes |
| :--- | :--- | :--- | :--- |
| **Agensi.io** | Merchant of Record | **Zoneless USDC (Solana)** -> Phantom/Solflare -> Pintu/Tokocrypto/Indodax | `$3.50` min, 72h settlement; `70%` organic / `90%` via `?ref=` (`https://www.agensi.io/r/SIGITADI`) |
| **PromptBase** | Marketplace | **Zoneless USDC (Solana)** -> Phantom/Solflare -> Pintu/Tokocrypto/Indodax | `$0` min, **daily** payouts; `0%` fee (`100%` share) on self-referred `?via=` sales |
| **Lemon Squeezy** | Full MoR (global VAT/GST) | **Direct IDR Bank Transfer** (BCA/Mandiri/BRI/Jago) | ~`1%` FX conversion to IDR; zero foreign tax registration needed |
| **Creem.io** | Full MoR (global VAT/GST) | **USDC on Polygon** -> self-custody wallet -> Pintu/Indodax | ~`2%` payout fee; fast crypto settlement |
| **Gumroad** | MoR + Discover | **Direct IDR Bank Transfer** | Built-in Gumroad Discover traffic; direct IDR bank payout |
| **Apify** | Actor Marketplace | **Wise -> Direct IDR Bank** (automated IDR conversion payout) | Use Wise IDR bank transfer flow rather than holding a Wise USD balance |
| **Payhip** | Direct / EU-UK VAT MoR | **Midtrans / Xendit (IDR local)** + PayPal | Best for domestic Indonesian buyers paying via QRIS or Virtual Account |

---

## 6. Hybrid Storefront & 9-Tap Creator Factory Architecture

PromptMatrix 2.0 separates **Public Affiliate Conversion** from **Private Creator Packaging Tools**:

### Public Storefront (Visible to All Visitors)
- **Header (`Skills 10` button)** and **Gallery Catalog Banner**: Open `AgensiCatalogModal` showcasing all 10 official skill packs, filters (`All` / `Free` / `Paid`), price badges, included files, and 27 supported agent runtimes.
- **Studio Contextual Promo (`AgensiSkillPromoCard`)**: Automatically matches the active framework category to relevant Flagship skills plus the `$0 Free` lead magnet (`prompt-matrix-prompt-architect`).
- **Affiliate Gate Protection:** Public visitors never see raw `.zip` export buttons in the catalog modal; instead, CTAs route to your configured Agensi.io affiliate/store URL (`?ref=...`) to capture the **90% creator share** and **20% 6-month cross-marketplace commission**.

### Creator Mode (Unlocked via 9-Tap Header Logo)
- **Studio `SKILL.md` Tab (`AgentSkillViewer`):** Unlocks 1-click browser `.zip` bundle export (`services/skillZipService.ts`, packing `SKILL.md`, `references/framework-guide.md`, `templates/sample-input.json`, and `scripts/validate-output.mjs`) plus **Copy Listing Copy (`Agensi.io/sell`)**.
- **Creator Settings (`AISettingsModal` -> `Paket Skill` tab):** Configure live `affiliateUrl`, `creatorStoreUrl`, and `affiliateRefCode` overrides persisted in `localStorage` (`pm_agensi_urls`), or hardcode permanent production URLs in `config/agensiConfig.ts` before running `npm run build` and `npm run deploy`.
