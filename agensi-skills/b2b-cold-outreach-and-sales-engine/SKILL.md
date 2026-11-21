---
name: b2b-cold-outreach-and-sales-engine
description: Authors high-converting 4-stage B2B cold email sequences, prospect research briefs, objection handling scripts, and spam-trigger audits. Use when drafting outbound sales copy, auditing subject line deliverability, writing multi-touch follow-ups, or designing personalized value propositions.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for outreach validator script)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# B2B Cold Outreach and Sales Engine

Craft personalized, deliverable, and high-converting 4-stage B2B outbound email sequences, objection-handling scripts, and prospect research dossiers with zero spam-trigger penalties.

## When to Activate

- Drafting outbound cold sales sequences targeting B2B decision-makers.
- Personalizing value propositions based on prospect signals (recent funding, job postings, tech stack changes).
- Auditing email copy for deliverability risks, spam trigger words, and mobile preview clipping.
- Authoring polite, non-pushy follow-up cadences that provide incremental value instead of "just checking in".

## Step 1: Architect the 4-Stage Outreach Cadence

Never rely on a single email. Structure a 4-touch sequence spaced over 14 business days:

| Touchpoint | Timing | Focus & Objective | Why It Converts |
| :--- | :--- | :--- | :--- |
| **Touch 1: Signal & Observation** | Day 1 | Specific prospect observation + concise pain statement + low-friction CTA (< 90 words). | Establishes relevance and respects recipient time. |
| **Touch 2: Concrete Case Evidence** | Day 4 | 2-sentence client metric snippet proving outcome + single-click resource. | Anchors credibility with verifiable facts. |
| **Touch 3: Alternative Perspective** | Day 8 | Contrarian question regarding an industry shift or friction point. | Re-engages analytical buyers. |
| **Touch 4: Clean Breakaway** | Day 14 | Graceful close without guilt; invites them to reach out when timing aligns. | Triggers loss aversion and cleanses the pipeline. |

## Step 2: Subject Line and Deliverability Rules

Ensure emails reach the primary inbox rather than promotional or spam folders:

1. **Short Subject Lines**: Keep subject lines between 2 and 5 words (under 35 characters) using lowercase or sentence case (e.g. "quick question on team workflow").
2. **Zero Punctuation Gimmicks**: Avoid exclamation marks, dollar signs (`$`), ALL CAPS, or artificial `Re:` prefixes.
3. **Spam Trigger Avoidance**: Eliminate high-risk sales buzzwords ("guaranteed", "free trial", "100%", "act now", "make money").
4. **Single CTA**: Present exactly one low-commitment call to action (e.g. "Open to exploring how this works?" instead of asking for a 30-minute calendar lock).

## Step 3: Enforce Plaintext Focus and Mobile Formatting

- **Word Count Budget**: Body copy must remain strictly under 125 words per touchpoint.
- **Paragraph Spacing**: Restrict each paragraph to 1 or 2 sentences for rapid scanning on mobile screens.
- **Minimal Links**: Include at most one bare hyperlink or plain text domain to maintain high domain sender reputation.

## Step 4: Validate Outreach Copy and Sequences

Start from `templates/email-sequence.json` when composing a campaign, and run the bundled offline scanner against any `.json` or `.md` outreach file:

```bash
node scripts/validate-outreach-copy.mjs templates/email-sequence.json
node scripts/validate-outreach-copy.mjs path/to/campaign.json
```

The script verifies:
- Subject line character counts (< 40 characters) and word counts (< 6 words).
- Total email body word count (< 125 words per stage).
- Absence of recognized email spam-trigger keywords.
- Presence of an explicit opt-out or clean breakaway option.

## Verification Checklist

- [ ] Subject lines contain between 2 and 5 words without deceptive prefixes.
- [ ] Email body text stays under 125 words with short 1-2 sentence paragraphs.
- [ ] Exactly one low-friction call-to-action per email.
- [ ] Sequence includes a graceful breakaway touchpoint.
- [ ] `node scripts/validate-outreach-copy.mjs <file>` passes with exit code `0`.

## See It in Action (Demo)

### The Request

Write an initial cold email and follow-up touchpoint targeting VP of Engineering prospects at high-growth SaaS startups whose teams are adopting multi-agent coding tools.

### The Result

## Summary
Constructed a high-deliverability 2-touch cold sequence focused on engineering team velocity, referencing specific public repository friction, and utilizing a low-friction question CTA.

### Compiled Sequence (`templates/email-sequence.json`)

```json
{
  "campaign_name": "SaaS Engineering Agentic Workflow Outreach",
  "target_persona": "VP of Engineering / Head of Platform",
  "sequence": [
    {
      "step": 1,
      "day": 1,
      "subject": "developer workflow velocity",
      "body": "Hi {{first_name}},\n\nSaw your team recently open-sourced the new connector for your platform.\n\nMost engineering teams expanding with AI coding assistants run into unexpected PR review bottlenecks when junior engineers generate large diffs.\n\nWe put together an automated workflow checklist that cuts PR review cycle time by 40% without adding headcount.\n\nWorth sending over a 2-minute overview?",
      "cta": "Worth sending over a 2-minute overview?",
      "word_count": 62
    },
    {
      "step": 2,
      "day": 4,
      "subject": "developer workflow velocity",
      "body": "Hi {{first_name}},\n\nQuick metric follow-up: a peer SaaS team applied the checklist to their core repo and dropped unreviewed PR aging from 48 hours to 14 hours in their first sprint.\n\nOpen to taking a look at the workflow diagram?",
      "cta": "Open to taking a look at the workflow diagram?",
      "word_count": 41
    }
  ]
}
```

| Guardrail | Target Rule | Risk Prevented |
| :--- | :--- | :--- |
| Subject: 3 words | `developer workflow velocity` | Mobile notification clipping and spam flagging |
| Word count: 62 words | Under 125-word cap | Reader abandonment on mobile screens |
| Soft CTA | `Worth sending over a 2-minute overview?` | High friction calendar rejection |

## Next Steps
1. Run `node scripts/validate-outreach-copy.mjs templates/email-sequence.json` to verify zero spam penalties.
2. Load the sequence into your outbound sales platform (Smartlead, Instantly, or Apollo).
