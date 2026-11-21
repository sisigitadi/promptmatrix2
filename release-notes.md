
# Catatan Rilis PromptMatrix

Dokumen ini mencatat perubahan teknis detail untuk setiap versi PromptMatrix.

---
## [V7.6.0] - 2026-11-21
### Adaptasi Standar Agensi.io, 4 Pilar Omnichannel & 15 Flagship Skills
- **Ekspansi 15 Flagship Packages (`agensi-skills/`, `config/agensiConfig.ts`)**:
  - Menambah 5 paket Open Agent Skills baru ke `agensi-skills/` untuk melengkapi pilar fungsional yang sebelumnya minim:
    - **Operate**: `ai-product-manager-and-prd-architect` ($14.99) dan `business-workflow-and-n8n-integrator` ($14.99).
    - **Grow**: `b2b-cold-outreach-and-sales-engine` ($11.99) dan `viral-short-form-video-hook-architect` ($9.99).
    - **Create**: `suno-ai-music-and-audio-director` ($9.99).
  - Setiap paket dilengkapi berkas root `SKILL.md`, panduan arsitektur di `references/`, starter template di `templates/`, serta validator offline Node.js 18+ di `scripts/`.
- **Taksonomi 4 Pilar Agensi.io (`config/agensiConfig.ts`, `data/skillListingDemos.ts`, `data/flagshipSkillsData.ts`)**:
  - Mengadopsi taksonomi 4 pilar fungsional Agensi.io (`Develop`, `Grow`, `Operate`, `Create`) pada konfigurasi `config/agensiConfig.ts` dan tipe `AgensiPillar`.
  - Mendaftarkan profil demo listing lengkap untuk ke-5 paket baru dengan ringkasan kapabilitas, input nyata, dan output berstandar emas agen (>= 700 karakter berstruktur `## Summary`).
- **Modal Katalog Dual-Filter Modern (`components/AgensiCatalogModal.tsx`)**:
  - Menghadirkan navigasi filter 2 baris terstruktur:
    - **Baris 1**: Pills 4 Pilar (`Semua Pilar`, `Develop`, `Grow`, `Operate`, `Create`) lengkap dengan counter aktif.
    - **Baris 2**: Pills Tier (`Semua Tier`, `Gratis (Lead Magnet)`, `Berbayar (Flagship)`).
  - Menambahkan lencana pilar berwarna di setiap kartu paket (Indigo untuk Develop, Emerald untuk Grow, Amber untuk Operate, Purple untuk Create).
- **Generator Cerdas Listing & Pricing (`services/skillZipService.ts`, `components/AgentSkillViewer.tsx`)**:
  - Menambahkan fungsi deterministik `inferAgensiPillar` untuk mendeteksi pilar secara otomatis dari kategori, tags, atau slug.
  - Memperbarui `inferRecommendedPriceUsd` dengan kalibrasi harga berbasis pilar dan kesediaan bayar pasar.
  - Menginjeksi baris spesifikasi `Pilar Ekosistem` ke tabel metadata GEO dan Schema.org JSON-LD.
- **Pembaruan Distribusi Multi-Channel Suite (`scripts/package-multi-channels.mjs`, `docs/AgensiMarketplacePlaybook.md`)**:
  - Memperbarui suite bundle multi-channel menjadi `promptmatrix-14-flagship-suite.zip` ($59.00 vs $195.87 total individual, hemat 70%) yang memuat seluruh 14 paket flagship berbayar.
  - Menyinkronkan seluruh playbook marketplace, SOP payout Zoneless USDC Solana untuk kreator Indonesia, serta register PRD v7.6.0.

---
## [V7.5.0] - 2026-11-21
### Integrasi Intern-Discovery AI & Studio Skill Editor untuk Flagship & Kustom
- **Dukungan Provider Intern-Discovery (Shanghai AI Lab) (`services/aiSettingsService.ts`, `services/universalAIService.ts`, `components/AISettingsModal.tsx`)**:
  - Menambahkan preset provider `internai` dan integrasi ke OpenAI-Compatible dengan Base API URL `https://discovery-api.intern-ai.org.cn/v1`.
  - Mengatasi pembatasan browser CORS pada endpoint `/v1/models` (yang mengembalikan HTTP 405 pada preflight OPTIONS) dengan mendeteksi domain `intern-ai.org.cn` secara otomatis dan menyediakan daftar 11 model resmi: `intern-s2`, `intern-s2-preview-397b`, `intern-s2-preview-35b`, `internvl3.5-241b-a28b`, `intern-s1`, `intern-s1-pro`, `intern-s1-mini`, `internlm3-latest`, `internlm2.5-latest`, `internlm2.5-20b-chat`, dan `internlm2.5-7b-chat`.
  - Auto-detection URL pada `AISettingsModal`: mendeteksi otomatis saat pengguna menempel URL `intern-ai.org.cn`, mengatur default model ke `intern-s2`, dan menampilkan pill panduan.
  - Menambahkan chip cepat di modal pengaturan AI untuk `intern-s2`, `intern-s2-preview-397b`, dan `internvl3.5-241b-a28b`.
