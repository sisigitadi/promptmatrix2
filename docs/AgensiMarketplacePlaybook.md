# Agensi.io Marketplace Playbook for PromptMatrix 2.0

A practical commercialization guide for packaging, pricing, listing, and distributing the 6 PromptMatrix Open Agent Skills on [Agensi.io](https://agensi.io).

---

## 1. Economic Breakdown & Creator Revenue Model

Agensi.io is a marketplace for portable Agent Skills (`SKILL.md` bundles) compatible with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and other Open Agent Skills runtimes.

| Term | Value | Operational Impact |
| :--- | :--- | :--- |
| **Listing Fee** | $0 (Free) | Zero upfront cost to publish all 6 packages. |
| **Exclusivity** | Non-exclusive | You retain full IP ownership and can distribute freely on GitHub, sigitadi.id, or PromptMatrix 2.0. |
| **Standard Revenue Share** | **70% to creator** | Payment processing fees are absorbed by Agensi.io; buyers discovered organically via Agensi search yield 70% net. |
| **Affiliate Signup Share** | **90% to creator** | When a new buyer registers through your PromptMatrix affiliate link and buys your skill, you keep 90%. |
| **Cross-Marketplace Referral** | **20% commission (6 months)** | You earn 20% on any other creator's skills that your referred buyer purchases during their first 6 months. |

### Illustrative Net Payout Math (Per Single Sale)

The table below shows exact creator payouts from list price under standard vs. affiliate-referred sales (no conversion assumptions are implied):

| Tier | List Price (USD) | Standard 70% Net | Affiliate 90% Net |
| :--- | :--- | :--- | :--- |
| Lead Magnet (`prompt-matrix-prompt-architect`) | $0 (Free) | $0.00 | $0.00 (drives affiliate cookie & store follows) |
| Focused Single Skill | $19.00 | $13.30 | $17.10 |
| Technical / Security Skill | $29.00 | $20.30 | $26.10 |
| Full Suite Bundle (All 5 Paid Skills) | $89.00 | $62.30 | $80.10 |

---

## 2. Recommended Pricing & Funnel Architecture

Use a two-step value ladder that pairs PromptMatrix 2.0 (free browser studio) with Agensi.io downloadable workflows:

1. **Free Lead Magnet ($0): `prompt-matrix-prompt-architect`**
   - Purpose: Lower friction to zero for developers discovering PromptMatrix on Agensi.io or installing from GitHub. Includes a working Node.js JSON prompt validator (`validate-json-prompt.mjs`) so buyers verify craft quality immediately.
2. **Entry Flagship ($19 each): `antislop-ui-and-copy-auditor` & `multimodal-video-image-director`**
   - Purpose: High-demand workflows for solo builders, designers, and content teams who want immediate automated copy/UI linting or late-2026 multimodal shot syntax.
3. **Core Engineering Flagships ($29 each): `fullstack-ts-nextjs-architect`, `mcp-server-production-builder`, `seo-geo-aeo-content-engine`**
   - Purpose: Production engineering playbooks bundled with runnable Node.js verification scripts (`check-strict-ts.mjs`, `validate-mcp-schema.mjs`, `validate-jsonld.mjs`) that teams drop directly into CI or pre-commit hooks.
4. **PromptMatrix Pro Skill Pack Bundle ($89, vs. $125 individual total)**
   - Purpose: Increases average order value by bundling all 5 paid skills at a ~29% bundle discount while keeping the lead magnet free.

---

## 3. Ready-to-Copy Agensi.io Listing Copy

All copy below avoids hype adjectives and states exact deliverables verified in `agensi-skills/`.

### Skill 1 (Free Lead Magnet): `prompt-matrix-prompt-architect`

- **Title:** PromptMatrix Prompt Architect (CO-STAR, RTF, GCC & JSON Contracts)
- **Tagline:** Structure deterministic agent prompts with RFC 8259 JSON contracts and a zero-width Unicode validator.
- **SEO Keywords:** `prompt engineering`, `CO-STAR framework`, `RFC 8259 JSON prompt`, `few-shot prompting`, `Claude Code skill`, `Cursor skill`, `PromptMatrix`
- **Description:**
  Turn ambiguous instructions into deterministic prompt specifications across five structures: RTF, CO-STAR, GCC, Few-Shot calibration, and strict RFC 8259 JSON output contracts. Includes a task-to-framework decision table, untrusted input isolation patterns, and a dependency-free Node.js script that catches JSON parse errors, BOM headers, and hidden zero-width Unicode characters before deployment.
- **What's Included:**
  - `SKILL.md`: Complete framework selection matrix and 4-step specification builder.
  - `references/frameworks-cheatsheet.md`: Copy-ready templates for RTF, CO-STAR, GCC, Few-Shot, and JSON Schema contracts.
  - `scripts/validate-json-prompt.mjs`: CLI validator checking RFC 8259 syntax, hidden zero-width characters, and `--strict-schema` / `--no-placeholders` flags.

---

### Skill 2 (Paid Flagship #1 - $29): `fullstack-ts-nextjs-architect`

- **Title:** Fullstack TypeScript & Next.js App Router Architect
- **Tagline:** Enforce zero-any TypeScript, Zod API contracts, Server/Client boundaries, and safe SQL migrations.
- **SEO Keywords:** `Next.js App Router`, `strict TypeScript`, `zero any`, `Zod API contract`, `PostgreSQL zero-downtime migration`, `Server Actions`
- **Description:**
  A production architecture workflow for Next.js App Router codebases. Guides coding agents on keeping database clients and secrets inside Server Components, typing Server Actions with discriminated `ActionResult<T>` unions, eliminating `any` escapes, and executing expand-and-contract PostgreSQL migrations without table locks. Ships with a runnable strict-TypeScript scanner for CI and local pre-commit checks.
- **What's Included:**
  - `SKILL.md`: Step-by-step App Router boundary rules, Zod contract pattern, and 4-phase migration workflow.
  - `references/architecture-checklist.md`: Strict `tsconfig.json` baseline, `any` replacement table, and PostgreSQL lock safety gates.
  - `scripts/check-strict-ts.mjs`: Scans `.ts` and `.tsx` files for `: any`, `any[]`, `<any>`, `as any`, `@ts-ignore`, and `@ts-nocheck`.

---

### Skill 3 (Paid Flagship #2 - $29): `mcp-server-production-builder`

- **Title:** MCP Server Production Builder (Zod Contracts, Transports & Security)
- **Tagline:** Design Model Context Protocol servers with strict JSON Schemas, Streamable HTTP, and secret redaction.
- **SEO Keywords:** `Model Context Protocol`, `MCP server`, `Streamable HTTP`, `stdio transport`, `MCP tool schema`, `MCP security`
- **Description:**
  Build security-hardened Model Context Protocol servers in TypeScript or Python. Covers verb-first tool naming, behavioral annotations (`readOnlyHint`, `destructiveHint`), keeping `stdio` stdout reserved strictly for JSON-RPC frames, securing remote Streamable HTTP endpoints against DNS rebinding and SSRF, and redacting API tokens from error payloads. Includes a schema validator for `tools/list` manifests.
- **What's Included:**
  - `SKILL.md`: Tool contract design, transport isolation rules, and path/command injection defenses.
  - `references/mcp-transport-and-security.md`: `stdio` vs. Streamable HTTP matrix, production tool JSON example, and secret redaction regex filter.
  - `scripts/validate-mcp-schema.mjs`: Validates MCP tool definitions, `required` property mappings, `additionalProperties`, and secret-leak patterns.

---

### Skill 4 (Paid Flagship #3 - $19): `antislop-ui-and-copy-auditor`

- **Title:** Antislop UI & Copy Auditor (WCAG AA, Focus Rings & Clean Prose)
- **Tagline:** Audit light/dark theme contrast, mobile viewport reflow, keyboard focus, and synthetic copy patterns.
- **SEO Keywords:** `UI accessibility audit`, `WCAG AA contrast`, `focus-visible`, `mobile reflow`, `anti-slop copywriting`, `React TSX linter`
- **Description:**
  Catch generic UI defects and synthetic prose before shipping. Audits `.tsx`, `.jsx`, `.html`, `.css`, and `.md` files for WCAG AA contrast failures across both dark and light modes, `375px` mobile horizontal overflow, `44px` touch targets, `outline: none` focus traps, `U+2014` em dashes, and banned hype buzzwords. Includes a fast zero-dependency Node.js scanner.
- **What's Included:**
  - `SKILL.md`: Automated scan workflow, dual-theme parity checks, and keyboard/mobile verification checklist.
  - `references/contrast-and-copy-rules.md`: Dark/Light hex contrast pairs, `:focus-visible` patterns, and copy hygiene rules.
  - `scripts/audit-slop.mjs`: CLI scanner flagging `U+2014` em dashes, banned buzzwords, and unguarded `outline: none` / `outline-none`.

---

### Skill 5 (Paid Flagship #4 - $29): `seo-geo-aeo-content-engine`

- **Title:** SEO, GEO & AEO Content Engine + JSON-LD Validator
- **Tagline:** Write evidence-first pillar pages structured for search crawlers, AI citations, and Schema.org rich results.
- **SEO Keywords:** `GEO optimization`, `Answer Engine Optimization`, `JSON-LD validator`, `FAQPage schema`, `HowTo schema`, `technical SEO`
- **Description:**
  Structure developer docs, comparison pages, and product pillars so search crawlers (SEO), AI synthesis engines (GEO), and featured-snippet extractors (AEO) parse accurate, attributable facts. Enforces 40 to 60 word direct answers, atomic verifiable claims, and copy-consistent Schema.org markup. Includes a Node.js validator that extracts and verifies JSON-LD blocks inside HTML and Markdown files.
- **What's Included:**
  - `SKILL.md`: AEO direct-answer structuring, GEO citation rules, and JSON-LD parity gates.
  - `references/schema-jsonld-templates.md`: Valid `SoftwareApplication`, `FAQPage`, and `HowTo` JSON-LD templates.
  - `scripts/validate-jsonld.mjs`: Extracts `<script type="application/ld+json">` and Markdown JSON-LD fences and verifies required Schema.org fields.

---

### Skill 6 (Paid Flagship #5 - $19): `multimodal-video-image-director`

- **Title:** Multimodal Video, Image & Audio Director (Late-2026 Model Syntax)
- **Tagline:** Compile model-native prompts for Midjourney v7, FLUX.2 Kontext, Veo 3, Kling 2.1, Sora 2, and Suno v4.5/v5.
- **SEO Keywords:** `Midjourney v7`, `FLUX.2 Kontext`, `Google Veo 3`, `Kling 2.1`, `OpenAI Sora 2`, `Suno v5`, `AI video director`
- **Description:**
  Replace generic quality-tag spam with model-native parameters, surgical edit invariance clauses, and shot-level camera choreography. Compiles structured prompts tailored to Midjourney v7 (`--oref`, `--sref`, `--raw`), FLUX.2 Kontext spatial editing, Google Veo 3 synchronized audio-video shots, Kling 2.1 Motion Brush masks, Sora 2 multi-shot continuity bibles, and Suno v4.5/v5 section metatags.
- **What's Included:**
  - `SKILL.md`: 4-step multimodal compiler covering stills, precision edits, video shot sheets, and audio arrangements.
  - `references/model-syntax-matrix.md`: Parameter flags, aspect ratios, Veo 3 / Kling 2.1 prompt skeletons, and Suno style header formulas.

---

### Bundle Option ($89): `promptmatrix-complete-agent-bundle`

- **Title:** PromptMatrix Complete Agent Skill Suite (5 Flagship Skills)
- **Tagline:** Fullstack TypeScript, MCP security, Antislop UI/Copy, SEO/GEO/AEO JSON-LD, and Multimodal Shot Director in one pack.
- **Description:**
  Combines all five paid PromptMatrix skills plus four runnable Node.js verification scripts (`check-strict-ts.mjs`, `validate-mcp-schema.mjs`, `audit-slop.mjs`, `validate-jsonld.mjs`). Built for solo founders, fullstack engineers, and technical content teams running Claude Code, Cursor, GitHub Copilot, Gemini CLI, or Windsurf.

---

## 4. Packaging, Upload & Affiliate Activation Checklist

Follow these steps in order when publishing to Agensi.io and wiring PromptMatrix 2.0.

### Step A: Pre-Package Verification (Run Locally)

Verify every `SKILL.md` frontmatter and syntax-check every Node.js script before zipping:

```powershell
# 1. Syntax-check all bundled .mjs scripts
Get-ChildItem -Path agensi-skills -Recurse -Filter *.mjs | ForEach-Object {
  node --check $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "Syntax check failed: $($_.FullName)" }
}

# 2. Run antislop audit across all skill markdown files
node agensi-skills/antislop-ui-and-copy-auditor/scripts/audit-slop.mjs agensi-skills/

# 3. Validate JSON-LD templates
node agensi-skills/seo-geo-aeo-content-engine/scripts/validate-jsonld.mjs agensi-skills/seo-geo-aeo-content-engine/references/schema-jsonld-templates.md
```

### Step B: Create Clean Zip Archives (One Per Skill)

Each archive should place `SKILL.md`, `references/`, and `scripts/` cleanly inside the skill folder without `.DS_Store`, `__MACOSX`, or `node_modules`:

```powershell
New-Item -ItemType Directory -Force -Path dist/agensi-zips | Out-Null

$skills = @(
  "prompt-matrix-prompt-architect",
  "fullstack-ts-nextjs-architect",
  "mcp-server-production-builder",
  "antislop-ui-and-copy-auditor",
  "seo-geo-aeo-content-engine",
  "multimodal-video-image-director"
)

foreach ($skill in $skills) {
  $dest = "dist/agensi-zips/$skill-v1.0.0.zip"
  if (Test-Path $dest) { Remove-Item $dest }
  Compress-Archive -Path "agensi-skills/$skill" -DestinationPath $dest -CompressionLevel Optimal
  Write-Host "Packaged $dest"
}
```

### Step C: Agensi.io Creator Upload Checklist

1. Sign in to your creator dashboard at `https://agensi.io`.
2. Publish `prompt-matrix-prompt-architect` first at **$0 (Free)** to establish your creator store profile and verify archive validation passes cleanly.
3. Upload the 5 paid skills using the Title, Tagline, SEO Keywords, and Description blocks from Section 3.
4. Create the **$89 Complete Suite Bundle** grouping all 5 paid skills.
5. Copy your official **Creator Store URL** and **Affiliate Referral Link** from the Agensi.io creator dashboard.

### Step D: Activate Affiliate Links in PromptMatrix (`config/agensiConfig.ts`)

PromptMatrix 2.0 ships with `config/agensiConfig.ts` containing `AGENSI_CONFIG` with empty placeholder strings (`affiliateUrl: ''`, `creatorStoreUrl: ''`) so no unverified URLs are ever exposed prematurely.

1. Open `config/agensiConfig.ts`.
2. Set `creatorStoreUrl` to your published Agensi.io creator store URL.
3. Set `affiliateUrl` to your Agensi.io affiliate referral URL so new users clicking from PromptMatrix's `SKILL.md` preview tab trigger the **90% revenue share** and **20% 6-month cross-marketplace commission**.
4. Run `npm run build` to verify TypeScript compilation passes with zero errors, then deploy with `npm run deploy`.
