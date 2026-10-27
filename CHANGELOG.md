# Changelog - PromptMatrix 2.0


## [6.4.0] - 2026-10-28
### 🚀 Rilis Besar PromptMatrix v6.4.0: 360 Formula Master, Sanitizer AI, Optimasi Bundle & Stash Markdown

#### Ditambahkan (Added):
- **10 Formula Masterclass 2026 Baru (Total 360 Formula Terverifikasi)**:
  - *Goal-Constraint-Context (GCC) Reasoning Framework*: Arsitektur prompt modern khusus model penalaran (Claude 3.7 Sonnet Thinking, DeepSeek-R1, OpenAI o1/o3).
  - *AIDA Klasik Copywriting Master*: Formula copywriting legendaris (Attention, Interest, Desire, Action) untuk sales letter dan ads.
  - *Midjourney v6.1 Character & Style Consistency Architect*: Konsistensi karakter dan gaya antar scene menggunakan parameter resmi `--cref`, `--cw`, `--sref`, dan `--style raw`.
  - *FLUX.1 Photorealistic Descriptive Studio*: Deskriptif fotorealistik studio dengan lensa sinematik (Cooke S4, Leica, Hasselblad) dan multi-source lighting tanpa negative tags.
  - *Kling 1.5 & Runway Gen-3 Cinematic Motion Director*: Pengaturan kamera sutradara (Dolly, Orbit, Crane), pacing gerak, dan kontinuitas adegan video AI.
  - *Suno v4 Hit Song Lyric & Prompt Architect*: Blueprint lirik ber-metatag stanzal (`[Intro]`, `[Verse]`, `[Chorus]`, `[Outro]`), BPM tempo, dan fusi genre.
  - *AI Coding Agent Rules Architect (`.cursorrules` & Windsurf)*: Dokumen konfigurasi ketat untuk AI coding agent otonom (Cursor, Windsurf, Copilot, Antigravity).
  - *MCP (Model Context Protocol) Server & Tool Designer*: Blueprint server MCP resmi Anthropic untuk tool custom dan integrasi Claude Desktop/Cursor IDE.
  - *TikTok Shop & Shopee Live High-Converting Stream Script*: Naskah host interaktif dengan hook 3 detik penahan scroll dan flash sale countdown.
  - *LPDP & Beasiswa Kontribusi Indonesia Essay Architect*: Struktur esai beasiswa bergengsi dengan golden thread masalah riil, keunggulan kampus, dan roadmap kontribusi 2045.
- **Ekspor Koleksi Stash ke Markdown (.md)**: Pengguna kini dapat mengekspor seluruh koleksi prompt tersimpan ke dalam berkas Markdown berformat rapi selain format JSON.
- **20 Quick Search Tags & 35 Intent Keyword Mappings**: Navigasi pencarian cepat instan di Galeri Template yang teruji 100% akurat ke formula terkait.

