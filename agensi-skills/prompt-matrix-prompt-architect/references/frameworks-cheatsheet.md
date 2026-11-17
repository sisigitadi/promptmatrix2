# Prompt Frameworks Cheatsheet

Quick reference for structuring prompts across common engineering, content, and automation workflows.

## 1. RTF (Role, Task, Format)

Best for single-turn operational tasks where context is self-contained.

```markdown
Role: Senior PostgreSQL database engineer reviewing migration SQL.
Task: Inspect the DDL below for lock contention, missing concurrent index flags, and destructive column drops.
Format: Markdown table with columns [Severity, Line, Issue, Safe Alternative]. Return "NO_ISSUES" if clean.
```

## 2. CO-STAR (Context, Objective, Style, Tone, Audience, Response)

Best for communication, documentation, product positioning, and user-facing prose.

- **Context**: Background facts, product state, and constraints the model must respect.
- **Objective**: Single measurable outcome of the response.
- **Style**: Structural pattern (for example: technical RFC, executive brief, step-by-step runbook).
- **Tone**: Register and attitude (for example: direct, matter-of-fact, zero hype).
- **Audience**: Reader role and technical familiarity.
- **Response**: Exact output format, length cap, and section headings.

## 3. GCC (Goal, Constraints, Context)

Best for coding agents, architectural decisions, and multi-step troubleshooting.

```markdown
Goal: Refactor `parseInvoice()` to handle multi-currency line items without changing its public signature.
Constraints:
- Preserve backward compatibility for callers omitting `currency`.
- Do not introduce external dependencies.
- All monetary math must use integer minor units (cents), never floating-point numbers.
Context:
- Runtime: Node.js 22 with TypeScript strict mode.
- Existing tests live in `src/billing/__tests__/parseInvoice.test.ts`.
```

## 4. Few-Shot Pattern (Calibration by Example)

Use 2 to 5 examples when prose instructions leave formatting ambiguity. Include at least one edge case.

```markdown
Classify support tickets into one of: [BILLING, BUG, ACCESS, OTHER]. Return JSON only.

Input: "My card was charged twice for invoice #4021."
Output: {"category": "BILLING", "confidence": "high", "needs_escalation": true}

Input: "Can you tell me the weather in Jakarta?"
Output: {"category": "OTHER", "confidence": "high", "needs_escalation": false}
```

## 5. RFC 8259 JSON Contract Template

Copy this block into system prompts that feed application code:

```json
{
  "contract_version": "1.0",
  "role": "Structured extractor for release notes",
  "task": "Extract breaking changes and migration steps from changelog text.",
  "constraints": [
    "Return valid RFC 8259 JSON only.",
    "Never invent version numbers or PR links not present in the input."
  ],
  "output_contract": {
    "type": "object",
    "required": ["version", "breaking_changes", "missing_fields"],
    "properties": {
      "version": { "type": ["string", "null"] },
      "breaking_changes": {
        "type": "array",
        "items": { "type": "string" }
      },
      "missing_fields": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  }
}
```
