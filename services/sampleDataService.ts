/**
 * PromptMatrix Realistic Sample Data Engine
 * Generates natural, context-aware sample values for all 136+ Prompt Frameworks
 * Fully synchronized for Indonesian (ID) and English (EN)
 */

import { Framework, FrameworkComponent } from '../data/frameworks';
import { translatePlaceholder } from './localizationService';

// Field-specific smart dictionary based on common component parameter names
const FIELD_SAMPLE_DICTIONARY: Record<string, { id: string; en: string }> = {
  // Roles & Personas
  role: { id: "Pakar Pemasaran Digital & Copywriter Senior dengan pengalaman 10+ tahun", en: "Senior Digital Marketing Specialist & Copywriter with 10+ years experience" },
  peran: { id: "Pakar Pemasaran Digital & Copywriter Senior dengan pengalaman 10+ tahun", en: "Senior Digital Marketing Specialist & Copywriter with 10+ years experience" },
  persona: { id: "Konsultan Bisnis Senior & Mentor Startup Teknologi", en: "Senior Business Consultant & Tech Startup Mentor" },
  user_persona: { id: "Profesional muda usia 25-35 tahun yang ingin meningkatkan produktivitas harian", en: "Young professional aged 25-35 looking to improve daily productivity" },
  
  // Context & Background
  context: { id: "Peluncuran produk SaaS manajemen keuangan otomatis untuk UMKM dan pekerja lepas", en: "Product launch of an automated financial management SaaS for SMBs and freelancers" },
  konteks: { id: "Peluncuran produk SaaS manajemen keuangan otomatis untuk UMKM dan pekerja lepas", en: "Product launch of an automated financial management SaaS for SMBs and freelancers" },
  background: { id: "Persaingan pasar semakin ketat dan audiens membutuhkan solusi cepat tanpa kurva belajar rumit", en: "Market competition is growing and the audience needs a fast solution without a steep learning curve" },
  latar_belakang: { id: "Persaingan pasar semakin ketat dan audiens membutuhkan solusi cepat tanpa kurva belajar rumit", en: "Market competition is growing and the audience needs a fast solution without a steep learning curve" },
  
  // Task & Objectives
  task: { id: "Buat draf strategi konten media sosial lengkap dengan jadwal posting dan 5 pilar konten utama", en: "Create a comprehensive social media content strategy draft with posting schedule and 5 core pillars" },
  tugas: { id: "Buat draf strategi konten media sosial lengkap dengan jadwal posting dan 5 pilar konten utama", en: "Create a comprehensive social media content strategy draft with posting schedule and 5 core pillars" },
  objective: { id: "Meningkatkan rasio konversi pendaftaran gratis hingga 25% dalam 30 hari ke depan", en: "Increase free sign-up conversion rate by 25% over the next 30 days" },
  tujuan: { id: "Meningkatkan rasio konversi pendaftaran gratis hingga 25% dalam 30 hari ke depan", en: "Increase free sign-up conversion rate by 25% over the next 30 days" },
  goal: { id: "Membangun kepercayaan pelanggan baru dan mendorong pembelian pertama", en: "Build trust with new customers and drive first-time purchases" },
  
  // Audience & Target Market
  audience: { id: "Pemilik bisnis online, pedagang marketplace, dan kreator konten digital di Indonesia", en: "Online business owners, marketplace merchants, and digital content creators" },
  audiens: { id: "Pemilik bisnis online, pedagang marketplace, dan kreator konten digital di Indonesia", en: "Online business owners, marketplace merchants, and digital content creators" },
  target_audience: { id: "Mahasiswa dan pekerja kantoran pemula yang ingin belajar investasi dari nol", en: "College students and early-career professionals wanting to learn investing from scratch" },
  target_market: { id: "Pengguna smartphone aktif usia 18-40 tahun yang menyukai kepraktisan belanja online", en: "Active smartphone users aged 18-40 who love the convenience of online shopping" },
  target_audiens: { id: "Pengguna smartphone aktif usia 18-40 tahun yang menyukai kepraktisan belanja online", en: "Active smartphone users aged 18-40 who love the convenience of online shopping" },

  // Topic, Subject, Problem
  topic: { id: "Cara mengelola waktu kerja secara efektif dengan teknik time-blocking dan AI", en: "How to effectively manage work time with time-blocking techniques and AI" },
  topik: { id: "Cara mengelola waktu kerja secara efektif dengan teknik time-blocking dan AI", en: "How to effectively manage work time with time-blocking techniques and AI" },
  subject: { id: "Aplikasi produktivitas berbasis mobile dengan fitur pelacak kebiasaan harian", en: "Mobile-first productivity app with a daily habit tracking feature" },
  subjek: { id: "Aplikasi produktivitas berbasis mobile dengan fitur pelacak kebiasaan harian", en: "Mobile-first productivity app with a daily habit tracking feature" },
  problem: { id: "Sering merasa kewalahan dengan tumpukan tugas tanpa tahu mana prioritas utama", en: "Constantly feeling overwhelmed with backlog tasks without knowing what to prioritize" },
  masalah: { id: "Sering merasa kewalahan dengan tumpukan tugas tanpa tahu mana prioritas utama", en: "Constantly feeling overwhelmed with backlog tasks without knowing what to prioritize" },
  pain_point: { id: "Membuang 3 jam sehari hanya untuk membalas pesan pelanggan berulang", en: "Wasting 3 hours a day just responding to repetitive customer inquiries" },

  // Video, Social & Hooks
  hook: { id: "90% orang salah saat menyusun anggaran bulanan, ini rahasia 3 langkah yang benar!", en: "90% of people make this mistake when budgeting, here is the real 3-step secret!" },
  story: { id: "Dulu saya selalu kehabisan gaji di minggu kedua, sampai saya mencoba sistem pembagian rekening otomatis ini...", en: "I used to run out of money by the second week, until I tested this automated account split system..." },
  offer: { id: "Klaim template spreadsheet keuangan gratis via tautan di bio sekarang sebelum dihapus!", en: "Claim your free financial tracking template via the link in bio before it gets taken down!" },
  cta: { id: "Klik tombol daftar sekarang untuk klaim diskon 50% khusus 100 pendaftar pertama!", en: "Click the register button now to claim an exclusive 50% discount for the first 100 signups!" },
  panggilan_aksi: { id: "Klik tombol daftar sekarang untuk klaim diskon 50% khusus 100 pendaftar pertama!", en: "Click the register button now to claim an exclusive 50% discount for the first 100 signups!" },

  // Style, Tone & Format
  tone: { id: "Profesional, persuasif, inspiratif namun tetap bersahabat dan mudah dimengerti", en: "Professional, persuasive, inspiring yet friendly and easy to understand" },
  gaya_bahasa: { id: "Santai, mengalir, penuh empati seperti berbicara dengan teman akrab", en: "Casual, flowing, empathetic like talking with a close friend" },
  style: { id: "Modern, elegan, bersih dengan sentuhan minimalis", en: "Modern, elegant, clean with a minimalist touch" },
  format: { id: "Gunakan poin-poin terstruktur dengan judul tebal dan ringkasan eksekutif 3 baris di awal", en: "Use structured bullet points with bold headers and a 3-line executive summary upfront" },
  format_output: { id: "Tabel perbandingan ringkas beserta rekomendasi langkah aksi konkret", en: "Concise comparison table alongside concrete action step recommendations" },

  // Constraints & Rules
  constraint: { id: "Maksimal 300 kata, hindari jargon teknis berlebihan, dan sertakan 3 tips praktis", en: "Maximum 300 words, avoid excessive technical jargon, and include 3 actionable tips" },
  batasan: { id: "Maksimal 300 kata, hindari jargon teknis berlebihan, dan sertakan 3 tips praktis", en: "Maximum 300 words, avoid excessive technical jargon, and include 3 actionable tips" },
  instruksi_khusus: { id: "Fokus pada solusi yang bisa langsung dipraktekkan hari ini tanpa modal tambahan", en: "Focus on solutions that can be applied immediately today with zero additional capital" },

  // Image & Visual Prompts (Midjourney / DALL-E)
  prompt_visual: { id: "Karakter 3D animasi Disney Pixar anak kucing oranye lucu mengenakan jas astronot mini, berdiri di permukaan bulan", en: "3D Disney Pixar animation character of a cute orange kitten wearing a mini astronaut suit, standing on the moon surface" },
  pencahayaan: { id: "Cinematic golden hour lighting dengan ambient rim light neon teal dan soft volumetric fog", en: "Cinematic golden hour lighting with neon teal ambient rim light and soft volumetric fog" },
  sudut_kamera: { id: "Eye-level shot, 85mm f/1.8 lens, bokeh latar belakang lembut, komposisi rule of thirds", en: "Eye-level shot, 85mm f/1.8 lens, smooth background bokeh, rule of thirds composition" },
  detail_visual: { id: "Detail tekstur fotorealistik 8K, render Octane, visual tajam dan kaya warna", en: "8K hyper-realistic texture detail, Octane render, crisp visuals and vibrant color palette" },

  // Code & Technical
  kode_bahasa: { id: "TypeScript / React dengan Tailwind CSS", en: "TypeScript / React with Tailwind CSS" },
  fungsi_tujuan: { id: "Fungsi utilitas untuk validasi formulir input dan kalkulasi diskon otomatis", en: "Utility function for input form validation and automatic discount calculation" },
  error_message: { id: "TypeError: Cannot read properties of undefined (reading 'map') saat memuat data async", en: "TypeError: Cannot read properties of undefined (reading 'map') when loading async data" },

  // STAR / Interview
  situation: { id: "Tim kami menghadapi penurunan performa penjualan sebesar 20% pada kuartal lalu", en: "Our team faced a 20% drop in sales performance during the last quarter" },
  situasi: { id: "Tim kami menghadapi penurunan performa penjualan sebesar 20% pada kuartal lalu", en: "Our team faced a 20% drop in sales performance during the last quarter" },
  action: { id: "Saya memimpin inisiatif restrukturisasi alur funnel dan membuat kampanye onboarding interaktif", en: "I led an initiative to restructure the funnel flow and created an interactive onboarding campaign" },
  aksi: { id: "Saya memimpin inisiatif restrukturisasi alur funnel dan membuat kampanye onboarding interaktif", en: "I led an initiative to restructure the funnel flow and created an interactive onboarding campaign" },
  result: { id: "Penjualan meningkat 35% dalam waktu 6 minggu dan churn rate berkurang separuh", en: "Sales increased by 35% within 6 weeks and the churn rate was cut in half" },
  hasil: { id: "Penjualan meningkat 35% dalam waktu 6 minggu dan churn rate berkurang separuh", en: "Sales increased by 35% within 6 weeks and the churn rate was cut in half" },
};

