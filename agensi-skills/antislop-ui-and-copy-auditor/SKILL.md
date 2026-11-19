---
name: antislop-ui-and-copy-auditor
description: Audits web UIs and product copy for WCAG AA color contrast, mobile viewport reflow, keyboard focus rings, em dash removal (U+2014), and banned marketing buzzwords. Use when reviewing TSX/HTML/CSS components, checking dark and light theme legibility, auditing landing-page prose, or running automated slop checks before shipping.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for slop auditor script)
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

## See It in Action (Demo)

### The Request

Audit this pricing card JSX and headline for WCAG AA contrast, 375px mobile overflow, keyboard focus visibility, and generic template copy: `<section className="p-6"><span className="text-slate-400 bg-slate-100">Beta</span><h2>World-class developer workflow -- trusted by 10,000+ teams</h2><button className="outline-none px-4 py-2 whitespace-nowrap">Get Started</button></section>`

### The Result

## Summary
Audited the pricing card snippet against WCAG 2.1 AA contrast, 375px mobile reflow, keyboard focus visibility, and copy honesty. Found 4 high-priority defects across copy, contrast, and focus styling.

### Audit Findings

| Rule ID | Severity | Finding | Concrete Fix |
| :--- | :--- | :--- | :--- |
| `COPY-NO-UNVERIFIED` | `HIGH` | Headline claims `"World-class"` and `"trusted by 10,000+ teams"` with no verifiable source, and uses a double-hyphen prose dash. | State concrete product behavior in plain punctuation: `"Built for engineering teams."` |
| `COPY-GENERIC-CTA` | `HIGH` | Badge `"Beta"` lacks context (`R-09`) and CTA `"Get Started"` is generic (`R-15`). | Label the real mode (`"Client-Side Audit"`) and action (`"Run Slop Audit"`). |
| `WCAG-CONTRAST-AA` | `HIGH` | `text-slate-400` (`#94a3b8`) on `bg-slate-100` (`#f1f5f9`) yields ~2.3:1 contrast, failing the 4.5:1 body threshold. | Switch badge text to `text-slate-800` (`#1e293b`, > 10:1 contrast). |
| `A11Y-NO-OUTLINE-NONE` | `HIGH` | `outline-none` strips the browser focus ring without a `focus-visible:ring-2` replacement, and `py-2` falls below the 44px touch target. | Add `min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`. |

### Patched Component

```tsx
<section className="p-6">
  <span className="inline-block rounded px-2.5 py-1 text-xs font-medium text-slate-800 bg-slate-100">
    Client-Side Audit
  </span>
  <h2 className="mt-3 text-xl font-semibold text-slate-900">
    Ship accessible product pages without template copy.
  </h2>
  <button
    type="button"
    className="mt-4 min-h-[44px] rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
  >
    Run Slop Audit
  </button>
</section>
```

## Next Steps
1. Run `node scripts/audit-slop.mjs src/` to confirm zero `COPY-NO-EMDASH`, `COPY-NO-BUZZWORD`, and `A11Y-NO-OUTLINE-NONE` hits.
2. Inspect the patched card at `375px` viewport width in both light and dark modes.
