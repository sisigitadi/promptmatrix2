# Pedoman Komponen Prompt yang Patuh Validator

Validator baru memastikan pola **komponen_prompt** konsisten dan siap dipakai tanpa edit manual. Gunakan contoh berikut saat menulis template baru:

## Contoh Format yang Patuh

- **PERAN**  
  `Anda adalah Strategist Konten B2B. [Target Audiens: {target_audience}] [Nada: {tone}]`
- **KONTEKS**  
  `Saya butuh outline konten untuk kampanye {campaign_name}. [Platform Utama: {platform}]`
- **TUGAS**  
  `Susun 5 ide konten beserta CTA singkat. [Batasan: {constraints}]`
- **FORMAT_OUTPUT**  
  `Berikan dalam bullet point ringkas (judul + CTA).`

## Aturan yang Divalidasi

1. **Blok kondisional wajib**  
   Setiap PERAN/KONTEKS/TUGAS harus memiliki blok `[ ... {placeholder} ... ]` agar konten opsional otomatis hilang bila kosong.
2. **Placeholder unik per bagian**  
   Placeholder tidak boleh muncul lebih dari satu kali di antara PERAN, KONTEKS, dan TUGAS. Gunakan satu lokasi yang paling relevan.
3. **Deduplikasi narasi vs detail**  
   Jika placeholder sudah disebut di narasi (PERAN/KONTEKS), jangan ulang di detail (TUGAS/FORMAT_OUTPUT).
4. **Pratinjau tanpa markdown tebal**  
   Hindari `**bold**`; preview harus bersih tanpa penekanan markdown.

## Cara Mengecek

- Otomatis dijalankan lewat pre-commit (`lint-staged`) pada berkas `src/data/frameworks/**/*.json`.
- Jalankan manual sebelum push: `npm run validate:komponen` (hanya berkas framework yang berubah yang dicek).
