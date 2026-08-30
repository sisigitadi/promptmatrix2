# FAQ & Panduan Troubleshooting: PromptMatrix

Dokumen ini memuat daftar pertanyaan umum dan solusi langkah-demi-langkah jika Anda mengalami kendala saat menjalankan atau menggunakan **PromptMatrix**.

---

## ❓ Pertanyaan Umum (FAQ)

### 1. Apakah data prompt saya disimpan di server pengembang?
**Tidak.** PromptMatrix dirancang dengan prinsip privasi penuh (*100% Client-Side Privacy*). Seluruh data riwayat prompt disimpan secara lokal di browser Anda menggunakan teknologi **IndexedDB**. Tidak ada data prompt atau identitas pribadi yang dikirim ke server kami.

### 2. Bagaimana cara mendapatkan Google Gemini API Key?
Anda dapat memperoleh API Key secara gratis melalui portal Google AI Studio:
1. Kunjungi [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Masuk menggunakan akun Google Anda.
3. Klik tombol **"Create API Key"** dan salin kunci tersebut.
4. Di PromptMatrix, klik ikon pengaturan **⚙️** di pojok kanan atas, tempelkan API key, lalu klik **Simpan**.

### 3. Apakah saya bisa menggunakan PromptMatrix tanpa API Key?
**Bisa.** Anda tetap dapat menggunakan seluruh pustaka ratusan framework, menyusun prompt secara interaktif, menyalin prompt, dan menyimpan/mengekspor prompt ke file JSON. API Key hanya dibutuhkan jika Anda ingin menggunakan fitur cerdas AI seperti *✨ AI Suggest*, *✨ AI Enhance*, dan *📊 Analisis Kualitas Prompt*.

---

## 🛠️ Panduan Troubleshooting Kendala Teknis

### Kendala 1: Perintah `npm run dev` Error / 'vite' is not recognized
**Penyebab:** Folder `node_modules` belum diinstal atau terjadi korupsi paket dependensi.  
**Solusi:**
Jalankan instalasi ulang dependensi:
```bash
npm install
npm run dev
```

---

### Kendala 2: Port 5173 Sudah Digunakan (Port in Use)
**Penyebab:** Ada instance server Vite lain yang sedang berjalan di background.  
**Solusi:**
Vite akan secara otomatis beralih ke port berikutnya seperti `http://localhost:5174`. Cek URL yang tertera pada log terminal Anda.

---

### Kendala 3: Error Fitur AI "API_KEY_INVALID" atau "Quota Exceeded"
**Penyebab:** Kunci API yang dimasukkan salah, kedaluwarsa, atau kuota gratis Google AI Studio telah mencapai batas limit per menit.  
**Solusi:**
1. Klik tombol **⚙️** di pojok kanan atas PromptMatrix.
2. Klik **Hapus**, lalu masukkan kembali API Key yang valid dari Google AI Studio.
3. Tunggu beberapa saat jika Anda terkena pembatasan kuota (*rate limiting*). PromptMatrix telah dilengkapi mekanisme *multi-model fallback* (`gemini-2.5-flash` ➡️ `2.0-flash` ➡️ `1.5-flash`) untuk meminimalisir gangguan.

---

### Kendala 4: Prompt yang Disimpan Tidak Muncul di Browser Lain
**Penyebab:** IndexedDB terikat pada browser dan perangkat fisik lokal tempat prompt tersebut dibuat.  
**Solusi:**
1. Di perangkat pertama, buka menu **📁 Koleksi**, lalu klik **📤 Ekspor JSON** untuk mengunduh file cadangan `.json`.
2. Di perangkat kedua, buka PromptMatrix, masuk ke menu **📁 Koleksi**, lalu klik **📥 Impor JSON** dan pilih file yang telah diunduh tadi.

---

### Kendala 5: Tampilan CSS Rusak / Tailwind Tidak Memuat Gaya
**Penyebab:** Cache Vite atau browser lawas yang belum disegarkan.  
**Solusi:**
1. Lakukan *Hard Refresh* di browser dengan menekan `Ctrl + F5` (Windows) atau `Cmd + Shift + R` (Mac).
2. Hentikan server dev di terminal dan jalankan:
```bash
npm run dev -- --force
```
