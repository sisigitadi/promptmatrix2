# ⚡ Panduan Fitur AI Pro, Pengaturan Provider & Paket Skill (Edisi Flagship Akhir 2026)

Dokumen ini adalah panduan eksklusif untuk fitur **AI Pro Terpadu & Paket Skill (`SKILL.md`)** di PromptMatrix 2.0 yang terbuka secara privat setelah Anda mengaktifkannya melalui **9-ketukan logo aplikasi** (tidak tampil di tampilan publik).

---

## 🔑 1. Daftar 15+ Provider API & Model Flagship Generasi Terbaru (Akhir 2026)

PromptMatrix 2.0 telah diaudit dan diselaraskan dengan model kecerdasan buatan serta endpoint API resmi terkini:

### A. 🤖 Google Gemini (AI Studio)
- `gemini-4-hydrogen` *(Flagship agentic & coding efisiensi tinggi, konteks 1M token - Rekomendasi Utama)*
- `gemini-4-carbon` *(Flagship frontier penalaran mendalam & arsitektur sistem kompleks)*
- `gemini-4-argon` *(Model penalaran frontier cepat dan seimbang)*
- `gemini-3.8-flash` *(Workhorse multimodal produksi dengan thinking budget adaptif)*
- `gemini-3.7-flash` *(Multimodal latensi rendah generasi 3.7)*
- `gemini-3.5-flash-lite` *(Model ultra-ringan, super cepat & hemat kuota token)*
- `gemini-2.5-flash` *(Versi stabil kompatibilitas generasi 2.5)*

### B. 🟢 OpenAI (GPT-6 & Reasoning)
- `gpt-6-astra` *(Flagship kecerdasan tertinggi OpenAI untuk coding, arsitektur & penalaran kompleks - Rekomendasi)*
- `gpt-6.1-sol` *(Keseimbangan optimal penalaran dan efisiensi biaya)*
- `gpt-6.1-terra` *(Penalaran visual, analisis dokumen & penulisan mendalam)*
- `gpt-6.1-luna` *(Latensi rendah untuk volume tinggi & tugas harian)*
- `gpt-5.2-codex` *(Spesialis engineering & refactoring kode)*
- `gpt-5`, `o3`, `o4-mini`, `gpt-4o` *(Penalaran seri o & kompatibilitas legacy)*

### C. 🟧 Anthropic (Claude 5.5 & Fable 5.2)
- `claude-sonnet-5-5` *(Flagship keseimbangan kecepatan, coding & penulisan, konteks 1M token - Rekomendasi Utama)*
- `claude-opus-5-5` *(Proyek kompleks, agentic coding & riset profesional)*
- `claude-fable-5-2` *(Model paling kapabel untuk penalaran berat dan alur kerja jangka panjang)*
- `claude-haiku-5-5` *(Eksekusi tercepat & paling ekonomis)*
- `claude-sonnet-4-5`, `claude-opus-4` *(Kompatibilitas generasi 4)*

### D. 🔵 DeepSeek AI (V4 & R1)
- `deepseek-v4-pro` *(Flagship DeepSeek V4 Pro 1M konteks untuk agentic & coding - Rekomendasi)*
- `deepseek-flash` *(DeepSeek-V4.1 Flash super cepat & hemat biaya)*
- `deepseek-reasoner` *(DeepSeek-R1 Chain of Thought 671B reasoning)*
- `deepseek-chat` *(Alias chat standar kompatibel V3/V4)*

### E. 🖤 xAI (Grok 4.7 & Reasoning)
- `grok-4.7` *(Flagship xAI 500K+ konteks untuk reasoning, coding, agentic & visi - Rekomendasi)*
- `grok-420-reasoning` *(Penalaran multi-langkah dengan kontrol effort)*
- `grok-4.6` & `grok-4.1-fast` *(Stabilitas & pemrosesan cepat)*

### F. 🌪️ Mistral AI
- `mistral-large-latest` *(Mistral Large 4, 1M konteks flagship multimodal)*
- `mistral-small-latest` *(Mistral Small 4 hybrid instruct, reasoning & coding)*
- `codestral-latest` *(Spesialis sintesis kode dan refactoring)*
- `ministral-3b-latest` *(Inferensi ringan berlatensi rendah)*

### G. ⚡ Groq Cloud (LPU Hardware)
- `meta-llama/llama-4-maverick-17b-128e-instruct` *(Llama 4 Maverick di Groq LPU - Rekomendasi)*
- `meta-llama/llama-4-scout-17b-16e-instruct` *(Llama 4 Scout konteks panjang)*
- `qwen/qwen3.8-27b` & `openai/gpt-oss-20b`
- `llama-3.3-70b-versatile` & `llama-3.1-8b-instant`

### H. 🌐 Perplexity AI
- `sonar-reasoning-pro` *(Penalaran dengan sitasi web real-time - Rekomendasi)*
- `sonar-deep-research`, `sonar-pro`, `sonar`

