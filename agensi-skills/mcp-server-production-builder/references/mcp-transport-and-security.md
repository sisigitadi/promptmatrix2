# MCP Transport and Security Reference

## 1. `stdio` vs `Streamable HTTP` Decision Matrix

| Criteria | `stdio` Transport | `Streamable HTTP` Transport |
| :--- | :--- | :--- |
| Deployment | Local developer machine (spawned by client) | Remote service / container / multi-user cloud |
| Auth Model | OS user + local env vars | OAuth 2.1 / scoped Bearer token + TLS |
| Logging | `stderr` only (`stdout` is JSON-RPC) | Structured JSON logger (stdout/OTLP) |
| Session State | Process lifetime | `Mcp-Session-Id` header or stateless per-request |
| Timeout Risk | Long tasks block stdio queue | Supports progress notifications and SSE streaming |

## 2. Production Tool Definition Example (JSON Schema)

```json
{
  "tools": [
    {
      "name": "query_audit_logs",
      "description": "Search workspace audit events within an ISO-8601 time window. Returns up to 100 matching records.",
      "annotations": {
        "readOnlyHint": true,
        "destructiveHint": false,
        "idempotentHint": true,
        "openWorldHint": false
      },
      "inputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["since", "limit"],
        "properties": {
          "since": {
            "type": "string",
            "format": "date-time",
            "description": "Inclusive ISO-8601 UTC start timestamp."
          },
          "actor_email": {
            "type": "string",
            "maxLength": 254,
            "description": "Optional exact actor email filter."
          },
          "limit": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "default": 25,
            "description": "Maximum records to return."
          }
        }
      }
    }
  ]
}
```

## 3. Secret Redaction Filter Pattern

Apply before returning tool errors or writing diagnostic logs:

```typescript
const SECRET_PATTERNS: RegExp[] = [
  /Bearer\s+[A-Za-z0-9._-]+/gi,
  /\b(sk|pk|rk)_[a-zA-Z0-9]{16,}\b/g,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /\bAIza[0-9A-Za-z_-]{30,}\b/g,
  /(password|secret|token|api_key)\s*[:=]\s*["']?[^\s"']+/gi,
];

export function redactSecrets(input: string): string {
  return SECRET_PATTERNS.reduce((acc, pattern) => acc.replace(pattern, '[REDACTED]'), input);
}
```

## 4. Security Hardening Checklist

- **Origin Validation**: For local HTTP servers (`127.0.0.1`), reject requests whose `Origin` header is not explicitly allowed.
- **SSRF Guard**: Block private IPv4/IPv6 ranges (`127.0.0.0/8`, `10.0.0.0/8`, `169.254.0.0/16`, `172.16.0.0/12`, `192.168.0.0/16`, `::1`) before fetching user-supplied URLs.
- **Payload Caps**: Truncate large responses (for example > 50 KB) with pagination cursors so one tool call does not exhaust the host model's context window.
- **Rate Limiting**: Enforce per-session token bucket limits on write or external-API tools.
