---
name: viral-short-form-video-hook-architect
description: Engineers high-retention 3-second hooks, visual pattern interrupts, pacing frameworks, and retention scripts for TikTok, YouTube Shorts, and Instagram Reels. Use when drafting video scripts, optimizing audience retention drop-offs, auditing script word density, or designing visual storyboards.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for video script validator script)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Viral Short-Form Video Hook Architect

Engineer 3-second opening hooks, visual pattern interrupts, pacing frameworks, and retention-maximized scripts for TikTok, YouTube Shorts, and Instagram Reels with concrete second-by-second execution blocks.

## When to Activate

- Drafting video scripts for technical concepts, software demos, or educational workflows on short-form video feeds.
- Engineering the initial 0s-3s window to defeat feed swipe-away behavior.
- Calibrating verbal pace (words-per-minute) and visual cut frequency (every 2.5 to 4.0 seconds).
- Auditing video scripts for audience drop-off risks, abstract jargon, or delayed payoff.

## Step 1: Craft the 3-Second Pattern Interrupt

The first three seconds dictate 80% of algorithm distribution. Select from three proven hook structures:

1. **The Contrarian Friction Hook**: Challenge common practice with a concrete consequence (e.g. "Stop writing manual API mocks; here is why your staging tests keep breaking").
2. **The Result-First Open**: Show the final working output or visual graph before explaining the mechanism.
3. **The High-Stakes Micro-Story**: Open directly in the middle of a failure or discovery (in media res).

## Step 2: Establish the Micro-Pacing Grid

Short-form algorithms reward average watch percentage. Structure scripts across bounded intervals:

| Time Interval | Phase | Visual Cue | Audio / Verbal Action |
| :--- | :--- | :--- | :--- |
| **0s - 3s** | Hook & Pattern Interrupt | High-contrast visual or terminal screenshot | Punchy, contrarian statement (< 14 words) |
| **3s - 12s** | Problem Agitation | Fast zoom on problem boundary | State why existing solutions fail |
| **12s - 35s** | Concrete Demonstration | Split screen: code snippet + terminal run | 3-step walkthrough showing the actual fix |
| **35s - 45s** | Synthesis & Targeted CTA | Clean static slide with single URL/tool name | Clear next step for interested viewers |

## Step 3: Enforce Word Density and Pacing Caps

- **Spoken Pacing**: Target between **130 and 155 words per minute** (approx. 2.2 to 2.5 words per second). Speeds above 165 wpm cause viewer fatigue; speeds below 120 wpm lead to feed swipe-away.
- **Visual Scene Cuts**: Every 2.5 to 4.0 seconds must introduce a camera angle shift, text overlay, zoom, or b-roll cut.
- **Zero Filler Intro**: Never begin with "Hey guys", "In this video", or product logos.

## Step 4: Validate Video Scripts

Start from `templates/video-script.json` when scripting a short-form video, and run the bundled offline validator against any `.json` or `.md` video script:

```bash
node scripts/validate-video-script.mjs templates/video-script.json
node scripts/validate-video-script.mjs path/to/script.json
```

The script verifies:
- Hook length (< 15 words) and target duration (< 3.5 seconds).
- Overall script word count matching the declared target runtime.
- Presence of explicit visual shot directions paired with spoken audio blocks.
- Absence of banned filler opening greetings.

## Verification Checklist

- [ ] Initial hook delivers value in under 15 words without greeting fluff.
- [ ] Every speaking segment pairs with an explicit visual cut or screen action.
- [ ] Average speaking rate remains between 130 and 160 words per minute.
- [ ] Final call-to-action directs to a single specific action.
- [ ] `node scripts/validate-video-script.mjs <file>` passes with exit code `0`.

## See It in Action (Demo)

### The Request

Script a 30-second technical short for TikTok and YouTube Shorts explaining how to prevent production database locks during PostgreSQL migrations.

### The Result

## Summary
Created a 30-second structured script pairing a contrarian hook on standard `CREATE INDEX` locks with split-screen visual cuts and a concrete `CONCURRENTLY` demonstration.

### Compiled Script (`templates/video-script.json`)

```json
{
  "title": "PostgreSQL Zero Downtime Index Creation",
  "target_duration_seconds": 30,
  "platform": "tiktok_shorts_reels",
  "hook": {
    "visual": "Close-up of a frozen production dashboard with red 504 gateway timeout alerts.",
    "spoken_text": "Running a standard CREATE INDEX query in Postgres can freeze your entire app.",
    "duration_seconds": 3.0,
    "word_count": 13
  },
  "scenes": [
    {
      "scene_id": 1,
      "timestamp": "0:03 - 0:10",
      "visual": "Terminal cursor highlighting a table lock icon.",
      "spoken_text": "Postgres takes an exclusive write lock while building the B-tree, queueing every incoming customer transaction until the query finishes."
    },
    {
      "scene_id": 2,
      "timestamp": "0:10 - 0:22",
      "visual": "Split screen showing CREATE INDEX CONCURRENTLY command running while live transactions pass.",
      "spoken_text": "Instead, always pass the CONCURRENTLY flag outside a transaction block. Postgres builds the index in the background without blocking writes."
    },
    {
      "scene_id": 3,
      "timestamp": "0:22 - 0:30",
      "visual": "Text card showing the complete SQL snippet with syntax highlighting.",
      "spoken_text": "Save this snippet before your next production schema migration, and check the description for the full checklist."
    }
  ],
  "total_words": 68
}
```

| Metric | Target | Actual Result |
| :--- | :--- | :--- |
| Hook Word Count | < 15 words | 13 words (0:00 - 0:03) |
| Total Script Words | 65 - 75 words (for 30s) | 68 words (~136 wpm) |
| Visual Scene Changes | Cut every 3-8s | 3 distinct visual setups |

## Next Steps
1. Run `node scripts/validate-video-script.mjs templates/video-script.json` to confirm pace and structure.
2. Record the voiceover and screencast according to the scene timestamps.
