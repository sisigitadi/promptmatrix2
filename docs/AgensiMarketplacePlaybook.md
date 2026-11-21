# Agensi.io Marketplace Playbook for PromptMatrix 2.0

A practical commercialization guide for packaging, pricing, listing, and distributing the 15 PromptMatrix Open Agent Skills on [Agensi.io](https://agensi.io), paired with the Hybrid Public Storefront and 9-Tap Creator Studio inside `https://prompt.sigitadi.id`.

---

## 1. Economic Breakdown & Creator Revenue Model

Agensi.io is a marketplace for portable Agent Skills (`SKILL.md` bundles) compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and 20+ other Open Agent Skills runtimes.

| Term | Value | Operational Impact |
| :--- | :--- | :--- |
| **Listing Fee** | $0 (Free) | Zero upfront cost to publish all 15 packages. |
| **Exclusivity** | Non-exclusive | You retain full IP ownership and can distribute freely on GitHub, sigitadi.id, or PromptMatrix 2.0. |
| **Standard Revenue Share** | **70% to creator** | Payment processing fees are absorbed by Agensi.io; buyers discovered organically via Agensi search yield 70% net. |
| **Affiliate Signup Share** | **90% to creator** | When a new buyer registers through your PromptMatrix affiliate link and buys your skill, you keep 90%. |
| **Cross-Marketplace Referral** | **20% commission (6 months)** | You earn 20% on any other creator's skills that your referred buyer purchases during their first 6 months. |

### Net Payout Math (Per Single Sale)

| Tier / Pillar | List Price (USD) | Standard 70% Net | Affiliate 90% Net |
| :--- | :--- | :--- | :--- |
| Lead Magnet (`prompt-matrix-prompt-architect`) | $0.00 (Free) | $0.00 | $0.00 (locks 6-month 20% affiliate cookie & store follows) |
| Create: Media & Sound (`multimodal-video-image-director`, `suno-ai-music-and-audio-director`) | $9.99 | $6.99 | $8.99 |
| Grow: Video Retention (`viral-short-form-video-hook-architect`) | $9.99 | $6.99 | $8.99 |
| Grow: Content & Outreach (`seo-geo-aeo-content-engine`, `b2b-cold-outreach-and-sales-engine`) | $11.99 | $8.39 | $10.79 |
| Create: Quality Auditor (`antislop-ui-and-copy-auditor`) | $12.00 | $8.40 | $10.80 |
| Develop: Core Engineering (4 packs: Next.js, MCP, Postgres, Playwright) | $14.99 | $10.49 | $13.49 |
| Operate: Management & Automation (2 packs: PRD Architect, n8n Integrator) | $14.99 | $10.49 | $13.49 |
| Develop: Security & Multi-Agent Pro (2 packs: OWASP Security, Multi-Agent Swarm) | $19.99 | $13.99 | $17.99 |

---

## 2. Catalog & Pricing Architecture (15 Verified Packages across 4 Pillars)

All 15 skill directories live in `agensi-skills/` and ship with `SKILL.md`, deep `references/`, runnable offline `scripts/*.mjs` validators, and drop-in `templates/` where applicable.

### Lead Magnet ($0 Free)
1. **`prompt-matrix-prompt-architect` ($0 Free - Lead Magnet):**
   - Pillar: **Develop**
   - Deliverables: `SKILL.md`, `references/frameworks-cheatsheet.md`, `templates/sample-prompt.json`, `scripts/validate-json-prompt.mjs`
   - Purpose: Zero-friction onboarding for developers and PromptMatrix visitors; establishes creator trust and activates the 6-month 20% affiliate cookie on signup.

### Develop Pillar (6 Flagships)
2. **`fullstack-ts-nextjs-architect` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/architecture-checklist.md`, `scripts/check-strict-ts.mjs`
   - Purpose: Enforces Next.js App Router server/client boundaries, zero-`any` TypeScript, Zod API contracts, and lock-safe SQL migrations.
3. **`mcp-server-production-builder` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/mcp-transport-and-security.md`, `scripts/validate-mcp-schema.mjs`
   - Purpose: Hardened Model Context Protocol server design for `stdio` and Streamable HTTP transports with strict Zod/JSON Schemas and secret redaction.
4. **`postgres-prisma-zero-downtime-sql-tuner` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/rls-and-index-playbook.md`, `templates/zero-downtime-migration.sql`, `scripts/lint-sql-migrations.mjs`
   - Purpose: Lock-safe PostgreSQL and Prisma migrations, `CONCURRENTLY` index enforcement, and Row-Level Security (RLS) policy auditing.
5. **`playwright-e2e-and-openapi-contract-suite` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/e2e-and-api-contract-matrix.md`, `templates/openapi-contract-stub.json`, `scripts/validate-openapi-and-e2e.mjs`
   - Purpose: Flake-free Playwright E2E testing (flagging `waitForTimeout` anti-patterns) paired with OpenAPI 3.x schema contract validation.
6. **`owasp-api-and-cloud-security-auditor` ($19.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/owasp-cloud-security-checklist.md`, `templates/security-audit-findings.json`, `scripts/scan-security-risks.mjs`
   - Purpose: Static security risk scanner for hardcoded API keys, dynamic `eval`/`Function`, wildcard CORS, unsafe HTML sinks, and insecure TLS flags.
7. **`multi-agent-swarm-and-subagent-orchestrator` ($19.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/subagent-handoff-patterns.md`, `templates/swarm-task-contract.json`, `scripts/validate-agent-workspace.mjs`
   - Purpose: Parallel subagent delegation, strict file ownership boundaries, JSON handoff contracts, and `AGENTS.md`/`SKILL.md` workspace verification.

### Operate Pillar (2 Flagships)
8. **`ai-product-manager-and-prd-architect` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/prd-and-user-story-standards.md`, `templates/prd-template.md`, `scripts/validate-prd-structure.mjs`
   - Purpose: Complete PRD specifications, INVEST user stories, acceptance criteria, metric trees, and structural markdown validation.
9. **`business-workflow-and-n8n-integrator` ($14.99 - Flagship):**
   - Deliverables: `SKILL.md`, `references/workflow-patterns.md`, `templates/workflow-contract.json`, `scripts/validate-workflow-spec.mjs`
   - Purpose: Resilient n8n and automation workflow contracts with error handling, dead-letter queues, idempotent webhooks, and credential safety checks.

### Grow Pillar (3 Flagships)
10. **`seo-geo-aeo-content-engine` ($11.99 - Flagship):**
    - Deliverables: `SKILL.md`, `references/schema-jsonld-templates.md`, `scripts/validate-jsonld.mjs`
    - Purpose: Evidence-first SEO pillar pages, AI synthesis citation blocks (GEO), AEO 40-60 word direct answers, and Schema.org JSON-LD validation.
11. **`b2b-cold-outreach-and-sales-engine` ($11.99 - Flagship):**
    - Deliverables: `SKILL.md`, `references/outreach-frameworks.md`, `templates/email-sequence.json`, `scripts/validate-outreach-copy.mjs`
    - Purpose: High-conversion 4-touch cold email sequences, plain ASCII punctuation, spam buzzword elimination, and personalization audit.
12. **`viral-short-form-video-hook-architect` ($9.99 - Flagship):**
    - Deliverables: `SKILL.md`, `references/hook-retention-formulas.md`, `templates/video-script.json`, `scripts/validate-video-script.mjs`
    - Purpose: 3-second visual and verbal pattern interrupt hooks, 60-second pacing grids, and character-budget verification for TikTok, Reels, and Shorts.

### Create Pillar (3 Flagships)
13. **`multimodal-video-image-director` ($9.99 - Flagship):**
    - Deliverables: `SKILL.md`, `references/model-syntax-matrix.md`, `scripts/validate-multimodal-params.mjs`
    - Purpose: Model-native prompt compiler for Midjourney v8.2, FLUX.3 / FLUX.2, Google Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6 with offline parameter validation.
14. **`antislop-ui-and-copy-auditor` ($12.00 - Flagship):**
    - Deliverables: `SKILL.md`, `references/contrast-and-copy-rules.md`, `scripts/audit-slop.mjs`
    - Purpose: Audits WCAG AA dark/light contrast, 375px mobile reflow, keyboard focus rings, `U+2014` em-dashes, and banned marketing buzzwords.
15. **`suno-ai-music-and-audio-director` ($9.99 - Flagship):**
    - Deliverables: `SKILL.md`, `references/suno-v6-prompting-guide.md`, `templates/suno-prompt.json`, `scripts/validate-suno-prompt.mjs`
    - Purpose: Suno v6/v5 style prompts under 200 characters, structural meta-tag arrangement (`[Verse]`, `[Chorus]`, `[Outro]`), vocal timbre calibration, and offline validation.

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
# 1. Validate all 15 packages, build dist-agensi/<slug>.zip, and generate upload copy
npm run package:skills

# 2. Package multi-channel distribution (dist-lead-magnet/, dist-channels/storefronts/, dist-channels/promptbase/)
npm run package:channels

# 3. Run the full PromptMatrix verification audit (400 formulas, 15 skills, 0 em-dashes, 0 buzzwords)
npm run audit
```

`npm run package:skills` writes:
- `dist-agensi/<slug>.zip` (15 verified archives with root `SKILL.md` and POSIX paths, git-ignored via `.gitignore`)
- `dist-agensi/AGENSI-LISTING-MANIFEST.md` (complete upload checklist, Indonesia payout SOP, and ready-to-copy title/price/tagline/description/tags for all 15 skills)

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
   - Bundles all 14 paid flagship folders into `promptmatrix-14-flagship-suite.zip` (POSIX `/` paths, `SUITE-README.md` at ZIP root, `< 50 MB`) and generates `STOREFRONT-MANIFEST.md` with ready-to-paste copy for **Lemon Squeezy**, **Creem.io**, **Gumroad**, **Whop**, and **Payhip** ($59.00 bundle vs $195.87 individual total computed from `config/agensiConfig.ts`).
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
- **Header (`Skills 15` button)** and **Gallery Catalog Banner**: Open `AgensiCatalogModal` showcasing all 15 official skill packs across 4 Pillars (`Develop`, `Grow`, `Operate`, `Create`), Dual-Filter tabs (Row 1 Pillar, Row 2 Tier), price badges, included files, and 27 supported agent runtimes.
- **Studio Contextual Promo (`AgensiSkillPromoCard`)**: Automatically matches the active framework category to relevant Flagship skills plus the `$0 Free` lead magnet (`prompt-matrix-prompt-architect`).
- **Affiliate Gate Protection:** Public visitors never see raw `.zip` export buttons in the catalog modal; instead, CTAs route to your configured Agensi.io affiliate/store URL (`?ref=...`) to capture the **90% creator share** and **20% 6-month cross-marketplace commission**.

### Creator Mode (Unlocked via 9-Tap Header Logo)
- **Studio `SKILL.md` Tab (`AgentSkillViewer`):** Unlocks 1-click browser `.zip` bundle export (`services/skillZipService.ts`, packing `SKILL.md`, `references/framework-guide.md`, `templates/sample-input.json`, and `scripts/validate-output.mjs`) plus **Copy Listing Copy (`Agensi.io/sell`)**.
- **Creator Settings (`AISettingsModal` -> `Paket Skill` tab):** Configure live `affiliateUrl`, `creatorStoreUrl`, and `affiliateRefCode` overrides persisted in `localStorage` (`pm_agensi_urls`), or hardcode permanent production URLs in `config/agensiConfig.ts` before running `npm run build` and `npm run deploy`.

---

## 7. Commercial Licensing Architecture & IP Protection Framework

Packaging and selling Open Agent Skills requires rigorous licensing boundaries to preserve creator revenue while maximizing organic distribution:

| License Preset | Category | Target Marketplace | Permitted Scope | Redistribution & Resale Clause |
| :--- | :--- | :--- | :--- | :--- |
| **Commercial License (Single-Seat)** | Commercial | Agensi.io, Gumroad, Lemon Squeezy | Single buyer entity executing skill in internal agent workflows and client deliverables | Reselling, sublicensing, or distributing raw `.zip` source files is strictly forbidden |
| **Team Commercial License (Multi-Seat)** | Commercial | Enterprise Storefronts & High-Value B2B | Organization-wide team seats for shared agency environments | Internal distribution permitted; public repo or raw asset leak prohibited |
| **Extended Agency License** | Commercial | High-Ticket White-Label Packages | Delivering integrated client solutions with deep custom modifications | Deliverable integration permitted; raw asset bundle resale prohibited |
| **MIT License** | Open Source | GitHub (`npx skills add`), skills.sh, skillsmp.com | Permissive public adoption, modification, and community trust building | Anyone may inspect or modify; reserved strictly for $0 lead magnets |
| **Apache 2.0 License** | Open Source | Enterprise Open Source Ecosystems | Contributor patent grants and trademark protection | Permissive code use with explicit patent and trademark safeguards |
| **CC BY-NC 4.0** | Hybrid | Dual-Licensing (Personal vs Business) | Free personal learning and academic research | Commercial usage requires separate paid commercial purchase |
| **Custom EULA** | Custom | Bespoke Enterprise Contracts | Tailored contractual agreements and custom legal stipulations | Regulated entirely by the creator's written enterprise agreement |

### Key Creator Takeaway
Never release paid assets under a permissive open source license (such as MIT) because buyers obtain a legal right to resell or publicly redistribute your code. PromptMatrix Studio v7.6.3 (`components/AgentSkillViewer.tsx`) includes an interactive **License Selector** that defaults to **Commercial License (Single-Seat)** for paid products while preserving **MIT** for free lead magnets.

---

## 8. Bilingual Listing Localization & Deterministic Sanitization Engine (v7.6.4)

PromptMatrix 2.0 provides native dual-language localization (Indonesian and English) across the entire Skill Creator workflow, ensuring that Indonesian creators and international buyers experience frictionless, culturally aligned copy without English leakage:

### Architecture of the Localization Engine
1. **Flagship Title Localization (`config/agensiConfig.ts`):**
   - Each of the 15 official packs supports `titleId` alongside the English `title` (e.g., *Auditor UI & Teks Bebas Slop (Antislop)* for `antislop-ui-and-copy-auditor`).
   - The helper `getAgensiPackTitle(pack, language)` resolves the accurate title based on active locale.

2. **Full Listing Demo Profiles (`data/skillListingDemos.ts`):**
   - `SKILL_LISTING_DEMOS_ID` maps every skill to translated `tagline`, `categoryLabel`, `highlights`, `demoRequest`, and comprehensive `demoResult` markdown.
   - The accessor `getSkillListingDemo(slug, language)` guarantees fallback-free Indonesian profiles.

3. **Localized Listing Markdown & Deliverable Specs (`services/skillZipService.ts`):**
   - When exporting `.zip` packages or copying marketplace listing copy in Indonesian, the markdown generator creates localized section headers (`## Ringkasan`, `### Spesifikasi Deliverable`, `### Pratinjau Kontrak Eksekusi`, `### Verifikasi Standar Kualitas (Quality Gateway)`, and `## Langkah Selanjutnya`).
   - Deliverable status badges are emitted in Indonesian (`Diterapkan`, `Aktif`, `Terverifikasi`, `Terkemas`, `Ditegakkan`).

4. **Stale Draft Sanitization (`components/AgentSkillViewer.tsx`):**
   - To prevent outdated English drafts cached in browser `localStorage` from overriding fresh Indonesian defaults, `AgentSkillViewer` detects default English text when switching to Indonesian and automatically replaces it with the official Indonesian title and profile.

---

## 9. AI Readiness Auto-Fix & Real-time Update Dashboard in Studio (v7.6.5)

To streamline creator preparation and provide immediate feedback when utilizing AI generation or field suggestions, PromptMatrix 2.0 introduces an integrated auto-fix workflow and real-time post-update dashboard in `AgentSkillViewer.tsx`:

### Key Features & Workflow
1. **Direct 1-Click AI Auto-Fix in Readiness Box:**
   - When the quality gate audit detects missing sections, short descriptions, improper tags, or suboptimal demo results, an interactive `[Auto-Fix Notes with AI]` button is rendered directly inside the warning header.
   - Clicking this button automatically generates and repairs all flagged items without requiring creators to hunt for field-level controls.

2. **Real-time Post-AI Update Dashboard (`aiUpdateRecord`):**
   - Immediately after AI finishes generating or suggesting metadata, a dedicated status banner appears at the top of Step 1.
   - Highlights the exact score transition (e.g., `67/100 ➔ 100/100 (+33 points)`), total passing checks, and an itemized list of resolved readiness notes.
   - Lists all modified fields (Slug Name, Listing Title, Tagline, Tags, Description, Demo Request, Demo Result).
   - Displays an unambiguous readiness confirmation when 100/100 is achieved, signaling that the skill is ready for export to `.zip` and marketplace distribution.

3. **Bilingual Summary Section Validation:**
   - The audit validator (`auditSkillMarketReadiness` in `services/agentSkillService.ts`) accepts both `## Ringkasan` and `## Summary` headings, ensuring native Indonesian live demo exemplars receive full compliance credit.

4. **Strict Kebab-Case Tag Sanitization:**
   - Tags returned by AI are deterministically formatted to lowercase kebab-case, stripped of `#` symbols, uppercase letters, spaces, and stopwords to ensure 100% adherence to marketplace discovery rules.

---

## 10. AI Skill Vector Logo Generator & Visual Branding (v7.6.6)

Every commercial listing and portable agent package benefits from a distinct visual identity. PromptMatrix 2.0 provides an integrated AI Vector Logo Designer and deterministic SVG emblem generator in `services/skillLogoService.ts`:

### Key Features
1. **Pillar-Aligned Vector Palette & Geometry:**
   - Develop (Slate with Neon Emerald & Electric Cyan)
   - Grow (Midnight Navy with Royal Indigo & Laser Blue)
   - Operate (Dark Bronze with Warm Amber & Gold)
   - Create (Matte Obsidian with Vibrant Fuchsia & Neon Coral)

2. **One-Click AI Logo Generation in Studio:**
   - An interactive `[Generate Logo with AI]` button directly in Step 1 of `AgentSkillViewer.tsx` calls Universal AI to design a modern squircle SVG icon (`128x128` viewBox) tailored to the skill's functional domain.
   - Built-in instant fallback generator provides offline, high-precision SVG vector icons for all 15 flagship packages and 400 formula templates.

3. **Multi-Format Export & ZIP Packaging:**
   - **Live Preview:** Renders crisp 80x80 vector emblem in Step 1 and 28x28 mini emblem in the header.
   - **`icon.svg` in Archive:** The generated SVG is automatically bundled into `dist-agensi/<slug>.zip` and custom formula `.zip` downloads (`services/skillZipService.ts`).
   - **Download & Copy:** One-click `Download SVG` and `Copy SVG Code` buttons.
   - **Midjourney v7 / FLUX Prompt Generator:** Automatically formats a ready-to-use 3D app icon prompt (`--ar 1:1 --v 7`) for Discord or Midjourney web.



