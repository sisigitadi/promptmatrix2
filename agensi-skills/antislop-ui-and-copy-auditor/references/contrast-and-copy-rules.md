# Contrast, Accessibility, and Copywriting Rules

Reference specification for auditing UI components and product prose.

## 1. WCAG AA Contrast Matrix

| Element Type | Minimum Ratio | Safe Dark Theme Pair | Safe Light Theme Pair |
| :--- | :--- | :--- | :--- |
| Primary body text | 4.5:1 | `#F8FAFC` on `#0F172A` | `#0F172A` on `#FFFFFF` |
| Muted / secondary text | 4.5:1 | `#CBD5E1` on `#0F172A` | `#475569` on `#F8FAFC` |
| Code / JSON viewer text | 4.5:1 | `#E2E8F0` on `#070B12` | `#1E293B` on `#F8FAFC` |
| Placeholder / input label | 4.5:1 | `#94A3B8` on `#0F172A` | `#475569` on `#FFFFFF` |
| Focus ring / border indicator | 3.0:1 | `#38BDF8` on `#0F172A` | `#0284C7` on `#FFFFFF` |

Watch out for `text-slate-400` on white (`#FFFFFF`) or `bg-slate-50` (`#F8FAFC`): its ratio is ~2.5:1, which fails WCAG AA. Upgrade light-theme muted text to `text-slate-600` (`#475569`) or darker.

## 2. Keyboard Focus and Interactive Controls

- Never write `outline: none` or Tailwind `outline-none` by itself.
- Always pair interactive controls with a visible focus ring:
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2`
- Avoid `<div onClick={...}>`. Use `<button type="button">` or `<a href="...">` so keyboard activation and screen-reader roles work natively.

## 3. Mobile Reflow Guardrails (375px Viewport)

- Wrap horizontally dense tab bars or data tables in `overflow-x-auto max-w-full`.
- Use `min-w-0` on flex/grid children containing long monospace strings or file paths so text wraps or truncates cleanly instead of pushing page width past `100vw`.
- Keep button tap height `>= 44px` (`min-h-[44px]` or `py-2.5 px-4`) on mobile breakpoints.

## 4. Copywriting Hygiene

1. **No Em Dashes (`U+2014`)**: Replace with commas, colons, periods, or parentheses.
2. **Concrete Verbs Over Hype**: Replace vague marketing claims with measurable mechanism descriptions (what the tool accepts, validates, or outputs).
3. **Specific CTAs**: Replace generic "Get Started" or "Learn More" buttons with task-specific actions like "Download SKILL.md", "Run Schema Check", or "Inspect Prompt JSON".
4. **Zero Fabricated Social Proof**: Never invent user counts, percentage speedups, customer logos, or fictional quotes.
