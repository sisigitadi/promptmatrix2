# Draf Revisi & Rencana Kerja Teknis: Audit & Perbaikan Translasi Total (revisi.md)

Dokumen ini disusun oleh **RetroBOT** (Arsitek Sistem & Asisten Rekayasa Resmi Sigit Adi) sebagai rencana perbaikan teknis atas audit translasi dwibahasa (Bahasa Indonesia 🇮🇩 ↔ Bahasa Inggris 🇬🇧) pada PromptMatrix 2.0.

> **Status:** SELESAI & TERVERIFIKASI 100% (COMPLETED & VERIFIED)  
> **Target:** 100% Translasi Dua Arah Sempurna (Zero English in ID mode, Zero Indonesian in EN mode) & Tampilan Mobile Responsif Optimal (Tombol AI & Bahasa 100% Terlihat)

---

## 📌 1. Hasil Temuan Audit Menyeluruh (Root Cause Analysis)

Berdasarkan audit otomatis dan inspeksi menyeluruh terhadap 360 kerangka kerja (frameworks), `services/localizationService.ts`, `App.tsx`, dan `components/TemplateGallery.tsx`, ditemukan akar masalah sebagai berikut:

### A. Judul Template EN Muncul di Mode ID (260 Kasus)
- **Penyebab:** Pada `data/frameworks.ts`, sebanyak 260 formula memiliki key/judul asli dalam Bahasa Inggris (misal: *"AI Coding Agent Rules Architect (.cursorrules & Windsurf)"*, *"MCP Server & Tool Designer"*, *"Pareto Principle 80/20 High-Leverage Strategic Audit"*, dsb).
- Di `services/localizationService.ts`, fungsi `translateFrameworkName` didefinisikan sebagai:
  ```ts
  export const translateFrameworkName = (fwName: string, lang: 'id' | 'en'): string => {
    if (lang === 'id' || !fwName) return fwName || '';
    return FRAMEWORK_NAMES_MAP[fwName] || fwName;
  };
  ```
  Artinya: saat pengguna memilih mode **ID (Bahasa Indonesia)**, sistem langsung mengembalikan `fwName` mentah tanpa ada proses penerjemahan dari EN ke ID! Tidak ada kamus `EN_TO_ID_FRAMEWORK_NAMES_MAP`.
- **Dampak:** 260 template (72% dari pustaka) tampil dengan judul Bahasa Inggris meskipun pengguna sedang dalam mode Bahasa Indonesia.

### B. Judul Template ID Muncul di Mode EN (Kasus Modal Review & Stash)
- **Penyebab:** Pada `App.tsx` (baris 1394 pada modal *Review & Copy Prompt*):
  ```tsx
  {selectedFrameworkName && (
    <span className="text-emerald-400 font-medium truncate max-w-[200px] sm:max-w-xs">
      {selectedFrameworkName}
    </span>
  )}
  ```
  Variabel `selectedFrameworkName` dicetak secara mentah tanpa dibungkus `translateFrameworkName(selectedFrameworkName, language)`.
- **Dampak:** Untuk 100 template yang key aslinya berbahasa Indonesia (misal: *"Brainstorming Ide Bisnis Modal Kecil (Side Hustle)"*, *"Simulasi Wawancara Kerja Interaktif (Mock Interviewer)"*), judul tetap muncul dalam Bahasa Indonesia saat pengguna berada di mode Bahasa Inggris.

### C. Komponen Formulir v6.4.0 Berbahasa Indonesia di Mode EN (52 Labels & 52 Infos)
- **Penyebab:** 10 formula terbaru v6.4.0 (AIDA, GCC Reasoning, Kling/Runway, Suno v4, Cursorrules, MCP Server, TikTok Live, LPDP Essay, FLUX.1, Midjourney v6.1) memiliki label dan info yang ditulis dalam Bahasa Indonesia, namun **belum terdaftar** di dalam `COMPLETE_LABELS_MAP` dan `ALL_INFOS_MAP`.
- **Dampak:** Saat beralih ke mode Bahasa Inggris (EN), label formulir seperti *"Tech Stack, Framework & Versi Utama"*, *"Larangan Mutlak (Strict Constraints & Anti-Patterns)"*, *"Profil & Rekam Jejak Pelamar"*, dan seluruh info tooltip-nya tetap tampil dalam Bahasa Indonesia.

