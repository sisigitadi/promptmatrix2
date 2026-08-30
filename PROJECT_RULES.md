# Project Rules & Engineering Standards: PromptMatrix

Dokumen ini berisi standar kode, arsitektur, konvensi penamaan, dan aturan pengembangan untuk proyek **PromptMatrix**.

---

## 🏛️ 1. Arsitektur & Prinsip Utama

1. **Client-Side First & Privacy-Centric:**
   - Aplikasi tidak bergantung pada server backend eksternal untuk menyimpan data pengguna.
   - Seluruh data prompt pengguna disimpan secara lokal di browser melalui **IndexedDB**.
   - API Key Google Gemini disimpan murni di sisi browser (`localStorage`) dan tidak pernah dikirim ke server selain endpoint resmi Google AI Studio.

2. **Modularitas Komponen (React 18 + TypeScript):**
   - Gunakan komponen fungsional (*Functional Components*) dengan React Hooks (`useState`, `useEffect`, `useRef`, `useCallback`).
   - Setiap komponen UI harus memiliki interface TypeScript Props yang jelas dan terdefinisi dengan baik.
   - Hindari komponen monolitik; pisahkan logika data, state UI, dan utilitas helper.

3. **Data-Driven Framework Engine:**
   - Seluruh kerangka kerja prompt didefinisikan secara deklaratif di [data/frameworks.ts](file:///d:/Projects/PromptMatrix2/data/frameworks.ts).
   - Antarmuka formulir dibangun secara dinamis (*dynamic rendering*) berdasarkan tipe komponen (`text`, `textarea`, `select`, `slider`, `number`, `multiselect`, dan `dynamicSubcomponents`).

---

## 💻 2. Standar Penulisan Kode (Coding Standards)

### A. TypeScript
- Aktifkan strict mode. Hindari penggunaan tipe data `any` secara sembarangan. Gunakan *union types* atau *generics* jika tipe bersifat dinamis.
- Seluruh model data utama wajib merujuk ke [types.ts](file:///d:/Projects/PromptMatrix2/types.ts) atau interface yang diekspor dari [data/frameworks.ts](file:///d:/Projects/PromptMatrix2/data/frameworks.ts).

### B. Styling (Tailwind CSS v4)
- Gunakan utility classes dari **Tailwind CSS**.
- Pertahankan palet warna tema gelap konsisten:
  - **Background Utama**: `bg-slate-900`
  - **Surface/Card**: `bg-slate-800/90` dengan border `border-slate-700/80`
  - **Input/Surface Sekunder**: `bg-slate-950` atau `bg-slate-900`
  - **Aksen Primer**: `teal-500` / `teal-600` / `teal-400`
  - **Aksen AI/Ungu**: `purple-500` / `indigo-500`
- Pastikan desain responsif di semua ukuran layar (`sm:`, `md:`, `lg:`, `xl:`).

### C. Penanganan Opsi Dinamis "Lainnya..." (*Custom Fallback Input*)
- Untuk setiap komponen bertipe `select` yang memiliki opsi `"Lainnya..."` atau `"Other..."`, sistem **wajib** memunculkan kolom input teks baru di bawahnya agar pengguna dapat menuliskan nilai kustom.
- Nilai kustom ini harus otomatis dikompilasi ke dalam teks pratinjau prompt.

### D. Standar Output AI Logic
- Format deskripsi persona/logika AI pada prompt terkompilasi harus menggunakan format yang ringkas, baku, dan langsung dipahami oleh LLM:
  ```text
  AI Logic: Anda adalah seorang [Peran] yang akan [Tugas]
  ```
- Hindari awalan bertele-tele seperti *"Persona AI: AI ini berfungsi untuk..."*.

---

## 🌐 3. Aturan Integrasi Provider AI Universal (Multi-Provider & Custom Endpoints)

1. **Dukungan Multi-Provider Standar:**
   - Sistem wajib mendukung: Google Gemini, OpenAI, DeepSeek, OpenRouter, Groq, Anthropic Claude, Ollama (Lokal), dan Custom OpenAI-compatible endpoints.
2. **Kustomisasi Base URL & Model:**
   - Pengguna bebas menentukan `baseUrl` (misalnya endpoint proxy lokal `http://localhost:11434/v1` atau `https://openrouter.ai/api/v1`) serta nama `model` secara bebas.
3. **Penanganan Otentikasi Aman:**
   - Semua API key disimpan di `localStorage` peramban pengguna.
   - Provider lokal seperti Ollama tidak memerlukan API Key (`requiresApiKey: false`).
4. **Fitur Pengujian Koneksi:**
   - Sediakan tombol *⚡ Uji Koneksi* di modal pengaturan untuk memverifikasi keabsahan endpoint dan kredensial sebelum digunakan pada formulir utama.
5. **Universal AI Dispatcher:**
   - Seluruh pemanggilan fitur cerdas (*AI Suggest*, *AI Enhance*, *Quality Analysis*) harus melalui dispatcher universal di [services/universalAIService.ts](file:///d:/Projects/PromptMatrix2/services/universalAIService.ts).

---

## 🗄️ 4. Aturan Basis Data Lokal (IndexedDB & Stash)

1. **Skema Penyimpanan (`PromptMatrixDB`):**
   - Object store: `userPrompts` dengan `keyPath: 'id'` dan `autoIncrement: true`.
2. **Operasi Ekspor / Impor JSON:**
   - Ekspor: Format JSON harus berupa array objek `SavedPrompt` valid dengan timestamp.
   - Impor: Saat mengimpor file JSON, hapus `id` lama dari payload agar `autoIncrement` membuat id baru tanpa menimpa data yang sudah ada di database lokal pengguna.

---

## 🌿 5. Konvensi Git & Kontribusi

1. **Format Pesan Commit (Conventional Commits):**
   - `feat: <deskripsi fitur baru>`
   - `fix: <deskripsi perbaikan bug>`
   - `docs: <pembaruan dokumentasi>`
   - `refactor: <restrukturisasi kode tanpa mengubah fungsionalitas>`
   - `style: <perubahan format, styling Tailwind, atau linting>`
2. **Branching:**
   - `main`: Branch produksi yang siap dideploy ke GitHub Pages (`gh-pages`).
   - `feature/<nama-fitur>`: Branch untuk pengembangan fitur baru.
   - `fix/<nama-bug>`: Branch untuk perbaikan bug spesifik.
