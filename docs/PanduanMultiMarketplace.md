# Panduan Lengkap Multi-Marketplace, Monetisasi Skill & Payout Indonesia

Dokumen privat ini terbuka bersamaan dengan fitur **AI Pro & Mode Kreator (9-Ketukan Logo)** di PromptMatrix 2.0. Di dalamnya terangkum strategi lengkap distribusi paralel di **Agensi.io** dan **3 Pilar Market Lain** yang aman untuk kreator di Indonesia tanpa membutuhkan rekening Stripe Indonesia maupun saldo penerima USD Wise.

---

## 1. Gambaran Besar Arsitektur 4 Jalur Pendapatan

PromptMatrix 2.0 memisahkan etalase publik dari pabrik `.zip` privat agar konversi afiliasi tetap terlindungi:

- **Jalur Utama - Agensi.io (Marketplace Skill AI):** Menjual 14 paket flagship satuan (`$9.99` sampai `$19.99`) dan 1 paket gratis (`$0`). Komisi kreator **`70%`** organik atau **`90%`** lewat link `?ref=` (`https://www.agensi.io/r/SIGITADI`) ditambah **`20%`** komisi lintas marketplace selama 6 bulan.
- **Pilar 1 - Direktori OSS & Lead Magnet Gratis (`dist-lead-magnet/`):** Hanya mempublikasikan **1 skill gratis** (`prompt-matrix-prompt-architect`) sebagai corong trafik organik ke `https://prompt.sigitadi.id` dan link afiliasi Agensi.io.
- **Pilar 2 - Toko Digital Global MoR (`dist-channels/storefronts/`):** Menjual bundel **Complete 14-Flagship Suite (`$59.00` vs `$195.87` satuan, hemat `$136.87` / `70%`)** di Lemon Squeezy, Creem.io, Gumroad, Whop, dan Payhip.
- **Pilar 3 - PromptBase (`dist-channels/promptbase/`):** Menjual **15 sistem prompt terstruktur** (`$4.99` sampai `$9.99`, format variabel `[Variable]`, bukan `.zip` kode) dengan payout harian `$0` minimum.

---

## 2. Jalur Utama: Agensi.io (`npm run package:skills`)

1. Jalankan perintah berikut di terminal root proyek:

```bash
npm run package:skills
```

2. Hasilnya otomatis tersimpan di folder lokal `dist-agensi/`:
   - **10 arsip POSIX `.zip`** (`SKILL.md` berada tepat di root `/` setiap arsip, ukuran `5.6 KB` - `12.6 KB`, bebas file sampah OS).
   - **`AGENSI-LISTING-MANIFEST.md`** berisi judul, harga, deskripsi, tag, dan copy siap tempel untuk halaman `Agensi.io/sell`.
3. Anda juga dapat mengekspor paket `.zip` langsung dari formula mana pun di tab pratinjau `SKILL.md` (saat Mode Kreator 9-Tap aktif) lewat tombol **Unduh Paket .zip** dan **Salin Listing Copy**.
4. **Payout Agensi.io (Indonesia):** Gunakan **Zoneless USDC (Solana)**, minimum penarikan **`$3.50`**, cair dalam **`~72 jam`**.

---

## 3. Pilar 1: Lead Magnet & Direktori OSS Gratis (`dist-lead-magnet/`)

Tujuan Pilar 1 adalah mendatangkan trafik developer dan builder dari ekosistem AI gratis **tanpa pernah membocorkan 9 paket flagship berbayar**.

1. Bangun paket 3 pilar dengan perintah:

```bash
npm run package:channels
```

2. Periksa folder **`dist-lead-magnet/`** (terdiri dari 7 file terverifikasi bebas bocor IP berbayar):
   - `SKILL.md` (hanya `prompt-matrix-prompt-architect` versi gratis `$0`)
   - `references/frameworks-cheatsheet.md`
   - `scripts/validate-json-prompt.mjs`
   - `.cursor/rules/prompt-matrix-architect.mdc`
   - `CLAUDE.md`
   - `README.md` (mencantumkan `npx skills add <github-user>/prompt-matrix-skill` dan tabel upgrade ke Agensi.io)
   - `SUBMISSION-CHECKLIST.md`

