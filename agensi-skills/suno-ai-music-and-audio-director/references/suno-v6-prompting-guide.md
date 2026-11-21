# Suno v6 and v5 Prompting Guide Reference

This reference documents engine syntax, proven genre pairings, and character budget rules for Suno AI audio generation.

## 1. Engine Limits & Character Budgets

| Field | Max Characters | Optimal Strategy |
| :--- | :--- | :--- |
| **Style of Music** | 200 characters | Comma-separated descriptors: Genre, Sub-genre, BPM, Key Instruments, Vocal Type. |
| **Title** | 80 characters | Clean evocative title without punctuation gimmicks. |
| **Lyrics** | 3,000 characters | Full song layout with bracketed section tags (`[Verse]`, `[Chorus]`, `[Bridge]`). |

## 2. Tested Structural Meta-Tags

Suno models recognize specific square-bracket directives to modulate musical transitions:

- **Song Sections**: `[Intro]`, `[Verse 1]`, `[Verse 2]`, `[Pre-Chorus]`, `[Chorus]`, `[Post-Chorus]`, `[Bridge]`, `[Guitar Solo]`, `[Drum Break]`, `[Outro]`, `[End]`.
- **Dynamics & Intensity**: `[Build]`, `[Drop]`, `[Beat Drop]`, `[Acoustic Breakdown]`, `[Dynamic Climax]`.
- **Vocal Directions**: `[Male Vocal]`, `[Female Vocal]`, `[Duet]`, `[Choir]`, `[Whisper]`, `[Belt]`, `[Fast Rap]`.

## 3. Disallowed Prompting Habits

- **Negative Prompting**: Suno ignores negative prompt phrases like "no guitars" or "no drums" and often incorporates them instead. Specify what you *want* to hear.
- **Natural Language Paragraphs**: Avoid full sentences in the Style field ("Please make a song that sounds like..."). Use concise keyword commas.
