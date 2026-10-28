# ATURAN REKAYASA & RUNBOOK AGEN AI: PromptMatrix 2.0 (RetroBOT Standard)

> **Repositori:** PromptMatrix 2.0  
> **Arsitek & Pemilik:** Sigit Adi ([https://sigitadi.id](https://sigitadi.id))  
> **Standar Rekayasa:** RetroBOT Protocol (`RetroBOT.md`)  
> **Kepatuhan:** Wajib ditaati oleh semua AI Coding Agent (Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot).

---

## 1. Sumber Kebenaran Tunggal (Single Source of Truth)
* **PRD:** [prd.md](file:///d:/Projects/PromptMatrix2/prd.md) adalah sumber kebenaran tunggal untuk logika fungsional, register komponen, dan riwayat rilis.
* **Sistem Desain:** [design.md](file:///d:/Projects/PromptMatrix2/design.md) adalah acuan mutlak untuk token visual, warna, spasi, dan interaksi.
* **Basis Data Formula:** [data/frameworks.ts](file:///d:/Projects/PromptMatrix2/data/frameworks.ts) dan [services/localizationService.ts](file:///d:/Projects/PromptMatrix2/services/localizationService.ts) adalah master repositori 360 formula prompt.

---

## 2. Aturan Ketat Kode & TypeScript
1. **DILARANG MENGGUNAKAN `any`:** Semua props, tipe state, dan kembalian fungsi wajib memiliki definisi interface/type yang presisi.
2. **KODE UTUH PADA FILE FISIK:** Saat mengedit atau membuat file di repositori, kode WAJIB ditulis secara 100% lengkap tanpa komentar pemotongan seperti `// ... rest of code here` atau `// existing logic stays here`.
3. **SURGICAL DIFF DI KOLOM CHAT:** Saat memberikan penjelasan perubahan ke pengguna di jendela chat, hanya jelaskan baris-baris atau modul yang mengalami modifikasi (*diff summary*). Jangan pernah men-dump ratusan baris kode utuh yang tidak berubah ke dalam jendela chat.
4. **PRIVASI 100% LOKAL (CLIENT-SIDE):** Dilarang menambahkan dependensi backend atau layanan analitik eksternal yang mengirimkan input prompt pengguna ke server jarak jauh.

---

## 3. Runbook Perintah Terminal Harian
* **Menjalankan Server Pengembangan Lokal:**
  ```bash
  npm run dev
  ```
* **Memvalidasi Build Produksi & Typecheck:**
  ```bash
  npm run build
  ```
* **Mempublikasikan ke GitHub Pages:**
  ```bash
  npm run deploy
  ```
* **Penyelamatan & Pemeriksaan Git:**
  ```powershell
  git status -s
  git add .
  git commit -m "feat/fix: deskripsi singkat perubahan"
  git push origin main
  ```

---

## 4. Protokol Efisiensi Token Agen
* Baca file secara terarah menggunakan rentang baris (`StartLine` & `EndLine`) saat melakukan investigasi bug, hindari membaca ribuan baris file yang tidak relevan.
* Pangkas baris log terminal yang redundan dan fokus langsung pada *root cause*.
* Selalu jalankan `npm run build` sebelum serah terima tugas untuk memastikan 0 error kompilasi TypeScript dan Vite.