3. Push isi `dist-lead-magnet/` ke **repositori GitHub publik baru tersendiri** (misalnya `prompt-matrix-skill`), lalu daftarkan ke direktori berikut:
   - **`skills.sh`:** Jalankan `npx skills add <github-user>/prompt-matrix-skill` agar terindeks di registri CLI Open Agent Skills.
   - **`skillsmp.com`:** Pastikan repo GitHub memiliki minimal **`>= 2` GitHub stars** dan frontmatter `SKILL.md` lengkap (`name`, `description`, `license`, `metadata`), lalu kirim URL repo via formulir submit.
   - **`clawhub.ai`:** Login dengan GitHub dan publikasikan slug `prompt-matrix-prompt-architect` dengan tautan balik ke `https://prompt.sigitadi.id`.
   - **`lobehub.com`:** Daftarkan URL repositori di kategori `Prompt Engineering / Developer Tools`.
   - **`claudemarketplaces.com`:** Daftarkan URL repositori yang sudah memiliki `CLAUDE.md` dan `SKILL.md` di root.
   - **`cursor.directory`:** Kirim rule dari `.cursor/rules/prompt-matrix-architect.mdc` di halaman Submit Rule.
   - **`futuretools.io`:** Daftarkan `https://prompt.sigitadi.id` di kategori *Prompt Guides / Generative AI Productivity*.
   - **`Product Hunt`:** Jadwalkan rilis pukul `00:01 PST` (~`14:01`/`15:01 WIB`) untuk meluncurkan PromptMatrix 2.0 bersama paket gratisnya.

---

## 4. Pilar 2: Toko Digital Global & MoR (`dist-channels/storefronts/`)

Setelah `npm run package:channels` selesai, buka folder **`dist-channels/storefronts/`**:
- **`promptmatrix-14-flagship-suite.zip` (`~108 KB`, `48` entri POSIX):** Berisi `SUITE-README.md` di root dan seluruh 14 folder skill flagship berbayar (paket gratis tidak diikutkan).
- **`STOREFRONT-MANIFEST.md`:** Berisi judul produk, deskripsi Markdown, tag, harga bundel **`$59.00` vs `$195.87` total satuan (hemat `$136.87` / `70%`)**, dan rincian copy 14 paket satuan (`dist-agensi/<slug>.zip`).

### Pilihan Platform Pilar 2 & Cara Payout Indonesia

| Platform | Peran Pajak / MoR | Jalur Payout Terbaik ke Indonesia | Biaya & Catatan Operasional |
| :--- | :--- | :--- | :--- |
| **Lemon Squeezy** | Full MoR (mengurus PPN/VAT global) | **Direct IDR Bank Transfer** (BCA/Mandiri/BRI/Jago) | Konversi FX ke IDR ~`1%`; cocok untuk pembeli kartu kredit/PayPal global |
| **Creem.io** | Full MoR (PPN/VAT global ditangani penuh) | **USDC di jaringan Polygon** -> wallet pribadi -> Pintu/Indodax | Biaya payout ~`2%`; pencairan kripto cepat untuk builder global |
| **Gumroad** | MoR + trafik **Gumroad Discover** | **Direct IDR Bank Transfer** | Membantu penemuan organik dari pengguna Gumroad Discover |
| **Whop** | Portal akses digital & komunitas | Bank / Kripto (cek dukungan payout ID terkini) | Bagus jika ingin memberi akses pembaruan berkala bagi pembeli bundel |
| **Payhip** | Checkout langsung / MoR EU-UK | **Midtrans / Xendit (QRIS & Virtual Account IDR)** + PayPal | Paling nyaman untuk pembeli domestik Indonesia via QRIS / VA bank |

*(Catatan tambahan dari playbook: apabila Anda juga membangun **Apify Actor**, pencairan Apify memakai alur Wise yang langsung mengonversi ke **rekening bank IDR lokal**, bukan ditahan di saldo USD Wise.)*

---

## 5. Pilar 3: PromptBase (`dist-channels/promptbase/`)

PromptBase berfokus pada penjualan template prompt individual dengan placeholder `[Variable]` (bukan arsip `.zip` agen). `npm run package:channels` telah mengekstrak **15 formula berintent tinggi** dari `data/frameworks.ts` dan mengisinya otomatis dengan data contoh dari `sampleDataService.ts`:

