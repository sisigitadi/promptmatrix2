# Subagent Handoff Patterns and Ownership Matrix

## 1. Topology Selection Guide

| Pattern | Best Used When | Concurrency Model | Failure Mode Prevented |
| :--- | :--- | :--- | :--- |
| Fan-Out / Fan-In | 3+ independent files or packages need creation/editing | Parallel writers + single coordinator | Sequential bottleneck |
| Staged Pipeline | Downstream design depends on upstream discovery | Sequential phases (`dependsOn`) | Building on wrong assumptions |
| Author-Verifier | High-risk logic needs independent test/audit check | Author writes, verifier runs checks | Author blind spots |
| Read-Only Shards | Large codebase needs security + perf + schema audit | Parallel read-only workers | Context window overflow |

## 2. File Ownership Rules

1. **Single-Writer Principle**: In an `inherit` workspace, at most one active task may own a given file path or directory prefix at any time.
2. **Coordinator-Owned Glue Files**: Shared registries (`package.json`, `App.tsx`, `index.ts`, `translations.ts`) should be owned by one designated integration worker or the coordinator after parallel leaf modules land.
3. **Isolated Clones for Competing/Overlapping Work**: If two tasks must run builds or edit overlapping trees concurrently, set `workspaceMode` to `"share"` or `"branch"` and assign an explicit merge step.

## 3. Handoff Message Protocol

A high-signal handoff message between agents must fit in 5-10 lines and include:

- **Status Tag**: `[done]` for terminal completion, `[blocked]` for missing dependency/decision, or `[review]` for peer verification.
- **Artifact List**: Exact file paths created or modified, plus exported symbol names.
- **Verification Proof**: Exact command run and exit status (e.g., `npm run build` exited 0).
- **Next Owner**: Single `@mention` of the next acting peer or `@coordinator` if all downstream work is complete.

## 4. Instruction File Standards

- **`SKILL.md`**: Must begin with YAML frontmatter (`---`), contain `name` matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` (`<= 64` chars), and `description` (`<= 1024` chars).
- **`AGENTS.md` / `CLAUDE.md`**: Must state single-source-of-truth files, strict language/type constraints, allowed build/test commands, and forbidden actions concisely so every spawned agent loads minimal token overhead.
