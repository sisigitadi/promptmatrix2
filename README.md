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

- 🌐 **Adaptasi Standar Agensi.io & 15 Flagship Open Agent Skills (v7.6.0)**:
  - Ekspansi katalog ke 15 paket mandiri lintas 4 Pilar fungsional Agensi.io (`Develop`, `Grow`, `Operate`, `Create`), menambahkan `ai-product-manager-and-prd-architect` ($14.99), `business-workflow-and-n8n-integrator` ($14.99), `b2b-cold-outreach-and-sales-engine` ($11.99), `viral-short-form-video-hook-architect` ($9.99), dan `suno-ai-music-and-audio-director` ($9.99).
  - Modal katalog Dual-Filter Modern: Baris 1 Pills 4 Pilar, Baris 2 Pills Tier All/Free/Paid, dan lencana pilar berwarna di setiap kartu paket.
  - Generator cerdas listing dan pricing dengan auto-deteksi pilar (`inferAgensiPillar`) dan injeksi spesifikasi GEO.
  - Pembaruan paket suite 14 flagship `promptmatrix-14-flagship-suite.zip` ($59.00 vs $195.87 total individual, hemat 70%).
- ⚡ **Unifikasi Protokol OpenAI-Compatible & Arsitektur Koneksi AI (v7.5.0)**:
  - Unifikasi seluruh provider melalui gateway OpenAI-Compatible (`callOpenAICompatible`), termasuk Google Gemini via endpoint resmi `/v1beta/openai` (menghilangkan misrouted 404 native Gemini).
  - Resolusi endpoint terpusat (`resolveAIEndpoint`), isolasi kunci per-provider (`providerKeys`), sanitasi kunci otomatis (`sanitizeApiKey`), dan deteksi ketidakcocokan kunci real-time.
  - Penyelarasan 11 model Shanghai AI Lab Intern-Discovery (`https://discovery-api.intern-ai.org.cn/v1`) dengan model default ultra-hemat `Agents-A1` (4 kredit).
  - Filosofi uji koneksi bersih (pola SocialBiz Manager) dengan smart fallback probe dan penanganan status HTTP 429 sebagai bukti otentikasi valid.
- 🛠️ **Multi-Target Studio Skill Editor & Dukungan Model Shanghai AI Lab (v7.5.0)**:
  - Beralih instan antara Formula Studio Aktif, 15 Paket Flagship Bawaan, dan Draf Skill Baru Mandiri langsung di Studio (`AgentSkillViewer.tsx`), dilengkapi tombol `[✏️ Edit di Studio]` pada katalog.
  - Lengkap dengan isian identitas marketplace (slug kebab-case tervalidasi dengan AI Suggest, kategori, author, version, license, trigger description), persistensi draft lokal browser (`localStorage`), dan 1-klik unduh ZIP siap jual (`<slug>.zip`).
  - Dukungan penuh OpenAI-Compatible gateway `https://discovery-api.intern-ai.org.cn/v1` (Shanghai AI Lab: `intern-s2`, `internvl3.5`, `intern-s1`, dll.) dengan deteksi URL otomatis dan bypass batasan CORS browser.
