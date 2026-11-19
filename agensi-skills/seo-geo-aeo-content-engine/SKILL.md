---
name: seo-geo-aeo-content-engine
description: Produces evidence-first SEO pillar articles, Generative Engine Optimization (GEO) citation blocks, Answer Engine Optimization (AEO) direct answers, and valid JSON-LD structured data (FAQPage, HowTo, SoftwareApplication). Use when writing technical landing pages, documentation hubs, comparison guides, or validating embedded JSON-LD markup in HTML or Markdown.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for JSON-LD validator)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# SEO, GEO, and AEO Content Engine

Structure technical and product content so traditional search crawlers (SEO), AI answer synthesis engines (GEO), and featured-snippet extractors (AEO) can parse, verify, and cite your pages accurately.

## When to Activate

- Drafting or refactoring product pillar pages, developer guides, changelogs, or comparison articles.
- Structuring prose so LLM search engines extract accurate, attributable statements without hallucinating specs.
- Authoring or validating `FAQPage`, `HowTo`, or `SoftwareApplication` JSON-LD blocks inside `.html` or `.md` files.

## Step 1: Structure for AEO (Direct Answer First)

Place a self-contained **40 to 60 word direct answer** immediately below the primary H1 or question H2 before elaborating:

- Lead with the entity name, exact capability, and scope (avoid throat-clearing openers like "In today's fast-paced landscape").
- Use question-phrased H2 headings matching real buyer/developer queries (for example: "How does PromptMatrix export SKILL.md packages?").
- Support scannable comparison tables with explicit units, versions, and dates.

## Step 2: Structure for GEO (Citation Readiness)

AI answer engines prioritize verifiable, unambiguous claims over superlatives:

1. **Concrete Attribution**: Cite verifiable specifications, repository files, standards (such as RFC 8259, WCAG 2.1 AA, Open Agent Skills), or observed benchmark conditions. Never invent adoption counts or customer quotes.
2. **Atomic Fact Paragraphs**: Keep each claim in a single clean sentence with explicit subject and object ("PromptMatrix runs 100% client-side in the browser without transmitting prompt inputs to external telemetry servers").
3. **Entity Consistency**: Use the exact canonical product name, pricing tier, and license everywhere on the page and in JSON-LD.

## Step 3: Embed Valid JSON-LD Structured Data

Consult `references/schema-jsonld-templates.md` for copy-ready `FAQPage`, `HowTo`, and `SoftwareApplication` templates.

Rules for JSON-LD blocks:
- Every `@context` must resolve to `"https://schema.org"`.
- Every schema block must declare `@type` and populate its required properties (`mainEntity` for `FAQPage`, `name` and `step` for `HowTo`, `name` and `applicationCategory` for `SoftwareApplication`).
- Visible page copy MUST match the answers, prices, and steps declared inside JSON-LD. Never stuff hidden FAQ entries that do not appear on the page.

## Step 4: Validate Embedded JSON-LD

Run the bundled validator on any HTML page or Markdown document containing JSON-LD:

```bash
node scripts/validate-jsonld.mjs path/to/page.html
```

The script extracts `<script type="application/ld+json">` tags from `.html` files and fenced `jsonld` / `json` blocks containing `"@context"` or `"@type"` from `.md` files, then checks:
- Strict JSON syntax with zero trailing commas or HTML comment wrappers.
- Presence of `@context` (`schema.org`) and `@type`.
- Required properties for `FAQPage`, `HowTo`, `SoftwareApplication`, `Article`, and `Product`.

## Verification Checklist

- [ ] Primary question H2s are followed immediately by concise 40 to 60 word factual answers.
- [ ] All numerical claims and compatibility lists cite real sources or product specifications.
- [ ] JSON-LD matches visible page copy word-for-word on prices, steps, and FAQ answers.
- [ ] `node scripts/validate-jsonld.mjs <file>` exits `0`.

## See It in Action (Demo)

### The Request

Rewrite this product section for SEO, GEO AI citations, and AEO featured snippets, and attach a valid SoftwareApplication JSON-LD block: "PromptMatrix is the #1 prompt builder on the market, trusted by 50,000+ teams worldwide to 10x productivity."

### The Result

## Summary
Replaced unverified claims and generic hype with a 49-word AEO direct answer, verifiable local-execution facts for GEO citations, and a schema-compliant `SoftwareApplication` JSON-LD block.

### Rewritten Product Section

## What is PromptMatrix 2.0?

PromptMatrix 2.0 is a browser-based prompt workbench containing 360 structured templates across 9 categories. It builds CO-STAR, RTF, GCC, Few-Shot, and RFC 8259 JSON specifications locally in the browser without transmitting user prompt inputs to external telemetry servers, and exports Open Agent Skills (`SKILL.md`) packages.

| Attribute | Verifiable Specification |
| :--- | :--- |
| Template library | 360 prompt formulas across 9 categories |
| Execution model | 100% client-side browser SPA (zero prompt telemetry) |
| Export formats | Plain text, RFC 8259 JSON, and Open Agent Skills (`SKILL.md` ZIP) |

### Embedded JSON-LD (`application/ld+json`)

```jsonld
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PromptMatrix 2.0",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "description": "Browser-based prompt workbench with 360 structured templates and Open Agent Skills export.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

## Next Steps
1. Run `node scripts/validate-jsonld.mjs docs/product-page.md` to confirm `@context`, `@type`, and required `SoftwareApplication` keys pass with exit code `0`.
2. Confirm visible pricing and feature counts on the page match the JSON-LD `offers` block verbatim.