#### Diperbaiki & Dioptimalkan (Fixed & Optimized):
- **Sanitizer Otomatis AI Output (`sanitizePromptText`)**: Mengatasi bug format teks berantakan saat menggunakan fitur AI Enhance, membersihkan kebocoran markdown code fences (```markdown), format bintang tebal (**), dan prolog percakapan AI.
- **Optimasi Ukuran Bundle & Code-Splitting Vite**:
  - Konfigurasi `manualChunks` di `vite.config.ts` memecah bundle data (`data-frameworks`, `data-localization`, `vendor-react`).
  - Bundle JavaScript utama berkurang drastis dari **1.415 kB** menjadi **152 kB** (penghematan **89%**), bebas peringatan limit chunk Vite.
- **UI/UX Clean SVG Icons**: Menggantikan seluruh raw emoji pada drawer Stash dan filter navigasi dengan SVG icon modern yang elegan dan presisi.
- **Resiliensi ErrorBoundary**: Opsi reset cache darurat kini melindungi `pm_ai_settings` (API Keys pengguna) dan `pm_ai_unlocked` agar tidak terhapus.
- **Pembersihan Dead Code (Repo Hygiene)**: Menghapus 8 berkas usang/orphan dan mencopot dependensi tak terpakai `@google/genai`.
- **SEO & Domain Alignment**: Sinkronisasi seluruh canonical URL, OpenGraph, JSON-LD, dan atribusi author ke `https://prompt.sigitadi.id` oleh Sigit Adi.

## [6.3.1] - 2026-10-28
### 🔗 Link Portofolio Developer di Header

#### Ditambahkan (Added):
- **Link Portofolio di Header**: Menambahkan tautan `🌐 sigitadi.id` di samping subtitle header (area brand), mengarah ke `https://sigitadi.id/` dan terbuka di tab baru.
  - Tampil pada layar `md:` ke atas (tablet & desktop) agar header mobile tetap ringkas.
  - Warna emerald subtle (`emerald-500/70`) dengan efek hover terang (`emerald-400`).

## [6.3.0] - 2026-10-15
### 🌐 Deteksi Bahasa Cerdas (Default EN / Auto-Browser) & Perbaikan Alur Navigasi Awal

#### Ditambahkan (Added):
- **Deteksi Otomatis Bahasa Browser**: Aplikasi kini secara otomatis mendeteksi preferensi bahasa peramban/sistem pengguna (`navigator.languages` & `navigator.language`).
  - Pengguna dengan browser berbahasa Indonesia (`id`, `id-ID`, `in`) otomatis disajikan antarmuka Bahasa Indonesia.
  - Pengguna internasional atau pengaturan bahasa lainnya otomatis disajikan default **English (EN)**.
  - Pilihan manual pengguna melalui tombol switcher di header tetap tersimpan persisten di `localStorage`.
- **Sinkronisasi Otomatis Atribut Dokumen HTML**: Tag `<html lang="...">` diperbarui secara dinamis mengikuti bahasa aktif untuk optimasi SEO dan pembaca layar (*accessibility*).

#### Diperbaiki (Fixed):
- **Perbaikan Halaman Pembuka (Landing View)**:
  - Mengatasi galat navigasi di mana saat aplikasi dibuka atau di-refresh selalu otomatis berpindah ke Mode Studio pada formula *"Koleksi & Inovasi - Prinsip Kepemimpinan & Evaluasi Produk"*.
  - Aplikasi kini selalu terbuka dengan mulus pada **Galeri Template (Mode Galeri)** dengan Hero Banner, bilah pencarian cerdas, dan filter kategori.
- **Konsistensi Urutan Formula Template**:
  - Grid kartu template di Galeri kini tersusun rapi mengikuti `CATEGORY_ORDER` (diawali oleh formula terpopuler *"Teks & Konten"*), bukan urutan acak objek JS.

## [2.0.0] - 2026-08-30
### 🚀 Rilis Besar PromptMatrix 2.0 (Senior Developer Overhaul & Viral Frameworks)

#### Ditambahkan (Added):
- **25 Formula Prompt Viral Baru**: HSO Video Pendek, 10 Hook TikTok/Reels, Deskripsi Shopee/Tokopedia, CS WhatsApp Closing, Latihan Interview Kerja Interaktif, 3D Pixar Avatar, Foto Produk Mewah, Itinerary Traveling Jam-per-Jam, Resep Masak Kulkas, dll.
- **Sistem 2 Mode Tampilan Fleksibel**:
  - `Galeri Template`: Eksplorasi kartu visual kebutuhan dengan chip pencarian cepat.
  - `Studio Peracik 2-Kolom`: Layout lega dan proporsional (58% Form Isian di Kiri, 42% Live Output Studio Card di Kanan).
- **Preset 1-Klik Isi Contoh Nyata** pada seluruh formulir template.
- **Mobile Floating Action Dock** untuk navigasi cepat dan salin instan di layar smartphone.
- **SEO, SEM & OpenGraph Metadata**: Dukungan Google Search Console, Bing Webmaster, Twitter Cards, Schema.org JSON-LD, `robots.txt`, dan `sitemap.xml`.

#### Disempurnakan (Improved):
- Perombakan total visual UI/UX: 100% bebas dari klise template AI, menggunakan tipografi *Inter* + *JetBrains Mono*, warna mewah *Deep Obsidian & Slate* dengan aksen *Emerald*.
- Pembaruan seluruh dokumen panduan (`PanduanPenggunaanInteraktif.md`, `FAQ.md`, `DaftarKerangkaKerja.md`).
- Master Localization Engine 100% sinkron dan bebas residu untuk Bahasa Indonesia & English.
