---
name: ai-product-manager-and-prd-architect
description: Transforms ambiguous product ideas into structured PRDs, Gherkin acceptance criteria, RICE prioritization matrices, and engineering-ready sprint backlogs. Use when writing product requirements, defining user stories, auditing edge cases, or validating functional specifications before sprint kickoff.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for PRD validator script)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# AI Product Manager and PRD Architect

Convert ambiguous product visions into engineering-ready Product Requirements Documents (PRDs), testable Gherkin acceptance criteria, RICE scoring matrices, and structured sprint backlogs.

## When to Activate

- Turning high-level feature requests or stakeholder notes into a formal, testable PRD.
- Defining user stories with strict Given-When-Then acceptance criteria and explicit boundary conditions.
- Prioritizing backlog items using Reach, Impact, Confidence, and Effort (RICE) scoring.
- Auditing existing specification documents for missing error states, security considerations, and edge cases before engineering estimation.

## Step 1: Establish Problem Scope and Success Metrics

Begin every product initiative by clarifying the problem statement and measurable business outcomes before jumping into implementation details. Consult `references/prd-and-user-story-standards.md` for standard schemas and metrics definitions:

1. **Problem Statement**: Articulate the exact user friction point, who experiences it, and the cost of inaction.
2. **Target Persona**: Name the primary user role, their current alternative solution, and their constraints.
3. **Leading and Lagging KPIs**: Pair lagging metrics (revenue, retention) with immediate leading signals (activation rate, time-to-first-value, task completion rate).
4. **Non-Goals**: Explicitly list capabilities excluded from the current milestone to prevent scope creep.

## Step 2: Author User Stories with Gherkin Acceptance Criteria

Structure user stories following the classic agile format, followed by concrete Given-When-Then scenarios covering typical and failure paths:

```markdown
### US-101: Workspace Team Invite Flow

As an **Organization Admin**,
I want to **invite team members by entering their work email addresses**,
So that **my team can collaborate on shared prompt libraries**.

#### Scenario 1: Successful Invitation Sent (Happy Path)
- **Given** I am logged in as an Organization Admin with available seat licenses,
- **When** I enter a valid email address "engineer@company.com" and click "Send Invitation",
- **Then** the system creates a pending invitation token expiring in 7 days,
- **And** sends an onboarding email with the secure signup link,
- **And** decrements available seats by 1.

#### Scenario 2: Seat Limit Reached (Boundary Case)
- **Given** my organization has 0 available seat licenses remaining,
- **When** I enter an invitee email address,
- **Then** the "Send Invitation" button remains disabled,
- **And** an inline alert prompts: "Seat limit reached. Upgrade plan to invite more members."
```

## Step 3: Prioritize Features with RICE Scoring

Score prospective backlog items across four objective dimensions:

$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

- **Reach**: Number of users impacted per quarter (integer count).
- **Impact**: Multiplier on user outcome (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal).
- **Confidence**: Percentage certainty in estimates (100% = high evidence, 80% = moderate data, 50% = speculative).
- **Effort**: Person-weeks or story points required across design, engineering, and QA.

## Step 4: Validate PRD Completeness

Start from `templates/prd-template.md` when drafting a new specification, and run the bundled offline validator against any `.md` or `.json` specification document:

```bash
node scripts/validate-prd-structure.mjs templates/prd-template.md --strict
node scripts/validate-prd-structure.mjs path/to/feature-prd.md
```

The script verifies:
- Presence of mandatory sections: Problem Statement, Success Metrics, User Stories, Non-Goals, and Security/Privacy Considerations.
- Format compliance of Gherkin Given-When-Then statements.
- Inclusion of at least one explicit failure or error state per story.
- Absence of unresolved placeholders (`[TBD]`, `{{...}}`, `TODO`).

## Verification Checklist

- [ ] Problem statement isolates the core friction without prescribing architecture.
- [ ] Every user story includes at least one boundary scenario and one error scenario.
- [ ] Non-goals explicitly declare what will NOT be built in this release.
- [ ] `node scripts/validate-prd-structure.mjs <file>` passes with exit code `0`.

## See It in Action (Demo)

### The Request

Draft an engineering-ready PRD section for an AI prompt stash export feature that allows users to download their saved prompts as a JSON or Markdown file with privacy-first client-side execution.

### The Result

## Summary
Drafted a complete specification containing problem framing, metric definitions, user stories with Gherkin criteria, and explicit non-goals emphasizing zero-server ingestion.

### Compiled Specification

```markdown
# PRD: Client-Side Prompt Stash Backup and Export

## 1. Problem Statement
PromptMatrix creators and engineers accumulate customized prompt templates in their browser IndexedDB storage. Without an export mechanism, users risk data loss upon browser cache purges and cannot migrate their prompts to other workstations.

## 2. Success Metrics
- **Primary Metric**: 100% successful local export rate without network dependency.
- **Guardrail Metric**: 0 bytes of prompt payload transmitted to remote servers during export.

## 3. User Story & Acceptance Criteria

### US-EXPORT-01: Export Stash to JSON and Markdown
As a **Prompt Engineer**,
I want to **export my prompt stash into a single JSON or Markdown file**,
So that **I can maintain an offline version-controlled backup of my prompt library**.

#### Scenario 1: Export Complete Stash to JSON
- **Given** I have 15 prompts saved in my local stash IndexedDB,
- **When** I click "Export Backup (JSON)",
- **Then** the browser generates a timestamped file `promptmatrix-stash-YYYY-MM-DD.json`,
- **And** the file conforms to RFC 8259 JSON format containing all prompt metadata and field values,
- **And** zero network requests are dispatched.

#### Scenario 2: Empty Stash State
- **Given** I have 0 prompts saved in my stash,
- **When** I view the Stash modal,
- **Then** the export buttons display in a disabled state with a tooltip: "Save at least one prompt to export."
```

| Section | Target Standard | Risk Prevented |
| :--- | :--- | :--- |
| Client-Side Scope | Pure browser Blob download | Accidental server ingestion of proprietary prompts |
| Disabled Empty State | Clear UI feedback | Corrupted zero-byte export downloads |
| RFC 8259 JSON Contract | Standardized JSON schema | Parse errors during cross-device restore |

## Next Steps
1. Run `node scripts/validate-prd-structure.mjs templates/prd-template.md` to confirm baseline structural integrity.
2. Review the technical feasibility with the frontend lead before sprint planning.
