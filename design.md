# SISTEM DESAIN RESMI: PromptMatrix 2.0 (RetroBOT Design System)

> **Produk:** PromptMatrix 2.0 — Guided AI Prompt Studio  
> **Arsitek & Desainer:** Sigit Adi ([https://sigitadi.id](https://sigitadi.id))  
> **Filosofi Visual:** *Slate Flat Anti-AI, High-Contrast Typography, Purposeful Micro-Interactions, Zero-Fluff Precision*

---

## 1. Filosofi & Karakteristik Desain (Anti-AI Aesthetics)

PromptMatrix 2.0 dibangun dengan standar desain produk modern kelas dunia yang menolak tampilan AI generik (*slop*):
1. **Solid Flat Contrast:** Mengutamakan permukaan gelap tegas (*rich obsidian slate*) `#090d16` dan `#0f172a` dengan batas garis presisi (*1px crisp borders*) `rgba(51, 65, 85, 0.7)` tanpa blur neon berlebihan yang mengotori kontras.
2. **Emerald & Teal Accent:** Warna aksen fungsional menggunakan hijau zamrud (`emerald-500`, `#10b981`) dan teal (`teal-400`, `#2dd4bf`) yang menandakan status siap, validasi berhasil, dan aksi konversi utama.
3. **Tipografi Hirarkis:** Menggunakan kombinasi font sans-serif modern **Inter** untuk keterbacaan teks antarmuka dan **JetBrains Mono** untuk representasi sintaks prompt, variabel, kode, dan kalkulasi token.
4. **Nested Radius Formula:** Sudut kelengkungan konsisten: kartu induk (`rounded-2xl` / `rounded-3xl` = 16–24px), tombol dan input di dalamnya (`rounded-xl` = 12px), tag dan badge mini (`rounded-lg` = 8px).

---

## 2. Palet Warna & Token Desain

| Token CSS | Kode Warna HEX | Peran & Penggunaan |
| :--- | :--- | :--- |
| `--bg-canvas` | `#090d16` | Latar belakang dasar aplikasi (Dark Canvas) |
| `--bg-surface` | `#0f172a` | Latar belakang kartu kontainer, modal, dan drawer |
| `--bg-panel` | `#070b12` | Latar belakang area teks pratinjau prompt (Monospace Terminal) |
| `--border-subtle` | `#1e293b` / `rgba(51, 65, 85, 0.8)` | Garis pemisah komponen dan kartu galeri |
| `--border-accent` | `#059669` / `#10b981` | Garis tepi elemen aktif, fokus input, dan kartu terpilih |
| `--text-primary` | `#f8fafc` | Judul, label utama, dan nilai isian |
| `--text-secondary`| `#94a3b8` | Deskripsi sub-teks, placeholder, dan metadata |
| `--accent-emerald`| `#10b981` | Tombol primer, indikator aktif, dan aksen brand |
| `--accent-amber`  | `#f59e0b` | Lencana populer, peringatan ramah, dan tips panduan |
| `--accent-rose`   | `#f43f5e` | Indikator hapus, error validasi, dan reset |

---

## 3. Tipografi & Skala Teks

* **Font Utama UI:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
* **Font Monospace / Prompt:** `"JetBrains Mono", Menlo, Monaco, Consolas, monospace`
* **Skala Ukuran:**
  * `text-[10px]` & `text-[11px]`: Label lencana, indikator status, dan tombol aksi mini.
  * `text-xs` (12px): Deskripsi kartu, teks bantuan (*info*), dan footer.
  * `text-sm` (14px): Input formulir, opsi pilihan, dan badan teks modal.
  * `text-base` (16px): Judul kartu formula dan heading modul.
  * `text-lg` s/d `text-xl` (18–20px): Heading bagian Studio dan judul dialog.
  * `text-2xl` s/d `text-4xl` (24–36px): Hero headline utama aplikasi.

---

## 4. Formula Interaksi & Kurva Motion

* **Transisi Standar:** `transition-all duration-200 ease-out`
* **Kurva Motion Halus:** `cubic-bezier(0.16, 1, 0.3, 1)` untuk kemunculan modal dan animasi floating buttons.
* **Micro-Interactions:**
  * **Hover Kartu:** Skala halus `hover:-translate-y-0.5` dengan peningkatan kecerahan border `hover:border-emerald-500/50`.
  * **Active Tap:** Efek tekan `active:scale-[0.98]` pada semua tombol interaktif untuk *tactile feedback*.
  * **Skeleton Shimmer:** Animasi `animate-pulse` solid slate saat memuat data galeri tanpa pergeseran tata letak (*zero cumulative layout shift*).

---

## 5. Standar Responsif & Aksesibilitas

* **Mobile-First Priority:** Semua elemen formulir, tombol salin, dan peluncur AI dapat dioperasikan dengan satu ibu jari (*one-thumb friendly*) dengan target sentuh minimal 44x44px.
* **Safe Area Support:** Mengakomodasi padding `env(safe-area-inset-bottom)` pada dock mengambang perangkat seluler modern.
* **Aksesibilitas Kontras (WCAG AAA/AA):** Semua rasio kontras teks primer terhadap latar gelap bernilai minimal 7:1 untuk kenyamanan mata pengguna dalam sesi kerja panjang.
