# Changelog - PromptMatrix 2.0

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
