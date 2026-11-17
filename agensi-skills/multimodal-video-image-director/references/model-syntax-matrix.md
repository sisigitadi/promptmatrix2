# Multimodal Model Syntax Matrix (Late 2026)

Reference guide for compiling model-accurate parameters across image, video, and audio generators.

## 1. Image Generators

### Midjourney v7
- **Core Flags**:
  - `--v 7` (target v7 model)
  - `--ar 16:9` / `4:5` / `1:1` / `9:16` (aspect ratio)
  - `--raw` (reduced default stylization for documentary/photographic control)
  - `--stylize <0-1000>` (`100` default; lower for literal prompt adherence, `250-500` for stronger aesthetic interpretation)
  - `--oref <image_url>` + `--ow <0-1000>` (Omni-Reference for consistent characters, products, or props)
  - `--sref <image_url>` + `--sw <0-1000>` (Style Reference weight)
  - `--no <term1, term2>` (negative exclusions; avoid listing what you want)

### FLUX.2 Kontext
- **Prompt Structure**: Natural-language edit directive + invariance clause.
- **Best Practices**:
  - Name the exact spatial anchor (`"on the left wooden shelf"`, `"the jacket worn by the foreground runner"`).
  - Explicitly state lighting and material match (`"cast soft warm bounce light onto the table surface"`).
  - For typography edits, wrap exact target text in double quotes and state font style (`"replace the storefront sign text with 'Kopi Nusantara' in clean cream sans-serif lettering"`).

## 2. Video Generators

| Parameter | Google Veo 3 | Kling 2.1 | OpenAI Sora 2 |
| :--- | :--- | :--- | :--- |
| Native Audio | Synchronized SFX, ambience, and spoken dialogue | External audio / post-sync unless audio mode enabled | Integrated scene audio and foley cues |
| Shot Length | 5s to 8s single beat | 5s to 10s physics-guided clip | 5s to 20s single or multi-cut storyboard |
| Motion Control | Natural-language camera verb + subject pacing | Motion Brush region masks + camera pan/tilt/zoom | Storyboard timestamps (`0s-4s`, `4s-8s`) |
| Continuity | Repeat lighting + wardrobe descriptors | Start/End keyframe image anchors | Shared Continuity Bible + character reference |

### Veo 3 Prompt Skeleton
```text
[Shot & Camera]: Medium 50mm shot, smooth eye-level tracking left-to-right.
[Subject & Action]: A ceramicist shapes wet stoneware clay on a spinning wheel, hands dusted with slip.
[Environment & Lighting]: Morning sunbeams cutting through dusty workshop windows, warm tungsten practical lamp behind.
[Audio]: Steady rhythmic hum of the pottery wheel, soft wet clay friction, birds chirping outside an open window. No background music.
```

### Kling 2.1 Motion Brush Specification
```text
[Base Scene]: Static coastal cliff overlooking dark ocean swells at blue hour.
[Motion Mask 1 - Foreground Grass]: Gentle sway left-to-right at low velocity (speed: 2/5).
[Motion Mask 2 - Ocean Waves]: Rolling surf crashing against rocks toward shore (speed: 4/5).
[Camera]: Slow push-in, 35mm wide lens, horizon locked level.
```

## 3. Audio & Music (Suno v4.5 / v5)

### Style Header Formula (Keep Concise)
`[Primary Genre], [Sub-genre], [BPM] BPM, [Key], [Lead Instruments], [Vocal Timbre & Delivery], [Mix Character]`

Example:
`Indie folk acoustic, warm analog tape mix, 92 BPM, D major, fingerpicked steel-string guitar, upright bass, brushed snare, intimate close-mic male baritone vocal`

### Arrangement Metatags
- `[Intro]`, `[Verse 1]`, `[Pre-Chorus]`, `[Chorus]`, `[Verse 2]`, `[Bridge]`, `[Instrumental Break]`, `[Outro]`
- Dynamic modifiers inside brackets: `[Chorus: full band enters, octave harmony]`, `[Bridge: stripped back to piano and vocal only]`.