- **Studio Skill Editor untuk 10 Flagship & Skill Kustom (`components/AgentSkillViewer.tsx`, `components/AgensiCatalogModal.tsx`, `data/flagshipSkillsData.ts`, `App.tsx`)**:
  - Menambahkan **Skill Source Switcher** di bagian atas Studio (`AgentSkillViewer.tsx`) yang memungkinkan beralih instan antara: (a) Formula Studio Aktif, (b) 10 Paket Flagship bawaan, dan (c) Draf Skill Baru Mandiri (Custom Draft).
  - Menambahkan tombol `[✏️ Edit di Studio]` pada setiap kartu paket di Tab 1 Katalog 10 Paket (`AgensiCatalogModal.tsx`) yang langsung membuka paket tersebut ke editor Studio.
  - Menyediakan kolom formulir lengkap untuk keperluan upload marketplace & metadata Open Agent Skills:
    - Nama Identifier Skill / Slug (`name` dalam format kebab-case valid dengan live validation badge dan tombol `✨ AI Suggest`).
    - Kategori Pasar (`category`).
    - Penulis / Pembuat (`author`).
    - Versi SemVer (`version`).
    - Lisensi (`license`).
    - Instruksi Pemicu Aktivasi (`description` YAML frontmatter dengan batas 1024 karakter dan live counter).
    - Judul Komersial, Tagline, Harga USD, Tag, Deskripsi Markdown, serta Live Demo (The Request & The Result).
  - Menambahkan persistensi draft lokal (`localStorage` kunci `pm_skill_draft_<slug>`) dengan tombol `💾 Simpan Draf` dan `↺ Reset ke Bawaan`.
  - Integrasi pembuatan paket ZIP: tombol unduh ZIP secara otomatis mengompilasi nama file `<slug>.zip` dan menyertakan frontmatter YAML serta isi markdown yang telah disunting.
  - Menambahkan tombol cepat salin `SKILL.md` berdampingan dengan tombol unduh ZIP di Langkah 2.

---
## [V7.4.0] - 2026-11-19
### Floating Sticky Header, Mesin SEO & GEO, serta Elaborasi Multi-Marketplace (Anti-Monopoli)
- **Perbaikan Header Mengambang & Sticky (`styles.css`, `components/Header.tsx`)**:
  - Mengganti `overflow-x: hidden` pada `html` dan `body` menjadi `overflow-x: clip`, memulihkan kapabilitas `position: sticky` tanpa memicu pembatasan scroll container browser.
  - Menambahkan listener pasif `isScrolled`, border ring emerald dinamis, dan efek bayangan mengambang saat halaman digulir.
- **Pemisahan Modal Paket Skill & Pengaturan AI (`components/AgensiCatalogModal.tsx`, `components/AISettingsModal.tsx`, `App.tsx`)**:
  - Memisahkan modal Paket Skill dari modal Pengaturan Provider AI, memberikan alur kerja mandiri yang lebih mudah diakses dan dipahami pengguna.
  - Menambahkan generator AI Suggestion terintegrasi untuk judul, tagline, deskripsi, dan demo skill.
- **Peluncur Cepat AI Dapat Diciutkan (`components/BlankCanvasPane.tsx`, `components/FrameworkPane.tsx`)**:
  - Menambahkan kontrol ciut/bentang untuk 34 peluncur cepat AI dengan status persistensi di `localStorage` (`pm_quick_launchers_expanded`).
- **Mesin SEO & GEO untuk Produk & Live Demo (`services/skillZipService.ts`, `services/universalAIService.ts`, `components/AgentSkillViewer.tsx`)**:
  - Menyematkan taksonomi tag berniat tinggi (`open-agent-skills`, `agent-skill`, `ai-agent`, runtimes `claude-code`, `cursor-rules`, `antigravity`).
  - Menghasilkan Direct Definition Answer Capsule (40-60 kata siap kutip Perplexity dan AI Overviews), Tabel Spesifikasi Teknis, dan 4 blok FAQ terstruktur.
  - Menghasilkan Schema.org `SoftwareApplication` JSON-LD terverifikasi lengkap dengan tombol 1-klik salin Schema dan FAQ GEO.
  - Menyediakan 4 indikator mutu SEO & GEO real-time di Langkah 1 formulir skill.
