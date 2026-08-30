# Standar Operasional Prosedur (SOP): Prompt Framework Design

Dokumen SOP ini mengatur tata cara perancangan, penamaan, strukturisasi komponen, dan penyusunan persona kecerdasan buatan (*AI Logic*) untuk seluruh kerangka kerja di dalam **PromptMatrix**.

---

## 🎯 1. Struktur Standar Kerangka Kerja (Framework Schema)

Setiap entri kerangka kerja wajib memenuhi 4 pilar utama:

### Pilar 1: Identitas & Klasifikasi
- **Nama Kerangka Kerja (`name`)**: Singkat, jelas, dan menyertakan singkatan jika ada (contoh: `RTF (Role-Task-Format)` atau `S-E-L-S-C`).
- **Deskripsi (`description`)**: 1-2 kalimat padat yang menjelaskan tujuan praktis framework tersebut.
- **Tipe Alat (`toolType`)**: Wajib salah satu dari:
  - `text` (Teks & Konten)
  - `image-generation` (Gambar & Ilustrasi)
  - `video` (Video & Animasi)
  - `music-composition` (Komposisi Musik & Audio)
  - `code` (Pemrograman & Pengembang)
  - `planning` (Perencanaan Proyek & Strategi)

---

### Pilar 2: Formula Persona & Logika AI (`ai_logic_description`)
- Harus dirumuskan secara lugas, baku, dan langsung mengarahkan instruksi ke LLM:
  ```text
  Anda adalah seorang [Peran Ahli] yang akan [Tugas Utama yang Dilakukan] berdasarkan [Parameter/Konteks Kunci].
  ```
- **Contoh Benar**:
  > *"Anda adalah seorang Pakar SEO Konten yang akan menyusun artikel SEO terstruktur dan ramah mesin pencari berdasarkan kata kunci dan target audiens."*
- **Contoh Salah**:
  > *"Persona AI: AI ini akan membantu pengguna untuk mengetik artikel..."* (Terlalu bertele-tele dan pasif).

---

### Pilar 3: Komponen Variabel Input (`components`)
Setiap variabel input harus memiliki:
1. `name`: Identifier unik camelCase (contoh: `targetAudience`, `primaryKeyword`).
2. `label`: Label yang jelas dan mudah dipahami dalam bahasa Indonesia atau Inggris.
3. `type`: Tipe elemen input yang paling sesuai (`text`, `textarea`, `select`, `slider`, `number`, dll.).
4. `placeholder`: Contoh nyata pengisian input.
5. `info`: Penjelasan singkat di tooltip mengenai fungsi data tersebut bagi AI.
6. **Dukungan Opsi Kustom**: Setiap elemen `select` wajib menyediakan opsi `"Lainnya..."` / `"Other..."` di akhir array opsi agar pengguna tidak dibatasi oleh pilihan baku.

---

### Pilar 4: Sub-komponen Dinamis (`dynamicSubcomponents`)
Gunakan properti ini untuk memunculkan kolom lanjutan secara kondisional hanya saat pengguna memilih opsi pemicu tertentu (misalnya: saat memilih tipe media tertentu, maka opsi resolusi/kamera khusus akan muncul).

---

## 📋 2. Matriks Komposisi Prompt Natural

Output yang dihasilkan oleh PromptMatrix mengikuti tata letak standar berikut:

```text
AI Logic: Anda adalah seorang [Peran] yang akan [Tugas]

[Label Komponen 1]: [Nilai Komponen 1]
[Label Komponen 2]: [Nilai Komponen 2]
[Label Komponen 3]: [Nilai Komponen 3]

Instruksi Tambahan: [Instruksi Batasan / Konteks Khusus jika ada]
```

Format ini terbukti paling optimal bagi model-model bahasa modern (GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Flash, DeepSeek-V3) karena memisahkan antara *system persona*, *structured parameters*, dan *user constraints*.
