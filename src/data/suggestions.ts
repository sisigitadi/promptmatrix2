export const INPUT_SUGGESTIONS: { [key: string]: string[] } = {
  // Common inputs
  TOPIK: [
    "Kecerdasan Buatan dalam Pendidikan",
    "Pemanasan Global",
    "Manajemen Waktu untuk Freelancer",
    "Resep Masakan Tradisional Modern",
    "Strategi Pemasaran Digital",
    "Kesehatan Mental di Tempat Kerja",
    "Pengembangan Kota Pintar",
    "Cryptocurrency dan Blockchain",
  ],
  ROLE: [
    "Seorang Guru SD yang sabar",
    "Seorang Konsultan Bisnis Senior",
    "Seorang Koki Bintang Lima",
    "Seorang Programmer Python Ahli",
    "Seorang Penulis Fiksi Ilmiah",
    "Seorang Terapis Pernikahan",
    "Seorang Sejarawan Seni",
    "Seorang Ahli Strategi SEO",
  ],
  AUDIENCE: [
    "Mahasiswa tingkat akhir",
    "Anak-anak usia 5-10 tahun",
    "Eksekutif perusahaan",
    "Ibu rumah tangga",
    "Pengembang pemula",
    "Investor aset kripto",
    "Pencinta kucing",
    "Wisatawan backpacker",
  ],
  TONE: [
    "Profesional dan Otoritatif",
    "Ramah dan Mengundang",
    "Lucu dan Menghibur",
    "Sarkastik dan Tajam",
    "Empatik dan Mendukung",
    "Akademis dan Formal",
    "Antusias dan Berenergi",
    "Misterius dan Menarik",
  ],
  CONTEXT: [
    "Untuk postingan LinkedIn viral",
    "Untuk email penawaran dingin (cold email)",
    "Untuk thread Twitter/X",
    "Untuk artikel blog SEO-friendly",
    "Untuk skrip video YouTube pendek",
    "Untuk deskripsi produk e-commerce",
    "Untuk surat lamaran kerja",
    "Untuk caption Instagram estetik",
  ],
  STYLE: [
    "Sangat detail dan komprehensif",
    "Singkat, padat, dan jelas (poin-poin)",
    "Bercerita (Storytelling)",
    "Debat pro dan kontra",
    "Panduan langkah demi langkah (How-to)",
    "Q&A (Tanya Jawab)",
    "Studi kasus nyata",
    "Analogi metaforis",
  ],
  LANGUAGE: [
    "Bahasa Indonesia Formal (EYD)",
    "Bahasa Indonesia Gaul/Santai",
    "Bahasa Inggris (UK Professional)",
    "Bahasa Inggris (US Casual)",
    "Campuran Indoglish (Jaksel style)",
    "Bahasa Jawa Krama Inggil",
  ],
  // Specific inputs
  GENRE: [
    "Cyberpunk Dystopian",
    "High Fantasy Medieval",
    "Space Opera Sci-Fi",
    "Noir Detective Mystery",
    "Romantic Comedy",
    "Slice of Life Anime",
    "Dark Psychological Horror",
  ],
  PLATFORM: [
    "Instagram Reels",
    "TikTok Video",
    "YouTube Shorts",
    "LinkedIn Article",
    "Medium Post",
    "Twitter Thread",
    "Facebook Group Post",
  ],
  // English Aliases
  TOPIC: [
    "Artificial Intelligence in Education",
    "Global Warming and Climate Change",
    "Time Management for Freelancers",
    "Modern Twist on Traditional Recipes",
    "Digital Marketing Strategies 2024",
    "Mental Health in the Workplace",
    "Smart City Development",
    "Cryptocurrency and Blockchain",
  ],
  SUBJECT: [
    "Physics: Quantum Mechanics",
    "History: The Industrial Revolution",
    "Biology: Photosynthesis",
    "Math: Calculus Derivatives",
    "Literature: Shakespearean Tragedy",
  ],
  KEYWORD: [
    "Sustainable, Eco-friendly, Green",
    "Minimalist, Clean, Modern",
    "Luxury, Premium, Exclusive",
    "Affordable, Budget, Cheap",
    "Fast, Efficient, Quick",
  ],
};

// Map simpler keys to existing arrays if needed to avoid duplication
INPUT_SUGGESTIONS["THEME"] = INPUT_SUGGESTIONS["TOPIK"];
INPUT_SUGGESTIONS["BAHASA"] = INPUT_SUGGESTIONS["LANGUAGE"];

export const getRandomSuggestion = (key: string): string => {
  // Normalize key to uppercase and replace spaces with underscores to match potential dictionary keys or formats
  const normalizedKey = key.toUpperCase().replace(/\s+/g, "_");

  // 1. Try exact match
  let suggestions = INPUT_SUGGESTIONS[normalizedKey];

  // 2. Try partial match: if dictionary key is contained in input key (e.g. "INPUT_TOPIK" contains "TOPIK")
  if (!suggestions) {
    const foundKeyStr = Object.keys(INPUT_SUGGESTIONS).find((dictKey) =>
      normalizedKey.includes(dictKey),
    );
    if (foundKeyStr) {
      suggestions = INPUT_SUGGESTIONS[foundKeyStr];
    }
  }

  // 3. Try reverse partial match: if input key is contained in dictionary key (less likely but possible)
  if (!suggestions) {
    const foundKeyStr = Object.keys(INPUT_SUGGESTIONS).find((dictKey) =>
      dictKey.includes(normalizedKey),
    );
    if (foundKeyStr) {
      suggestions = INPUT_SUGGESTIONS[foundKeyStr];
    }
  }

  if (suggestions && suggestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  }

  return "";
};