- **Elaborasi Multi-Marketplace Anti-Monopoli (7 Toko Komersial + 1 OSS Lead Magnet)**:
  - **Format Switcher 5 Platform di Langkah 3 (`components/AgentSkillViewer.tsx`)**: Tab khusus untuk format Universal (SEO/GEO), PromptBase (judul <= 40 char, variabel `[VARIABLE]`, contoh tes, payout 80%), Storefront/MoR (Gumroad, Lemon Squeezy, Whop, Payhip, Creem.io), GitHub OSS Lead Magnet (`npx skills add`), dan Schema JSON-LD.
  - **Dashboard 7 Marketplace di Tab 3 (`components/AgensiCatalogModal.tsx`)**: Menghilangkan sekat "Kanal Sekunder" tertutup dan menampilkan kartu terbuka untuk Gumroad, Lemon Squeezy, PromptBase, Whop, Creem.io, Payhip, dan Agensi.io dengan rincian fee dan jalur payout.
  - **Matriks Komparasi 8 Platform di Tab 4 (`components/AgensiCatalogModal.tsx`)**: Tabel perbandingan lengkap model bisnis, potongan fee, jalur payout Indonesia, deliverable kiriman, 4 pilar omnichannel playbook, dan advisory perbankan Indonesia (Direct IDR Bank, USDC Polygon, USDC Solana).
  - **Multi-Marketplace Checkout di Tab 1**: Tombol direct checkout untuk setiap platform yang dikonfigurasi dan shortcut pengaturan pasar.

---
## [V7.3.0] - 2026-11-18
### Universal Agent Skill Creator, Header 1-Baris Minimalis & Privasi 9-Tap
- **Penyederhanaan Header Ramping 1-Baris (`components/Header.tsx`)**:
  - Mengeliminasi bilah sekunder mobile dan memadatkan kontrol header menjadi tata letak 1-baris responsif.
- **Privasi Penuh Fitur Kreator & AI**:
  - Fitur pembuatan skill dan pengaturan AI terkunci aman di balik gerbang privat 9-Tap Logo Unlock (`showAIFeatures`).
- **Universal Agent Skill & Market Kit (All-in-One)**:
  - Merombak formulir studio menjadi alur 3 langkah bersih (Identitas & Harga, Deskripsi & Live Demo >= 700 karakter, serta Salin & Jual).
  - Standarisasi format live demo paritas tinggi dengan heading `## Summary` dan langkah kerja agen AI.

---
## [V7.2.1] - 2026-11-18
### Ekosistem Monetisasi Agensi.io (Model Hibrida), 10 Paket Skill `.zip` & Pabrik Ekspor Browser
- **Etalase Afiliasi Publik (`components/Header.tsx`, `components/TemplateGallery.tsx`, `components/AgensiSkillPromoCard.tsx`, `components/AgensiCatalogModal.tsx`)**:
  - Menambahkan tombol publik **Skills (`10`)** di Header, banner katalog di Galeri, kartu rekomendasi kontekstual per kategori di Studio, serta modal katalog 10 paket dengan filter *All / Free ($0) / Paid Flagship* tanpa mengekspos unduhan `.zip` gratis ke pengunjung publik.
- **Pabrik `.zip` 1-Klik & Generator Listing Copy (`services/skillZipService.ts`, `components/AgentSkillViewer.tsx`, `components/AISettingsModal.tsx`, `config/agensiConfig.ts`)**:
  - Menambahkan generator `.zip` POSIX bebas dependensi di browser (`SKILL.md` di root, `references/framework-guide.md`, `templates/sample-input.json`, `scripts/validate-output.mjs`), tombol **Salin Listing Copy** untuk form `Agensi.io/sell`, serta form override URL afiliasi/toko berbasis `localStorage` (`pm_agensi_urls`).
- **10 Paket Agent Skills & CLI Packager (`agensi-skills/`, `scripts/package-agensi-skills.mjs`, `scripts/audit-frameworks.mjs`)**:
  - Menyempurnakan `multimodal-video-image-director` (validator `validate-multimodal-params.mjs` + penyelarasan model 2026) dan `seo-geo-aeo-content-engine` (`https://prompt.sigitadi.id`).
  - Menambahkan 4 paket Flagship baru: `owasp-api-and-cloud-security-auditor`, `multi-agent-swarm-and-subagent-orchestrator`, `postgres-prisma-zero-downtime-sql-tuner`, dan `playwright-e2e-and-openapi-contract-suite`.
  - Menambahkan perintah `npm run package:skills` dan `npm run audit` untuk menghasilkan 10 arsip POSIX `.zip` di `dist-agensi/` beserta `AGENSI-LISTING-MANIFEST.md` (SOP pencairan Zoneless USDC Solana untuk Indonesia).