- 💎 **400 Formula Prompt Master**: Mencakup 8 kategori inti dengan **83 subkategori** spesifik, termasuk workflow Agentic AI (`SKILL.md` Builder, Claude Code Subagents & Hooks, MCP Server v2), GEO/AEO, Antislop UI Audit, Next.js/PostgreSQL, Midjourney v7 (`--oref`), FLUX.2 / Kontext, Veo 3, Kling 2.1, Sora 2, dan Suno v4.5/v5.
- 🧩 **Ekosistem Agent Skill (`SKILL.md`) & Monetisasi Agensi.io (Model Hibrida)**:
  - **Etalase Afiliasi Publik & Suite Bundle Opsional**: Tombol **Skills (`15`)** di Header, banner katalog di Galeri, kartu rekomendasi kontekstual per kategori di Studio (`AgensiSkillPromoCard`), dan modal katalog 15 paket resmi (`AgensiCatalogModal`) dengan filter *All / Free ($0) / Paid Flagship*, kartu **Suite Bundle (`$59.00` vs `$195.87` satuan, hemat `70%`)**, serta tautan checkout sekunder opsional (Lemon Squeezy, Creem.io, Gumroad, PromptBase) yang hanya tampil jika dikonfigurasi (Agensi.io tetap CTA utama).
  - **Pabrik `.zip` Privat (9-Tap Creator Mode) & Generator Multi-Channel (`package:channels`)**: Konversi formula aktif mana pun menjadi berkas `SKILL.md` tervalidasi (`name <= 64` kebab-case, `description <= 1024`), ekspor **1-Klik Paket `.zip` Agensi.io** langsung di browser (`SKILL.md` root + `references/` + `templates/` + `scripts/`), generator **Salin Listing Copy** untuk `Agensi.io/sell`, dukungan 27 runtime agen, pengaturan live URL afiliasi + channel sekunder (`pm_agensi_urls`), **15 paket siap terbit** di `agensi-skills/`, serta skrip CLI `npm run package:channels` untuk memaketkan Lead Magnet (`dist-lead-magnet/`), Bundel 14 Flagship (`dist-channels/storefronts/`), dan 15 listing PromptBase (`dist-channels/promptbase/`).
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
├── agensi-skills/                      # 10 paket Open Agent Skills siap kemas & terbit ke Agensi.io
│   ├── antislop-ui-and-copy-auditor/
│   ├── fullstack-ts-nextjs-architect/
│   ├── mcp-server-production-builder/
│   ├── multi-agent-swarm-and-subagent-orchestrator/
│   ├── multimodal-video-image-director/
│   ├── owasp-api-and-cloud-security-auditor/
│   ├── playwright-e2e-and-openapi-contract-suite/
│   ├── postgres-prisma-zero-downtime-sql-tuner/
│   ├── prompt-matrix-prompt-architect/
│   └── seo-geo-aeo-content-engine/
├── components/
│   ├── AgensiCatalogModal.tsx          # Modal katalog publik 10 paket Agent Skills & mode kreator
│   ├── AgensiSkillPromoCard.tsx        # Kartu promosi kontekstual Agensi.io per kategori di Studio
│   ├── AISettingsModal.tsx             # Modal pengaturan API key, model 2026 & URL afiliasi Agensi.io
│   ├── AgentSkillViewer.tsx            # Pratinjau, validasi, ekspor .zip & Listing Copy Agensi.io
│   ├── CleanJsonViewer.tsx             # Pratinjau JSON RFC 8259 bebas decode error
│   ├── Footer.tsx                      # Footer modern dan tautan dokumentasi
│   ├── FrameworkPane.tsx               # Panel studio peracik formulir & visual preview
│   ├── Header.tsx                      # Navigasi atas, tombol Skills (10), toggle bahasa/tema & Stash
│   ├── HelpModal.tsx                   # Panduan interaktif dan FAQ pengguna
│   ├── InputField.tsx                  # Komponen input dinamis (text, select, textarea, dll.)
│   ├── NavigationPane.tsx              # Sidebar navigasi kategori & subkategori
│   ├── TemplateGallery.tsx             # Grid galeri 400 kartu formula, katalog skills & filter instan
│   └── VisualPromptPreview.tsx         # Pratinjau mockup visual & benchmark gold-standard
├── config/
│   └── agensiConfig.ts                 # Konfigurasi 10 paket Agensi.io, helper URL afiliasi & 27 agen
├── contexts/
│   └── LanguageContext.tsx             # State management dwibahasa (ID <-> EN)
├── data/
│   ├── aiPlatforms.ts                  # Daftar preset model LLM frontier 2026
│   └── frameworks.ts                   # Basis data 400 master prompt frameworks (83 subkategori)
├── docs/                               # Katalog 400 formula, AgensiMarketplacePlaybook.md & SOP
├── public/
│   ├── CNAME                           # Custom domain pointer (prompt.sigitadi.id)
│   ├── _redirects                      # SPA routing rewrite
│   ├── manifest.json                   # Konfigurasi PWA v7.2.1
│   ├── robots.txt                      # SEO robots configuration
│   ├── sitemap.xml                     # SEO XML sitemap
│   └── sw.js                           # Service Worker offline cache (promptmatrix-v7.2.1)
├── scripts/
│   ├── audit-frameworks.mjs            # Gerbang audit programatik (400 formula, 10 skills, antislop)
│   ├── package-agensi-skills.mjs       # Pemaket 10 arsip POSIX .zip & generator AGENSI-LISTING-MANIFEST.md
│   └── package-multi-channels.mjs      # Generator 3 pilar distribusi (Lead Magnet, Suite ZIP, 15 PromptBase)
├── services/
│   ├── agentSkillService.ts            # Generator & validator Open Agent Skills SKILL.md
│   ├── aiSettingsService.ts            # Manajemen preset provider & persistensi localStorage
│   ├── jsonPromptService.ts            # Sanitizer & formatter payload JSON RFC 8259
│   ├── localizationService.ts          # Mesin lokalisasi presisi 8.600+ entri (ID <-> EN)
│   ├── sampleDataService.ts            # Mesin data contoh realistis otomatis (400 formula)
│   ├── skillZipService.ts              # Pembungkus POSIX .zip in-browser & generator Listing Copy
│   ├── universalAIService.ts           # Dispatcher universal multi-provider AI
│   └── visualBenchmarkService.ts       # Kurasi gambar benchmark untuk seluruh 400 formula
├── App.tsx                             # Root application logic, 34 Quick Launchers & state orchestration
├── DEPLOYMENT.md                       # Panduan teknis publikasi live domain
├── package.json                        # Konfigurasi dependensi & skrip build/audit/package:skills (v7.2.1)
└── vite.config.ts                      # Konfigurasi bundler Vite & alias path
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi [MIT](LICENSE).

---

*PromptMatrix 2.0: Optimize Your AI, Starting from the Prompt.*
