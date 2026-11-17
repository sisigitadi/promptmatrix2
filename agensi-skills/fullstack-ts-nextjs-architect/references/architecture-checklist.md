# Fullstack TypeScript and Next.js Architecture Checklist

## 1. Strict `tsconfig.json` Baseline

Recommended compiler flags for production Next.js repos:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 2. Common `any` Replacements

| Anti-Pattern | Strict Replacement |
| :--- | :--- |
| `catch (err: any)` | `catch (err: unknown)` then `err instanceof Error ? err.message : String(err)` |
| `Record<string, any>` | `Record<string, unknown>` or explicit interface |
| `(req as any).user` | Module augmentation (`declare module ...`) or typed auth wrapper |
| `JSON.parse(raw)` assigned directly | `const parsed: unknown = JSON.parse(raw); const data = Schema.parse(parsed);` |
| `items.reduce((acc: any, x) => ...)` | `items.reduce<Record<string, number>>((acc, x) => ..., {})` |

## 3. Next.js App Router Boundary Rules

- **Server Components**: Async by default; use `cache()` or `revalidateTag()` for deduplicated reads; never attach browser event listeners (`onClick`, `onChange`).
- **Client Components**: Keep state minimal; receive server-resolved initial data as serialized JSON-safe props (`Date` converted to ISO string or epoch ms).
- **Route Handlers**: Export named HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`), explicitly set `Content-Type`, and return `NextResponse.json(..., { status })`.
- **Caching**: Explicitly opt into `export const dynamic = 'force-dynamic'` or `revalidate` for user-specific routes so private data is never cached across users.

## 4. Database Migration Safety Gate

Before approving a migration SQL or Prisma/Drizzle diff:

1. **Destructive Drops**: `DROP TABLE`, `DROP COLUMN`, or `TRUNCATE` require verifying zero active code references and a prior backup snapshot.
2. **Column Type Changes**: `ALTER COLUMN TYPE` rewrites the table under an `ACCESS EXCLUSIVE` lock in PostgreSQL. Use a shadow column + backfill + rename instead.
3. **Foreign Keys on Large Tables**: Add with `NOT VALID` first, then run `ALTER TABLE ... VALIDATE CONSTRAINT ...` in a separate step so concurrent writes are not blocked during validation.
4. **Row-Level Security (RLS)**: Enable RLS on multi-tenant tables and verify policies cover `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
