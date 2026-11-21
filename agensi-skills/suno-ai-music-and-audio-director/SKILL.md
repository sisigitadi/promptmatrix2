---
name: suno-ai-music-and-audio-director
description: Directs Suno v6 and v5 generative music prompts with engine-tested genre tags, BPM, instrumentation, song structure markup, and character-budget verification. Use when authoring Suno style prompts, structuring verse-chorus-bridge sections, arranging vocal tags, or validating prompt lengths.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, and Open Agent Skills compatible runtimes (Node.js 18+ for Suno prompt validator script)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Suno AI Music and Audio Director

Direct generative music composition in Suno v6 and v5 using engine-tested style prompt tags, tempo/BPM parameters, instrumentation descriptors, and structural meta-tags under strict character budgets.

## When to Activate

- Authoring Suno v6/v5 style prompts under the 200-character input cap.
- Structuring full song lyrics with structural meta-tags (`[Verse]`, `[Pre-Chorus]`, `[Chorus]`, `[Guitar Solo]`, `[Outro]`).
- Arranging vocal styles (timbre, gender, register, backing vocals) and instrument dynamics.
- Auditing prompt payloads for syntax-breaking punctuation or unsupported genre labels.

## Step 1: Craft the Style Prompt Under Character Budget

Suno v6 limits the primary Style Prompt field to **200 characters**. Order tags from broadest genre to specific production texture:

1. **Primary Genre & Sub-Genre**: e.g. `Synthwave, Darksynth` or `Neo-Soul, Lo-Fi R&B`.
2. **Tempo & Rhythm**: e.g. `118 BPM, syncopated groove` or `92 BPM, half-time swing`.
3. **Key Instrumentation**: e.g. `analog Moog bassline, gated reverb snare, vintage arpeggiator`.
4. **Vocal Timbre**: e.g. `smooth male baritone, subtle tape saturation` or `instrumental`.

Example Style Prompt (142 characters):
`Synthwave, Darksynth, 118 BPM, heavy sidechain analog bass, 80s gated reverb drums, lush polyphonic pads, driving nocturnal arpeggio, male vocal`

## Step 2: Structure Lyrics with Section Meta-Tags

Organize the Lyrics field using square-bracketed structural directives that guide Suno's internal musical progression:

```text
[Intro - slow atmospheric synth swell, filtered 4-on-the-floor kick]

[Verse 1 - intimate, minimal bass and drums]
Neon reflections on the wet asphalt,
Another midnight run, nobody's fault.

[Pre-Chorus - rising arpeggios, building snare roll]
The headlights cut through the heavy rain,
Leaving behind the city pain.

[Chorus - explosive, wide stereo synths, vocal harmonies]
We run through the electric night,
Chasing shadows in the violet light.

[Guitar Solo - screaming retro 80s synth lead]

[Chorus - full energy, maximum dynamic peak]
We run through the electric night,
Chasing shadows in the violet light.

[Outro - fading arpeggios, tape delay decay]
[End]
```

## Step 3: Vocal and Instrumental Calibration

- **Vocal Delivery Tags**: Place performance tags directly in square brackets above lyrics: `[Whispered Vocals]`, `[Falsetto]`, `[Soulful Belting]`, `[Spoken Word]`.
- **Backing Harmonies**: Enclose backing layers in parentheses inside lines: `(chasing the light)`.
- **Pure Instrumental**: When composing instrumentals, leave the Lyrics field empty or place `[Instrumental]` in the lyrics block and append `instrumental` to the Style Prompt.

## Step 4: Validate Suno Prompt Payloads

Start from `templates/suno-prompt.json` when building a song prompt, and run the bundled offline validator against any `.json` or `.md` music prompt file:

```bash
node scripts/validate-suno-prompt.mjs templates/suno-prompt.json
node scripts/validate-suno-prompt.mjs path/to/song-prompt.json
```

The script verifies:
- Style prompt length strictly under 200 characters.
- Proper bracket formatting on all structural section tags.
- Presence of mandatory sections: `[Verse]`, `[Chorus]`, and `[Outro]`.
- Proper tempo (BPM) formatting if specified.

## Verification Checklist

- [ ] Style prompt contains genre, tempo, instruments, and stays under 200 characters.
- [ ] Lyrics utilize balanced structural meta-tags (`[Verse]`, `[Chorus]`, `[Outro]`).
- [ ] Backing vocals are formatted in parentheses inside lyric lines.
- [ ] `node scripts/validate-suno-prompt.mjs <file>` passes with exit code `0`.

## See It in Action (Demo)

### The Request

Draft a complete Suno v6 prompt for an energetic Japanese Cyberpunk City Pop track with female vocals, 124 BPM, and full song structure tags.

### The Result

## Summary
Formulated a compliant Suno v6 style prompt (166 characters) pairing vintage Japanese City Pop instrumentation with cyberpunk synth textures, accompanied by structured bilingual lyrics.

### Compiled Specification (`templates/suno-prompt.json`)

```json
{
  "title": "Tokyo Neon Midnight (City Pop x Cyberpunk)",
  "engine": "Suno v6",
  "style_prompt": "Japanese City Pop, Cyberpunk, 124 BPM, slap bass, brass stabs, shimmering electric piano, gated snare, bright female vocal, retro 80s Tokyo anime production",
  "style_char_count": 166,
  "structure": {
    "sections": [
      "[Intro - funk slap bass riff and brass stabs]",
      "[Verse 1]",
      "Raindrops glowing on the shinjuku street,",
      "Walking in rhythm to the midnight beat.",
      "[Pre-Chorus - rising synthesizer build]",
      "Before the sunrise washes the glow away,",
      "[Chorus - punchy brass, vocal harmonies, peak energy]",
      "Dancing under neon rain,",
      "Lost inside the Tokyo train,",
      "[Bridge - Rhodes piano solo with tape echo]",
      "[Chorus - full band, driving groove]",
      "Dancing under neon rain,",
      "[Outro - fading slap bass groove and saxophone]",
      "[Fade Out]",
      "[End]"
    ]
  }
}
```

| Guardrail | Target Rule | Risk Prevented |
| :--- | :--- | :--- |
| Style length: 166 chars | Under 200-char cap | Truncation of critical instruments by Suno tokenizer |
| Structural tags | `[Verse]`, `[Chorus]`, `[Outro]` | Monotonous repetition or premature song ending |
| Tempo: 124 BPM | Explicit BPM tag | Engine guessing inappropriate slow tempo |

## Next Steps
1. Run `node scripts/validate-suno-prompt.mjs templates/suno-prompt.json` to verify character budget compliance.
2. Copy the `style_prompt` into Suno v6 Custom Mode Style and the lyrics block into the Lyrics box.
