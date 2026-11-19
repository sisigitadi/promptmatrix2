---
name: owasp-api-and-cloud-security-auditor
description: Audits REST, GraphQL, and serverless APIs plus cloud configurations against OWASP API Security Top 10 and cloud hardening baselines. Use when reviewing authentication, BOLA/IDOR authorization, SSRF, CORS, TLS settings, secret handling, or running static security scans before production release.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for static risk scanner)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# OWASP API and Cloud Security Auditor

Evaluate API endpoints, server handlers, frontend HTML sinks, and cloud infrastructure configs against the OWASP API Security Top 10 (2023) and deterministic cloud hardening baselines.

## When to Activate

- Reviewing Route Handlers, Express/Fastify/Hono endpoints, GraphQL resolvers, or serverless functions before launch.
- Auditing authorization boundaries for Broken Object Level Authorization (BOLA/IDOR) and Broken Function Level Authorization (BFLA).
- Checking repositories for leaked API keys, wildcard CORS policies, disabled TLS verification, `eval(`, `new Function(`, or XSS sinks.
- Producing structured, reproducible security audit reports for engineering remediation.

## Step 1: Run the Static Risk Scanner

Scan target source directories or config files before manual review:

```bash
node scripts/scan-security-risks.mjs src/
```

To emit machine-readable JSON findings or fail on warnings as well as errors:

```bash
node scripts/scan-security-risks.mjs src/ --json
node scripts/scan-security-risks.mjs src/ --strict
```

The scanner flags:
- Hardcoded credential patterns (`sk-...`, `AKIA...`, `ghp_...`, `AIza...`, `xox...`, PEM private keys).
- Dynamic code execution (`eval(`, `new Function(`).
- Wildcard CORS headers or options (`Access-Control-Allow-Origin: *`, `origin: '*'`).
- Unsanitized React DOM sinks (`dangerouslySetInnerHTML`).
- Disabled TLS certificate verification (`rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED = '0'`).

## Step 2: Audit OWASP API Top 10 Controls

Walk through `references/owasp-cloud-security-checklist.md` and verify every public and internal endpoint:

1. **API1 BOLA / IDOR**: Every resource query (`findUnique`, `SELECT`, storage fetch) must scope by the authenticated `userId` or `tenantId` from the verified session token, never trusting a client-supplied owner ID alone.
2. **API2 Broken Authentication**: Verify JWT signature, `iss`, `aud`, `exp`, and algorithm allowlist; enforce rate limiting and lockout on login, OTP, and token refresh routes.
3. **API3 BOPLA (Mass Assignment & Data Exposure)**: Explicitly whitelist writable fields with Zod or DTO schemas and select explicit response columns so internal flags (`role`, `isAdmin`, `passwordHash`) are never returned or overwritten.
4. **API4 Resource Consumption**: Bound pagination (`limit <= 100`), request body sizes, upload bytes, and downstream timeouts.
5. **API5 BFLA**: Enforce role and permission checks inside each handler or server action rather than relying solely on UI hiding or edge middleware.
6. **API7 SSRF**: Validate outbound URLs against an allowlist of schemes (`https:`) and hosts; block loopback (`127.0.0.1`, `::1`), link-local metadata (`169.254.169.254`), and private RFC1918 CIDRs after DNS resolution.
7. **API8 Security Misconfiguration**: Lock CORS to explicit origins, enforce strict TLS verification, set `HttpOnly`/`Secure`/`SameSite` cookie flags, and strip stack traces from production error responses.

## Step 3: Verify Cloud IAM and Secret Hygiene

- Confirm cloud roles follow least privilege with explicit resource ARNs/IDs rather than wildcard `*` actions or resources.
- Ensure object storage buckets block public ACLs and enforce encryption at rest unless explicitly configured as public CDN assets.
- Replace long-lived static cloud keys in CI with short-lived OIDC workload identity federation.
- Rotate any credential that ever appeared in Git history; removing a key in a later commit does not revoke exposure.

## Step 4: Emit Structured Audit Findings

Record confirmed vulnerabilities and remediation steps using the schema in `templates/security-audit-findings.json`. Group items by severity (`critical`, `high`, `medium`, `low`), include exact `file` and `line` pointers, map each item to its `owaspCategory`, and provide a minimal patch or configuration fix.

## Verification Checklist

- [ ] `node scripts/scan-security-risks.mjs <target>` exits `0` with zero unresolved high/critical findings.
- [ ] Every endpoint enforces authentication, object-level ownership (BOLA), and function-level roles (BFLA).
- [ ] Outbound HTTP fetchers validate target hosts and block private/metadata IP ranges (SSRF).
- [ ] CORS origins are explicitly allowlisted and TLS certificate validation remains enabled everywhere.
- [ ] Audit output conforms to `templates/security-audit-findings.json` with reproducible evidence.

## See It in Action (Demo)

### The Request

Audit this Express endpoint for OWASP API Top 10 risks and return structured findings: `app.get('/api/invoices/:id', async (req, res) => { const inv = await prisma.invoice.findUnique({ where: { id: req.params.id } }); res.setHeader('Access-Control-Allow-Origin', '*'); return res.json(inv); });`

### The Result

## Summary
Audited `GET /api/invoices/:id` against OWASP API Top 10 (2023) and flagged 3 vulnerabilities: missing tenant scoping (API1 BOLA), unprojected database response (API3 BOPLA), and wildcard CORS (API8).

### Structured Audit Findings (`templates/security-audit-findings.json` format)

```json
{
  "summary": { "critical": 0, "high": 2, "medium": 1, "low": 0, "status": "action-required" },
  "findings": [
    {
      "ruleId": "OWASP-API1-BOLA",
      "owaspCategory": "API1:2023 Broken Object Level Authorization",
      "severity": "high",
      "file": "src/routes/invoices.ts",
      "line": 1,
      "evidence": "prisma.invoice.findUnique({ where: { id: req.params.id } })",
      "remediation": "Require verified session and scope query with tenantId: session.tenantId."
    },
    {
      "ruleId": "OWASP-API3-BOPLA",
      "owaspCategory": "API3:2023 Broken Object Property Level Authorization",
      "severity": "high",
      "file": "src/routes/invoices.ts",
      "line": 1,
      "evidence": "return res.json(inv)",
      "remediation": "Add explicit Prisma select projection for public invoice fields only."
    },
    {
      "ruleId": "OWASP-API8-CORS",
      "owaspCategory": "API8:2023 Security Misconfiguration",
      "severity": "medium",
      "file": "src/routes/invoices.ts",
      "line": 1,
      "evidence": "Access-Control-Allow-Origin: *",
      "remediation": "Restrict Origin header to an explicit allowlist of trusted origins."
    }
  ]
}
```

## Next Steps
1. Run `node scripts/scan-security-risks.mjs src/ --strict` after applying tenant scoping, explicit `select` fields, and CORS allowlisting.
2. Add an authorization test confirming cross-tenant requests to `/api/invoices/:id` return `404` or `403`.
