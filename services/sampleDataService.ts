/**
 * PromptMatrix Realistic Sample Data Engine
 * Generates natural, context-aware sample values for all 360+ Prompt Frameworks
 * Fully synchronized for Indonesian (ID) and English (EN)
 * Powers 1-Click Sample Filling & AI Suggestion Context Benchmarks
 */

import { FrameworkComponent } from '../data/frameworks';
import { translatePlaceholder } from './localizationService';

// Field-specific smart dictionary based on common component parameter names
const FIELD_SAMPLE_DICTIONARY: Record<string, { id: string; en: string }> = {
  // Roles & Personas
  role: { id: "Pakar Pemasaran Digital & Copywriter Senior dengan pengalaman 10+ tahun", en: "Senior Digital Marketing Specialist & Copywriter with 10+ years experience" },
  peran: { id: "Pakar Pemasaran Digital & Copywriter Senior dengan pengalaman 10+ tahun", en: "Senior Digital Marketing Specialist & Copywriter with 10+ years experience" },
  persona: { id: "Konsultan Bisnis Senior & Mentor Startup Teknologi", en: "Senior Business Consultant & Tech Startup Mentor" },
  user_persona: { id: "Profesional muda usia 25-35 tahun yang ingin meningkatkan produktivitas harian", en: "Young professional aged 25-35 looking to improve daily productivity" },
  expert_role: { id: "Principal Software Architect spesialis sistem terdistribusi skala besar", en: "Principal Software Architect specializing in large-scale distributed systems" },
  
  // Context & Background
  context: { id: "Peluncuran produk SaaS manajemen keuangan otomatis untuk UMKM dan pekerja lepas", en: "Product launch of an automated financial management SaaS for SMBs and freelancers" },
  konteks: { id: "Peluncuran produk SaaS manajemen keuangan otomatis untuk UMKM dan pekerja lepas", en: "Product launch of an automated financial management SaaS for SMBs and freelancers" },
  background: { id: "Persaingan pasar semakin ketat dan audiens membutuhkan solusi cepat tanpa kurva belajar rumit", en: "Market competition is growing and the audience needs a fast solution without a steep learning curve" },
  latar_belakang: { id: "Persaingan pasar semakin ketat dan audiens membutuhkan solusi cepat tanpa kurva belajar rumit", en: "Market competition is growing and the audience needs a fast solution without a steep learning curve" },
  scenario: { id: "Perusahaan bertumbuh cepat dari 10 ke 50 karyawan dan sistem komunikasi internal mulai tidak terkoordinasi", en: "Company rapidly growing from 10 to 50 employees and internal communication is getting disorganized" },
  skenario: { id: "Perusahaan bertumbuh cepat dari 10 ke 50 karyawan dan sistem komunikasi internal mulai tidak terkoordinasi", en: "Company rapidly growing from 10 to 50 employees and internal communication is getting disorganized" },
  
  // Task & Objectives
  task: { id: "Buat draf strategi konten media sosial lengkap dengan jadwal posting mingguan dan 5 pilar konten utama", en: "Create a comprehensive social media content strategy draft with weekly posting schedule and 5 core pillars" },
  tugas: { id: "Buat draf strategi konten media sosial lengkap dengan jadwal posting mingguan dan 5 pilar konten utama", en: "Create a comprehensive social media content strategy draft with weekly posting schedule and 5 core pillars" },
  objective: { id: "Meningkatkan rasio konversi pendaftaran gratis hingga 25% dalam 30 hari ke depan", en: "Increase free sign-up conversion rate by 25% over the next 30 days" },
  tujuan: { id: "Meningkatkan rasio konversi pendaftaran gratis hingga 25% dalam 30 hari ke depan", en: "Increase free sign-up conversion rate by 25% over the next 30 days" },
  goal: { id: "Membangun kepercayaan pelanggan baru dan mendorong transaksi pembelian pertama", en: "Build trust with new customers and drive first-time purchase transactions" },
  
  // Audience & Target Market
  audience: { id: "Pemilik bisnis online, pedagang marketplace, dan kreator konten digital di Indonesia", en: "Online business owners, marketplace merchants, and digital content creators" },
  audiens: { id: "Pemilik bisnis online, pedagang marketplace, dan kreator konten digital di Indonesia", en: "Online business owners, marketplace merchants, and digital content creators" },
  target_audience: { id: "Mahasiswa dan pekerja kantoran pemula yang ingin belajar literasi finansial dari nol", en: "College students and early-career professionals wanting to learn financial literacy from scratch" },
  target_market: { id: "Pengguna smartphone aktif usia 18-40 tahun yang menyukai kepraktisan belanja online", en: "Active smartphone users aged 18-40 who love the convenience of online shopping" },
  target_audiens: { id: "Pengguna smartphone aktif usia 18-40 tahun yang menyukai kepraktisan belanja online", en: "Active smartphone users aged 18-40 who love the convenience of online shopping" },
  demografi: { id: "Pria dan wanita urban usia 25-35 tahun dengan minat tinggi pada gaya hidup sehat dan efisiensi waktu", en: "Urban men and women aged 25-35 with high interest in healthy lifestyle and time efficiency" },

  // Topic, Subject, Problem & Pain Points
  topic: { id: "Cara mengelola waktu kerja secara efektif dengan teknik time-blocking dan AI", en: "How to effectively manage work time with time-blocking techniques and AI" },
  topik: { id: "Cara mengelola waktu kerja secara efektif dengan teknik time-blocking dan AI", en: "How to effectively manage work time with time-blocking techniques and AI" },
  subject: { id: "Aplikasi produktivitas berbasis mobile dengan fitur pelacak kebiasaan harian otomatis", en: "Mobile-first productivity app with an automated daily habit tracking feature" },
  subjek: { id: "Aplikasi produktivitas berbasis mobile dengan fitur pelacak kebiasaan harian otomatis", en: "Mobile-first productivity app with an automated daily habit tracking feature" },
  problem: { id: "Sering merasa kewalahan dengan tumpukan tugas tanpa tahu mana prioritas yang memberikan dampak terbesar", en: "Constantly feeling overwhelmed with task backlogs without knowing which priority drives highest impact" },
  masalah: { id: "Sering merasa kewalahan dengan tumpukan tugas tanpa tahu mana prioritas yang memberikan dampak terbesar", en: "Constantly feeling overwhelmed with task backlogs without knowing which priority drives highest impact" },
  pain_point: { id: "Membuang 3 jam sehari hanya untuk membalas pesan pelanggan berulang dan rekap data manual", en: "Wasting 3 hours a day just responding to repetitive customer inquiries and manual data entry" },
  titik_masalah: { id: "Tingginya angka churn pelanggan akibat proses onboarding yang membingungkan dan lambat", en: "High customer churn rate caused by a confusing and sluggish onboarding process" },

  // Video, Social, Hooks & Copywriting
  hook: { id: "90% orang salah saat menyusun anggaran bulanan, ini rahasia 3 langkah yang jarang dibagikan!", en: "90% of people make this mistake when budgeting, here is the real 3-step secret rarely shared!" },
  story: { id: "Dulu saya selalu kehabisan gaji di minggu kedua, sampai saya mencoba sistem pembagian rekening 50/30/20 otomatis ini...", en: "I used to run out of money by the second week, until I tested this automated 50/30/20 account split system..." },
  offer: { id: "Klaim template spreadsheet keuangan gratis via tautan di bio sekarang sebelum dihapus!", en: "Claim your free financial tracking template via the link in bio before it gets taken down!" },
  cta: { id: "Klik tombol daftar sekarang untuk klaim diskon 50% khusus 100 pendaftar pertama!", en: "Click the register button now to claim an exclusive 50% discount for the first 100 signups!" },
  panggilan_aksi: { id: "Klik tombol daftar sekarang untuk klaim diskon 50% khusus 100 pendaftar pertama!", en: "Click the register button now to claim an exclusive 50% discount for the first 100 signups!" },
  headline: { id: "Solusi Cerdas Otomatisasi Operasional Bisnis Tanpa Tambahan Karyawan", en: "Smart Business Operations Automation Solution Without Adding Headcount" },

  // Style, Tone & Format
  tone: { id: "Profesional, persuasif, inspiratif namun tetap bersahabat dan mudah dimengerti", en: "Professional, persuasive, inspiring yet friendly and easy to understand" },
  gaya_bahasa: { id: "Santai, mengalir, penuh empati seperti berbicara dengan teman akrab yang berpengalaman", en: "Casual, flowing, empathetic like talking with an experienced close friend" },
  style: { id: "Modern, elegan, bersih dengan sentuhan minimalis berorientasi hasil", en: "Modern, elegant, clean with a minimalist results-driven touch" },
  format: { id: "Gunakan poin-poin terstruktur dengan judul tebal dan ringkasan eksekutif 3 baris di awal", en: "Use structured bullet points with bold headers and a 3-line executive summary upfront" },
  format_output: { id: "Tabel perbandingan ringkas beserta rekomendasi langkah aksi konkret", en: "Concise comparison table alongside concrete action step recommendations" },
  panjang_kata: { id: "Sekitar 400 - 600 kata yang padat isi tanpa pemborosan kalimat", en: "Around 400 - 600 words, dense in value with zero filler" },

  // Constraints & Rules
  constraint: { id: "Maksimal 300 kata, hindari jargon teknis berlebihan, dan sertakan 3 tips praktis siap pakai", en: "Maximum 300 words, avoid excessive technical jargon, and include 3 actionable tips" },
  batasan: { id: "Maksimal 300 kata, hindari jargon teknis berlebihan, dan sertakan 3 tips praktis siap pakai", en: "Maximum 300 words, avoid excessive technical jargon, and include 3 actionable tips" },
  instruksi_khusus: { id: "Fokus pada solusi yang bisa langsung dipraktekkan hari ini tanpa modal tambahan", en: "Focus on solutions that can be applied immediately today with zero additional capital" },
  larangan: { id: "Dilarang menggunakan kata klise seperti 'di era modern ini', 'revolusioner', atau 'tak terbantahkan'", en: "Strictly avoid buzzwords like 'in this modern era', 'game-changing', or 'revolutionize'" },

  // Image & Visual Prompts (Midjourney, DALL-E, FLUX.1)
  prompt_visual: { id: "Karakter 3D animasi Disney Pixar anak kucing oranye lucu mengenakan jas astronot mini, berdiri di permukaan bulan dengan latar bumi biru bersinar", en: "3D Disney Pixar animation character of a cute orange kitten wearing a mini astronaut suit, standing on the moon surface with radiant blue Earth background" },
  pencahayaan: { id: "Cinematic golden hour lighting dengan ambient rim light neon teal dan soft volumetric fog", en: "Cinematic golden hour lighting with neon teal ambient rim light and soft volumetric fog" },
  sudut_kamera: { id: "Eye-level shot, 85mm f/1.8 lens, bokeh latar belakang lembut, komposisi rule of thirds", en: "Eye-level shot, 85mm f/1.8 lens, smooth background bokeh, rule of thirds composition" },
  detail_visual: { id: "Detail tekstur fotorealistik 8K, render Octane, visual tajam dan kaya warna", en: "8K hyper-realistic texture detail, Octane render, crisp visuals and vibrant color palette" },
  rasio_aspek: { id: "16:9", en: "16:9" },
  aspek_rasio: { id: "16:9", en: "16:9" },

  // Code & Technical Engineering
  kode_bahasa: { id: "TypeScript / React dengan Tailwind CSS", en: "TypeScript / React with Tailwind CSS" },
  bahasa_pemrograman: { id: "TypeScript (ES2022+)", en: "TypeScript (ES2022+)" },
  fungsi_tujuan: { id: "Fungsi utilitas untuk validasi formulir input dan kalkulasi diskon otomatis secara reaktif", en: "Utility function for input form validation and reactive automatic discount calculation" },
  error_message: { id: "TypeError: Cannot read properties of undefined (reading 'map') saat memuat data async", en: "TypeError: Cannot read properties of undefined (reading 'map') when loading async data" },
  arsitektur: { id: "Clean Architecture dengan Feature-Sliced Design dan pemisahan concerns yang ketat", en: "Clean Architecture with Feature-Sliced Design and strict separation of concerns" },

  // STAR / Interview / Career
  situation: { id: "Tim kami menghadapi penurunan performa penjualan sebesar 20% pada kuartal lalu akibat peralihan tren pasar", en: "Our team faced a 20% drop in sales performance during the last quarter due to market trend shift" },
  situasi: { id: "Tim kami menghadapi penurunan performa penjualan sebesar 20% pada kuartal lalu akibat peralihan tren pasar", en: "Our team faced a 20% drop in sales performance during the last quarter due to market trend shift" },
  action: { id: "Saya memimpin inisiatif restrukturisasi alur funnel, meluncurkan konten edukasi viral, dan membuat kampanye onboarding interaktif", en: "I led an initiative to restructure the funnel flow, launched viral educational content, and created an interactive onboarding campaign" },
  aksi: { id: "Saya memimpin inisiatif restrukturisasi alur funnel, meluncurkan konten edukasi viral, dan membuat kampanye onboarding interaktif", en: "I led an initiative to restructure the funnel flow, launched viral educational content, and created an interactive onboarding campaign" },
  result: { id: "Penjualan meningkat 35% dalam waktu 6 minggu, churn rate berkurang 50%, dan kepuasan pelanggan naik menjadi 4.8/5", en: "Sales increased by 35% within 6 weeks, churn rate dropped by 50%, and CSAT rose to 4.8/5" },
  hasil: { id: "Penjualan meningkat 35% dalam waktu 6 minggu, churn rate berkurang 50%, dan kepuasan pelanggan naik menjadi 4.8/5", en: "Sales increased by 35% within 6 weeks, churn rate dropped by 50%, and CSAT rose to 4.8/5" },

  // Reasoning & Deliberative Models (DeepSeek R1, Claude 3.7 Thinking, o1/o3)
  hardconstraints: { id: "DILARANG menggunakan database NoSQL. Harus kompatibel dengan PostgreSQL 16. Skema harus zero downtime migration.", en: "STRICTLY FORBIDDEN to use NoSQL databases. Must be compatible with PostgreSQL 16. Schema must support zero downtime migration." },
  contextualgrounding: { id: "Tim 4 backend engineer Golang. Berjalan di Kubernetes on-premise dengan batasan lisensi open-source.", en: "Team of 4 Golang backend engineers. Running on-premise Kubernetes with open-source licensing constraints." },
  outputcontract: { id: "1. Ringkasan Eksekutif Trade-off, 2. Skema DDL SQL Lengkap, 3. Protokol Penanganan Sharding & Failover.", en: "1. Executive Trade-off Summary, 2. Complete SQL DDL Schema, 3. Sharding & Failover Protocol." },

  // MCP & AI Coding Agents (.cursorrules / Windsurf)
  projecttechstack: { id: "Next.js 15 (App Router), TypeScript 5.5, Tailwind CSS v4, Zustand, Supabase Database, React Query v5", en: "Next.js 15 (App Router), TypeScript 5.5, Tailwind CSS v4, Zustand, Supabase Database, React Query v5" },
  architecturalpatterns: { id: "Gunakan Feature-First Folder Structure (/features/[name]/components, api, hooks). Pisahkan business logic ke custom hooks.", en: "Use Feature-First Folder Structure (/features/[name]/components, api, hooks). Decouple business logic into custom hooks." },
  strictforbiddenrules: { id: "DILARANG menggunakan 'any' di TypeScript. JANGAN install dependensi baru tanpa persetujuan. HINDARI inline styles.", en: "DO NOT use 'any' in TypeScript. NEVER install new dependencies without approval. AVOID inline styles." },
  mcpservername: { id: "PostgreSQL Cloud Analytics MCP Server - Integrasi query database & visualisasi schema", en: "PostgreSQL Cloud Analytics MCP Server - Database query integration & schema visualization" },
  toolsandresources: { id: "1. execute_read_query (SQL SELECT dengan limit proteksi), 2. inspect_table_schema (Ambil DDL & relasi foreign keys), 3. explain_query_plan (Analisis query latency)", en: "1. execute_read_query (Protected SELECT with limit), 2. inspect_table_schema (DDL & foreign keys), 3. explain_query_plan (Query latency analysis)" },

  // Multimodal Video & Suno v4 Audio
  scenevisualnarrative: { id: "Seorang astronot berdiri di tepi ngarai Planet Mars, mengangkat sensor cuaca saat badai pasir jingga menerjang dan visor memantulkan dua bulan", en: "An astronaut standing at the edge of a Martian canyon, raising a sensor device as orange dust storms sweep across terrain with twin moon visor reflections" },
  songstructurelyrics: { id: "[Intro]\n(Melodi gitar akustik hangat)\n\n[Verse 1]\nPagi buta melangkah di aspal ibukota\nMenatap gedung tinggi menembus cakrawala\n\n[Chorus]\nAku berjanji takkan pulang dengan tangan hampa\nDoa ibu mengiringi setiap tetes peluh rasa\n\n[Guitar Solo]\n\n[Outro]\nSampai esok kita berjumpa di puncak impian", en: "[Intro]\n(Warm acoustic guitar picking)\n\n[Verse 1]\nEarly morning walking on city pavement\nGazing at high-rises reaching the clouds\n\n[Chorus]\nI promised I would never return empty-handed\nMother's prayer carries every step I take\n\n[Guitar Solo]\n\n[Outro]\nUntil we meet tomorrow at the peak of our dreams" },

  // Live Stream E-Commerce & Scholarship
  liveproductname: { id: "Paket Skincare Glowing 4-in-1 (Serum + Moisturizer + Sunscreen + Facial Wash) Diskon 50% + Free Pouch", en: "4-in-1 Glowing Skincare Set (Serum + Moisturizer + Sunscreen + Facial Wash) 50% Off + Free Travel Pouch" },
  flashsaleurgency: { id: "Khusus 20 orang pertama yang tap love sampai 10K dan ketik 'MAU GLOWING' di kolom komentar, harga diskon 50%! Hitungan 10 detik etalase dibuka!", en: "Exclusive for first 20 viewers who tap love to 10K and comment 'WANT GLOWING', instant 50% off! 10 second countdown begins now!" },
  applicantbackground: { id: "Dokter umum lulusan UI dengan pengalaman 3 tahun memimpin program penanganan stunting di pelosok Nusa Tenggara Timur", en: "Medical doctor from UI with 3 years leading childhood stunting eradication in remote East Nusa Tenggara" },
  poststudyroadmap: { id: "Tahun 1-2: Kembali bertugas di Kemenkes RI merancang digitalisasi sistem rujukan Puskesmas. Tahun 3-5: Mendirikan inisiatif tele-health non-profit untuk 50 kepulauan terluar.", en: "Year 1-2: Serve at Ministry of Health designing digital primary clinic referral. Year 3-5: Establish non-profit tele-health network for 50 outermost islands." },
};

