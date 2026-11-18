# PostgreSQL RLS and Zero-Downtime Index Playbook

## 1. Lock Level Quick Reference

| DDL Operation | Lock Acquired | Blocks Reads? | Blocks Writes? | Safe Alternative |
| :--- | :--- | :--- | :--- | :--- |
| `CREATE INDEX` | `SHARE` | No | Yes | `CREATE INDEX CONCURRENTLY` |
| `ALTER TABLE ADD COLUMN ... DEFAULT const` (PG 11+) | `ACCESS EXCLUSIVE` (brief metadata only) | Brief | Brief | Keep `lock_timeout = '3s'` |
| `ALTER TABLE ADD COLUMN ... NOT NULL` (no default) | Fails on populated rows / table rewrite | Yes | Yes | Add nullable -> backfill -> `CHECK NOT VALID` -> `VALIDATE CONSTRAINT` |
| `ALTER TABLE ADD CONSTRAINT ... FOREIGN KEY` | `SHARE ROW EXCLUSIVE` (full scan) | No | Yes | `ADD CONSTRAINT ... NOT VALID` then `VALIDATE CONSTRAINT` |
| `ALTER TABLE ALTER COLUMN TYPE` | `ACCESS EXCLUSIVE` (full rewrite) | Yes | Yes | Shadow column + dual write + backfill + swap |
| `ALTER TABLE DROP COLUMN` | `ACCESS EXCLUSIVE` (breaks running code) | Brief | Brief | Stop reads/writes in app first, deploy, verify, then drop |

## 2. Two-Step NOT NULL and Foreign Key Pattern

```sql
SET lock_timeout = '3s';

ALTER TABLE public.invoices
  ADD CONSTRAINT chk_invoices_currency_not_null
  CHECK (currency IS NOT NULL) NOT VALID;

ALTER TABLE public.invoices
  VALIDATE CONSTRAINT chk_invoices_currency_not_null;
```

`VALIDATE CONSTRAINT` scans rows under `SHARE UPDATE EXCLUSIVE`, allowing concurrent `SELECT`, `INSERT`, `UPDATE`, and `DELETE` traffic to continue.

## 3. Multi-Tenant Row-Level Security (RLS) Template

```sql
ALTER TABLE public.workspace_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspace_api_keys_tenant_isolation
  ON public.workspace_api_keys
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
```

Always index the RLS column (`tenant_id` or `user_id`) concurrently so policy predicates execute as index scans rather than full table scans.

## 4. Prisma Migration Notes

- Run `npx prisma migrate dev --create-only --name <name>` to inspect generated SQL before applying.
- Prisma wraps each migration file in a transaction by default. Keep `CREATE INDEX CONCURRENTLY` in its own dedicated migration or execute outside a transaction block when targeting live production databases.