### D. Pilihan Dropdown (Options) Belum Terpetakan Sempurna (62 Opsi EN Mode & 16 Opsi ID Mode)
- **Penyebab:** 62 opsi baru dari 10 template v6.4.0 belum terdaftar di `OPTION_TRANSLATIONS` (ID ➔ EN), dan 16 opsi teknis bahasa Inggris belum memiliki terjemahan di `EN_TO_ID_OPTIONS_MAP` (EN ➔ ID).
- **Dampak:** Opsi select tampil dalam bahasa yang berlawanan dengan preferensi bahasa aktif.

### E. Label Subkategori & Badge ToolType
- Subkategori `"AI, RAG & Desktop Multiplatform"` dan `"Voiceover & Sound Design"` identik antara ID dan EN. Perlu dibuatkan versi bahasa Indonesia yang natural (`"AI, RAG & Desktop Lintas Platform"`, `"Sulih Suara & Desain Suara"`).
- Badge ToolType di `TemplateGallery.tsx` baris 374 mencetak string mentah (`text`, `code`, `video`, `music-composition`, `planning`, `General`) tanpa lokalisasi di mode ID.

---

## 🛠️ 2. Rencana Tindakan Perbaikan Teknis (Action Plan)

### Modul 1: `services/localizationService.ts`
1. **Buat Kamus `EN_TO_ID_FRAMEWORK_NAMES_MAP` (260 Judul Template):**
   - Menerjemahkan seluruh 260 judul formula Inggris ke padanan Bahasa Indonesia yang profesional, presisi, dan kontekstual.
   - Contoh:
     - `"AI Coding Agent Rules Architect (.cursorrules & Windsurf)"` ➔ `"Arsitek Aturan Agen Koding AI (.cursorrules & Windsurf)"`
     - `"MCP (Model Context Protocol) Server & Tool Designer"` ➔ `"Perancang Server & Tool MCP (Model Context Protocol)"`
     - `"LangChain & LlamaIndex RAG Pipeline Architect"` ➔ `"Arsitek Pipeline RAG LangChain & LlamaIndex"`
     - `"Pareto Principle 80/20 High-Leverage Strategic Audit"` ➔ `"Audit Strategis Berdampak Tinggi Prinsip Pareto 80/20"`
     - `"Eisenhower Matrix Priority & Time Mastery Engine"` ➔ `"Mesin Prioritas & Manajemen Waktu Matriks Eisenhower"`
     - `"Pre-Mortem Analysis & Project Failure Prevention"` ➔ `"Analisis Pre-Mortem & Pencegahan Kegagalan Proyek"`
2. **Perbarui Logika `translateFrameworkName`:**
   ```ts
   export const translateFrameworkName = (fwName: string, lang: 'id' | 'en'): string => {
     if (!fwName) return '';
     if (lang === 'id') {
       return EN_TO_ID_FRAMEWORK_NAMES_MAP[fwName] || fwName;
     }
     return FRAMEWORK_NAMES_MAP[fwName] || fwName;
   };
   ```
3. **Perbarui `getLocalizedFramework`:**
   - Pada blok `if (lang === 'id')`, ganti `name: fwName` menjadi `name: translateFrameworkName(fwName, 'id')`.
4. **Lengkapi 52 Label ke `COMPLETE_LABELS_MAP`:**
   - Memasukkan seluruh padanan Bahasa Inggris untuk 52 label komponen input v6.4.0.
5. **Lengkapi 52 Info ke `ALL_INFOS_MAP`:**
   - Memasukkan seluruh padanan Bahasa Inggris untuk 52 deskripsi info/tooltip input v6.4.0.