- **`PROMPTBASE-15-LISTINGS.md` & `promptbase-15-listings.json`:** Memuat 15 listing siap tempel (AI Coding Rules `.cursorrules`, MCP Server, Claude Code Hooks, Postgres RLS, OWASP Security, Multi-Agent Swarm, Pitch Deck, Micro-SaaS Launch, SEO Pillar 3000 kata, SaaS Onboarding Email, Midjourney v7 Omniref, FLUX.2 Kontext, Veo 3, Sora 2, Suno v5) lengkap dengan judul **`<= 40` karakter**, rekomendasi harga **`$4.99` - `$9.99`**, dan contoh tes terisi penuh.
- **Payout PromptBase:** **Zoneless USDC di jaringan Solana**, minimum payout **`$0` USD**, cair **setiap hari**.
- **Trik Komisi `0%` Fee (`?via=`):** Setiap kali membagikan tautan listing PromptBase Anda di web, blog, atau media sosial, tambahkan parameter `?via=<handle-promptbase-anda>`. PromptBase menghapus potongan `20%` pada penjualan yang berasal dari rujukan Anda sendiri (`100%` untuk kreator).

---

## 6. SOP Keamanan Payout Indonesia (Anti-Gagal & Anti-Freeze)

> **Peringatan Wise Indonesia:** Akun Wise yang terdaftar di Indonesia tidak dapat membuka atau menampung saldo rekening penerima USD komersial umum. Jangan pernah mengarahkan payout marketplace USD ke saldo USD Wise yang tidak tersedia.

Alur penarikan **Zoneless USDC (Solana)** yang aman (untuk Agensi.io & PromptBase):
1. Siapkan wallet non-kustodial Solana seperti **Phantom** atau **Solflare**. **Jangan** menempelkan alamat deposit CEX (exchange) langsung sebagai alamat payout di dashboard marketplace.
2. Terima payout **SPL-USDC** masuk ke wallet Phantom/Solflare Anda.
3. Kirim SPL-USDC langsung ke akun **Pintu** (pastikan jaringan **Solana/SPL** cocok!), atau swap `USDC -> SOL` via **Jupiter (`jup.ag`)** lalu kirim `SOL` ke **Pintu / Tokocrypto / Indodax** untuk ditarik menjadi Rupiah (IDR) ke rekening bank lokal.

Alur untuk **USDC Polygon** (Creem.io):
1. Terima USDC (Polygon) ke wallet pribadi (Phantom/Rabby/MetaMask) yang terhubung ke jaringan Polygon.
2. Transfer USDC (Polygon) ke exchange lokal terdaftar yang mendukung jaringan Polygon untuk pencairan IDR.

---

## 7. Cara Menghubungkan Link Market ke PromptMatrix 2.0

Begitu produk Anda sudah live di Lemon Squeezy, Creem.io, Gumroad, atau PromptBase, Anda bisa mengaktifkannya di modal katalog publik PromptMatrix tanpa menulis ulang UI:

### Opsi A - Pasang Cepat di Browser (Per Perangkat via Mode Kreator 9-Tap)
1. Ketuk logo **PromptMatrix 2.0** di header sebanyak **9 kali** hingga fitur AI Pro & Kreator terbuka.
2. Klik ikon **Pengaturan AI** di header -> buka tab **Paket Skill (`10`)**.
3. Klik akordion lipat **Saluran Marketplace Sekunder (Opsional)**.
4. Masukkan URL toko/checkout Anda untuk **Lemon Squeezy**, **Creem.io**, **Gumroad**, atau **PromptBase (`?via=...`)**, lalu klik **Simpan**.
5. Buka modal **Katalog Skill (`10`)**: kartu **Suite Bundle (`$59.00`)** otomatis memunculkan tombol checkout sekunder hanya untuk saluran yang URL-nya sudah terisi, sedangkan saluran kosong tetap disembunyikan agar tidak ada tautan mati. **Agensi.io** tetap menjadi tombol CTA utama.