- **Ekspansi Multi-Marketplace 3 Pilar (`scripts/package-multi-channels.mjs`, `config/agensiConfig.ts`, `AgensiCatalogModal.tsx`, `AISettingsModal.tsx`)**:
  - Menambahkan skrip `npm run package:channels` yang membangun: (1) `dist-lead-magnet/` berisi hanya skill gratis `prompt-matrix-prompt-architect` dengan guard anti-bocor paket berbayar untuk direktori terbuka; (2) `dist-channels/storefronts/promptmatrix-9-flagship-suite.zip` (`SUITE-README.md` + 9 folder flagship, `$59.00` vs `$133.92`, hemat `$74.92` / `56%`) beserta `STOREFRONT-MANIFEST.md` untuk Lemon Squeezy, Creem.io, Gumroad, Whop, dan Payhip; serta (3) `dist-channels/promptbase/` berisi 15 listing PromptBase tervalidasi (`PROMPTBASE-15-LISTINGS.md` dan `.json`).
  - Menambahkan kartu Suite Bundle dan tombol checkout sekunder bersyarat (hanya muncul bila URL terkonfigurasi) pada `AgensiCatalogModal.tsx`, serta form lipat **Secondary Marketplace Channels** pada tab `skills` di `AISettingsModal.tsx`.

### Penyelarasan Model Frontier 2026, Pembersihan Model Defunct & Perbaikan Tata Letak Responsif (2026-11-17)
- **Integrasi Model Frontier 2026 & Pembersihan Model Usang (`services/aiSettingsService.ts`, `services/universalAIService.ts`, `data/aiPlatforms.ts`, `components/AISettingsModal.tsx`)**:
  - **Google Gemini:** Mengintegrasikan model frontier aktif late-2026: `gemini-4-carbon` (default kognisi tertinggi), `gemini-4-argon` (multimodal & reasoning), `gemini-4-hydrogen` (ultra-ringan & latensi terendah), `gemini-3.8-flash`, `gemini-3.7-flash`, dan `gemini-3.5-flash-lite`. Memangkas model yang sudah tidak aktif (`gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.5-flash`).
  - **OpenAI:** Mengintegrasikan model frontier aktif late-2026: `gpt-6.1-sol` (default), `gpt-6-astra`, `gpt-6.1-terra`, `gpt-6.1-luna`, `gpt-5.2-codex`, dan `gpt-5`. Menghapus total model deprecated/defunct (`gpt-4o`, `gpt-4o-mini`, `gpt-4.5-preview`, `o3`, `o4-mini`).
  - **Anthropic Claude:** Mengintegrasikan model frontier aktif late-2026: `claude-sonnet-5-5` (default), `claude-opus-5-5`, `claude-fable-5-2`, `claude-haiku-5-5`, dan `claude-sonnet-4-5`. Menghapus keluarga legacy Claude 3 (`claude-3-5-sonnet`, `claude-3-opus`, dll).
  - **OpenRouter & OpenAI-Compatible (Kustom):** Menyelaraskan seluruh preset model kustom dengan model frontier aktif 2026 (`gemini-4-carbon`, `gemini-4-argon`, `gemini-4-hydrogen`, `gpt-6-astra`, `gpt-6.1-sol`, `claude-sonnet-5-5`, `deepseek-v4-pro`, dll) dan memperbaiki label provider "OpenAI-Compatible (Kustom)".
- **Audit & Perbaikan Tata Letak Responsif `AgentSkillViewer.tsx`**:
  - Memperbaiki tata letak bagian footer info komisi Agensi.io agar tidak tertekan menjadi kolom sempit vertikal satu kata per baris saat nama file `-SKILL.md` panjang.
  - Memisahkan blok paragraf info komisi dengan baris status info file menggunakan tata letak bertingkat flex-col dan `truncate min-w-0`.
- **Penguatan Kepatuhan TypeScript & Standar RetroBOT**:
  - Mengeliminasi tipe `any` terlarang di seluruh basis kode komponen dan service.
  - Memperbaiki tabrakan nama props `name` (TS2783) dan tipe `formValues` di `components/FrameworkPane.tsx`.
  - Menginstal `@types/node` untuk menuntaskan resolusi TS2688.
  - Memperbarui cache Service Worker ke `promptmatrix-v7.2.1` dan versi `package.json` ke `7.2.1`.

---
## [V7.2.0] - 2026-11-17
### Agent Skill SKILL.md Builder, Agensi.io Readiness & 400 Master Frameworks
- **Pratinjau & Ekspor `SKILL.md` Berstandar Open Agent Skills (`services/agentSkillService.ts`, `components/AgentSkillViewer.tsx`, `config/agensiConfig.ts`)**:
  - Menambahkan mode tampilan keempat `SKILL.md` pada Studio Output Card dan Modal Review Layar Penuh.
  - Fungsi `buildAgentSkillSpec`, `validateAgentSkillSpec`, dan `formatAgentSkillMarkdown` mengonversi state formula aktif menjadi spesifikasi `SKILL.md` dengan validasi panjang `name` (`<= 64` kebab-case) dan `description` (`<= 1024`), serta menghapus karakter kontrol maupun em dash.
  - Dilengkapi tombol **Salin SKILL.md**, tombol **Unduh `-SKILL.md`**, dukungan tema Terang & Gelap, strip 27 runtime agen di `AGENSI_CONFIG.supportedAgents`, dan informasi kesiapan katalog Agensi.io.
