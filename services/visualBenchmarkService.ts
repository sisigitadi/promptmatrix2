/**
 * Visual Mockup & Benchmark Service
 * Generates context-aware, informative visual mockups for ALL 360+ Prompt Frameworks
 * Strictly aligned with 1-Click Sample Data scenarios in sampleDataService.ts
 * 100% Client-Side, Zero External API Limit / Rate Limit Free
 */

import { Framework } from '../data/frameworks';

export type AspectRatioType = '1:1' | '16:9' | '9:16' | '4:5' | '21:9';

export interface VisualBenchmarkData {
  id: string;
  title: string;
  imageUrl: string;
  aspectRatio: AspectRatioType;
  styleCategory: string;
  keyParameters: {
    label: string;
    value: string;
  }[];
  authorOrModel: string;
  description: string;
  sampleScenarioLink: string;
}

// Registry of rich visual mockups aligned with automatic sample scenarios
const VISUAL_MOCKUPS: Record<string, VisualBenchmarkData> = {
  // 1. FLUX.1 Descriptive Studio Architect
  flux_artisan: {
    id: 'flux_artisan',
    title: 'Pengrajin Batik Tradisional di Studio Jogja',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'FLUX.1 Hyper-Realistic Portrait',
    keyParameters: [
      { label: 'Subjek', value: 'Pengrajin Batik Jogja' },
      { label: 'Pencahayaan', value: 'Golden Hour Volumetric' },
      { label: 'Lensa Kamera', value: '35mm f/1.4 Anamorphic' },
      { label: 'Engine Render', value: 'FLUX.1 [dev] 8K' }
    ],
    authorOrModel: 'FLUX.1 Descriptive Studio',
    description: 'Menampilkan detail tekstur kain canting autentik, debu atmosferik di udara, dan pencahayaan alami jendela kayu.',
    sampleScenarioLink: 'Selaras dengan isian otomatis subjek pengrajin batik dan pencahayaan keemasan studio Jogja.'
  },

  // 2. Midjourney v6.1 Masterclass (--ar 16:9, --sref, lighting)
  midjourney_cinematic: {
    id: 'midjourney_cinematic',
    title: 'Gang Hujan Cyberpunk Neo-Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Midjourney v6.1 Cinematic',
    keyParameters: [
      { label: 'Aksen Neon', value: 'Teal & Magenta Glow' },
      { label: 'Refleksi Basah', value: 'Wet Asphalt Puddles' },
      { label: 'Sudut Kamera', value: 'Low Angle Eye-Level' },
      { label: 'Sintaks Model', value: '--ar 16:9 --style raw -v 6.1' }
    ],
    authorOrModel: 'Midjourney v6.1 (--stylize 250)',
    description: 'Refleksi genangan aspal malam dengan pendar neon tajam dan kedalaman ruang sinematik anamorphic.',
    sampleScenarioLink: 'Selaras dengan parameter pencahayaan neon teal dan detail visual fotorealistik 8K.'
  },

  // 3. Karakter 3D Animasi Disney/Pixar (Anak Kucing Astronot di Bulan)
  character_3d_cat: {
    id: 'character_3d_cat',
    title: 'Anak Kucing Oranye Astronot di Bulan',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '1:1',
    styleCategory: '3D Pixar Animation Character',
    keyParameters: [
      { label: 'Karakter', value: 'Anak Kucing Oranye' },
      { label: 'Kostum', value: 'Jas Astronot Mini' },
      { label: 'Latar Belakang', value: 'Permukaan Bulan & Bumi Biru' },
      { label: 'Shader Material', value: 'Subsurface Scattering' }
    ],
    authorOrModel: 'DALL-E 3 & Midjourney Stylize',
    description: 'Karakter hewan animasi 3D bergaya studio Pixar dengan jas luar angkasa mini di permukaan bulan berlatar bumi bersinar.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis isian prompt_visual (kucing astronot mini di bulan).'
  },

  // 4. Video Sinematik Kling & Runway Gen-3 (Astronot di Ngarai Mars)
  video_mars_canyon: {
    id: 'video_mars_canyon',
    title: 'Astronot di Ngarai Planet Mars (Badai Pasir)',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Runway Gen-3 / Kling 1.5 Video Shot',
    keyParameters: [
      { label: 'Visual Scene', value: 'Ngarai Gurun Mars' },
      { label: 'Kondisi Cuaca', value: 'Badai Pasir Jingga' },
      { label: 'Refleksi Visor', value: 'Dua Bulan Kembar' },
      { label: 'Gerak Kamera', value: 'Slow Orbit Cinematic Push' }
    ],
    authorOrModel: 'Runway Gen-3 & Kling 1.5 Director',
    description: 'Frame video sinematik astronot berdiri di tepi ngarai Mars saat kabut pasir jingga menerjang helm reflektif.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis isian scenevisualnarrative (astronot di ngarai Mars).'
  },

  // 5. Suno v4 & Udio Lyrical Architect (Gitar Akustik & Songwriting Studio)
  audio_suno_studio: {
    id: 'audio_suno_studio',
    title: 'Studio Rekaman Akustik & Songwriting',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Suno v4 Acoustic Master',
    keyParameters: [
      { label: 'Instrumen Utama', value: 'Gitar Akustik Hangat' },
      { label: 'Struktur Lagu', value: '[Intro] -> [Verse] -> [Chorus]' },
      { label: 'Tema Lirik', value: 'Perjuangan & Doa Ibu di Ibukota' },
      { label: 'Nuansa Suara', value: 'Warm Studio Mic (24-bit/48kHz)' }
    ],
    authorOrModel: 'Suno v4 Studio Audio',
    description: 'Visualisasi ruang rekaman musisi dengan instrumen petikan gitar akustik yang hangat dan kertas lirik lagu.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis lirik lagu songstructurelyrics (petikan melodi gitar akustik).'
  },

  // 6. TikTok Shop Live Stream Script (Skincare Glowing 4-in-1 Flash Sale)
  tiktok_skincare_live: {
    id: 'tiktok_skincare_live',
    title: 'Paket Skincare Glowing 4-in-1 (Live Stream Sale)',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '9:16',
    styleCategory: 'TikTok Shop / Reels Live Commerce',
    keyParameters: [
      { label: 'Produk Etalase', value: 'Skincare Glowing 4-in-1' },
      { label: 'Diskon Urgensi', value: '50% OFF (100 Tercepat)' },
      { label: 'Format Layar', value: '9:16 Vertical Smartphone' },
      { label: 'Pemicu Konversi', value: 'Tap Love 10K & Countdown' }
    ],
    authorOrModel: 'TikTok Shop Live Stream Script',
    description: 'Mockup produk kecantikan premium di atas pedestal studio, siap untuk sesi penjualan langsung live streaming 9:16.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis isian liveproductname & flashsaleurgency (Paket Skincare Glowing).'
  },

  // 7. AI Coding Agent Rules (.cursorrules, Windsurf, TypeScript & Next.js 15)
  coding_agent_rules: {
    id: 'coding_agent_rules',
    title: 'Modern IDE Architecture (Next.js 15 & TypeScript)',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Fullstack Engineering IDE Mockup',
    keyParameters: [
      { label: 'Tech Stack', value: 'Next.js 15, TS 5.5, Tailwind v4' },
      { label: 'Arsitektur', value: 'Feature-First Folder Structure' },
      { label: 'Batasan AI', value: 'Zero any & Safe Migrations' },
      { label: 'Validasi', value: 'Strict Type-Check & Linter' }
    ],
    authorOrModel: 'Cursor & Windsurf Rules Architect',
    description: 'Visualisasi antarmuka editor kode profesional dark-mode dengan struktur arsitektur modular dan sintaks type-safe.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis projecttechstack & strictforbiddenrules (Next.js 15 & TS).'
  },

  // 8. MCP (Model Context Protocol) Server & Tool Designer
  mcp_database_server: {
    id: 'mcp_database_server',
    title: 'Cloud Database MCP Server Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'MCP Infrastructure & Tool Protocol',
    keyParameters: [
      { label: 'Server Service', value: 'PostgreSQL Cloud Analytics' },
      { label: 'Core Tools', value: 'execute_read_query, inspect_ddl' },
      { label: 'Keamanan Data', value: 'Query Limit & Read-Only Protection' },
      { label: 'Protokol', value: 'JSON-RPC 2.0 via STDIO / SSE' }
    ],
    authorOrModel: 'Model Context Protocol (MCP) Standard',
    description: 'Arsitektur server cloud terdistribusi yang menyediakan alat (tools) dan data terkelola langsung ke agen AI.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis mcpservername & toolsandresources (PostgreSQL MCP Server).'
  },

  // 9. LPDP Essay & Academic Scholarship Architect (Dokter Pedesaan NTT)
  scholarship_medical: {
    id: 'scholarship_medical',
    title: 'Inisiatif Pengabdian Medis & Tele-Health Terluar',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Academic & Essay Portfolio Mockup',
    keyParameters: [
      { label: 'Profil Pelamar', value: 'Dokter Umum Pengentasan Stunting' },
      { label: 'Lokasi Proyek', value: 'Pelosok Nusa Tenggara Timur' },
      { label: 'Roadmap Pasca', value: 'Digitalisasi Rujukan Puskesmas' },
      { label: 'Target Dampak', value: 'Tele-Health 50 Kepulauan' }
    ],
    authorOrModel: 'LPDP & Chevening Essay Architect',
    description: 'Dokumentasi visual tenaga kesehatan profesional dalam memimpin inisiatif layanan medis masyarakat pelosok.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis applicantbackground & poststudyroadmap (Dokter UI di NTT).'
  },

  // 10. AIDA Klasik, Copywriting & Peluncuran SaaS Finansial
  marketing_saas_dashboard: {
    id: 'marketing_saas_dashboard',
    title: 'Peluncuran SaaS Otomatisasi Keuangan UMKM',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'AIDA Copywriting & Funnel Mockup',
    keyParameters: [
      { label: 'Produk SaaS', value: 'Manajemen Keuangan UMKM' },
      { label: 'Target Audiens', value: 'Pekerja Lepas & Merchant Online' },
      { label: 'Penawaran Inti', value: 'Trial Gratis Spreadsheet Otomatis' },
      { label: 'Panggilan Aksi', value: 'Diskon 50% 100 Pendaftar Pertama' }
    ],
    authorOrModel: 'AIDA High-Converting Sales Funnel',
    description: 'Dashboard performa konversi kampanye pemasaran digital dengan grafik pertumbuhan pendapatan dan metrik retensi.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis role, context, dan headline (SaaS Keuangan UMKM).'
  },

  // 11. STAR Method / Simulasi Wawancara Kerja & Karir
  career_star_interview: {
    id: 'career_star_interview',
    title: 'Presentasi Strategi Manajemen Eksekutif',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'STAR Framework Career Mockup',
    keyParameters: [
      { label: 'Situasi Bisnis', value: 'Penjualan Turun 20% Kuartal Lalu' },
      { label: 'Tindakan Strategis', value: 'Restrukturisasi Funnel & Onboarding' },
      { label: 'Hasil Terukur', value: 'Omset Naik +35%, Churn Turun 50%' },
      { label: 'Tingkat Skor CSAT', value: '4.8 / 5.0 Kepuasan Pelanggan' }
    ],
    authorOrModel: 'STAR Behavioral Interview Standard',
    description: 'Sesi presentasi eksekutif profesional yang mendemonstrasikan kepemimpinan, pemecahan masalah terukur, dan hasil nyata.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis situation, action, dan result (peningkatan penjualan 35%).'
  },

  // 12. Model Penalaran GCC (Claude 3.7 Thinking & DeepSeek-R1)
  reasoning_architecture: {
    id: 'reasoning_architecture',
    title: 'Arsitektur Penalaran Jaringan Saraf Kognitif',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Reasoning GCC Cognitive Graph',
    keyParameters: [
      { label: 'Model Target', value: 'Claude 3.7 Thinking & DeepSeek R1' },
      { label: 'Batasan Keras', value: 'Zero-Downtime PostgreSQL 16 DDL' },
      { label: 'Toleransi Error', value: 'Zero-Hallucination Verified DDL' },
      { label: 'Format Keluaran', value: 'Sharding & Failover Protocols' }
    ],
    authorOrModel: 'Reasoning Models Framework (GCC)',
    description: 'Visualisasi graf struktur penalaran multi-cabang (tree-of-thought) untuk memecahkan problem engineering kompleks.',
    sampleScenarioLink: '100% selaras dengan contoh otomatis hardconstraints & outputcontract (PostgreSQL Sharding).'
  },

  // 13. Fotografi Makanan Makro & Komersial
  food_macro_culinary: {
    id: 'food_macro_culinary',
    title: 'Matcha Latte & Dessert Tradisional Makro',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '4:5',
    styleCategory: 'Commercial Culinary Photography',
    keyParameters: [
      { label: 'Lensa Kamera', value: '100mm f/2.8 Macro Lens' },
      { label: 'Pencahayaan', value: 'Soft Window Lighting' },
      { label: 'Kedalaman Bidang', value: 'Shallow Depth of Field' },
      { label: 'Komposisi', value: '45-Degree Close-Up Food Angle' }
    ],
    authorOrModel: 'Commercial Food Photography',
    description: 'Detail butiran bubuk matcha ultra-tajam dengan tekstur saus lembut dan piring keramik kerajinan tangan.',
    sampleScenarioLink: 'Selaras dengan parameter lensa makro dan pencahayaan studio kuliner.'
  },

  // 14. Ruang Isometrik 3D & Desain Interior Arsitektural
  isometric_room_interior: {
    id: 'isometric_room_interior',
    title: 'Studio Desain Interior Minimalis Isometrik',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: '3D Isometric Architecture Concept',
    keyParameters: [
      { label: 'Proyeksi Kamera', value: 'Orthographic Isometric 30°' },
      { label: 'Gaya Interior', value: 'Nordic Warm Minimalist' },
      { label: 'Pencahayaan', value: 'Warm Accent Shelf Lighting' },
      { label: 'Palet Warna', value: 'Oak Wood, Sage Green & White' }
    ],
    authorOrModel: 'Blender & 3D Octane Architecture',
    description: 'Visualisasi tata ruang studio kreatif 3D isometrik dengan penataan furnitur modular dan pencahayaan fungsional.',
    sampleScenarioLink: 'Selaras dengan parameter proyeksi isometrik dan interior minimalis.'
  },

  // 15. Gaya Anime Makoto Shinkai & Lanskap Visual
  anime_shinkai_landscape: {
    id: 'anime_shinkai_landscape',
    title: 'Lanskap Senja Stasiun Kereta Api (Gaya Shinkai)',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Anime Art Makoto Shinkai Style',
    keyParameters: [
      { label: 'Estetika Studio', value: 'CoMix Wave Films Style' },
      { label: 'Bentuk Awan', value: 'Volumetric Cumulonimbus' },
      { label: 'Nuansa Warna', value: 'Golden Twilight & Royal Blue' },
      { label: 'Detail Latar', value: 'Perlintasan Kereta Api Senja' }
    ],
    authorOrModel: 'Niji Journey v6 & Anime Studio',
    description: 'Seni lanskap anime puitis dengan sapuan awan megah, pendar matahari tenggelam, dan rel kereta api reflektif.',
    sampleScenarioLink: 'Selaras dengan parameter gaya anime Shinkai dan komposisi langit senja.'
  },

  // 16. Kategori Universal: Teks & Konten (Creative Writing & Editorial)
  cat_text_default: {
    id: 'cat_text_default',
    title: 'Workspace Penulisan Konten Kreatif & Editorial',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Content Strategy & Editorial Mockup',
    keyParameters: [
      { label: 'Medium', value: 'Artikel Terstruktur & Skrip Kreatif' },
      { label: 'Gaya Bahasa', value: 'Persuasif, Bernas & Mengalir' },
      { label: 'Struktur Output', value: 'Headline, Poin Inti & Ringkasan' },
      { label: 'Target Hasil', value: 'Retensi Audiens & Konversi Tinggi' }
    ],
    authorOrModel: 'Editorial Strategy Framework',
    description: 'Mockup meja kerja konseptual kreator konten dan jurnalisme dengan catatan riset, draf tulisan, dan kopi hangat.',
    sampleScenarioLink: 'Mencerminkan hasil strategi artikel terstruktur, copywriting persuasif, dan naskah konten.'
  },

  // 17. Kategori Universal: Kode & Pengembang (Software Development)
  cat_code_default: {
    id: 'cat_code_default',
    title: 'Workstation Rekayasa Perangkat Lunak Modern',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Software Engineering Architecture',
    keyParameters: [
      { label: 'Pola Desain', value: 'Clean Code & Separation of Concerns' },
      { label: 'Standar Mutu', value: 'Type-Safe (TypeScript Strict)' },
      { label: 'Manajemen Data', value: 'Zero Overhead & Optimal Memory' },
      { label: 'Hasil Eksekusi', value: 'Fungsi Reusable & Skalabilitas' }
    ],
    authorOrModel: 'Software Architecture Matrix',
    description: 'Workstation rekayasa perangkat lunak dengan monitor ganda, kode rapi tanpa bug, dan arsitektur teruji.',
    sampleScenarioLink: 'Mencerminkan implementasi kode berkualitas tinggi, refactoring, dan arsitektur backend.'
  },

  // 18. Kategori Universal: Audio & Musik (Audio Production)
  cat_audio_default: {
    id: 'cat_audio_default',
    title: 'Studio Desain Suara & Produksi Audio Digital',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Audio & Music Production Mockup',
    keyParameters: [
      { label: 'Instrumen', value: 'Synthesizer, Drum & Soundboard' },
      { label: 'Dynamic Range', value: 'Loudness Matched & Clear EQ' },
      { label: 'Genre Musik', value: 'Modern Production Mix' },
      { label: 'Output Master', value: 'High-Fidelity Studio Audio' }
    ],
    authorOrModel: 'Music Composition Framework',
    description: 'Konsol kontrol audio profesional dengan fader multi-track, monitor suara studio, dan tata suara jernih.',
    sampleScenarioLink: 'Mencerminkan komposisi aransemen musik, mixing suara, dan sulih suara (voiceover) berkualitas studio.'
  },

  // 19. Kategori Universal: Video & Animasi (Filmmaking & Directing)
  cat_video_default: {
    id: 'cat_video_default',
    title: 'Rig Kamera Sinematografi & Pengarah Adegan',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Cinematography & Video Production',
    keyParameters: [
      { label: 'Framing', value: 'Rule of Thirds Cinematic' },
      { label: 'Pergerakan', value: 'Dynamic Gimbal Tracking' },
      { label: 'Gradasi Warna', value: 'Teal & Orange Hollywood Grade' },
      { label: 'Frame Rate', value: '24fps Motion Blur Asli' }
    ],
    authorOrModel: 'Video Directing Framework',
    description: 'Rig kamera bioskop dengan lensa prima sinema untuk pengarahan adegan, storyboard, dan naskah visual bergerak.',
    sampleScenarioLink: 'Mencerminkan instruksi pergerakan kamera, storyboard video promosi, dan ritme animasi.'
  },

  // 20. Kategori Universal: Prompt Ringkas & Asisten Cerdas (Quick Tasks)
  cat_quick_default: {
    id: 'cat_quick_default',
    title: 'Asisten Produktivitas & Solusi Cepat Eksekutif',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Quick Productivity Matrix',
    keyParameters: [
      { label: 'Kecepatan', value: 'Hasil Instan Tanpa Bertele-tele' },
      { label: 'Fokus', value: 'Inti Solusi & Prioritas Utama' },
      { label: 'Format Teks', value: 'Ringkas, Bernomor & Siap Pakai' },
      { label: 'Akurasi', value: 'Tepat Sasaran Sesuai Instruksi' }
    ],
    authorOrModel: 'Rapid Execution Prompt Engine',
    description: 'Checklist efisiensi kerja cepat dengan buku agenda minimalis, pulpen, dan strategi prioritas harian.',
    sampleScenarioLink: 'Mencerminkan efisiensi eksekusi prompt ringkas untuk klarifikasi cepat, perbaikan teks, dan ringkasan eksekutif.'
  },

  // 21. Kategori Universal: Prompt Proyek & Manajemen Strategis (Projects)
  cat_project_default: {
    id: 'cat_project_default',
    title: 'Manajemen Proyek, Roadmap & Strategi Tim',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Project Architecture & Roadmap',
    keyParameters: [
      { label: 'Metodologi', value: 'Agile Sprint & Waterfall Milestone' },
      { label: 'Analisis Risiko', value: 'Mitigasi & Jalur Kritis (CPM)' },
      { label: 'Delegasi Tugas', value: 'Matriks RACI Jelas' },
      { label: 'Keluaran Akhir', value: 'Timeline Terukur & Deliverables' }
    ],
    authorOrModel: 'Strategic Project Management Matrix',
    description: 'Papan perancangan proyek dengan bagan alur kerja, sticky notes warna-warni, dan target capaian tim.',
    sampleScenarioLink: 'Mencerminkan perencanaan proyek skala menengah-besar, alokasi sumber daya, dan mitigasi risiko.'
  },

  // 22. Kategori Universal: Koleksi & Inovasi (Innovation & Deep Research)
  cat_collection_default: {
    id: 'cat_collection_default',
    title: 'Laboratorium Riset & Inovasi Teknologi Masa Depan',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '16:9',
    styleCategory: 'Deep Research & Innovation Lab',
    keyParameters: [
      { label: 'Domain Riset', value: 'AI Multimodal & Sistem Kognitif' },
      { label: 'Tingkat Analisis', value: 'Rigorous & Evidence-Based' },
      { label: 'Sintesis Ide', value: 'Inovasi Lintas Disiplin Ilmu' },
      { label: 'Dampak Jangka Panjang', value: 'Terobosan Baru Berkelanjutan' }
    ],
    authorOrModel: 'Innovation & Research Architecture',
    description: 'Visualisasi laboratorium riset masa depan dengan eksplorasi teknologi terdepan dan sintesis wawasan mendalam.',
    sampleScenarioLink: 'Mencerminkan kerangka kerja riset canggih, brainstorming inovasi radikal, dan evaluasi model AI.'
  }
};

