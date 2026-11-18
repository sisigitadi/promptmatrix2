---
name: postgres-prisma-zero-downtime-sql-tuner
description: Authors and lints zero-downtime PostgreSQL, Prisma, and Drizzle SQL migrations, concurrent indexes, and Row-Level Security (RLS) policies. Use when writing DDL migrations, adding NOT NULL columns, creating indexes on live tables, dropping columns safely, or auditing multi-tenant RLS isolation.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills compatible runtimes (Node.js 18+ for SQL migration linter)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# PostgreSQL and Prisma Zero-Downtime SQL Tuner

Write and audit production PostgreSQL, Prisma, and Drizzle migrations without table-locking outages, broken rolling deploys, or multi-tenant Row-Level Security (RLS) gaps.

## When to Activate

- Creating or reviewing `.sql` migration files generated manually or via `prisma migrate dev --create-only`.
- Adding indexes, foreign keys, `NOT NULL` constraints, or column type changes to populated production tables.
- Planning safe column/table deprecation (`DROP COLUMN`) across blue-green or rolling deployments.
- Enforcing tenant or user isolation with PostgreSQL Row-Level Security (`ENABLE ROW LEVEL SECURITY` + `CREATE POLICY`).

## Step 1: Run the SQL Migration Linter

Before applying or committing any migration, run the bundled linter:

```bash
node scripts/lint-sql-migrations.mjs templates/zero-downtime-migration.sql
node scripts/lint-sql-migrations.mjs prisma/migrations/
```

The linter checks `.sql` files for:
- `SQL-INDEX-NOT-CONCURRENT`: `CREATE [UNIQUE] INDEX` missing `CONCURRENTLY` (blocks writes on large tables).
- `SQL-DROP-COLUMN-UNGUARDED`: `ALTER TABLE ... DROP COLUMN` without an explicit `-- deprecation-verified:` guard comment.
- `SQL-ADD-NOT-NULL-NO-DEFAULT`: `ALTER TABLE ... ADD COLUMN ... NOT NULL` without a `DEFAULT` clause.
- `SQL-MISSING-RLS`: User or tenant tables (`CREATE TABLE`) lacking `ENABLE ROW LEVEL SECURITY` and a `CREATE POLICY` statement.

## Step 2: Apply Expand-and-Contract DDL Rules

Consult `references/rls-and-index-playbook.md` for lock levels and multi-phase examples:

1. **Indexes**: Always use `CREATE INDEX CONCURRENTLY IF NOT EXISTS ...`. In Prisma, split concurrent index DDL into a separate migration file that avoids wrapping the statement in an explicit `BEGIN`/`COMMIT` transaction.
2. **NOT NULL Columns**: Add the column as nullable first (or with a constant `DEFAULT` in PostgreSQL 11+), backfill in bounded batches, add `CHECK (col IS NOT NULL) NOT VALID`, and validate with `VALIDATE CONSTRAINT` under a `SHARE UPDATE EXCLUSIVE` lock.
3. **Column Drops**: Never drop a column in the same release that removes application references. Deploy application code that stops reading/writing the column first, verify zero query usage, document `-- deprecation-verified: <ticket-or-date>`, then drop.
4. **Lock Timeouts**: Set `SET lock_timeout = '3s';` and `SET statement_timeout = '30s';` before DDL statements so blocked metadata locks fail fast instead of queuing behind long-running queries.

## Step 3: Enforce Multi-Tenant RLS Isolation

For every table storing user, account, workspace, or tenant records:

1. Run `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
2. Define explicit policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` referencing session context (`current_setting('app.current_tenant_id', true)` or `auth.uid()`).
3. Create a supporting B-tree index (`CONCURRENTLY`) on the RLS predicate column (`tenant_id` or `user_id`) to prevent sequential scans.

## Step 4: Reference Template

Use `templates/zero-downtime-migration.sql` as the starting pattern for new table creation, safe additive alterations, RLS policies, and concurrent indexing.

## Verification Checklist

- [ ] `node scripts/lint-sql-migrations.mjs <migration-dir>` exits `0`.
- [ ] Every `CREATE INDEX` uses `CONCURRENTLY` outside a transaction block.
- [ ] No `ADD COLUMN ... NOT NULL` lacks a safe `DEFAULT` or expand-and-contract steps.
- [ ] Every user/tenant table enables Row-Level Security with explicit policies and supporting indexes.
