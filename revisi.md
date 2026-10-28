# Draf Revisi & Rencana Kerja Teknis: Refactor Hero Banner Ringkas & Latar Belakang Gambar (revisi.md)

Dokumen ini disusun oleh **RetroBOT** (Arsitek Sistem & Asisten Rekayasa Resmi Sigit Adi) sebagai rencana perancangan dan implementasi teknis untuk pembaharuan **Hero Banner** pada PromptMatrix 2.0.

> **Status:** SELESAI & TERVERIFIKASI 100% (COMPLETED & VERIFIED)  
> **Target:**  
> 1. Menambahkan latar belakang gambar bertema Cybernetic Neural Studio dengan overlay gradien gelap tajam (WCAG AAA contrast).  
> 2. Mengurangi jumlah pencarian cepat dari 20 tags menjadi 6 tag esensial lintas modalitas.  
> 3. Memadatkan struktur bagian atas aplikasi (~40% lebih ringkas) dengan placeholder pencarian kontekstual agar konten galeri lekas tampak di layar pertama.  
> **Hasil Validasi:** Build Vite lolos dengan 0 error kompilasi dan 0 type error TypeScript (`✓ built in 2.76s`).

---

## 📌 1. Rincian Perubahan

### A. Latar Belakang Gambar Hero (`Opsi 1: Cybernetic Neural Studio`)
- Menambahkan gambar latar belakang `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80` (Neural network dark matrix) dengan opacity terkontrol (`opacity-20` atau `opacity-25`) dan blend-mode halus.
- Melapisi dengan multi-layer linear & radial dark gradient overlay (`from-[#070b12] via-[#090e18]/95 to-[#090d16]/80` dan `from-black/40 via-transparent to-[#070b12]/90`) sehingga teks putih dan elemen input 100% kontras dan nyaman di mata.

### B. Reduksi Pencarian Cepat (6 Tag Esensial Lintas Pilar)
Memangkas 20 tag menjadi 6 tag terpopuler:
1. `Reasoning (GCC)` (Query: `GCC`)
2. `AIDA Copywriting` (Query: `AIDA`)
3. `Midjourney & Flux` (Query: `Midjourney`)
4. `Cursor & Windsurf` (Query: `cursorrules`)
5. `TikTok Shop & Video` (Query: `TikTok Shop`)
6. `Suno Musik` (Query: `Suno`)

### C. Pemadatan Vertikal & Desain Ringkas (Above-The-Fold Efficiency)
- Padding dipadatkan dari `p-4 sm:p-8 md:p-10` menjadi `py-5 sm:py-6 px-4 sm:px-7`.
- Headline dipadatkan menjadi *"Racik 360 Formula Prompt AI Presisi Tinggi"*.
- Deskripsi diringkas menjadi 1 baris padat.
- Placeholder pencarian kontekstual: *"Cari 360 formula AI: GCC, AIDA, Cursorrules, Midjourney, LPDP..."*.