/**
 * Detect intended aspect ratio from prompt flags or content
 */
export const detectAspectRatioFromPrompt = (prompt: string): AspectRatioType => {
  if (!prompt) return '16:9';
  
  if (prompt.includes('--ar 16:9') || prompt.includes('16:9') || prompt.includes('landscape')) {
    return '16:9';
  }
  if (prompt.includes('--ar 9:16') || prompt.includes('9:16') || prompt.includes('portrait') || prompt.includes('tiktok') || prompt.includes('reels')) {
    return '9:16';
  }
  if (prompt.includes('--ar 4:5') || prompt.includes('4:5') || prompt.includes('instagram')) {
    return '4:5';
  }
  if (prompt.includes('--ar 21:9') || prompt.includes('21:9') || prompt.includes('ultrawide')) {
    return '21:9';
  }
  if (prompt.includes('--ar 1:1') || prompt.includes('1:1') || prompt.includes('square')) {
    return '1:1';
  }

  return '16:9';
};

/**
 * Get curated, informative visual mockup for ANY template in PromptMatrix 2.0
 * Guarantees 100% alignment with automatic sample scenarios
 */
export const getVisualBenchmarkForFramework = (
  framework: Framework | null,
  frameworkName?: string | null,
  category?: string | null
): VisualBenchmarkData => {
  const name = (frameworkName || framework?.nama_kerangka || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  const toolType = (framework?.toolType || '').toLowerCase();

  // 1. Specific Framework Exact Keyword Matches (Matching sampleDataService.ts scenarios)
  if (name.includes('flux')) {
    return VISUAL_MOCKUPS.flux_artisan;
  }
  if (name.includes('midjourney') || name.includes('cyberpunk') || name.includes('neon')) {
    return VISUAL_MOCKUPS.midjourney_cinematic;
  }
  if (name.includes('karakter') || name.includes('character') || name.includes('pixar') || name.includes('disney')) {
    return VISUAL_MOCKUPS.character_3d_cat;
  }
  if (name.includes('kling') || name.includes('runway') || (toolType === 'video' && name.includes('video'))) {
    return VISUAL_MOCKUPS.video_mars_canyon;
  }
  if (name.includes('suno') || name.includes('udio') || toolType === 'music-composition' || toolType === 'music-generation') {
    return VISUAL_MOCKUPS.audio_suno_studio;
  }
  if (name.includes('tiktok') || name.includes('live stream') || name.includes('reels') || name.includes('etalase')) {
    return VISUAL_MOCKUPS.tiktok_skincare_live;
  }
  if (name.includes('cursor') || name.includes('windsurf') || name.includes('coding agent') || name.includes('rules architect')) {
    return VISUAL_MOCKUPS.coding_agent_rules;
  }
  if (name.includes('mcp') || name.includes('model context protocol') || name.includes('tool designer')) {
    return VISUAL_MOCKUPS.mcp_database_server;
  }
  if (name.includes('lpdp') || name.includes('scholarship') || name.includes('beasiswa') || name.includes('esai')) {
    return VISUAL_MOCKUPS.scholarship_medical;
  }
  if (name.includes('aida') || name.includes('copywriting') || name.includes('sales funnel') || name.includes('saas')) {
    return VISUAL_MOCKUPS.marketing_saas_dashboard;
  }
  if (name.includes('star') || name.includes('wawancara') || name.includes('interview') || name.includes('karir')) {
    return VISUAL_MOCKUPS.career_star_interview;
  }
  if (name.includes('reasoning') || name.includes('deepseek') || name.includes('claude 3.7') || name.includes('gcc')) {
    return VISUAL_MOCKUPS.reasoning_architecture;
  }
  if (name.includes('makanan') || name.includes('food') || name.includes('kuliner')) {
    return VISUAL_MOCKUPS.food_macro_culinary;
  }
  if (name.includes('isometrik') || name.includes('isometric') || name.includes('arsitektur') || name.includes('interior')) {
    return VISUAL_MOCKUPS.isometric_room_interior;
  }
  if (name.includes('anime') || name.includes('manga') || name.includes('shinkai') || name.includes('kartun')) {
    return VISUAL_MOCKUPS.anime_shinkai_landscape;
  }

  // 2. ToolType Based Fallbacks
  if (toolType === 'code') {
    return VISUAL_MOCKUPS.cat_code_default;
  }
  if (toolType === 'video') {
    return VISUAL_MOCKUPS.cat_video_default;
  }
  if (toolType === 'audio-generation' || toolType === 'music-generation' || toolType === 'music-composition') {
    return VISUAL_MOCKUPS.cat_audio_default;
  }
  if (toolType === 'image-generation' || toolType === 'image-editing') {
    return VISUAL_MOCKUPS.midjourney_cinematic;
  }

  // 3. Category Based Fallbacks (Coverage for all 8 main categories in PromptMatrix)
  if (cat.includes('gambar') || cat.includes('desain') || cat.includes('design')) {
    return VISUAL_MOCKUPS.midjourney_cinematic;
  }
  if (cat.includes('kode') || cat.includes('pengembang') || cat.includes('code')) {
    return VISUAL_MOCKUPS.cat_code_default;
  }
  if (cat.includes('audio') || cat.includes('musik') || cat.includes('music')) {
    return VISUAL_MOCKUPS.cat_audio_default;
  }
  if (cat.includes('video') || cat.includes('animasi') || cat.includes('animation')) {
    return VISUAL_MOCKUPS.cat_video_default;
  }
  if (cat.includes('ringkas') || cat.includes('quick')) {
    return VISUAL_MOCKUPS.cat_quick_default;
  }
  if (cat.includes('proyek') || cat.includes('project')) {
    return VISUAL_MOCKUPS.cat_project_default;
  }
  if (cat.includes('koleksi') || cat.includes('inovasi') || cat.includes('collection')) {
    return VISUAL_MOCKUPS.cat_collection_default;
  }

  // 4. Default Overall Fallback: High-Quality Content & Editorial Strategy
  return VISUAL_MOCKUPS.cat_text_default;
};
