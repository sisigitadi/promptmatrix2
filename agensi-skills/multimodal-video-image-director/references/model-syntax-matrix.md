# Multimodal Model Syntax Matrix

Reference guide for compiling model-accurate parameters across image, video, and audio generators. Validate compiled prompt files with `node scripts/validate-multimodal-params.mjs <prompt-file>`.

## 1. Image Generators

### Midjourney v8.2
- **Core Flags**:
  - `--v 8.2` (target v8.2 model; do not combine with `--niji`)
  - `--ar W:H` such as `16:9`, `4:5`, `1:1`, `9:16` (positive integer ratio)
  - `--raw` (reduced default stylization for documentary/photographic control)
  - `--stylize <0-1000>` (`100` default; lower for literal prompt adherence, `250-500` for stronger aesthetic interpretation)
  - `--oref <image_url>` + `--ow <0-1000>` (Omni-Reference for consistent characters, products, or props)
  - `--sref <image_url>` + `--sw <0-1000>` (Style Reference weight)
  - `--no <term1, term2>` (negative exclusions; avoid listing what you want)

### FLUX.3 / FLUX.2
- **FLUX.3 (Generation)**: Natural-language scene composition, lens/lighting physics, and exact quoted strings for embedded typography. Avoid Midjourney `--` flags.
- **FLUX.2 (Instruction Editing)**: Natural-language edit directive + explicit invariance clause.
- **Best Practices**:
  - Name the exact spatial anchor (`"on the left wooden shelf"`, `"the jacket worn by the foreground runner"`).
  - Explicitly state lighting and material match (`"cast soft warm bounce light onto the table surface"`).
  - For typography edits, wrap exact target text in double quotes and state font style (`"replace the storefront sign text with 'Kopi Nusantara' in clean cream sans-serif lettering"`).

## 2. Video Generators

| Parameter | Google Veo 3.1 | Kling 3.0 | Runway Gen-4.5 |
| :--- | :--- | :--- | :--- |
| Native Audio | Synchronized SFX, ambience, and spoken dialogue | External audio or optional ambient sync | Scene audio, foley cues, and ambient beds |
| Shot Duration | `4s` to `16s` (optimal `6s` to `10s` single beat) | `4s` to `16s` physics-guided clip | `4s` to `16s` single or multi-cut storyboard |
| Motion Control | Natural-language camera verb + subject pacing | Motion Brush region masks + camera pan/tilt/zoom | Camera rig path + timestamped beats (`0s-6s`, `6s-12s`) |
| Continuity | Repeat lighting + wardrobe descriptors | Start/End keyframe image anchors | Shared Continuity Bible + character reference |

### Google Veo 3.1 Prompt Skeleton
```text
Duration: 8s
[Shot & Camera]: Medium 50mm shot, smooth eye-level tracking left-to-right.
[Subject & Action]: A ceramicist shapes wet stoneware clay on a spinning wheel, hands dusted with slip.
[Environment & Lighting]: Morning sunbeams cutting through dusty workshop windows, warm tungsten practical lamp behind.
[Audio]: Steady rhythmic hum of the pottery wheel, soft wet clay friction, birds chirping outside an open window. No background music.
```

### Kling 3.0 Motion Brush Specification
```text
Duration: 10s
[Base Scene]: Static coastal cliff overlooking dark ocean swells at blue hour.
[Motion Mask 1 - Foreground Grass]: Gentle sway left-to-right at low velocity (speed: 2/5).
[Motion Mask 2 - Ocean Waves]: Rolling surf crashing against rocks toward shore (speed: 4/5).
[Camera]: Slow push-in, 35mm wide lens, horizon locked level.
```

### Runway Gen-4.5 Multi-Shot Skeleton
```text
Duration: 8s
[Continuity Bible]: Courier in charcoal waxed jacket, warm sodium streetlamps, wet asphalt reflections, 35mm anamorphic lens.
[Shot 1 (0s-4s)]: Low-angle tracking from behind as the courier steps off the curb into light rain.
[Shot 2 (4s-8s)]: Medium close-up front profile as the courier checks a brass pocket watch under an awning.
```

## 3. Audio & Music (Suno v6)

### Style Header Formula (Maximum 200 Characters)
`[Primary Genre], [Sub-genre], [BPM] BPM, [Key], [Lead Instruments], [Vocal Timbre & Delivery], [Mix Character]`

Example (156 chars):
`Indie folk acoustic, warm analog tape mix, 92 BPM, D major, fingerpicked steel-string guitar, upright bass, brushed snare, intimate close-mic male baritone vocal`

### Arrangement Metatags
- Core section tags: `[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]` (numbered variants like `[Verse 1]`, `[Verse 2]` and `[Pre-Chorus]`, `[Bridge]`, `[Instrumental Break]` are supported).
- Dynamic modifiers inside brackets: `[Intro: fingerpicked guitar only]`, `[Chorus: full band enters, octave harmony]`, `[Bridge: stripped back to piano and vocal only]`, `[Outro: gentle fade on sustained chord]`.
