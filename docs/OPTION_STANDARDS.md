## Standar Penamaan Opsi & Pola "Lainnya..."

Gunakan panduan singkat ini saat menambah atau mengubah opsi di kerangka prompt:

1) **Format Hybrid EN-ID**

- Tulis label opsi dalam format `Technical Term (Penjelasan ID)`.
- Contoh: `Blog Article (Artikel Blog)`, `Job Interview (Wawancara Kerja)`, `User Flow Design (Perancangan Alur Pengguna)`.
- Pertahankan **label/info UI dalam Bahasa Indonesia** agar pengalaman kurasi tetap konsisten.

2) **Opsi "Lainnya..."**

- Setiap komponen yang memiliki opsi `Lainnya...` **wajib** punya entri `dynamicSubcomponents` untuk trigger tersebut.
- Entri `Lainnya...` harus menampilkan input teks/textarea kustom **dengan** `validation.min_length` (minimal `3` dianjurkan) dan `optional: false`.
- Gunakan label seperti `Sebutkan <Label Komponen> Lainnya` dan jelaskan cara mengisinya dalam bahasa Indonesia.

3) **Validasi Otomatis**

- Jalankan `node scripts/validate-frameworks.js` sebelum commit. Skrip ini gagal jika ada opsi `Lainnya...` tanpa dynamic subcomponent kustom atau tanpa validasi minimal.

Dengan mengikuti pola di atas, opsi lintas kerangka akan tetap konsisten dan siap diperluas tanpa mengorbankan pengalaman kurator.
