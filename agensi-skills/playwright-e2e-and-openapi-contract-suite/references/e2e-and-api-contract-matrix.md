# E2E and API Contract Matrix

## 1. OpenAPI 3.x Required Fields and Status Coverage

| Element | Requirement | Why It Matters |
| :--- | :--- | :--- |
| `openapi` | Matches `^3\.\d+\.\d+$` (`3.0.3` or `3.1.0`) | Ensures codegen, Swagger UI, and validators parse reliably |
| `info.title` & `info.version` | Non-empty strings | Identifies contract ownership and release version |
| `paths` | Non-empty object with keys starting with `/` | Prevents empty or malformed route specs |
| `operationId` | Unique across entire spec, camelCase verb+noun | Required for typed SDK clients and mock servers |
| `responses` | At least one `2xx` plus `4xx` error schema | Guarantees clients handle validation and auth failures |

## 2. Playwright Anti-Pattern Replacement Table

| Anti-Pattern | Failure Mode | Deterministic Replacement |
| :--- | :--- | :--- |
| `await page.waitForTimeout(1500)` | Slow on fast CI, flaky on loaded CI | `await expect(page.getByRole('status')).toHaveText('Saved')` |
| `await page.waitForLoadState('networkidle')` | Hangs on SSE, WebSockets, or telemetry | `await Promise.all([page.waitForResponse(r => r.url().includes('/api/items') && r.ok()), btn.click()])` |
| `page.locator('div > ul > li:nth-child(3)')` | Breaks on minor markup refactor | `page.getByRole('listitem').filter({ hasText: 'Invoice #104' })` |
| `await btn.click({ force: true })` | Masks overlapping modals or disabled states | Wait for overlay dismissal and element actionability |
| `test.only('...')` | Silently skips rest of CI suite | Remove `.only` before commit |

## 3. Recommended `playwright.config.ts` CI Defaults

- `forbidOnly: !!process.env.CI` to fail CI immediately if `.only` slips in.
- `retries: process.env.CI ? 2 : 0` paired with `trace: 'on-first-retry'` for actionable failure diagnostics.
- `use.actionTimeout: 10000` and `expect.timeout: 5000` so assertions auto-retry cleanly without manual sleeps.
