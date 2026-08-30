# 🚀 Panduan Deployment & Live PromptMatrix 2.0 ke https://prompt.sigitadi.id

Dokumen ini menjelaskan langkah-langkah lengkap untuk mempublikasikan (*deploy*) **PromptMatrix 2.0** agar dapat diakses secara online (live) di domain kustom Anda: **[https://prompt.sigitadi.id](https://prompt.sigitadi.id)**.

Repository: [https://github.com/sisigitadi/promptmatrix2](https://github.com/sisigitadi/promptmatrix2)  
Domain Live: [https://prompt.sigitadi.id](https://prompt.sigitadi.id)

---

## 🌐 Langkah 1: Konfigurasi DNS di Provider Domain Anda (Cloudflare / cPanel / Niagahoster / Rumahweb / Namecheap)

Agar domain `prompt.sigitadi.id` terhubung ke server hosting GitHub Pages:

1. Buka dashboard DNS Manager domain Anda (misal: Cloudflare, cPanel, Niagahoster, dll.).
2. Tambahkan satu entri DNS Record baru bertipe **CNAME**:
   - **Type**: `CNAME`
   - **Name / Host**: `prompt`
   - **Target / Value / Points to**: `sisigitadi.github.io`
   - **TTL**: `Auto` (atau `3600`)
   - *(Jika menggunakan Cloudflare)*: **Proxy status**: `DNS only` (Grey cloud) atau `Proxied` (Orange cloud).
3. Simpan perubahan DNS Record.

---

## ⚙️ Langkah 2: Konfigurasi Custom Domain di GitHub Pages

File `public/CNAME` berisi `prompt.sigitadi.id` sudah tersedia di dalam repositori dan otomatis terbawa saat build.

Untuk memastikannya aktif di GitHub:
1. Buka browser ke repositori Anda: **`https://github.com/sisigitadi/promptmatrix2/settings/pages`**
2. Di bagian **Build and deployment**:
   - **Source**: Pilih **GitHub Actions**.
3. Di bagian **Custom domain**:
   - Ketik: `prompt.sigitadi.id`
   - Klik tombol **Save**.
4. GitHub akan melakukan pengecekan DNS (*DNS check*).
5. Centang opsi **Enforce HTTPS** agar website Anda memiliki sertifikat keamanan SSL gratis otomatis dari Let's Encrypt / GitHub.

---

## 🚀 Langkah 3: Push Kode ke GitHub

Lakukan push ke repositori GitHub Anda:

```bash
# 1. Masukkan semua perubahan
git add .

# 2. Buat commit
git commit -m "feat: configure custom domain prompt.sigitadi.id and deployment automation"

# 3. Dorong ke repositori
git push origin main --force
```

GitHub Actions akan secara otomatis mengompilasi aplikasi dan mempublikasikannya langsung ke **`https://prompt.sigitadi.id`**.

---

## 🌟 Opsi Alternatif: Deployment via Vercel (1-Click)

Jika Anda juga ingin men-deploy cadangan (*fallback*) di Vercel dengan domain `prompt.sigitadi.id`:

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New...** > **Project** > Import repositori **promptmatrix2**.
3. Klik tombol **Deploy**.
4. Setelah deploy selesai, buka **Project Settings** > **Domains**.
5. Tambahkan domain: `prompt.sigitadi.id`.
6. Ikuti arahan DNS Vercel (CNAME record mengarah ke `cname.vercel-dns.com`).

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
