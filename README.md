# PromptMatrix 2.0 - Ultimate Guided AI Prompt Generator 🚀

[![Production Build](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Frameworks](https://img.shields.io/badge/Master%20Frameworks-360%20Templates-blue.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Bilingual](https://img.shields.io/badge/Languages-100%25%20Bilingual%20(ID%20%7C%20EN)-purple.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Live Domain](https://img.shields.io/badge/Live-prompt.sigitadi.id-emerald.svg)](https://prompt.sigitadi.id)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PromptMatrix 2.0** adalah platform generator prompt AI berpemandu dan terstruktur terlengkap dengan **360 formula master siap pakai** berstandar global. Dirancang untuk memudahkan siapa saja—mulai dari pengguna awam non-teknis hingga profesional tingkat lanjut—meracik instruksi prompt AI berkualitas tinggi, kontekstual, dan berdaya guna dalam hitungan detik untuk ChatGPT, Claude 3.7 Thinking, Gemini, DeepSeek R1, Midjourney v6.1, FLUX.1, Kling 1.5, Suno v4, dan berbagai model AI mutakhir lainnya.

🌐 **Website Live Resmi**: [https://prompt.sigitadi.id](https://prompt.sigitadi.id)  
📖 **Panduan Deployment & DNS**: Baca [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan konfigurasi domain dan hosting.

---

## 🌟 Fitur Unggulan

- 💎 **360 Formula Prompt Master**: Mencakup 8 kategori inti dengan 80 subkategori spesifik, termasuk 10 Masterclass 2026 (Reasoning GCC, Cursor Rules, MCP Server, FLUX.1 Descriptive Studio, Kling Director, Suno v4, TikTok Shop Live, LPDP Essay).
- 🌐 **Deteksi Bahasa Cerdas & Dual Bahasa (EN ⇄ ID)**: Default bahasa Inggris (EN) dengan auto-deteksi preferensi browser (otomatis Bahasa Indonesia jika locale browser ID/IN). Pengguna dapat beralih bahasa kapan saja melalui header switcher dengan persistensi `localStorage`. Seluruh 4.300+ entri teks tersinkronisasi 100%.
- ⚡ **1-Klik Isi Contoh Nyata (*Fill Sample*)**: Membantu pengguna baru memahami cara kerja formula dengan mengisi data formulir secara otomatis menggunakan skenario riil dalam Bahasa Indonesia atau Bahasa Inggris didukung smart dictionary.
- 🎨 **2 Mode Antarmuka Intuitif**:
  - 🧭 **Galeri Template**: Tampilan kartu visual modern dengan filter kategori instan, 20 quick search tags terverifikasi, dan pencarian intent cerdas.
  - 🛠️ **Studio Peracik**: Layout 2-kolom lapang (58% formulir input berpemandu, 42% kartu preview prompt langsung dengan penghitung karakter & estimasi token).
- 🧹 **AI Enhance Sanitizer**: Output AI dibersihkan otomatis dari kebocoran code fence (```markdown) dan bold asterisks (**).
- 📦 **Prompt Stash, Backup & Markdown Export**: Simpan racikan prompt favorit langsung di browser (IndexedDB) dan ekspor ke format JSON atau **Markdown (.md)** siap pakai.
- 🚀 **Quick Launch ke 38+ AI Tools**: Salin prompt dan buka langsung ChatGPT, Claude 3.7, Google Gemini, DeepSeek R1, Perplexity, Midjourney, Runway, Kling, Suno, dll. dalam satu klik.
- 🔒 **100% Privasi & Client-Side**: Seluruh data dan racikan formulir diproses secara lokal di peramban Anda tanpa pengiriman data ke server pihak ketiga.

---

## 📚 Pembagian 8 Kategori Master (360 Frameworks)

| Kategori | Jumlah Template | Cakupan Niche & Kemampuan |
| :--- | :---: | :--- |
| 📝 **Teks & Konten** | **90** | Copywriting (AIDA), TikTok Live, Esai LPDP, SEO, Email, Naskah Podcast, Storytelling |
| ⚡ **Prompt Ringkas** | **52** | Reasoning Models (GCC), Formula Kilat (PAS, BAB, FAB), Negosiasi Cepat, Hook Medsos |
| 🎨 **Gambar & Desain** | **50** | Midjourney v6.1 (--cref/--sref), FLUX.1 Studio, DALL-E 3, Fotografi Produk, Seni 3D |
| 💻 **Kode & Pengembang** | **40** | AI Coding Agent (.cursorrules), MCP Server Designer, RAG Pipeline, Refactoring, DevOps |
| 🎵 **Audio & Musik** | **35** | Suno v4 Hit Song, Udio, Produksi Lagu, Sound Design, Voiceover, Soundscape |
| 🚀 **Prompt Proyek** | **31** | Perencanaan Bisnis, Pitch Deck Investor, Peluncuran Produk, Manajemen Proyek |
| 💡 **Koleksi & Inovasi** | **31** | Model Mental, SCAMPER, Blue Ocean Strategy, TRIZ, First Principles Thinking |
| 🎬 **Video & Animasi** | **31** | Kling 1.5 & Runway Gen-3 Director, OpenAI Sora, Luma Ray, Naskah Video Viral |
| **TOTAL KESELURUHAN** | **360** | **Master Frameworks Terintegrasi Penuh** |

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
│       └── deploy.yml           # CI/CD otomatis untuk GitHub Pages
├── components/
│   ├── AISettingsModal.tsx      # Modal pengaturan API key & preferensi model
│   ├── Footer.tsx               # Footer modern dan tautan dokumentasi
│   ├── FrameworkPane.tsx        # Panel studio peracik formulir & live preview
│   ├── Header.tsx               # Navigasi atas, toggle bahasa, dan Stash badge
│   ├── HelpModal.tsx            # Panduan interaktif dan FAQ pengguna
│   ├── InputField.tsx           # Komponen input dinamis (text, select, textarea, dll.)
│   ├── NavigationPane.tsx       # Sidebar navigasi kategori & subkategori
│   └── TemplateGallery.tsx      # Grid galeri kartu formula & filter instan
├── contexts/
│   └── LanguageContext.tsx      # State management dwibahasa (ID ↔ EN)
├── data/
│   ├── aiPlatforms.ts           # Daftar 38 platform AI tools untuk Quick Launch
│   └── frameworks.ts            # Basis data 350 master prompt frameworks
├── docs/                        # Dokumentasi SOP, panduan AI Pro, dan FAQ
├── public/
│   ├── CNAME                    # Custom domain pointer (prompt.sigitadi.id)
│   ├── _redirects               # SPA routing rewrite
│   ├── robots.txt               # SEO robots configuration
│   └── sitemap.xml              # SEO XML sitemap
├── services/
│   ├── localizationService.ts   # Mesin lokalisasi presisi 4.213 entri (ID ↔ EN)
│   └── sampleDataService.ts     # Mesin data contoh realistis otomatis
├── App.tsx                      # Root application logic & state orchestration
├── DEPLOYMENT.md                # Panduan teknis publikasi live domain
├── package.json                 # Konfigurasi dependensi & skrip build
└── vite.config.ts               # Konfigurasi bundler Vite & alias path
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi [MIT](LICENSE).

---

*PromptMatrix 2.0 — Optimize Your AI, Starting from the Prompt.*
