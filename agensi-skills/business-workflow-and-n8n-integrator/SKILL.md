---
name: business-workflow-and-n8n-integrator
description: Architects production n8n, Zapier, Make, and webhook workflows with idempotency keys, dead-letter queues, exponential backoff, and strict payload contracts. Use when designing integration pipelines, auditing webhook consumers for replay attacks, mapping data schemas, or validating event schemas.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for workflow validator script)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Business Workflow and n8n Integrator

Architect, secure, and debug automated business integration workflows across n8n, Zapier, Make, and webhook-driven event pipelines with strict payload contracts and error isolation.

## When to Activate

- Designing automated workflows connecting webhooks, databases, CRMs, and messaging queues.
- Hardening webhook receivers against replay attacks, duplicate processing, and payload tampering.
- Structuring dead-letter queues (DLQ), automated retries with exponential backoff, and rate-limiting safeguards.
- Auditing integration payloads against strict RFC 8259 JSON contracts before writing to production datastores.

## Step 1: Enforce Idempotency and Deduplication

Every webhook ingestion endpoint must isolate against network retries and duplicate events by validating an `idempotency_key` or event ID:

1. **Idempotency Key Verification**: Check the incoming header `Idempotency-Key` or payload `event_id` against a short-term key-value store (e.g. Redis TTL 24h).
2. **Immediate Lock**: If the key is currently processing, return HTTP `409 Conflict` or queue the message.
3. **Cached Response**: If the key was already successfully completed, return the cached result payload with HTTP `200 OK` without re-executing side effects (like charging cards or dispatching emails).

## Step 2: Configure Retry and Dead-Letter Queue Logic

Follow the bounded exponential backoff pattern for downstream API rate limits and transient network blips:

- **Initial Delay**: 1 second.
- **Backoff Factor**: $2 \times \text{previous delay}$ with $\pm 20\%$ random jitter.
- **Maximum Retries**: 4 attempts (1s, 2s, 4s, 8s).
- **Dead-Letter Dispatch**: If attempt 4 fails, serialize the raw payload, error stack, and timestamp to a permanent dead-letter queue (DLQ) for human inspection. Do not discard failed events silently.

## Step 3: Implement Webhook Authentication Contracts

Never trust unauthenticated webhooks. Apply cryptographic verification:

- **HMAC SHA-256 Signatures**: Compute `HMAC-SHA256(secret, timestamp + "." + raw_body)` and perform constant-time comparison against the `X-Signature` header.
- **Timestamp Freshness**: Reject requests where the timestamp difference exceeds 300 seconds (5 minutes) to defeat replay attacks.

## Step 4: Validate Workflow Contracts

Start from `templates/workflow-contract.json` when defining an automated event contract, and run the bundled offline validator against any `.json` workflow definition or payload contract:

```bash
node scripts/validate-workflow-spec.mjs templates/workflow-contract.json
node scripts/validate-workflow-spec.mjs path/to/workflow-spec.json
```

The script verifies:
- Presence of required metadata: `workflow_id`, `trigger_type`, `idempotency_key_path`, and `retry_policy`.
- Valid schema for retry limits, timeout thresholds, and dead-letter routing destinations.
- Zero network calls and strict RFC 8259 JSON format.

## Verification Checklist

- [ ] Webhook triggers verify cryptographic signatures before executing downstream nodes.
- [ ] Idempotency keys prevent duplicate execution of state-mutating actions.
- [ ] Transient failures route through exponential backoff with a hard 4-attempt limit.
- [ ] Unrecoverable failures deposit into a dead-letter queue without silent data loss.
- [ ] `node scripts/validate-workflow-spec.mjs <file>` passes with exit code `0`.

## See It in Action (Demo)

### The Request

Design a webhook processing workflow specification for inbound Stripe checkout events that updates user subscription tiers in an internal database, sends a welcome email, and guarantees zero duplicate provisioning.

### The Result

## Summary
Created a hardened workflow specification enforcing Stripe signature validation, Redis-backed idempotency, bounded retry policies, and dead-letter queue isolation for downstream database failures.

### Compiled Specification (`templates/workflow-contract.json`)

```json
{
  "workflow_id": "stripe-checkout-provisioning-v1",
  "name": "Stripe Checkout Event Ingestion and Provisioning",
  "trigger": {
    "type": "webhook",
    "endpoint": "/api/webhooks/stripe",
    "auth": {
      "type": "hmac_sha256",
      "signature_header": "Stripe-Signature",
      "tolerance_seconds": 300
    }
  },
  "idempotency": {
    "enabled": true,
    "key_path": "payload.id",
    "storage": "redis",
    "ttl_seconds": 86400
  },
  "retry_policy": {
    "max_retries": 4,
    "initial_delay_ms": 1000,
    "backoff_multiplier": 2.0,
    "jitter": true,
    "dead_letter_target": "dlq-stripe-events"
  },
  "steps": [
    {
      "step_id": "verify_event",
      "action": "crypto.verify_stripe_signature"
    },
    {
      "step_id": "deduplicate_check",
      "action": "redis.acquire_idempotency_lock"
    },
    {
      "step_id": "update_database",
      "action": "postgres.update_user_tier"
    },
    {
      "step_id": "send_confirmation",
      "action": "resend.send_onboarding_email"
    }
  ]
}
```

| Guardrail | Target Rule | Risk Prevented |
| :--- | :--- | :--- |
| `tolerance_seconds: 300` | 5-minute freshness check | Malicious replay of old captured webhook packets |
| `key_path: "payload.id"` | Event ID deduplication | Double billing or duplicate account provisioning |
| `dead_letter_target` | Bounded retries to DLQ | Poison-pill events blocking worker queue pipelines |

## Next Steps
1. Run `node scripts/validate-workflow-spec.mjs templates/workflow-contract.json` to verify schema validity.
2. Import the specification into your n8n workflow or Node.js webhook consumer service.
