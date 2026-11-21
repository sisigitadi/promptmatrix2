# PRD and User Story Standards Reference

This document establishes the structural requirements for engineering-grade Product Requirements Documents (PRDs) and user stories.

## 1. Mandatory PRD Anatomy

Every production PRD must include these seven core sections:

| Section | Required Elements | Verification Criteria |
| :--- | :--- | :--- |
| **1. Header & Meta** | Title, Author, Target Milestone, Status (Draft/Review/Approved) | Metadata block present at top of file |
| **2. Problem Statement** | Current workflow friction, affected users, business impact | Quantifiable friction with no solution prescription |
| **3. Goals & Non-Goals** | Specific objectives paired with an explicit list of exclusions | At least 2 non-goals listed to prevent scope creep |
| **4. User Personas** | Role description, workflow context, user pain points | Persona linked directly to the problem statement |
| **5. Functional Requirements** | Numbered user stories with Gherkin acceptance criteria | Every story has Happy Path and Error Path scenarios |
| **6. Non-Functional Requirements** | Performance, security, accessibility (WCAG AA), privacy | Latency targets, auth boundaries, storage limits |
| **7. Rollout & Telemetry** | Feature flags, migration plans, key observability events | Rollback plan and metric logging definitions |

## 2. Gherkin Acceptance Criteria Protocol

Acceptance criteria must use the Given-When-Then format to ensure testability by QA engineers and automated testing frameworks:

- **Given**: The initial system context or pre-condition (e.g. user authentication state, existing records).
- **When**: The discrete user trigger or event (e.g. clicking a button, submitting a form, receiving a webhook).
- **Then**: The observable outcome or state change (e.g. database update, UI notification, file download).
- **And**: Supplementary conditions linked to the primary outcome.

### Anti-Patterns to Avoid

- **Vague Criteria**: "The form should look nice and load quickly." (Non-testable).
- **Prescriptive UI Code**: "The React hook should dispatch an action with payload X." (Keep criteria focused on user outcomes).
- **Missing Error Paths**: Specifying only what happens when everything succeeds while ignoring validation failures, network drops, or rate limits.
