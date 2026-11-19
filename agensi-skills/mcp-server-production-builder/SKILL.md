---
name: mcp-server-production-builder
description: Designs and hardens Model Context Protocol (MCP) servers with strict Zod and JSON Schema tool contracts, stdio and Streamable HTTP transports, OAuth2/bearer boundary checks, and secret sanitization. Use when building an MCP server, defining MCP tool schemas, migrating SSE transports to Streamable HTTP, or auditing tool handlers for prompt/command injection.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for schema validator)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# MCP Server Production Builder

Build resilient, security-hardened Model Context Protocol (MCP) servers with deterministic tool schemas, clean transport isolation, and strict secret redaction.

## When to Activate

- Designing a new MCP server in TypeScript or Python exposing tools, resources, or prompts.
- Defining `inputSchema` and `outputSchema` JSON Schemas or Zod definitions for MCP tools.
- Configuring `stdio` local transports or remote `Streamable HTTP` transports with authentication.
- Hardening tool execution against path traversal, shell injection, SSRF, and accidental secret leakage in logs or tool responses.

## Step 1: Design Narrow, Composable Tool Contracts

Avoid exposing one giant "do_everything" tool or raw SQL/shell passthrough tools. Follow these schema rules:

1. **Naming**: Use lowercase snake_case (`[a-z0-9_]{1,64}`), verb-first names such as `search_issues`, `get_invoice`, `create_draft_pr`.
2. **Annotations**: Declare MCP tool behavior annotations accurately (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) so host clients prompt users appropriately.
3. **Strict Inputs**: Set `additionalProperties: false` on every `inputSchema` object. Constrain strings with `minLength`, `maxLength`, `enum`, or `pattern`.
4. **Actionable Descriptions**: State what the tool does, what inputs it requires, and what failure conditions return. Never embed instructions targeting unrelated tools.

## Step 2: Choose and Secure the Transport

Consult `references/mcp-transport-and-security.md` for full transport patterns.

- **Local CLI Agents (`stdio`)**:
  - Reserve `stdout` exclusively for JSON-RPC frames. Write ALL logs, warnings, and debug output to `stderr` (`console.error`). Writing a single stray `console.log` corrupts the MCP protocol stream.
  - Validate environment variables at startup and fail fast on `stderr` if required credentials are missing.
- **Remote Services (`Streamable HTTP`)**:
  - Implement `/mcp` handling `POST` (JSON-RPC requests), `GET` (optional SSE stream), and `DELETE` (session termination) per the MCP Streamable HTTP specification.
  - Validate `Origin` headers to prevent DNS rebinding attacks when binding to localhost.
  - Require OAuth 2.1 / Bearer token verification on every request; bind user/tenant permissions on the server side, never via a client-supplied `user_id` tool argument.

## Step 3: Sanitize Errors, Paths, and Secrets

Every tool handler must wrap execution in structured error handling:

1. **Path Normalization**: Resolve file paths with `path.resolve()` and verify `resolved.startsWith(allowedRoot + path.sep)` before reading or writing.
2. **No Shell Interpolation**: Use `execFile(cmd, argsArray)` instead of `exec(string)` to block command injection.
3. **Secret Redaction**: Pass all error messages, stack traces, and upstream HTTP bodies through a redaction filter (`sk-...`, `ghp_...`, `Bearer ...`, `Authorization` headers) before returning `content` or writing `stderr`.
4. **Structured Tool Errors**: Return `{ isError: true, content: [{ type: "text", text: "..." }] }` with a clear remediation hint rather than crashing the MCP server process.

## Step 4: Validate MCP Tool Schemas

Validate any tool manifest JSON or exported `tools/list` payload before publishing:

```bash
node scripts/validate-mcp-schema.mjs path/to/tools.json
```

The validator checks:
- Top-level `tools` array (or single tool object) parses cleanly.
- Every tool has a valid `name` (`^[a-zA-Z0-9_-]{1,64}$`), non-empty `description`, and `inputSchema` object with `type: "object"`.
- Every key listed in `required` exists inside `properties`.
- `additionalProperties` is explicitly defined (warns or errors if omitted in `--strict` mode).
- Descriptions and schema defaults contain no leaked secret patterns.

## Verification Checklist

- [ ] `stdout` is 100% clean of `console.log` in `stdio` servers.
- [ ] All tools enforce `additionalProperties: false` and explicit `required` arrays.
- [ ] File and URL inputs are validated against allowlists / root boundaries.
- [ ] `node scripts/validate-mcp-schema.mjs <schema.json> --strict` exits `0`.

## See It in Action (Demo)

### The Request

Design a hardened stdio MCP tool contract and handler for reading workspace markdown docs without path traversal, stdout corruption, or leaked tokens in error output.

### The Result

## Summary
Defined the `read_workspace_doc` MCP tool schema with `additionalProperties: false` and `readOnlyHint: true`, paired with a `stdio`-safe handler that enforces root-path containment and secret redaction.

### Tool Schema (`tools.json`)

```json
{
  "tools": [
    {
      "name": "read_workspace_doc",
      "description": "Read a UTF-8 markdown file inside the approved docs directory. Rejects traversal paths outside docs/.",
      "annotations": { "readOnlyHint": true, "destructiveHint": false, "idempotentHint": true, "openWorldHint": false },
      "inputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["relativePath"],
        "properties": {
          "relativePath": { "type": "string", "minLength": 1, "maxLength": 180, "pattern": "^[a-zA-Z0-9/_.-]+\\.md$" }
        }
      }
    }
  ]
}
```

### Handler Guardrails (`src/tools/readDoc.ts`)

```typescript
const DOCS_ROOT = path.resolve(process.cwd(), 'docs');

export async function handleReadDoc(relativePath: string) {
  const target = path.resolve(DOCS_ROOT, relativePath);
  if (!target.startsWith(DOCS_ROOT + path.sep)) {
    console.error('[mcp] blocked traversal attempt');
    return { isError: true, content: [{ type: 'text', text: 'Path must stay inside docs/.' }] };
  }
  const body = await fs.readFile(target, 'utf8');
  return { content: [{ type: 'text', text: redactSecrets(body) }] };
}
```

## Next Steps
1. Run `node scripts/validate-mcp-schema.mjs tools.json --strict` to verify schema compliance and zero leaked tokens.
2. Test `../../.env` against `handleReadDoc` and confirm logs go to `stderr` only so `stdout` carries pure JSON-RPC frames.
