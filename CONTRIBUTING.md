# Panduan Kontribusi: PromptMatrix

Terima kasih atas minat Anda untuk berkontribusi pada pengembangan **PromptMatrix**! Kami sangat menyambut kontribusi berupa perbaikan bug, penambahan kerangka kerja (*framework*) baru, optimasi performa, maupun penyempurnaan dokumentasi.

---

## 🚀 Alur Kontribusi (Contributor Workflow)

1. **Fork Repositori**: Buat salinan repositori ini ke akun GitHub Anda.
2. **Kloning ke Lokal**:
   ```bash
   git clone https://github.com/USERNAME_ANDA/promptmatrix.git
   cd promptmatrix
   ```
3. **Buat Branch Baru**:
   Gunakan nama branch yang deskriptif:
   ```bash
   git checkout -b feature/nama-fitur-baru
   # atau
   git checkout -b fix/perbaikan-bug-spesifik
   ```
4. **Instal Dependensi & Jalankan Server**:
   ```bash
   npm install
   npm run dev
   ```
5. **Lakukan Perubahan & Pengujian Lokal**:
   Pastikan kode terbebas dari error TypeScript atau masalah linting.
6. **Commit Perubahan Anda**:
   Gunakan konvensi [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(frameworks): tambahkan framework SMART untuk perencanaan proyek"
   ```
7. **Push ke Branch Anda & Buat Pull Request**:
   ```bash
   git push origin feature/nama-fitur-baru
   ```
   Buka GitHub dan ajukan **Pull Request (PR)** ke branch `main`.

---

## 📐 Panduan Menambahkan Framework Baru

Untuk menambahkan kerangka kerja prompt baru ke dalam PromptMatrix, ikuti langkah-langkah berikut:

1. Buka file `data/frameworks.ts`.
2. Tentukan **Kategori** dan **Sub-kategori** yang sesuai di dalam objek `PROMPT_FRAMEWORKS`.
3. Definisikan kerangka kerja mengikuti struktur tipe data `Framework`:

```typescript
"Nama Kerangka Kerja": {
  description: "Deskripsi singkat mengenai fungsi dan kegunaan framework ini.",
  toolType: "text", // Opsi: text | image-generation | video | music-composition | code | planning
  ai_logic_description: "Anda adalah seorang [Peran] yang akan [Tugas].",
  components: [
    {
      name: "namaVariabel",
      label: "Label yang Tampil pada Input",
      type: "text", // Opsi: text | textarea | select | slider | number | multiselect
      placeholder: "Contoh placeholder...",
      info: "Informasi tooltip bantuan untuk pengguna.",
      // Jika type === 'select':
      // options: ["Opsi 1", "Opsi 2", "Lainnya..."]
    }
  ]
}
```

4. Jika framework memiliki sub-komponen bersyarat, gunakan properti `dynamicSubcomponents`:
```typescript
dynamicSubcomponents: {
  trigger: "namaVariabelPemicu",
  options: {
    "Nilai Tertentu": [
      {
        name: "kolomTambahan",
        label: "Label Kolom Tambahan",
        type: "text",
        placeholder: "..."
      }
    ]
  }
}
```

---

## 🧪 Pengujian & Verifikasi

Sebelum mengajukan PR, pastikan:
1. Menjalankan `npm run build` dan memastikan proses kompilasi sukses tanpa error.
2. Membuka browser lokal dan memverifikasi bahwa framework yang baru ditambahkan:
   - Muncul pada daftar sub-kategori di panel kiri.
   - Input formulir berfungsi normal.
   - Opsi `"Lainnya..."` memunculkan kolom kustom jika dipilih.
   - Format teks output terkompilasi dengan benar di panel pratinjau.

---

## 📜 Lisensi Kontribusi
Dengan berkontribusi pada proyek PromptMatrix, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi **MIT**.