- **6 Paket Agent Skills & Playbook (`agensi-skills/`, `docs/AgensiMarketplacePlaybook.md`)**:
  - Merilis 6 paket skill siap pakai beserta referensi dan skrip validator: `antislop-ui-and-copy-auditor`, `fullstack-ts-nextjs-architect`, `mcp-server-production-builder`, `multimodal-video-image-director`, `prompt-matrix-prompt-architect`, dan `seo-geo-aeo-content-engine`.
- **Peningkatan ke 400 Formula Master & Penyelarasan Model Late-2026**:
  - Penambahan 40 formula baru sehingga total mencapai 400 formula di 8 kategori dan 83 subkategori (`Kode & Pengembang: 50`, `Koleksi & Inovasi: 36`, `Teks & Konten: 98`, `Prompt Proyek: 36`, `Gambar & Desain: 54`, `Video & Animasi: 35`, `Audio & Musik: 37`, `Prompt Ringkas: 54`).
  - Pembaruan preset dan referensi model ke standar late-2026 (GPT-5, o3, o4-mini, Claude 4 / Sonnet 4.5, Gemini 3.7, DeepSeek R1/V3, xAI Grok 4.6, Midjourney v7, FLUX.2, Veo 3, Kling 2.1, Sora 2, Runway Gen-4, Suno v4.5/v5).
  - Sinkronisasi penuh lokalisasi ID <-> EN (`services/localizationService.ts`), sample data 1-klik (`services/sampleDataService.ts`), dan visual benchmark (`services/visualBenchmarkService.ts`).
  - Pembaruan katalog `docs/DaftarKerangkaKerja.md` dan `public/docs/DaftarKerangkaKerja.md`, Service Worker cache `promptmatrix-v7.2.0`, serta metadata SEO/PWA/OG.

---
## [V7.1.0] - 2026-11-16
### Clean JSON Prompt Preview (Zero Decode Errors) & Few-Shot AI Suggest
- **Pratinjau JSON Bebas Decode Error Berstandar RFC 8259 (`services/jsonPromptService.ts` & `components/CleanJsonViewer.tsx`)**:
  - Menambahkan tab pratinjau ketiga `{ } JSON` pada Studio Output Card dan Modal Review Layar Penuh.
  - Sanitasi karakter kontrol, normalisasi baris, penghapusan byte tak kasat mata (zero-width chars `\u200B`), dan validasi ganda `JSON.parse` internal.
  - 100% bebas dari `json.decoder.JSONDecodeError` pada Python, `SyntaxError: Bad control character` pada Node.js, unescaped quotes, dan unescaped backslashes.
  - 3 Sub-format JSON: **Struktur Penuh (Full Structure)**, **Format Chat API (Messages)** siap pakai OpenAI/Claude/Gemini, dan **Prompt String Aman**.
  - Visualizer kode monospace modern dengan pewarnaan sintaks murni React JSX dan nomor baris interaktif.
  - Tombol **Salin JSON** langsung di pojok pratinjau dan sinkronisasi otomatis tombol salin utama.
- **✨ AI Suggest pada Contoh Acuan Few-Shot (`components/FrameworkPane.tsx` & `services/universalAIService.ts`)**:
  - Tombol mandiri **AI Suggest** pada kolom *Contoh Masukan (Sample Input)* dan *Contoh Keluaran yang Diharapkan (Expected Output)*.
  - Prompt kognitif khusus spesialis *In-Context Learning* yang menghasilkan pasangan masukan dan jawaban yang selaras konteks framework.

---
## [V7.0.0] - 2026-10-28
### Visual Mockup & Benchmark Engine for All 360 Templates
- **Visual Mockup & Benchmark Showcase (Universal 360 Templates)**:
  - Pratinjau visual terkurasi beresolusi tinggi untuk seluruh formula di 8 kategori.
  - 100% selaras dengan skenario isian otomatis (*1-Click Sample*) di `services/sampleDataService.ts`.
  - Zero rate-limit: mengeliminasi dependensi model publik pihak ketiga yang rentan limit kuota.
  - Tampil instan (0 detik latensi) dan 100% offline-ready (PWA Cache-First).
  - Dilengkapi Lightbox Zoom Modal (fullscreen preview dengan shortcut `Esc`), ringkasan parameter kunci (*Key Visual Parameters*), akordion *Sembunyikan/Tampilkan Visual*, dan tombol *Unduh Gambar* lokal.