### I. 🤝 Together AI, 🚀 Cerebras, ⚡ SambaNova, 🏛️ Cohere & 🤗 Hugging Face
- **Together AI:** `deepseek-ai/DeepSeek-V4-Pro`, `deepseek-ai/DeepSeek-V4.1-Flash`, `meta-llama/Llama-4-Maverick-17B-128E-Instruct`, `Qwen/Qwen3.8-27B`, `Qwen/Qwen3.7-Max`, `deepseek-ai/DeepSeek-R1`
- **Cerebras:** `gpt-oss-120b` (~3000 tps), `qwen-3.8-27b` (~1850 tps), `llama-3.3-70b`, `llama3.1-8b`
- **SambaNova:** `DeepSeek-R1`, `DeepSeek-V3`, `gemma-4-31B-it`, `Meta-Llama-3.3-70B-Instruct`
- **Cohere (`https://api.cohere.ai/compatibility/v1`):** `command-a-plus-05-2026`, `command-a-reasoning-08-2025`, `command-a-03-2025`
- **Hugging Face (`https://router.huggingface.co/v1`):** `deepseek-ai/DeepSeek-V4.1-Flash:fastest`, `deepseek-ai/DeepSeek-R1`, `meta-llama/Llama-3.3-70B-Instruct`, `Qwen/Qwen3-Coder-30B-A3B-Instruct`

### J. 🦙 Ollama (Lokal Offline)
- `qwen3.8:27b`, `qwen3-coder:30b`, `gemma4:12b`, `gemma4:31b`, `llama4:16x17b`, `qwen3.5:9b`, `deepseek-r1:14b`, `deepseek-r1:8b`, `deepseek-r1:latest`

---

## 🧩 2. Paket Skill Privat (`SKILL.md`, Pabrik `.zip` & Bundel `agensi-skills/`)

PromptMatrix 2.0 menerapkan **Model Akses Hibrida**: etalase publik (`Skills 10` & kartu kontekstual Studio) mengarahkan pengunjung ke tautan afiliasi Agensi.io, sedangkan **Pabrik `.zip` & Pengaturan URL Kreator** dikunci di balik gerbang privat **9-ketukan logo** (`showAIFeatures`):
1. **Tab `Paket Skill (10)` di Modal Pengaturan AI**:
   - Mengatur **Agensi Affiliate URL (`?ref=...`)**, **Creator Store URL**, **Affiliate Ref Code**, serta bagian lipat **Secondary Marketplace Channels** (URL opsional untuk Lemon Squeezy Bundle, Creem.io Bundle, Gumroad Bundle, dan PromptBase Store) langsung dari browser (`localStorage` `pm_agensi_urls`).
   - Tombol checkout sekunder pada modal katalog publik hanya akan ditampilkan jika URL-nya terisi di sini, sehingga **Agensi.io** tetap menjadi CTA utama dan tidak ada tautan mati.
   - Mengelola **10 bundel Open Agent Skills (`agensi-skills/`)** lengkap dengan perintah validator, tombol **Salin Listing Copy** untuk `Agensi.io/sell`, kesiapan publikasi toko, serta generator CLI `npm run package:channels` untuk Lead Magnet (`dist-lead-magnet/`), Suite ZIP (`dist-channels/storefronts/`), dan 15 listing PromptBase (`dist-channels/promptbase/`).
2. **Tab Pratinjau `SKILL.md` di Studio & Layar Penuh**:
   - Otomatis muncul sejajar dengan tab *Terstruktur*, *Teks Polos*, dan *JSON* saat Mode AI Pro & Paket Skill dibuka.
   - Dilengkapi tombol **Unduh Paket `.zip` Agensi.io** (membungkus `SKILL.md` di root + `references/` + `templates/` + `scripts/` secara instan di browser) dan panel **Salin Listing Copy (`Agensi.io/sell`)**.
3. **Panduan Lengkap Multi-Marketplace & Payout Indonesia**:
   - Buka kartu **Panduan Multi-Market** di Modal Bantuan (`?`) saat Mode AI Pro aktif, atau buka akordion panduan di dalam tab `Paket Skill (10)` Pengaturan AI untuk langkah lengkap Agensi.io, Pilar 1 Direktori OSS (`dist-lead-magnet/`), Pilar 2 Lemon Squeezy / Creem.io / Gumroad / Whop / Payhip (`$59.00` vs `$133.92`), Pilar 3 PromptBase (`0%` fee `?via=` & Zoneless USDC Solana), serta SOP penarikan dana aman di Indonesia tanpa saldo USD Wise.

---

## 🛠️ 3. Cara Menggunakan Fitur AI Pro

1. **💡 AI Suggest (Bantu Ide Isian Kolom)**:
   - Klik tombol **"✨ Bantu Ide"** pada formulir untuk meminta AI mengisi rekomendasi jawaban cerdas.
2. **🪄 AI Enhance (Sempurnakan Prompt)**:
   - Klik tombol ungu **"✨ Sempurnakan dengan AI"** pada kartu output studio untuk memperkaya prompt dengan struktur presisi tinggi.
3. **📊 AI Quality Analysis (Audit Kualitas)**:
   - Klik tombol **"📊 Analisis Kualitas"** untuk mendapatkan skor 1-100 dan saran perbaikan prompt secara otomatis.

---

## 🔒 4. Cara Mengunci / Menyembunyikan Kembali
- Ketuk logo aplikasi **PromptMatrix 2.0** sebanyak **9 kali** berturut-turut untuk menyembunyikan kembali seluruh tombol AI, pengaturan provider, tab `SKILL.md`, dan katalog Paket Skill dari tampilan publik.
