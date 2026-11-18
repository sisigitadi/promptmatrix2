---
name: multimodal-video-image-director
description: Compiles structured, model-native prompts for Midjourney v8.2, FLUX.3 / FLUX.2, Google Veo 3.1, Kling 3.0, Runway Gen-4.5, and Suno v6. Use when directing AI image generation, multi-reference character edits, synchronized audio-video shots, camera motion scripts, or multi-stem music arrangements.
license: MIT
compatibility: Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, and Open Agent Skills compatible runtimes (Node.js 18+ for parameter validator)
metadata:
  author: "Sigit Adi (PromptMatrix)"
  version: "1.0.0"
---

# Multimodal Video, Image, and Audio Director

Translate creative briefs into exact, model-native shot specifications without generic quality-tag spam ("8k masterpiece hyperrealistic"). Match syntax, parameter flags, camera physics, shot durations, and audio cues to the target generator.

## When to Activate

- Drafting image generation or precision image-editing prompts for **Midjourney v8.2** or **FLUX.3 / FLUX.2**.
- Directing video shots, camera choreography, and lip-synced or ambient audio for **Google Veo 3.1**, **Kling 3.0**, or **Runway Gen-4.5**.
- Compiling structured song arrangement prompts and vocal/instrumental stems for **Suno v6**.

## Step 1: Identify Target Model and Deliverable Mode

Consult `references/model-syntax-matrix.md` for exact flags, aspect ratios, duration bounds, and parameter ranges.

| Modality | Target Engine | Core Control Lever |
| :--- | :--- | :--- |
| Photoreal / Editorial Stills | **Midjourney v8.2** | `--ar`, `--sref`, `--oref` (omni-reference), `--ow`, `--stylize`, `--raw` |
| Generation & Instruction Image Edit | **FLUX.3 / FLUX.2** | Spatial anchors, typography quotes, preservation clauses ("keep X unchanged, modify only Y") |
| Synced Audio-Video Shots | **Google Veo 3.1** | Subject action + camera move + explicit ambient/dialogue audio cues (`4s` to `16s`) |
| Physics & Brush-Guided Motion | **Kling 3.0** | Motion trajectory vectors, brush-region isolation, speed curves (`4s` to `16s`) |
| Multi-Shot Narrative Continuity | **Runway Gen-4.5** | Shot list with consistent seed/wardrobe/lighting anchors and camera rig paths (`4s` to `16s`) |
| Studio Song & Stem Production | **Suno v6** | Style Header (`<= 200` chars) + bracketed section tags (`[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]`) |

## Step 2: Compile Image Prompts (Midjourney v8.2 & FLUX.3 / FLUX.2)

### Midjourney v8.2 Formula
Build prompts in five crisp clauses separated by commas, ending with native flags:

`[Subject & Pose] + [Environment & Props] + [Lens & Framing] + [Lighting & Color Palette] + [Material Texture] --ar W:H --v 8.2`

Rules:
- Use `--ar W:H` with positive integers (such as `--ar 16:9`, `--ar 4:5`, `--ar 1:1`, `--ar 9:16`).
- Do not combine `--v 8.2` with `--niji` in the same prompt; choose one model selector.
- Keep `--stylize <0-1000>`, `--ow <0-1000>` (paired with `--oref <url>`), and `--sw <0-1000>` (paired with `--sref <url>`) strictly within `0` to `1000`.
- Add `--raw` when strict photographic realism without editorial beautification is required.
- Avoid contradictory lighting terms or filler quality adjectives.

### FLUX.3 / FLUX.2 Generation & Editing Formula
For **FLUX.3** stills, state subject, spatial layout, physical lighting direction, material detail, and exact quoted typography in direct natural language without Midjourney `--` flags.

For **FLUX.2** instruction-based edits, describe **only the delta** and explicitly anchor what must stay invariant:

`"In the provided scene, replace [specific element] with [exact target], matching the existing [direction/color temperature] key light and perspective. Preserve the subject's face, pose, clothing folds, and background architecture unchanged."`

## Step 3: Direct Video Shots (Google Veo 3.1, Kling 3.0, Runway Gen-4.5)

Structure every video prompt as a **4-part shot sheet** sized to a **4s to 16s** clip (`4s` minimum, `16s` maximum):

1. **Camera & Lens**: Focal length (`35mm`, `85mm`), movement (`slow dolly-in`, `handheld tracking`, `locked tripod`), and framing (`medium close-up`).
2. **Primary Motion**: One clear physical action with velocity ("walks calmly toward the window and sets down a ceramic cup") instead of stacking five simultaneous actions.
3. **Environment & Lighting Continuity**: Time of day, practical light sources, atmospheric motion (rain streaks, dust motes, fabric sway).
4. **Audio Layer (Google Veo 3.1 / Runway Gen-4.5)**: Specify dialogue in quotes with speaker tone, plus foreground SFX and room tone ("Soft footsteps on oak floorboards, distant rain against glass, warm baritone voice saying: 'We ship at dawn.'").

Model-specific directives:
- **Google Veo 3.1**: Keep single-beat clips in the `4s` to `16s` window (typically `6s` to `10s`) with explicit spoken dialogue, foley, and room-tone separation.
- **Kling 3.0**: Append explicit motion isolation notes (`[Motion Mask 1]`, `[Motion Mask 2]`): specify which foreground mask moves along a trajectory and which background regions remain static within a `4s` to `16s` duration.
- **Runway Gen-4.5**: For multi-shot sequences, lock a shared `[Continuity Bible]` header (character wardrobe, hex/color palette, lens family, time of day) above Shot 1, Shot 2, and Shot 3, keeping every shot span within `4s` to `16s`.

## Step 4: Arrange Audio Prompts (Suno v6)

Separate **Style Header** (`<= 200` characters: primary genre, sub-genre, BPM, key, instrumentation, vocal delivery, mix texture) from **Structured Lyrics**:

- Use bracketed section tags: `[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]` (with optional modifiers such as `[Intro: muted Rhodes chords, vinyl crackle]`, `[Verse 1: intimate dry vocal]`, `[Chorus: wide stereo synth bass, layered harmonies]`, `[Bridge]`, `[Outro: tape stop]`).
- Keep line syllable counts rhythmic and consistent within verses.
- Never place artist names in the Style Header; describe acoustic instruments, era, and production techniques instead.

## Step 5: Validate Prompt Parameters

Run the bundled parameter validator before finalizing or shipping any prompt artifact:

```bash
node scripts/validate-multimodal-params.mjs <prompt-file>
```

You can also run built-in regression checks with:

```bash
node scripts/validate-multimodal-params.mjs --self-test
```

## Verification Checklist

- [ ] `node scripts/validate-multimodal-params.mjs <prompt-file>` exits `0` with zero parameter errors.
- [ ] Midjourney prompts use `--v 8.2` (without conflicting `--niji`), valid `--ar W:H`, and weights (`--stylize`, `--ow`, `--sw`) within `0` to `1000`.
- [ ] Video shots for Google Veo 3.1, Kling 3.0, and Runway Gen-4.5 stay within `4s` to `16s` and restrict primary action to 1 to 2 coherent physical beats.
- [ ] Suno v6 Style Headers stay at or below 200 characters and lyrics include bracketed section tags (`[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]`).
- [ ] Character and wardrobe anchors are repeated verbatim across Runway Gen-4.5 or Midjourney `--oref` sequences.
- [ ] Zero banned slop phrases or artist-name copyright triggers appear in generated outputs.