/**
 * Get a high quality, realistic sample value for a component in the active language.
 */
export const getRealisticSampleForComponent = (
  comp: FrameworkComponent,
  frameworkName: string,
  lang: 'id' | 'en' = 'id'
): any => {
  // 1. Select type: return first valid option
  if (comp.type === 'select' && comp.options && comp.options.length > 0) {
    const validOpt = comp.options.find(o => o !== 'Lainnya...' && o !== 'Other...') || comp.options[0];
    return validOpt;
  }

  // 2. Sliders / numbers: return ideal midpoint
  if (comp.type === 'slider' || comp.type === 'number') {
    if (comp.min !== undefined && comp.max !== undefined) {
      return Math.round((comp.min + comp.max) / 2);
    }
    return comp.min ?? 5;
  }

  // 3. Boolean / Checkboxes
  if (comp.type === 'boolean') {
    return true;
  }

  // 4. Try from placeholder if meaningful
  if (comp.placeholder && comp.placeholder.trim()) {
    const raw = translatePlaceholder(comp.placeholder, lang);
    const cleaned = raw
      .replace(/^contoh:\s*|^e\.g\.,\s*|^example:\s*|^misal:\s*/i, '')
      .replace(/['"]\s*$/, '')
      .replace(/^\s*['"]/, '')
      .trim();

    // Check if cleaned is a genuine realistic sample (not just "Masukkan..." or "Tempelkan...")
    const isInstructionOnly = /^(masukkan|tempelkan|tuliskan|salin|paste|enter|insert|copy)/i.test(cleaned);
    if (cleaned && cleaned.length > 5 && !isInstructionOnly && !cleaned.startsWith('...')) {
      return cleaned;
    }
  }

  // 5. Check field-specific smart dictionary
  const normalizedKey = comp.name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  if (FIELD_SAMPLE_DICTIONARY[normalizedKey]) {
    return FIELD_SAMPLE_DICTIONARY[normalizedKey][lang];
  }

  // Check partial key matching
  for (const [key, val] of Object.entries(FIELD_SAMPLE_DICTIONARY)) {
    if (normalizedKey.includes(key)) {
      return val[lang];
    }
  }

  // 6. Natural fallback based on component label
  const label = (comp.label || comp.name).toLowerCase();
  if (label.includes('produk') || label.includes('product') || label.includes('brand')) {
    return lang === 'id' 
      ? 'Botol Minum Termos Stainless Steel 500ml Tahan Panas 24 Jam' 
      : '500ml Stainless Steel Insulated Thermos Bottle 24h Heat Retention';
  }
  if (label.includes('topik') || label.includes('topic') || label.includes('judul') || label.includes('title')) {
    return lang === 'id'
      ? 'Panduan Praktis Meningkatkan Produktivitas dan Fokus Kerja Harian'
      : 'Practical Guide to Boosting Daily Productivity and Work Focus';
  }
  if (label.includes('audiens') || label.includes('audience') || label.includes('target')) {
    return lang === 'id'
      ? 'Profesional muda dan pemilik usaha kecil menengah usia 22-40 tahun'
      : 'Young professionals and small business owners aged 22-40';
  }
  if (label.includes('tujuan') || label.includes('goal') || label.includes('objective')) {
    return lang === 'id'
      ? 'Membantu pembaca memahami konsep dasar dan langsung mempraktikkannya hari ini'
      : 'Help readers grasp the core concepts and apply them immediately today';
  }

  // Final fallback
  return lang === 'id'
    ? `Contoh ${comp.label || comp.name} untuk skenario ${frameworkName}`
    : `Sample ${comp.label || comp.name} for ${frameworkName} scenario`;
};