---
## [V6.4.2] - 2026-10-28
### Security, Privacy & Layout Enhancements
- **Proteksi Fitur AI Discretionary (Default Tersembunyi)**:
  - Tombol **Atur AI** di header dibungkus kondisional `{showAIFeatures && ...}`.
  - State awal `showAIFeatures` dikembalikan ke default `false` (hanya aktif jika `pm_ai_unlocked === 'true'`).
  - Seluruh fitur AI (Atur AI, AI Suggest, AI Enhance, AI Quality Score, panduan AI) disembunyikan total sebelum pengguna secara sadar mengaktifkannya via 9-tap logo.
- **Transformasi Grid Kategori Kebutuhan (Tanpa Geser / Non-Scrolling)**:
  - Mengubah baris geser horizontal (`overflow-x-auto whitespace-nowrap`) menjadi layout grid responsif.
  - Tampilan ponsel (< 640px): 2 kolom dengan tombol "Semua Kategori" membentang penuh di atas.
  - Tampilan tablet/desktop (≥ 640px): Grid 3x3 simetris dengan ikon SVG, nama kategori terpotong rapi (*truncate*), dan badge hitungan.

---
## [V6.4.1] - 2026-10-28
### Added & Enhanced
- **Responsivitas Layar Mobile Penuh (360px - 420px)**:
  - Tombol **Ganti Bahasa** (Globe + "ID"/"EN") dan **Pengaturan AI** (Sparkle + Status Dot + "AI") 100% selalu terlihat di header pada semua ukuran layar mobile.
  - Tab Switcher tengah (Galeri/Studio) diset responsif (`hidden sm:flex`) untuk mengeliminasi pemotongan dan scrollbar horizontal (*zero horizontal overflow*).
  - Aksesibilitas tap target diperbesar hingga $\ge 32\text{px} \times 32\text{px}$ di mobile dan $\ge 36\text{px}$ di desktop.
  - Menambahkan safe-area inset `pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]` pada *Mobile Floating Dock* di bagian bawah.
  - Memperbaiki bug auto-zoom iOS Safari pada form input (`font-size: 16px !important`).
- **Audit Translasi Total Dua Arah (360 Formula Terverifikasi)**:
  - Kamus `EN_TO_ID_FRAMEWORK_NAMES_MAP` (260 judul formula Inggris ➔ padanan resmi Bahasa Indonesia).
  - Pemetaan judul formula Indonesia ➔ Inggris pada Modal Review (`translateFrameworkName`).
  - 52 label komponen dan 52 info tooltip baru dari formula v6.4.0 terdaftar dwibahasa di `COMPLETE_LABELS_MAP`, `ALL_INFOS_MAP`, dan `EN_TO_ID_LABELS_MAP`.
  - 62 pilihan dropdown terdaftar dwibahasa di `OPTION_TRANSLATIONS` dan `EN_TO_ID_OPTIONS_MAP`.
  - Badge ToolType kartu galeri terjemah dinamis (`Teks`, `Kode`, `Gambar`, `Video`, `Audio & Musik`, `Perencanaan`, `Umum`).
- **Aktivasi Fitur AI Default**:
  - `showAIFeatures` aktif secara bawaan (`true`) sehingga fitur AI dapat langsung dinikmati tanpa perlu 9-tap logo.

---
## [V6.0.0] - YYYY-MM-DD (Tanggal Rilis Sebenarnya)
### Added
- **Fitur Inti: Analisis & Penilaian Prompt oleh AI (Membutuhkan Kunci API):**
    - Pengguna dapat meminta analisis mendalam untuk prompt yang aktif atau yang dimuat dari Stash.
    - AI (Gemini) memberikan feedback terstruktur meliputi:
        - Skor Kejelasan (1-10) dengan justifikasi.
        - Skor Spesifisitas (1-10) dengan justifikasi.
        - Identifikasi Potensi Ambiguitas dalam prompt.
        - Saran Tindak Lanjut konkret untuk perbaikan.
        - Penilaian Keseluruhan singkat mengenai kualitas prompt.
    - Tombol baru "Analisis Detail dengan AI 📊" ditambahkan di panel Pratinjau Prompt.
    - Hasil analisis ditampilkan secara terstruktur di bawah pratinjau prompt, dalam format yang mudah dibaca.
