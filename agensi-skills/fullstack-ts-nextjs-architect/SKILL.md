---
name: fullstack-ts-nextjs-architect
description: Enforces production Next.js App Router architecture, strict zero-any TypeScript, Zod-validated API contracts, and zero-downtime database migrations. Use when scaffolding Next.js features, auditing TypeScript files for unsafe type escapes, reviewing Server Actions or Route Handlers, or planning schema migrations.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills compatible runtimes (Node.js 18+ for strict TS scanner)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Fullstack TypeScript and Next.js Architect

Design and review fullstack Next.js App Router applications with zero `any` leaks, explicit Server/Client boundaries, validated API contracts, and safe PostgreSQL/Prisma/Drizzle migrations.

## When to Activate

- Creating or refactoring Next.js App Router pages, layouts, Server Components, Server Actions, or Route Handlers.
- Enforcing strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`) across `.ts` and `.tsx` modules.
- Designing API request/response schemas with runtime validation.
- Writing or reviewing SQL/ORM migrations for production tables without table locks or breaking deploys.

## Step 1: Enforce Server and Client Boundaries

1. Keep data fetching, database queries, and secret environment reads inside Server Components (`page.tsx`, `layout.tsx`) or server-only modules (`import 'server-only'`).
2. Push `'use client'` as low down the component tree as possible. Pass only serializable props across the boundary.
3. Never import server database clients or `process.env.SECRET_*` inside files marked `'use client'`.
4. Colocate loading (`loading.tsx`) and error (`error.tsx`) boundaries next to async route segments.

## Step 2: Lock API and Server Action Contracts

Every Route Handler (`route.ts`) and Server Action (`'use server'`) must validate untrusted input at runtime before touching business logic:

```typescript
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
  visibility: z.enum(['private', 'workspace']),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'INTERNAL'; message: string };
```

Rules:
- Authenticate and authorize inside every Server Action and Route Handler; do not rely solely on middleware for authorization.
- Return typed discriminated unions (`ActionResult<T>`) instead of throwing raw database errors to the client.
- Validate `params` and `searchParams` (in Next.js 15+, remember both are Promises and must be `await`ed).

## Step 3: Zero-Any TypeScript Discipline

- Replace `any` with `unknown` + type narrowing (`typeof`, `in`, or Zod schema parsing).
- Replace `as any` casts with proper generic parameters or discriminated union narrowing.
- Never silence compiler errors with `@ts-ignore` or `@ts-nocheck`. If a third-party type definition is genuinely broken, isolate a typed adapter module or use `@ts-expect-error` with a ticket link and explanation.

Run the bundled scanner after every refactor:

```bash
node scripts/check-strict-ts.mjs src/
```

## Step 4: Zero-Downtime Database Migrations

Consult `references/architecture-checklist.md` for the full migration safety matrix. Follow the expand-and-contract pattern:

1. **Expand**: Add nullable columns or new tables first. Never add `NOT NULL` without a default on a populated table in one blocking lock.
2. **Backfill**: Populate data in bounded batches outside the schema transaction.
3. **Switch**: Deploy application code that writes both or reads the new column.
4. **Contract**: Drop legacy columns or constraints in a later migration after confirming zero reads.
5. **Indexes**: Create PostgreSQL indexes with `CONCURRENTLY` outside transactions to avoid blocking writes.

## Verification Checklist

- [ ] `node scripts/check-strict-ts.mjs <target>` exits `0` with zero `: any`, `as any`, or `@ts-ignore` hits.
- [ ] Every Route Handler and Server Action validates input with Zod and checks session/ownership.
- [ ] No database client or server secret is reachable from `'use client'` modules.
- [ ] `npx tsc --noEmit` and `npm run build` pass cleanly.