/**
 * Get a high quality, realistic sample value for any component without exception.
 * Guarantees every single field is filled with rich, realistic, context-aware content
 * that directly serves as an authoritative benchmark for AI idea generation.
 */
export const getRealisticSampleForComponent = (
  comp: FrameworkComponent,
  frameworkName: string,
  lang: 'id' | 'en' = 'id'
): any => {
  // 1. Select type: return first valid option (avoiding "Lainnya..." / "Other...")
  if (comp.type === 'select') {
    if (comp.options && comp.options.length > 0) {
      const validOpt = comp.options.find(o => o !== 'Lainnya...' && o !== 'Other...') || comp.options[0];
      return validOpt;
    }
    return lang === 'id' ? 'Opsi Default Rekomendasi' : 'Recommended Default Option';
  }

  // 2. Multiselect type: return array of top options
  if (comp.type === 'multiselect') {
    if (comp.options && comp.options.length > 0) {
      const validOptions = comp.options.filter(o => o !== 'Lainnya...' && o !== 'Other...');
      if (validOptions.length >= 2) {
        return [validOptions[0], validOptions[1]];
      }
      return validOptions.length > 0 ? [validOptions[0]] : [comp.options[0]];
    }
    return lang === 'id' ? ['Pilihan Utama', 'Pilihan Tambahan'] : ['Primary Choice', 'Secondary Choice'];
  }

  // 3. Sliders / numbers: return ideal midpoint or within range
  if (comp.type === 'slider' || comp.type === 'number') {
    if (comp.min !== undefined && comp.max !== undefined) {
      return Math.round((comp.min + comp.max) / 2);
    }
    if (comp.min !== undefined) return comp.min + 5;
    if (comp.max !== undefined) return Math.min(comp.max, 10);
    return 10;
  }

  // 4. Boolean / Checkboxes
  if (comp.type === 'boolean') {
    return true;
  }

  // 5. Date type: return current real-world date (YYYY-MM-DD)
  if (comp.type === 'date') {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // 6. Color picker
  if (comp.type === 'color') {
    return '#10b981';
  }

  // 7. Code type
  if (comp.type === 'code') {
    return lang === 'id'
      ? `// Logika fungsi utilitas utama\nexport const processData = (items: string[]) => {\n  return items.filter(Boolean).map(item => item.trim());\n};`
      : `// Core utility function implementation\nexport const processData = (items: string[]) => {\n  return items.filter(Boolean).map(item => item.trim());\n};`;
  }

  // 8. Try extracting from placeholder if it provides a genuine example
  if (comp.placeholder && comp.placeholder.trim()) {
    const raw = translatePlaceholder(comp.placeholder, lang);
    const cleaned = raw
      .replace(/^contoh:\s*|^e\.g\.,\s*|^example:\s*|^misal:\s*/i, '')
      .replace(/['"]\s*$/, '')
      .replace(/^\s*['"]/, '')
      .trim();

    // Check if cleaned is a genuine realistic sample (not merely an imperative instruction)
    const isInstructionOnly = /^(masukkan|tempelkan|tuliskan|salin|isi|paste|enter|insert|copy|type)\b/i.test(cleaned);
    if (cleaned && cleaned.length > 5 && !isInstructionOnly && !cleaned.startsWith('...')) {
      return cleaned;
    }
  }

  // 9. Exact match from field dictionary
  const normalizedKey = comp.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  if (FIELD_SAMPLE_DICTIONARY[normalizedKey]) {
    return FIELD_SAMPLE_DICTIONARY[normalizedKey][lang];
  }

  // 10. Partial key matching from dictionary
  for (const [key, val] of Object.entries(FIELD_SAMPLE_DICTIONARY)) {
    if (normalizedKey.includes(key)) {
      return val[lang];
    }
  }

  // 11. Intelligent contextual synthesis based on label & parameter semantics
  const label = (comp.label || comp.name).toLowerCase();

  if (label.includes('produk') || label.includes('product') || label.includes('brand') || label.includes('merek')) {
    return lang === 'id' 
      ? 'Botol Minum Termos Stainless Steel 500ml Tahan Panas 24 Jam' 
      : '500ml Stainless Steel Insulated Thermos Bottle 24h Heat Retention';
  }
  if (label.includes('topik') || label.includes('topic') || label.includes('judul') || label.includes('title') || label.includes('tema')) {
    return lang === 'id'
      ? 'Strategi Praktis Meningkatkan Fokus, Produktivitas, dan Konsistensi Kerja Harian'
      : 'Practical Strategies to Boost Daily Focus, Productivity, and Consistency';
  }
  if (label.includes('audiens') || label.includes('audience') || label.includes('target') || label.includes('pengguna') || label.includes('user')) {
    return lang === 'id'
      ? 'Profesional muda usia 22-38 tahun dan pemilik usaha kecil menengah yang mengutamakan efisiensi'
      : 'Young professionals aged 22-38 and small business owners prioritizing efficiency';
  }
  if (label.includes('tujuan') || label.includes('goal') || label.includes('objective') || label.includes('target')) {
    return lang === 'id'
      ? 'Membantu pembaca memahami kerangka kerja inti dan menerapkannya langsung dalam pekerjaan hari ini'
      : 'Help readers grasp the core framework and apply it directly in their work today';
  }
  if (label.includes('masalah') || label.includes('problem') || label.includes('kendala') || label.includes('challenge')) {
    return lang === 'id'
      ? 'Alur kerja masih manual dan tidak terdokumentasi rapi sehingga sering terjadi miskomunikasi tim'
      : 'Workflow remains manual and undocumented, leading to frequent team miscommunication';
  }
  if (label.includes('solusi') || label.includes('solution') || label.includes('langkah') || label.includes('step')) {
    return lang === 'id'
      ? 'Standardisasi alur kerja digital dengan template otomatisasi dan panduan langkah demi langkah'
      : 'Standardizing digital workflow with automation templates and step-by-step guidance';
  }
  if (label.includes('manfaat') || label.includes('benefit') || label.includes('keunggulan')) {
    return lang === 'id'
      ? 'Menghemat waktu operasional hingga 70% dan meningkatkan akurasi data tanpa kerja lembur'
      : 'Save up to 70% operational time and enhance data accuracy without overtime work';
  }
  if (label.includes('harga') || label.includes('price') || label.includes('biaya') || label.includes('cost')) {
    return lang === 'id'
      ? 'Mulai dari Rp149.000 (Paket Starter) dengan garansi kepuasan 30 hari uang kembali'
      : 'Starting from $19/month (Starter Plan) with a 30-day money-back guarantee';
  }
  if (label.includes('durasi') || label.includes('duration') || label.includes('waktu') || label.includes('time')) {
    return lang === 'id'
      ? '60 detik berdurasi cepat dan langsung ke inti permasalahan'
      : '60 seconds fast-paced and straight to the core message';
  }
  if (label.includes('link') || label.includes('tautan') || label.includes('url')) {
    return 'https://prompt.sigitadi.id/';
  }
  if (label.includes('email') || label.includes('surel')) {
    return 'si.sigitadi@gmail.com';
  }

  // 12. High-Caliber Contextual Synthesizer (Never returns generic placeholder)
  const readableLabel = (comp.label || comp.name).trim();
  return lang === 'id'
    ? `Rincian ${readableLabel} yang spesifik, relevan, dan terukur untuk skenario optimal ${frameworkName}`
    : `Specific, actionable, and measurable ${readableLabel} tailored for optimal ${frameworkName} execution`;
};
