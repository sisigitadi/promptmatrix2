---
name: multi-agent-swarm-and-subagent-orchestrator
description: Designs and validates multi-agent swarm topologies, subagent delegation contracts, file ownership boundaries, and workspace instruction files (AGENTS.md, CLAUDE.md, SKILL.md). Use when orchestrating parallel coding agents, writing task handoff JSON contracts, preventing merge conflicts, or validating agent skill frontmatter.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for workspace validator)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Multi-Agent Swarm and Subagent Orchestrator

Coordinate parallel and staged AI coding agents without file conflicts, lost context, or ambiguous handoffs. Define deterministic task contracts, isolate write scopes, and validate `AGENTS.md`, `CLAUDE.md`, and `SKILL.md` metadata before spawning workers.

## When to Activate

- Splitting a multi-module build or refactor across parallel subagents or swarm workers.
- Authoring a formal swarm handoff contract (`swarm-task-contract.json`) with disjoint `ownedPaths` and explicit `acceptanceCriteria`.
- Auditing `AGENTS.md`, `CLAUDE.md`, or `SKILL.md` frontmatter for kebab-case naming (`<= 64` chars) and description length (`<= 1024` chars).
- Preventing concurrent edit collisions between builder, reviewer, and verifier agents.

## Step 1: Choose the Right Topology

Consult `references/subagent-handoff-patterns.md` to match the task structure to a proven pattern:

1. **Fan-Out / Fan-In**: Independent modules or files edited simultaneously by separate workers, merged and verified by a coordinator.
2. **Staged Pipeline**: Research/Audit -> Architecture Spec -> Parallel Implementation -> Independent Verification.
3. **Author-Verifier Pair**: One worker writes code; a separate read-only verifier runs tests and reports failures back to the author.
4. **Read-Only Investigator**: Unblocks an unknown API, test failure, or schema question while implementation proceeds elsewhere.

## Step 2: Lock Disjoint File Ownership

Every concurrent worker must have an explicit, non-overlapping write boundary:

- Declare `ownedPaths` (files or directories the agent may create or edit) and `forbiddenPaths` (shared files reserved for the coordinator or another peer).
- Keep `workspaceMode: "inherit"` for read-only auditors and verifiers, or for parallel writers with strictly disjoint `ownedPaths`.
- Use `workspaceMode: "share"` or `"branch"` whenever two workers must build, test, or touch overlapping repository paths concurrently.
- Require the coordinator to perform final integration of shared entrypoints (`package.json`, router registries, barrel exports).

## Step 3: Define the Handoff Contract

Use `templates/swarm-task-contract.json` as the baseline schema. Every worker brief must specify:

1. **Identity & Scope**: Kebab-case `agentName`, `role`, and `dependsOn` list.
2. **File Boundaries**: Exact `ownedPaths` and `forbiddenPaths`.
3. **Done Criteria**: Verifiable commands or schema checks (`acceptanceCriteria`), never vague completion phrases.
4. **Handoff Target & Guardrails**: Explicit `handoffTo`, `maxRetries`, and `timeoutSeconds`.

## Step 4: Validate Workspace Files and Contracts

Run the bundled validator against a contract JSON, an agent instruction markdown file, or a workspace directory:

```bash
node scripts/validate-agent-workspace.mjs templates/swarm-task-contract.json
node scripts/validate-agent-workspace.mjs path/to/SKILL.md
node scripts/validate-agent-workspace.mjs .
```

The validator checks:
- `SKILL.md` YAML frontmatter: required `name` (kebab-case, `<= 64` chars) and `description` (`1..1024` chars).
- `AGENTS.md` and `CLAUDE.md`: non-empty markdown structure, headings, and valid optional frontmatter if present.
- Swarm contract JSON: valid `tasks`, unique `id` and `agentName`, acyclic `dependsOn` graph, non-empty `acceptanceCriteria`, and zero overlapping `ownedPaths` among concurrent `inherit`-workspace tasks.

## Verification Checklist

- [ ] `node scripts/validate-agent-workspace.mjs <target>` exits `0` with zero contract or frontmatter errors.
- [ ] No two concurrent `inherit` workers share overlapping `ownedPaths`.
- [ ] Every worker brief includes explicit `acceptanceCriteria` and a clear `handoffTo` peer or coordinator.
- [ ] Verification is assigned to an independent verifier or final coordinator pass before delivery.
