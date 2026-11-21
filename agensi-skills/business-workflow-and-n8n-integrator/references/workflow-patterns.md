# Integration and Workflow Patterns Reference

This reference documents architectural patterns for business workflow automations across n8n, Zapier, Make, and webhook microservices.

## 1. Webhook Security and Ingestion Protocol

```mermaid
flowchart TD
    A[Inbound Webhook HTTP Request] --> B{Verify Signature & Timestamp}
    B -->|Invalid / Expired| C[Return 401 Unauthorized / Drop]
    B -->|Valid| D{Check Idempotency Key in Redis}
    D -->|Already Completed| E[Return Cached 200 OK]
    D -->|Currently In Progress| F[Return 409 Conflict / Wait]
    D -->|New Event| G[Lock Key & Execute Workflow Steps]
    G --> H{Step Succeeded?}
    H -->|Yes| I[Mark Key Completed & Return 200 OK]
    H -->|Transient Error| J[Exponential Backoff Retry <= 4 times]
    J --> H
    H -->|Fatal Error / Max Retries Exceeded| K[Write to Dead Letter Queue & Alert On-Call]
```

## 2. Standard Idempotency Key Headers

When publishing or receiving webhook events, standardize on one of these recognized header contracts:
- `Idempotency-Key: <uuid-v4>` (IETF Draft Standard)
- `X-Event-ID: <unique-provider-event-id>` (Provider-specific, e.g. Stripe `evt_1...`)

## 3. Safe Schema Mapping Rules

- **Strict Type Validation**: Always validate payload types before performing database writes. Convert incoming numeric strings to integers/floats explicitly.
- **Null Safety**: Map missing optional keys to `null` rather than omitting them or relying on `undefined`.
- **Secret Redaction**: Never pass raw authorization tokens, database connection strings, or full credit card numbers across log streams or unencrypted webhook payloads.
