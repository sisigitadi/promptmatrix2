# PromptMatrix 2.0 - Ultimate Guided AI Prompt Generator 🚀

[![Production Build](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Frameworks](https://img.shields.io/badge/Master%20Frameworks-350%20Templates-blue.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Bilingual](https://img.shields.io/badge/Languages-100%25%20Bilingual%20(ID%20%7C%20EN)-purple.svg)](https://github.com/sisigitadi/promptmatrix2)
[![Live Domain](https://img.shields.io/badge/Live-prompt.sigitadi.id-emerald.svg)](https://prompt.sigitadi.id)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PromptMatrix 2.0** adalah platform generator prompt AI berpemandu dan terstruktur terlengkap dengan **350 formula master siap pakai** berstandar global. Dirancang untuk memudahkan siapa saja—mulai dari pengguna awam non-teknis hingga profesional tingkat lanjut—meracik instruksi prompt AI berkualitas tinggi, kontekstual, dan berdaya guna dalam hitungan detik untuk ChatGPT, Claude, Gemini, DeepSeek, Midjourney, Sora, dan berbagai model AI lainnya.

🌐 **Website Live Resmi**: [https://prompt.sigitadi.id](https://prompt.sigitadi.id)  
📖 **Panduan Deployment & DNS**: Baca [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan konfigurasi domain dan hosting.

---

## 🌟 Fitur Unggulan

- 💎 **350 Formula Prompt Master**: Mencakup 8 kategori inti dengan 80 subkategori spesifik yang telah diaudit dan disinkronkan secara mendalam.
- 🌐 **100% Sinkronisasi Dual Bahasa (ID ⇄ EN)**: Seluruh 4.213 entri teks—mulai dari nama formula, deskripsi, persona sistem AI, label kolom, tips balon, placeholder contoh nyata, opsi dropdown, hingga output live preview—berganti bahasa secara reaktif dan alami.
- ⚡ **1-Klik Isi Contoh Nyata (*Fill Sample*)**: Membantu pengguna baru memahami cara kerja formula dengan mengisi data formulir secara otomatis menggunakan skenario riil dalam Bahasa Indonesia atau Bahasa Inggris.
- 🎨 **2 Mode Antarmuka Intuitif**:
  - 🧭 **Galeri Template**: Tampilan kartu visual modern dengan filter kategori instan, pencarian cerdas, dan navigasi cepat.
  - 🛠️ **Studio Peracik**: Layout 2-kolom lapang (58% formulir input berpemandu, 42% kartu preview prompt langsung dengan penghitung karakter & estimasi token).
- 🚀 **Quick Launch ke 38+ AI Tools**: Salin prompt dan buka langsung ChatGPT, Claude 3.7, Google Gemini, DeepSeek R1, Perplexity, Midjourney, Runway, Kling, Suno, dll. dalam satu klik.
- 📦 **Prompt Stash & Koleksi**: Simpan dan kelola racikan prompt favorit Anda langsung di peramban tanpa perlu login.
- 🔒 **100% Privasi & Client-Side**: Seluruh data dan racikan formulir diproses secara lokal di peramban Anda tanpa pengiriman data ke server pihak ketiga.

---

## 📚 Pembagian 8 Kategori Master (350 Frameworks)

| Kategori | Jumlah Template | Cakupan Niche & Kemampuan |
| :--- | :---: | :--- |
| 📝 **Teks & Konten** | **87** | Copywriting, SEO, Email Marketing, Naskah Podcast, PR, Storytelling, Akademis |
| ⚡ **Prompt Ringkas** | **51** | Formula Kilat (AIDA, PAS, BAB, FAB), Negosiasi Cepat, Elevator Pitch, Hook Medsos |
| 🎨 **Gambar & Desain** | **48** | Midjourney, DALL-E 3, Stable Diffusion, Desain Logo, Fotografi Produk, Seni 3D |
| 💻 **Kode & Pengembang** | **38** | Refactoring, Unit Testing, Desain API, Arsitektur Backend, DevOps, Smart Contract |
| 🎵 **Audio & Musik** | **34** | Suno AI, Udio, Produksi Lagu, Sound Design, Voiceover, Soundscape Meditasi |
| 🚀 **Prompt Proyek** | **31** | Perencanaan Bisnis, Pitch Deck Investor, Peluncuran Produk, Manajemen Proyek |
| 💡 **Koleksi & Inovasi** | **31** | Model Mental, SCAMPER, Blue Ocean Strategy, TRIZ, First Principles Thinking |
| 🎬 **Video & Animasi** | **30** | Runway Gen-3, OpenAI Sora, Kling AI, Pika, Naskah Video Viral TikTok/Reels |
| **TOTAL KESELURUHAN** | **350** | **Master Frameworks Terintegrasi Penuh** |

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
