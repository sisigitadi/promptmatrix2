---
name: playwright-e2e-and-openapi-contract-suite
description: Validates OpenAPI 3.x API contract specifications and enforces deterministic, flake-free Playwright end-to-end test suites. Use when designing REST API schemas, auditing OpenAPI JSON for missing operationIds or responses, removing waitForTimeout flakiness in Playwright specs, or gating CI releases on contract checks.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for OpenAPI and Playwright validator)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Playwright E2E and OpenAPI Contract Suite

Keep API contracts and browser end-to-end tests aligned without schema drift or timing flakiness. Validate OpenAPI 3.x specs structurally and scan Playwright test specs for deterministic-wait anti-patterns.

## When to Activate

- Creating or updating OpenAPI 3.0/3.1 JSON specs (`openapi.json`, `templates/openapi-contract-stub.json`).
- Reviewing Playwright `.spec.ts` / `.test.ts` suites for flaky sleeps (`waitForTimeout`), brittle selectors, or stray `.only` calls.
- Building CI quality gates that verify API contracts and browser journeys together.
- Mapping critical user flows to backend API status codes and error schemas.

## Step 1: Lock the OpenAPI 3.x Contract

Start from `templates/openapi-contract-stub.json` and verify every route includes:

1. Valid `openapi` semantic version (`3.0.x` or `3.1.x`).
2. Complete `info` metadata (`title`, `version`).
3. Paths prefixed with `/`, where each HTTP operation (`get`, `post`, `put`, `patch`, `delete`) defines:
   - A unique, descriptive `operationId` (e.g., `listProjects`, `createProject`).
   - Explicit `responses` covering success (`200`, `201`, `204`) and failure (`400`, `401`, `404`) payloads referencing shared `components.schemas`.

## Step 2: Enforce Deterministic Playwright E2E Rules

Consult `references/e2e-and-api-contract-matrix.md` for selector and wait replacements:

- **Zero `waitForTimeout`**: Never sleep for fixed milliseconds (`page.waitForTimeout(2000)`). Use web-first assertions (`await expect(locator).toBeVisible()`) or explicit network sync (`await page.waitForResponse(...)`).
- **Role and Label Locators**: Prefer `page.getByRole(...)`, `page.getByLabel(...)`, and `page.getByTestId(...)` over fragile CSS chains or positional XPath.
- **Zero `networkidle` Coupling**: Wait for specific UI milestones or API responses instead of `waitForLoadState('networkidle')`, which flakes with background polling or analytics streams.
- **No Focused Tests in Commits**: Reject `test.only(...)` and `describe.only(...)` before merge.

## Step 3: Run the Contract and E2E Validator

Validate an OpenAPI JSON file, a Playwright spec file, or a mixed directory:

```bash
node scripts/validate-openapi-and-e2e.mjs templates/openapi-contract-stub.json
node scripts/validate-openapi-and-e2e.mjs tests/e2e/ --strict
```

The script checks:
- OpenAPI 3.x root structure (`openapi`, `info`, `paths`), unique `operationId`s, and valid `responses` status maps.
- Playwright `.spec.ts`/`.test.ts` files for `waitForTimeout(`, `test.only(`, `describe.only(`, `networkidle`, and `{ force: true }`.

## Verification Checklist

- [ ] `node scripts/validate-openapi-and-e2e.mjs <target>` exits `0` with zero errors.
- [ ] Every OpenAPI operation has a unique `operationId` and documented success plus `4xx` error responses.
- [ ] Zero `page.waitForTimeout(...)` calls remain in Playwright specs.
- [ ] Critical E2E flows assert against real UI visibility and verified API response statuses.

## See It in Action (Demo)

### The Request

Fix this flaky Playwright test and align it with an OpenAPI 3.1 contract entry for `POST /v1/items`: `test.only('creates item', async ({ page }) => { await page.locator('#btn').click({ force: true }); await page.waitForTimeout(2500); await page.waitForLoadState('networkidle'); });`

### The Result

## Summary
Removed `test.only`, `waitForTimeout(2500)`, `waitForLoadState('networkidle')`, and `{ force: true }`, replacing them with accessible role locators, explicit API response synchronization, and a matching OpenAPI 3.1 `POST /v1/items` operation.

### Flake-Free Playwright Spec (`tests/e2e/items.spec.ts`)

```typescript
import { expect, test } from '@playwright/test';

test('creates workspace item via API and renders it', async ({ page }) => {
  await page.goto('/workspace');
  await page.getByLabel('Item title').fill('Contract Test Item');

  const responsePromise = page.waitForResponse(
    (res) => res.url().endsWith('/v1/items') && res.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Create Item' }).click();

  const response = await responsePromise;
  expect(response.status()).toBe(201);
  await expect(page.getByRole('heading', { name: 'Contract Test Item' })).toBeVisible();
});
```

### OpenAPI 3.1 Contract Path (`openapi.json` excerpt)

```json
{
  "/v1/items": {
    "post": {
      "operationId": "createWorkspaceItem",
      "responses": {
        "201": { "description": "Workspace item created" },
        "400": { "description": "Request validation failed" },
        "401": { "description": "Authentication required" }
      }
    }
  }
}
```

## Next Steps
1. Run `node scripts/validate-openapi-and-e2e.mjs tests/e2e/ openapi.json --strict` to confirm zero `waitForTimeout`, `.only`, or missing `operationId` errors.
2. Execute `npx playwright test tests/e2e/items.spec.ts` against your staging server to verify deterministic `201` assertion timing.
