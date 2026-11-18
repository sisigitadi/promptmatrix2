# OWASP API and Cloud Security Checklist

## 1. OWASP API Security Top 10 (2023) Matrix

| ID | Risk | Concrete Verification Check | Standard Remediation |
| :--- | :--- | :--- | :--- |
| API1 | Broken Object Level Authorization | Does `GET/PATCH/DELETE /items/:id` verify `item.tenantId === session.tenantId`? | Scope every query with `WHERE id = $1 AND tenant_id = $2`. |
| API2 | Broken Authentication | Are JWT `alg`, `iss`, `aud`, and `exp` validated? Are auth endpoints rate-limited? | Pin allowed algorithms (e.g. `RS256`/`EdDSA`), reject `none`, enforce per-IP and per-account throttling. |
| API3 | Broken Object Property Level Auth | Can a client send `{"role": "admin"}` in a profile update payload? | Parse request bodies with strict schemas (`.strict()`), reject unknown keys, project explicit output fields. |
| API4 | Unrestricted Resource Consumption | Are `limit`, `pageSize`, upload size, and upstream timeouts bounded? | Cap page size (`<= 100`), enforce body byte limits, set explicit `AbortSignal.timeout(...)`. |
| API5 | Broken Function Level Authorization | Are `/admin/*` and privileged mutations guarded by explicit RBAC checks inside the handler? | Assert `hasPermission(session, 'resource:action')` inside every route handler and server action. |
| API6 | Unrestricted Access to Sensitive Business Flows | Can automated bots abuse signup, coupon redemption, checkout, or AI inference endpoints? | Add per-user quotas, idempotency keys, and abuse/bot throttling on sensitive flows. |
| API7 | Server-Side Request Forgery (SSRF) | Does the server fetch user-supplied URLs (webhooks, avatars, previews)? | Allowlist `https:`, resolve DNS, block `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, and disable automatic cross-host redirects. |
| API8 | Security Misconfiguration | Are CORS origins wildcard `*`, TLS verification disabled, or debug traces exposed? | Use an explicit origin allowlist, keep `rejectUnauthorized: true`, return generic error IDs in production. |
| API9 | Improper Inventory Management | Are deprecated `/v1/` endpoints, staging hosts, or undocumented routes still reachable? | Maintain an OpenAPI inventory, sunset old versions with explicit dates, disable unused debug routes. |
| API10 | Unsafe Consumption of APIs | Does the backend trust third-party webhook payloads or responses without validation? | Verify HMAC webhook signatures with constant-time comparison and validate external JSON with schemas. |

## 2. Cloud IAM, Storage, and Network Hardening

1. **IAM Least Privilege**: Avoid `"Action": "*"` or `"Resource": "*"` in IAM policies. Scope permissions to exact service actions and resource prefixes.
2. **Public Access Prevention**: Enable account-level and bucket-level public access block on object storage (S3, GCS, R2) for private data buckets.
3. **Encryption**: Enforce TLS 1.2+ in transit and KMS/AES-256 encryption at rest for databases, object buckets, and backups.
4. **Secrets Management**: Store API keys and database credentials in a dedicated secret manager or encrypted runtime environment, never in source files or client-side bundles (`NEXT_PUBLIC_*`, `VITE_*`).
5. **Egress Controls**: Restrict database and internal microservice security groups so only application subnets can reach data stores on explicit ports.

## 3. Browser and Transport Security Headers

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: disallow inline script execution (`script-src 'self'`) and unsafe dynamic evaluation unless strictly required with nonces.