### Changed
- Nomor versi aplikasi diperbarui menjadi V6.0.0 di footer, `package.json`, dan dokumentasi.
- State management di `App.tsx` diperluas untuk menangani data dan status fitur analisis detail (`detailedAiAnalysis`, `isFetchingDetailedAnalysis`, `detailedAnalysisError`, `detailedAiAnalysisReceived`).
- Komponen `PromptOutput.tsx` dimodifikasi secara signifikan untuk mengakomodasi tombol baru dan area tampilan hasil analisis detail, termasuk logika parsing untuk respons AI.
### Technical Notes
- Fungsi baru `fetchDetailedAiAnalysis` di `App.tsx` untuk memanggil model Gemini (`gemini-2.5-flash-preview-04-17`) dengan *system instruction* khusus yang dirancang untuk tugas analisis prompt (tersedia di `translations.ts` sebagai `geminiDetailedAnalysisInstruction`).
- *System instruction* meminta Gemini untuk mengembalikan respons teks yang terstruktur dengan header spesifik (misalnya, "Skor Kejelasan (1-10):", "Potensi Ambiguitas:") untuk memudahkan parsing.
- Fungsi `renderFormattedTextSection` di `PromptOutput.tsx` digunakan (dengan penyesuaian jika perlu) untuk mem-parsing dan menampilkan teks berformat dari AI.
- Penambahan kunci terjemahan baru di `types.ts` dan `translations.ts` untuk semua UI elemen, pesan, dan judul bagian terkait fitur analisis detail.
- Ikon baru `ChartBarIcon.tsx` ditambahkan dan digunakan untuk tombol analisis detail.

---

## [V5.5.0] - YYYY-MM-DD 
### Added
- File `updates.md` untuk log fitur dan pembaruan tingkat tinggi.
- Adopsi Semantic Versioning (SemVer: `MAJOR.MINOR.PATCH`) mulai dari versi ini.
### Changed
- Versi pada footer aplikasi diperbarui menjadi `V5.5.0`.
- Versi di `package.json` diubah menjadi `5.5.0`.
- `README.md` diperbarui untuk mencerminkan versi `V5.5.0` dan adopsi SemVer.
### Technical Notes
- Diskusi awal mengenai standarisasi sistem versioning dan pembuatan `release-notes.md`.
- Persiapan untuk pencatatan rilis yang lebih detail.

---

## [V5.1 - V5.4] - YYYY-MM-DD (Periode Rilis Inkremental)
### Added
- **Manajemen Data:**
    - Fungsionalitas Ekspor/Impor untuk Prompt Stash (data JSON). Tombol ditempatkan pada panel Prompt Stash.
    - Notifikasi Toast untuk status keberhasilan/kegagalan operasi Ekspor/Impor.
- **Pengalaman Pengguna (UX):**
    - Fitur "Favorite Frameworks":
        - Pengguna dapat menandai/membatalkan penandaan kerangka kerja sebagai favorit menggunakan ikon bintang.
        - Kerangka kerja favorit ditampilkan secara visual berbeda dan diurutkan di bagian atas daftar kategori masing-masing.
        - Status favorit disimpan menggunakan `localStorage`.
### Changed
- Peningkatan logika penyortiran daftar kerangka kerja untuk menampilkan favorit di atas.
- Peningkatan styling untuk indikator favorit.
- Logika perakitan prompt interaktif disempurnakan untuk hasil yang lebih bersih dan akurat.
- Pembaruan pada `README.md` dan `LICENSE.md` untuk kejelasan dan kelengkapan.
### Fixed
- Berbagai perbaikan bug minor dan peningkatan stabilitas.
### Technical Notes
- Implementasi `JSON.stringify` untuk ekspor dan `JSON.parse` dengan validasi dasar untuk impor.
- Penggunaan `localStorage` untuk menyimpan array ID kerangka kerja favorit (`favoriteFrameworkIds`).
- Peningkatan fokus pada atribut ARIA untuk aksesibilitas yang lebih baik.

---

## [V5.0] - YYYY-MM-DD
### Added
- **Fitur Inti - Prompt Stash (My Prompt Stash):**
    - Penyimpanan prompt lokal menggunakan **IndexedDB**.
    - Operasi CRUD (Create, Read, Update, Delete) untuk prompt.
    - Panel "Prompt Stash" khusus di UI untuk melihat, memuat, mengganti nama, dan menghapus prompt.
- **Navigasi Kerangka Kerja:**
    - Bilah Pencarian/Filter di atas daftar kerangka kerja.
- **Umpan Balik Pengguna:**
    - Sistem Notifikasi Toast untuk berbagai aksi (simpan, muat, hapus, error).
### Changed
- **UI & Styling:**
    - Peningkatan signifikan pada animasi dan umpan balik visual untuk interaksi UI.
    - Penyesuaian layout untuk mengakomodasi panel baru.
    - Peningkatan styling placeholder input agar non-copyable dan lebih jelas.
    - Logika pratinjau prompt yang konsisten, menampilkan teks instruksional hingga ada input pengguna yang signifikan.
### Technical Notes
- Integrasi IndexedDB melalui helper `db.ts` (fungsi `openDB`, `addPromptToDB`, `getAllPromptsFromDB`, dll.).
- Penggunaan React `useState` dan `useEffect` untuk mengelola state Prompt Stash dan interaksi DB.

---