### Opsi B - Pasang Permanen untuk Semua Pengunjung Website (`https://prompt.sigitadi.id`)
1. Buka berkas `config/agensiConfig.ts` dan isi properti `lemonSqueezyBundleUrl`, `creemBundleUrl`, `gumroadBundleUrl`, dan/atau `promptBaseStoreUrl` pada objek `AGENSI_CONFIG`.
2. Validasi seluruh skrip & UI:

```bash
npx tsc --noEmit
npm run build
npm run audit
npm run package:channels
```

3. Simpan perubahan ke Git dan terbitkan ke GitHub Pages:

```bash
git add .
git commit -m "feat: update secondary marketplace checkout URLs"
git push origin main
npm run deploy
```

---

## 8. Strategi Lisensi & Perlindungan Hak Cipta Komersial

Memilih lisensi yang tepat sangat menentukan apakah karya prompt dan agen AI Anda terlindungi dari pembajakan atau kebocoran:

| Format & Saluran | Lisensi Direkomendasikan | Hak yang Diberikan | Larangan Keras bagi Pembeli |
| :--- | :--- | :--- | :--- |
| **Produk Berbayar Satuan** (Agensi.io, Gumroad, Lemon Squeezy) | **Commercial License (Single-Seat)** | Menjalankan skill pada agent untuk proyek klien & bisnis pribadi | Dilarang mendistribusikan ulang, membagikan gratis, atau menjual kembali source code `.zip` |
| **Bundel Suite Agensi** (Lemon Squeezy, Creem, Whop) | **Team Commercial License / Extended Agency** | Penggunaan multi-kursi tim internal dan delivery solusi white-label ke klien | Dilarang mempublikasikan berkas sumber mentah secara terbuka di repositori publik |
| **Lead Magnet Gratis $0** (GitHub, skills.sh, skillsmp.com) | **MIT License / Apache 2.0** | Siapapun bebas menggunakan, mengkaji, dan mengintegrasikan | Bebas digunakan; ditujukan untuk membangun basis pengguna dan trust |
| **Dual-Licensing Model** (Freemium) | **CC BY-NC 4.0** | Bebas dipakai untuk riset dan eksperimen personal non-komersial | Dilarang digunakan untuk kepentingan komersial tanpa membeli lisensi berbayar |

### Catatan Keamanan Lisensi MIT untuk Kreator
Lisensi MIT bersifat permisif penuh. Jika Anda menjual paket berbayar seharga $19.99 dengan lisensi MIT, secara hukum pembeli berhak menjual ulang atau mengunggah source code tersebut ke GitHub secara cuma-cuma. Oleh karena itu, gunakan **Commercial License (Single-Seat)** untuk semua produk komersial di Agensi.io, Gumroad, dan Lemon Squeezy, serta simpan lisensi **MIT** secara eksklusif untuk paket lead magnet $0 di GitHub.

PromptMatrix v7.6.3 menyediakan **License Selector** terintegrasi di Step 1 Studio Agent Skill (`components/AgentSkillViewer.tsx`), memungkinkan pemilihan preset resmi lengkap dengan deskripsi hak cipta bilingual dan opsi kustom EULA otomatis.

---

## 9. Lokalisasi Dwibahasa Penuh & Sanitasi Otomatis Studio (v7.6.4)

Pada versi 7.6.4, Studio Agent Skill menerapkan sistem lokalisasi 100% dwibahasa (ID/EN) untuk seluruh 15 paket flagship dan formula aktif:

1. **Judul & Profil Flagship Bahasa Indonesia:**
   - Seluruh 15 paket resmi kini memiliki judul resmi berbahasa Indonesia di katalog dan studio (misalnya *Arsitek Fullstack TS & Next.js*, *Pembangun Server MCP Produksi*, *Auditor Keamanan Cloud & API OWASP*).
   - Tagline manfaat, kategori, poin keunggulan, serta skenario uji demo terisi otomatis dalam bahasa Indonesia yang baku tanpa kebocoran istilah bahasa Inggris mentah.

2. **Copy Listing & Spesifikasi Deliverable Dwibahasa:**
   - Generator teks listing marketplace (`services/skillZipService.ts`) memproduksi format Markdown berbahasa Indonesia lengkap dengan header terjemahan (`## Ringkasan`, `### Spesifikasi Deliverable`, `### Pratinjau Kontrak Eksekusi`, `### Verifikasi Standar Kualitas (Quality Gateway)`, dan `## Langkah Selanjutnya`).
   - Lencana status deliverable disesuaikan menjadi `Diterapkan`, `Aktif`, `Terverifikasi`, `Terkemas`, dan `Ditegakkan`.