6. **Lengkapi 62 Opsi Dropdown ke `OPTION_TRANSLATIONS` & 16 Opsi ke `EN_TO_ID_OPTIONS_MAP`:**
   - Sinkronisasi opsi dropdown dua arah secara komprehensif.
7. **Perbarui `COMPLETE_SUBCATEGORIES_MAP` & `SUBCATEGORY_TRANSLATIONS`:**
   - Menambahkan translasi untuk subkategori yang masih identik.

### Modul 2: `App.tsx`
1. **Perbaiki Modal Review Prompt (baris 1394):**
   - Bungkus `{selectedFrameworkName}` dengan `{translateFrameworkName(selectedFrameworkName, language)}`.
2. **Sinkronkan Penamaan Simpan ke Koleksi (Stash):**
   - Gunakan nama yang telah dilokalisasi saat menyimpan prompt ke Stash.

### Modul 3: `components/TemplateGallery.tsx`
1. **Lokalisasi Badge ToolType di Kartu Template (baris 374):**
   - Buat helper mapper untuk toolType:
     - `text` ➔ ID: `Teks`, EN: `Text`
     - `code` ➔ ID: `Kode`, EN: `Code`
     - `video` ➔ ID: `Video`, EN: `Video`
     - `music-generation` / `music-composition` / `audio-generation` ➔ ID: `Musik / Audio`, EN: `Music / Audio`
     - `image-generation` / `image-editing` ➔ ID: `Gambar`, EN: `Image`
     - `planning` ➔ ID: `Perencanaan`, EN: `Planning`
     - `General` ➔ ID: `Umum`, EN: `General`

---

## 📋 3. File yang Terdampak
1. `services/localizationService.ts` (Kamus translasi 260 judul EN->ID, 52 labels, 52 infos, 62 options, update fungsi translasi)
2. `App.tsx` (Lokalisasi modal review dan stash naming)
3. `components/TemplateGallery.tsx` (Lokalisasi badge toolType pada card)
4. `prd.md` (Update status living context Zona Bawah setelah eksekusi)

---

## 🛡️ 4. Rencana Pengujian & Validasi
1. **Automated Verification Script:** Menjalankan script validasi mandiri Node.js untuk mengecek:
   - Jumlah judul EN yang tampil di ID: **0**
   - Jumlah judul ID yang tampil di EN: **0**
   - Jumlah label yang belum terjemah di EN: **0**
   - Jumlah info yang belum terjemah di EN: **0**
2. **Build Type-Check:** Menjalankan `npm run build` untuk memastikan 0 TypeScript error dan bundle tetap teroptimasi (< 500 kB).

---

---

## 🎯 5. Hasil Verifikasi Akhir (Verification Outcomes)
1. **Automated Verification Script:**
   - 360 formula diuji menyeluruh di 8 kategori.
   - Judul formula dengan translasi ID yang presisi: **262 formula** (seluruh 260 formula Inggris + 2 bilingual).
   - Judul formula dengan translasi EN yang presisi: **100 formula** (seluruh 100 formula Indonesia).
   - 52 missing component labels, 52 missing infos, dan 62 missing options terdaftar 100% dua arah.
   - Subkategori & ToolType terjemah dwibahasa secara mulus.
2. **Mobile Device Display & Responsiveness:**
   - Tombol ganti bahasa (Globe + "ID"/"EN") dan tombol konfigurasi AI (Sparkle + Status Dot + "AI") 100% selalu terlihat di layar mobile (360px - 420px).
   - Horizontal scrollbar / layout overflow tereliminasi total.
   - iOS input zoom bug diperbaiki (`font-size: 16px`).
   - Mobile floating dock dilengkapi `safe-area-inset-bottom` untuk iPhone dan Android gesture bar.
3. **Build & Type-Check:**
   - `npm run build` sukses 100% tanpa error (`✓ built in 2.69s`).