## [V4.0] - YYYY-MM-DD
### Added
- **Revolusi Pembuatan Prompt - Interactive Prompt Studio:**
    - Semua kerangka kerja **Gambar, Video, dan Musik** dikonversi untuk menggunakan **Interactive Prompt Builder** baru.
    - Tipe input beragam: Isian Manual, Pilihan Tunggal (Dropdown dengan opsi "Lainnya..." yang memunculkan input teks), Pilihan Ganda (Checkbox Kolapsibel).
- **Integrasi AI yang Ditingkatkan (Membutuhkan Kunci API):**
    - **Saran Kerangka Kerja Berbasis AI**: AI menganalisis deskripsi tujuan pengguna dan merekomendasikan kerangka kerja yang relevan (ditandai visual).
    - **Saran AI untuk Isian "Lainnya..."**: Bantuan AI kontekstual untuk input kustom di dropdown mode interaktif.
- **UI/UX Overhaul:**
    - **Indikator Status API Key Dinamis**: Header menampilkan "AI Inside" (API aktif) atau "Disconnected" (API tidak aktif) dengan styling dan animasi.
### Changed
- Perilaku panel input/output utama yang dapat diciutkan disempurnakan.
- Konsistensi visual dan estetika ditingkatkan di seluruh aplikasi.
- Logika perakitan prompt untuk kerangka kerja interaktif disempurnakan untuk output yang lebih bersih.
### Technical Notes
- Implementasi komponen `InteractivePromptBuilder.tsx`.
- Modifikasi signifikan pada `frameworks.ts` untuk mendukung definisi interaktif.
- Logika state management diperluas untuk menangani nilai formulir interaktif dan status AI.
- Penggunaan variabel CSS untuk status API dinamis.

---

## [V3.0] - YYYY-MM-DD
### Added
- **Integrasi AI Awal (Tergantung Kunci API Google Gemini):**
    - **Peningkatan Prompt Berbasis AI**:
        - Umpan balik keseluruhan prompt (tombol "Get AI Suggestions").
        - Saran per-isian untuk kerangka kerja teks.
- **Panduan Pengguna & Transparansi:**
    - Penonaktifan visual dan fungsional fitur AI jika tidak ada kunci API.
    - **Modal Disclaimer**: Menginformasikan tujuan alat, ketergantungan fitur AI, dan privasi.
    - **Modal Cara Pakai**: Panduan fitur dan alur kerja aplikasi, termasuk diagram visual.
### Technical Notes
- Integrasi awal dengan `@google/genai` SDK.
- Pembuatan komponen Modal (`DisclaimerModal.tsx`, `HowToUseModal.tsx`).
- Penambahan state untuk mengelola feedback AI dan status API key.

---

## [V2.0] - YYYY-MM-DD
### Added
- **Kategori Kerangka Kerja Baru**: "Media" (untuk Gambar & Video AI) dan "Musik" (untuk Musik & Audio AI).
- **Struktur Kerangka Kerja Awal**: Kerangka kerja dasar non-interaktif (berbasis komponen) untuk alat AI media dan musik populer (Midjourney, DALL-E, Suno AI, dll.).
- **Tautan Alat**: Integrasi tautan langsung ke situs web/platform resmi untuk banyak alat AI yang didukung.
### Technical Notes
- Perluasan struktur data `Framework` di `types.ts` dan `frameworks.ts` untuk mengakomodasi kategori dan tautan baru.
- Penyesuaian UI untuk pemilihan kategori.

---

## [V1.0] - YYYY-MM-DD
### Added
- **Tujuan Edukasi Inti**: Dirancang untuk membantu pengguna mempelajari dan memahami prinsip-prinsip konstruksi prompt yang efektif.
- **Kerangka Kerja Prompt Teks**: Fokus pada metodologi prompt berbasis teks yang sudah dikenal (misalnya, RTF, TRACE, CARE, TAG).
- **Input Berbasis Komponen**: Pengguna mengisi komponen-komponen berbeda dari kerangka kerja yang dipilih.
- **Pratinjau Prompt Real-Time**: Output prompt yang dihasilkan secara dinamis berdasarkan input pengguna.
- **Fungsionalitas Inti**:
    - Salin ke Clipboard untuk transfer prompt yang mudah.
    - Antarmuka Dwibahasa (Inggris & Indonesia).
    - Desain Responsif dengan Tema Gelap.
- **Konten Statis**: Kerangka kerja dan contoh sebagian besar di-hardcode.
- **Tanpa Integrasi AI**: Berfungsi murni sebagai alat sisi klien lokal untuk konstruksi dan pembelajaran prompt.
### Technical Notes
- Struktur proyek awal dengan React dan TypeScript.
- Implementasi `LanguageContext` untuk dukungan dwibahasa.
- Styling dasar menggunakan CSS standar dan Tailwind CSS (via CDN).

---
*Catatan: Log ini adalah ringkasan tingkat tinggi. Versi sub spesifik mungkin telah menyertakan perbaikan bug minor dan penyesuaian UI yang tidak dirinci secara lengkap di sini.*
