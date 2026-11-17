# PromptMatrix 2.0 - Guided AI Prompt Studio & Agent Skill Builder 🚀

[![Production Build](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Frameworks](https://img.shields.io/badge/Master%20Frameworks-400%20Templates-blue.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Bilingual](https://img.shields.io/badge/Languages-100%25%20Bilingual%20(ID%20%7C%20EN)-purple.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Live Domain](https://img.shields.io/badge/Live-prompt.sigitadi.id-emerald.svg)](https://prompt.sigitadi.id)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PromptMatrix 2.0** adalah platform generator prompt AI berpemandu dan pembuat Agent Skill (`SKILL.md`) dengan **400 formula master siap pakai** lintas **83 subkategori** dan **8 kategori**. Dirancang untuk membantu pengguna non-teknis hingga software engineer menyusun instruksi prompt AI yang kontekstual dan siap pakai untuk GPT-5, o3, Claude 4 / Sonnet 4.5, Gemini 3.7, DeepSeek R1/V3, Midjourney v7, FLUX.2, Veo 3, Kling 2.1, Sora 2, Suno v4.5/v5, serta runtime Open Agent Skills.

🌐 **Website Live Resmi**: [https://prompt.sigitadi.id](https://prompt.sigitadi.id)  
📖 **Panduan Deployment & DNS**: Baca [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan konfigurasi domain dan hosting.

---

## 🌟 Fitur Unggulan

- 💎 **400 Formula Prompt Master**: Mencakup 8 kategori inti dengan **83 subkategori** spesifik, termasuk workflow Agentic AI (`SKILL.md` Builder, Claude Code Subagents & Hooks, MCP Server v2), GEO/AEO, Antislop UI Audit, Next.js/PostgreSQL, Midjourney v7 (`--oref`), FLUX.2 / Kontext, Veo 3, Kling 2.1, Sora 2, dan Suno v4.5/v5.
- 🧩 **Pratinjau & Ekspor Agent Skill (`SKILL.md`) Siap Agensi.io**: Konversi formula apa pun di Studio menjadi berkas `SKILL.md` berstandar Open Agent Skills dengan validasi frontmatter YAML (`name <= 64` karakter kebab-case, `description <= 1024`), salin 1-klik, unduh file `-SKILL.md`, dukungan 27 runtime agen (Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf, OpenAI Codex, Antigravity, dll.), serta 6 paket siap terbit di `agensi-skills/`.
- ⚡ **Pratinjau JSON Bebas "Decode Error" (RFC 8259)**: Tampilan pratinjau JSON terformat dan tervalidasi dengan 3 sub-format (*Struktur Penuh*, *Format Chat API messages*, dan *Prompt String Aman*) yang bebas dari `json.decoder.JSONDecodeError` untuk Python, cURL, LangChain, dan REST API.
- ✨ **Few-Shot In-Context Learning Booster dengan AI Suggest**: Tingkatkan akurasi prompt dengan contoh acuan masukan dan keluaran yang didukung generator AI Suggest terarah.
- 🌐 **Deteksi Bahasa Cerdas & Dual Bahasa (EN ⇄ ID)**: Default bahasa Inggris (EN) dengan auto-deteksi preferensi browser (otomatis Bahasa Indonesia jika locale browser ID/IN). Pengguna dapat beralih bahasa dan tema (Dark/Light) kapan saja melalui header switcher dengan persistensi `localStorage`. Seluruh 400 nama formula, logika AI, serta 8.600+ entri kamus label, opsi, dan placeholder tersinkronisasi penuh.
- ⚡ **1-Klik Isi Contoh Nyata (*Fill Sample*)**: Membantu pengguna baru memahami cara kerja formula dengan mengisi seluruh data formulir secara otomatis menggunakan skenario riil dalam Bahasa Indonesia atau Bahasa Inggris.
- 🎨 **2 Mode Antarmuka Intuitif**:
  - 🧭 **Galeri Template**: Tampilan kartu visual modern dengan filter kategori instan, quick search tags, dan pencarian intent cerdas.
  - 🛠️ **Studio Peracik**: Layout 2-kolom lapang (58% formulir input berpemandu, 42% kartu preview prompt langsung dengan tab *Structured*, *Raw*, *JSON*, dan *SKILL.md*, penghitung karakter & estimasi token).
- 🧹 **AI Enhance Sanitizer**: Output AI dibersihkan otomatis dari kebocoran code fence (```markdown) dan bold asterisks (**).
- 📦 **Prompt Stash, Backup & Markdown Export**: Simpan racikan prompt favorit langsung di browser (IndexedDB) dan ekspor ke format JSON, **Markdown (.md)**, atau Plain Text (`.txt`).
- 🚀 **Quick Launch ke 33 AI Tools**: Salin prompt dan buka langsung ChatGPT (GPT-5/o3), Claude (Sonnet 4.5), Google Gemini (3.7 Flash), DeepSeek (R1/V3), Perplexity, Midjourney, Runway Gen-4, Kling 2.1, Suno, Claude Code, Cursor, Windsurf, dll. dalam satu klik.
- 🔒 **100% Privasi & Client-Side**: Seluruh data dan racikan formulir diproses secara lokal di peramban Anda tanpa pengiriman data ke server pihak ketiga.

---

## 📚 Pembagian 8 Kategori Master (400 Frameworks, 83 Subkategori)

| Kategori | Jumlah Template | Subkategori | Cakupan Niche & Kemampuan |
| :--- | :---: | :---: | :--- |
| 📝 **Teks & Konten** | **98** | 19 | GEO/AEO, Copywriting (AIDA), TikTok Live, Esai LPDP, SEO, Email, B2B Case Study, Changelog |
| 🎨 **Gambar & Desain** | **54** | 11 | Midjourney v7 (`--oref`), FLUX.2 / Kontext, Nano Banana Pro, Desain System Token, Fotografi Produk |
| ⚡ **Prompt Ringkas** | **54** | 11 | Reasoning Models (GCC), JSON-Strict Contract, Diff-Only Patch, PAS, BAB, FAB, CO-STAR, RTF |
| 💻 **Kode & Pengembang** | **50** | 6 | Agent Skill (`SKILL.md`), Claude Code Subagents & Hooks, MCP Server v2, TypeScript Zero-Any, PostgreSQL RLS |
| 🎵 **Audio & Musik** | **37** | 8 | Suno v4.5/v5 Multi-Stem Studio, Udio, Podcast & Voiceover SSML, Sound Design, Soundscape |
| 🚀 **Prompt Proyek** | **36** | 13 | Micro-SaaS 30-Day Launch, Technical RFC/ADR, Blameless Post-Mortem, PRD to Task Graph |
| 💡 **Koleksi & Inovasi** | **36** | 8 | Multi-Agent Swarm Spec, Antislop UI & Copy Audit, AI Eval Red-Teaming, SCAMPER, Blue Ocean, TRIZ |
| 🎬 **Video & Animasi** | **35** | 7 | Google Veo 3 Audio-Video, Kling 2.1 Motion Brush, OpenAI Sora 2 Continuity, Runway Gen-4 |
| **TOTAL KESELURUHAN** | **400** | **83** | **Master Frameworks Terintegrasi Penuh** |

---

## 🚀 Memulai Secara Lokal (Quick Start)

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- npm / yarn / pnpm.

### Langkah Instalasi:

```bash
# 1. Clone repositori
git clone https://github.com/sisigitadi/promptmatrix2.git
cd promptmatrix2

# 2. Install dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

---

## 🚢 Panduan Deployment ke https://prompt.sigitadi.id

Proyek ini telah dilengkapi dengan workflow **GitHub Actions** otomatis serta berkas `public/CNAME` untuk domain `prompt.sigitadi.id`:

### 1. Konfigurasi DNS di Provider Domain:
- Buat record **CNAME**:
  - **Host / Name**: `prompt`
  - **Target / Points to**: `sisigitadi.github.io`

### 2. Konfigurasi di GitHub Pages:
- Buka repositori `https://github.com/sisigitadi/promptmatrix2/settings/pages`.
- Pada bagian **Custom domain**, masukkan `prompt.sigitadi.id` lalu klik **Save**.
- Centang opsi **Enforce HTTPS**.

### 3. Push ke GitHub:
- Lakukan `git push origin main`. GitHub Actions akan otomatis melakukan build dan mempublikasikan aplikasi ke:  
  👉 **`https://prompt.sigitadi.id`**

*Untuk panduan lengkap deployment ke Vercel atau Netlify, silakan baca [DEPLOYMENT.md](DEPLOYMENT.md).*

---

## 🏗️ Struktur Arsitektur Proyek

```text
promptmatrix2/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # CI/CD otomatis untuk GitHub Pages
├── agensi-skills/                      # 6 paket Open Agent Skills siap pakai & siap Agensi.io
│   ├── antislop-ui-and-copy-auditor/
│   ├── fullstack-ts-nextjs-architect/
│   ├── mcp-server-production-builder/
│   ├── multimodal-video-image-director/
│   ├── prompt-matrix-prompt-architect/
│   └── seo-geo-aeo-content-engine/
├── components/
│   ├── AISettingsModal.tsx             # Modal pengaturan API key & preferensi model late-2026
│   ├── AgentSkillViewer.tsx            # Pratinjau, validasi & ekspor SKILL.md siap Agensi.io
│   ├── CleanJsonViewer.tsx             # Pratinjau JSON RFC 8259 bebas decode error
│   ├── Footer.tsx                      # Footer modern dan tautan dokumentasi
│   ├── FrameworkPane.tsx               # Panel studio peracik formulir & visual preview
│   ├── Header.tsx                      # Navigasi atas, toggle bahasa/tema, dan Stash badge
│   ├── HelpModal.tsx                   # Panduan interaktif dan FAQ pengguna
│   ├── InputField.tsx                  # Komponen input dinamis (text, select, textarea, dll.)
│   ├── NavigationPane.tsx              # Sidebar navigasi kategori & subkategori
│   ├── TemplateGallery.tsx             # Grid galeri 400 kartu formula & filter instan
│   └── VisualPromptPreview.tsx         # Pratinjau mockup visual & benchmark gold-standard
├── config/
│   └── agensiConfig.ts                 # Konfigurasi marketplace Agensi.io & 27 runtime agen
├── contexts/
│   └── LanguageContext.tsx             # State management dwibahasa (ID <-> EN)
├── data/
│   ├── aiPlatforms.ts                  # Daftar preset model LLM (GPT-5, Claude 4, Gemini 3.7, DeepSeek, Grok)
│   └── frameworks.ts                   # Basis data 400 master prompt frameworks (83 subkategori)
├── docs/                               # Katalog 400 formula, AgensiMarketplacePlaybook.md & SOP
├── public/
│   ├── CNAME                           # Custom domain pointer (prompt.sigitadi.id)
│   ├── _redirects                      # SPA routing rewrite
│   ├── manifest.json                   # Konfigurasi PWA v7.2.0
│   ├── robots.txt                      # SEO robots configuration
│   ├── sitemap.xml                     # SEO XML sitemap
│   └── sw.js                           # Service Worker offline cache (promptmatrix-v7.2.0)
├── services/
│   ├── agentSkillService.ts            # Generator & validator Open Agent Skills SKILL.md
│   ├── aiSettingsService.ts            # Manajemen preset provider & persistensi localStorage
│   ├── jsonPromptService.ts            # Sanitizer & formatter payload JSON RFC 8259
│   ├── localizationService.ts          # Mesin lokalisasi presisi 8.600+ entri (ID <-> EN)
│   ├── sampleDataService.ts            # Mesin data contoh realistis otomatis (400 formula)
│   ├── universalAIService.ts           # Dispatcher universal multi-provider AI
│   └── visualBenchmarkService.ts       # Kurasi gambar benchmark untuk seluruh 400 formula
├── App.tsx                             # Root application logic, 33 Quick Launchers & state orchestration
├── DEPLOYMENT.md                       # Panduan teknis publikasi live domain
├── package.json                        # Konfigurasi dependensi & skrip build (v7.2.0)
└── vite.config.ts                      # Konfigurasi bundler Vite & alias path
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi [MIT](LICENSE).

---

*PromptMatrix 2.0: Optimize Your AI, Starting from the Prompt.*
