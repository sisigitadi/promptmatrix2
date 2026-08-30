# 🚀 Panduan Deployment & Live PromptMatrix 2.0

Dokumen ini menjelaskan langkah-langkah lengkap untuk mempublikasikan (*deploy*) **PromptMatrix 2.0** agar dapat diakses secara online (live).

Repository: [https://github.com/sisigitadi/promptmatrix2](https://github.com/sisigitadi/promptmatrix2)

---

## 📋 Daftar Opsi Deployment

1. [Opsi 1: GitHub Pages Otomatis via GitHub Actions (Sangat Direkomendasikan)](#opsi-1-github-pages-otomatis-via-github-actions)
2. [Opsi 2: GitHub Pages Manual (`npm run deploy`)](#opsi-2-github-pages-manual-npm-run-deploy)
3. [Opsi 3: Vercel (1-Click Deployment)](#opsi-3-vercel-1-click-deployment)
4. [Opsi 4: Netlify / Cloudflare Pages](#opsi-4-netlify--cloudflare-pages)

---

## 🌟 Opsi 1: GitHub Pages Otomatis via GitHub Actions

Workflow GitHub Actions sudah dikonfigurasi di file `.github/workflows/deploy.yml`. Setiap kali Anda melakukan `git push` ke branch `main`, GitHub akan secara otomatis mengkompilasi dan mempublikasikan aplikasi.

### Langkah Aktivasi di GitHub:
1. Buka repositori Anda: `https://github.com/sisigitadi/promptmatrix2`
2. Klik tab **Settings** (Pengaturan) di bagian atas.
3. Di menu sebelah kiri, pilih menu **Pages** (di bawah bagian *Code and automation*).
4. Di bagian **Build and deployment**:
   - Pada dropdown **Source**, pilih **GitHub Actions**.
5. Lakukan push commit terbaru ke branch `main`:
   ```bash
   git add .
   git commit -m "feat: complete master localization and deployment setup for promptmatrix2"
   git push origin main
   ```
6. Buka tab **Actions** di repositori Anda untuk melihat proses build & deployment berjalan.
7. Setelah selesai, website Anda akan live di:
   👉 **`https://sisigitadi.github.io/promptmatrix2/`**

---

## ⚡ Opsi 2: GitHub Pages Manual (`npm run deploy`)

Jika Anda ingin melakukan deploy langsung dari terminal komputer lokal Anda:

1. Jalankan perintah:
   ```bash
   npm run deploy
   ```
2. Perintah ini akan:
   - Menjalankan `npm run build` untuk mengompilasi kode ke folder `dist/`.
   - Mengunggah folder `dist/` ke branch `gh-pages` di repositori GitHub Anda menggunakan paket `gh-pages`.
3. Pastikan di **Settings > Pages**, Source disetel ke **Deploy from a branch** dengan branch `gh-pages` dan folder `/(root)`.

---

## ▲ Opsi 3: Vercel (1-Click Deployment)

Vercel memberikan performa super cepat dengan global CDN dan SSL otomatis gratis.

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repositori **promptmatrix2** dari daftar repositori Anda lalu klik **Import**.
4. Di bagian konfigurasi proyek:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. (Opsional) Jika ingin menggunakan fitur AI live execution dengan Gemini API:
   - Buka **Environment Variables**, tambahkan:
     - `GEMINI_API_KEY`: `your_gemini_api_key_here`
6. Klik tombol **Deploy**.
7. Dalam 30 detik, aplikasi Anda akan live di URL Vercel (misal: `https://promptmatrix2.vercel.app`).

---

## 🌐 Opsi 4: Netlify / Cloudflare Pages

### Netlify:
1. Buka [https://app.netlify.com](https://app.netlify.com) dan hubungkan akun GitHub Anda.
2. Pilih repositori `promptmatrix2`.
3. Set **Build command**: `npm run build` dan **Publish directory**: `dist`.
4. File `public/_redirects` sudah disertakan untuk memastikan *Single Page Application routing* bekerja mulus tanpa error 404 saat refresh halaman.
5. Klik **Deploy site**.

---

## 🔒 Konfigurasi Environment Variable (Opsional)

Aplikasi PromptMatrix 2.0 dapat berjalan **100% offline & client-side** untuk meracik dan menyalin prompt. Jika Anda ingin mengaktifkan fitur integrasi AI langsung ke model Google Gemini:

1. Buat file `.env` di folder utama:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
2. Pada platform hosting (Vercel / Netlify / GitHub Secrets), tambahkan variabel lingkungan `GEMINI_API_KEY` pada menu pengaturan *Environment Variables*.

---

## 🛠️ Perintah Pengembangan Lokal

```bash
# Clone repositori
git clone https://github.com/sisigitadi/promptmatrix2.git
cd promptmatrix2

# Install dependensi
npm install

# Jalankan server lokal
npm run dev

# Uji kompilasi produksi
npm run build

# Preview hasil build produksi
npm run preview
```

---

*PromptMatrix 2.0 — Optimize Your AI, Starting from the Prompt.*
