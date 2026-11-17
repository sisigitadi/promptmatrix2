---
name: antislop-ui-and-copy-auditor
description: Audits web UIs and product copy for WCAG AA color contrast, mobile viewport reflow, keyboard focus rings, em dash removal (U+2014), and banned marketing buzzwords. Use when reviewing TSX/HTML/CSS components, checking dark and light theme legibility, auditing landing-page prose, or running automated slop checks before shipping.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills compatible runtimes (Node.js 18+ for slop auditor script)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Antislop UI and Copy Auditor

Eliminate generic template UI defects, accessibility regressions, and synthetic copywriting patterns across `.tsx`, `.html`, and `.md` files.

## When to Activate

- Auditing frontend components (`.tsx`, `.html`, `.css`) for keyboard focus, mobile overflow, and color contrast across both light and dark themes.
- Reviewing product copy, READMEs, or marketing sections for `U+2014` (em dash) characters, inflated marketing clichés, or unverified claims.
- Enforcing delivery-gate hygiene before merging a PR or publishing a web release.

## Step 1: Run Automated Slop Scan

Run the bundled scanner across target UI components, HTML templates, and Markdown docs:

```bash
node scripts/audit-slop.mjs src/ docs/
```

The scanner flags three high-signal defect classes:
1. **`COPY-NO-EMDASH`**: Any `U+2014` em dash character in UI copy or documentation. Replace with commas, colons, periods, or parentheses.
2. **`COPY-NO-BUZZWORD`**: Generic synthetic hype phrases (overused tech superlatives and vague marketing adjectives defined in `scripts/audit-slop.mjs`) that obscure concrete product behavior.
3. **`A11Y-NO-OUTLINE-NONE`**: `outline: none`, `outline: 0`, or Tailwind `outline-none` lacking a visible `:focus-visible` ring replacement on the same element or rule block.

## Step 2: Audit Contrast and Dual-Theme Parity

Consult `references/contrast-and-copy-rules.md` for exact WCAG AA thresholds and Tailwind token pairings. Check both dark and light modes:

- Normal body text (< 18px regular or < 14px bold): minimum **4.5:1** contrast ratio against its rendered background.
- Large text (>= 18px regular or >= 14px bold) and UI boundaries/focus indicators: minimum **3.0:1** contrast ratio.
- Inspect embedded code viewers, JSON/Markdown preview panels, badges, and muted helper captions inside light cards so dark-slate defaults do not break light-theme legibility.

## Step 3: Audit Mobile Reflow and Keyboard Flow

Verify every interactive screen at **375px** (mobile) and **1280px** (desktop):

1. **Zero Horizontal Overflow**: No element causes `document.documentElement.scrollWidth > window.innerWidth`. Long URLs, code blocks, and tables use `overflow-x-auto` or `break-words`.
2. **Minimum Tap Targets**: Primary buttons, tab triggers, and icon controls have at least `44px x 44px` hit area (or `min-h-[44px]`) on touch viewports.
3. **Keyboard Reachability**: Every button, link, tab, accordion, and modal is reachable via `Tab` / `Shift+Tab`, triggers via `Enter` / `Space`, and dialogs close on `Escape` while restoring focus.
4. **Honest States and Evidence**: Confirm empty, loading, and error states exist. Remove fabricated metrics, placeholder testimonials, or dead links (`href="#"` with no handler).

## Step 4: Deliver Findings or Patch Cleanly

When running in audit mode, output a numbered findings table citing `[File:Line]`, rule ID, severity (`HIGH` for contrast/keyboard/fabricated claims, `MEDIUM` for mobile spacing/copy tone), and exact fix. Re-run `node scripts/audit-slop.mjs` after edits to verify exit code `0`.

## Verification Checklist

- [ ] `node scripts/audit-slop.mjs <targets>` exits `0`.
- [ ] Both Light and Dark themes pass WCAG AA contrast (`>= 4.5:1` body, `>= 3.0:1` large/UI).
- [ ] All interactive elements display visible `:focus-visible` indicators.
- [ ] Zero horizontal scroll at `375px` width and zero dead controls.
