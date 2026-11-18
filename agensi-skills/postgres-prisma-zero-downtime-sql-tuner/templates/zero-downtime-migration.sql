-- Zero-Downtime Migration Template (Expand Phase + RLS + Concurrent Index)
-- Safe for production PostgreSQL and Prisma/Drizzle workflows.

SET lock_timeout = '3s';
SET statement_timeout = '30s';

-- 1. Create multi-tenant user table with explicit tenant ownership
CREATE TABLE IF NOT EXISTS public.workspace_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  key_prefix varchar(16) NOT NULL,
  key_hash text NOT NULL,
  label varchar(80) NOT NULL DEFAULT 'default',
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz NULL
);

-- 2. Enforce Row-Level Security on the user/tenant table
ALTER TABLE public.workspace_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspace_api_keys_tenant_select
  ON public.workspace_api_keys
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY workspace_api_keys_tenant_write
  ON public.workspace_api_keys
  FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
    AND user_id = current_setting('app.current_user_id', true)::uuid
  )
  WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
    AND user_id = current_setting('app.current_user_id', true)::uuid
  );

-- 3. Safe additive column with explicit DEFAULT (no table rewrite in PG 11+)
ALTER TABLE public.workspace_api_keys
  ADD COLUMN IF NOT EXISTS last_used_at timestamptz NULL;

ALTER TABLE public.workspace_api_keys
  ADD COLUMN IF NOT EXISTS rate_limit_rpm integer NOT NULL DEFAULT 120;

-- 4. Non-blocking concurrent index supporting RLS and active-key lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workspace_api_keys_tenant_active
  ON public.workspace_api_keys (tenant_id, user_id)
  WHERE revoked_at IS NULL;
