---
name: multimodal-video-image-director
description: Compiles structured, model-native prompts for Midjourney v7, FLUX.2 Kontext, Google Veo 3, Kling 2.1, OpenAI Sora 2, and Suno v4.5/v5. Use when directing AI image generation, multi-reference character edits, synchronized audio-video shots, camera motion scripts, or multi-stem music arrangements.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills compatible runtimes
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Multimodal Video, Image, and Audio Director

Translate creative briefs into exact, model-native shot specifications without generic quality-tag spam ("8k masterpiece hyperrealistic"). Match syntax, parameter flags, camera physics, and audio cues to the target late-2026 generator.

## When to Activate

- Drafting image generation or precision image-editing prompts for **Midjourney v7** or **FLUX.2 Kontext**.
- Directing video shots, camera choreography, and lip-synced/ambient audio for **Veo 3**, **Kling 2.1**, or **Sora 2**.
- Compiling structured song arrangement prompts and vocal/instrumental stems for **Suno v4.5 / v5**.

## Step 1: Identify Target Model and Deliverable Mode

Consult `references/model-syntax-matrix.md` for exact flags, aspect ratios, and parameter ranges.

| Modality | Target Engine | Core Control Lever |
| :--- | :--- | :--- |
| Photoreal / Editorial Stills | **Midjourney v7** | `--ar`, `--sref`, `--oref` (omni-reference), `--ow`, `--stylize`, `--raw` |
| Instruction-Based Image Edit | **FLUX.2 Kontext** | Surgical preservation clauses ("keep X unchanged, modify only Y") |
| Synced Audio-Video Shots | **Google Veo 3** | Subject action + camera move + explicit ambient/dialogue audio cues |
| Physics & Brush-Guided Motion | **Kling 2.1** | Motion trajectory vectors, brush-region isolation, speed curves |
| Multi-Shot Narrative Continuity | **OpenAI Sora 2** | Shot list with consistent seed/wardrobe/lighting anchors across cuts |
| Studio Song & Stem Production | **Suno v4.5 / v5** | Metatag arrangement (`[Intro]`, `[Verse]`, `[Chorus]`), BPM, key, vocal timbre |

## Step 2: Compile Image Prompts (Midjourney v7 & FLUX.2 Kontext)

### Midjourney v7 Formula
Build prompts in five crisp clauses separated by commas, ending with native flags:

`[Subject & Pose] + [Environment & Props] + [Lens & Framing] + [Lighting & Color Palette] + [Material Texture] --ar W:H --v 7`

Rules:
- Use `--oref <url> --ow <0-1000>` for character or object consistency across shots, and `--sref <url> --sw <0-1000>` for style locking.
- Add `--raw` when strict photographic realism without editorial beautification is required.
- Avoid contradictory lighting terms or filler quality adjectives.

### FLUX.2 Kontext Editing Formula
Describe **only the delta** and explicitly anchor what must stay invariant:

`"In the provided scene, replace [specific element] with [exact target], matching the existing [direction/color temperature] key light and perspective. Preserve the subject's face, pose, clothing folds, and background architecture unchanged."`

## Step 3: Direct Video Shots (Veo 3, Kling 2.1, Sora 2)

Structure every video prompt as a **4-part shot sheet** sized to a 4s to 10s clip:

1. **Camera & Lens**: Focal length (`35mm`, `85mm`), movement (`slow dolly-in`, `handheld tracking`, `locked tripod`), and framing (`medium close-up`).
2. **Primary Motion**: One clear physical action with velocity ("walks calmly toward the window and sets down a ceramic cup") instead of stacking five simultaneous actions.
3. **Environment & Lighting Continuity**: Time of day, practical light sources, atmospheric motion (rain streaks, dust motes, fabric sway).
4. **Audio Layer (Veo 3 / Sora 2)**: Specify dialogue in quotes with speaker tone, plus foreground SFX and room tone ("Soft footsteps on oak floorboards, distant rain against glass, warm baritone voice saying: 'We ship at dawn.'").

For **Kling 2.1**, append explicit motion isolation notes: specify which foreground mask moves along a trajectory and which background regions remain static. For **Sora 2** multi-shot sequences, lock a shared `[Continuity Bible]` header (character wardrobe, hex/color palette, lens family, time of day) above Shot 1, Shot 2, and Shot 3.

## Step 4: Arrange Audio Prompts (Suno v4.5 / v5)

Separate **Style Header** (under 200 characters: genre, sub-genre, BPM, key, instrumentation, vocal delivery, mix texture) from **Structured Lyrics**:

- Use bracketed section tags: `[Intro: muted Rhodes chords, vinyl crackle]`, `[Verse 1: intimate dry vocal]`, `[Chorus: wide stereo synth bass, layered harmonies]`, `[Bridge]`, `[Outro: tape stop]`.
- Keep line syllable counts rhythmic and consistent within verses.
- Never place artist names in the Style Header; describe acoustic instruments, era, and production techniques instead.

## Verification Checklist

- [ ] Prompt uses syntax valid for the declared model version (no legacy `--v 5` flags on v7 or missing audio layer on Veo 3).
- [ ] Every video shot restricts primary action to 1 to 2 coherent physical beats so temporal physics stay stable.
- [ ] Character and wardrobe anchors are repeated verbatim across multi-shot Sora 2 or Midjourney `--oref` sequences.
- [ ] Zero banned slop phrases or artist-name copyright triggers appear in generated outputs.
