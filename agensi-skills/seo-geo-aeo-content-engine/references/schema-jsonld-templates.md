# JSON-LD Schema Templates (Schema.org)

Ready-to-use structured data templates for technical products, tutorials, and FAQ sections. Wrap in `<script type="application/ld+json">...</script>` inside HTML `<head>` or `<body>`.

## 1. `SoftwareApplication`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PromptMatrix 2.0",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "url": "https://promptmatrix.example.com",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Client-side prompt engineering studio with 400 structured frameworks and Open Agent Skills SKILL.md export."
}
```

## 2. `FAQPage`

Only include questions and answers that are visibly rendered on the same page.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does PromptMatrix send prompt inputs to external servers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. PromptMatrix runs locally in the browser and stores templates in client storage without sending user prompt inputs to a remote backend."
      }
    },
    {
      "@type": "Question",
      "name": "Which coding agents support exported SKILL.md files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exported SKILL.md packages follow the Open Agent Skills format and work with Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, and OpenAI Codex."
      }
    }
  ]
}
```

## 3. `HowTo`

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to package an Agent Skill for Agensi.io",
  "description": "Validate frontmatter, run bundled Node.js checks, and archive the skill directory into a clean zip package.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Validate SKILL.md frontmatter",
      "text": "Confirm name is lowercase kebab-case under 64 characters and description is under 1024 characters."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Run verification scripts",
      "text": "Execute node --check and dry-run every file inside scripts/ against sample fixtures."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Archive the skill directory",
      "text": "Zip the folder containing SKILL.md, references/, and scripts/ without macOS or node_modules artifacts."
    }
  ]
}
```