3. **Pencegahan Polusi Draf Usang (Cache Sanitization):**
   - Sistem secara otomatis mendeteksi jika `localStorage` menyimpan draf bawaan bahasa Inggris dari sesi sebelumnya saat pengguna memilih bahasa Indonesia.
   - Draf bawaan usang tersebut digantikan secara instan dengan profil resmi bahasa Indonesia tanpa menghilangkan perubahan kustom yang dilakukan pengguna.

---

## 10. Perbaikan Otomatis Kesiapan AI & Dashboard Feedback Realtime (v7.6.5)

Fitur perbaikan kesiapan AI di Studio Agent Skill (`components/AgentSkillViewer.tsx`) kini memberikan konfirmasi dan umpan balik langsung setelah AI generate atau suggestion dijalankan:

1. **Tombol 1-Klik Perbaikan Otomatis pada Kotak Peringatan:**
   - Kotak *Catatan Kesiapan* kini dilengkapi tombol interaktif `[Bantu Perbaiki Catatan dengan AI]`.
   - Menghubungkan proses perbaikan langsung ke generator universal AI sehingga seluruh saran perbaikan (judul, tagline, tag, deskripsi, dan demo) dapat dioptimasi sekaligus dengan 1 ketukan.

2. **Dashboard Pembaruan Realtime Pasca-AI (`aiUpdateRecord`):**
   - Menampilkan kartu status pembaruan tepat di atas formulir Step 1 setelah AI selesai memproses data.
   - Menampilkan transisi skor kesiapan (contoh: `67/100 ➔ 100/100 (+33 poin)`), jumlah cek yang lolos, serta rincian catatan kesiapan yang berhasil diselesaikan.
   - Memberikan lencana bidang apa saja yang diperbarui dan konfirmasi kelayakan rilis 100% untuk mempublikasikan paket ke marketplace.

3. **Validasi Header Demo Dwibahasa:**
   - Mesin audit kepatuhan mengakui header `## Ringkasan` (dan `## Ringkasan Eksekutif`) setara dengan `## Summary`, memastikan demo hasil berbahasa Indonesia langsung mendapatkan skor maksimal.

4. **Sanitasi Otomatis Tag Marketplace:**
   - Seluruh tag hasil rekomendasi AI secara otomatis dikonversi ke format kebab-case murni (bebas huruf besar, tanda pagar, dan spasi) agar selalu memenuhi standar registri publik.

---

## 11. Generator Logo Vektor AI & Branding Visual Skill (v7.6.6)

Identitas visual yang profesional sangat penting agar paket skill Anda menonjol di katalog marketplace (Agensi.io, ClawHub, PromptBase) dan etalase digital:

1. **Tombol 'Buat Logo dengan AI' di Studio:**
   - Terintegrasi langsung pada Step 1 Studio (`components/AgentSkillViewer.tsx`).
   - Memanfaatkan Universal AI untuk merancang logo vektor SVG 1:1 (`viewBox 0 0 128 128`) berbentuk squircle modern dengan palet warna dan glif simbolik yang selaras dengan domain skill.

2. **Generator Aligned Deterministik (Offline & Instan):**
   - Menyediakan generator emblem deterministik berbasis pilar (Develop, Grow, Operate, Create) yang menghasilkan logo SVG tajam untuk seluruh 15 paket flagship dan 400 formula tanpa dependensi API luar.

3. **Otomasi Bundel `icon.svg` ke Arsip ZIP:**
   - Berkas `icon.svg` otomatis dikemas ke dalam arsip `.zip` saat tombol *Unduh Paket .zip* diklik (`services/skillZipService.ts`).
   - Kreator dapat mengunduh berkas SVG secara terpisah atau menyalin kode SVG langsung ke clipboard.

4. **Generator Prompt Midjourney v7 / FLUX.2:**
   - Menyediakan tombol salin prompt Midjourney v7 berformat `--ar 1:1 --v 7` bagi kreator yang menginginkan render 3D fotorealistik atau ikon aplikasi gaya iOS.



