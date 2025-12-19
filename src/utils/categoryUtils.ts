export const categoryCssNameMap: { [key: string]: string } = {
  // Utama
  "Audio & Musik": "category-audio",
  "Gambar & Desain": "category-image",
  "Teks & Konten": "category-text",
  Programming: "category-code",
  "Bisnis & Profesional": "category-business",
  "Edukasi & Pembelajaran": "category-education",
  "Game & Narasi": "category-game",

  // Tambahan
  "Prompt Ringkas": "category-concise",
  "Prompt Proyek": "category-project",
  "Koleksi & Inovasi": "category-collection",

  // Default fallback
  default: "category-default",
};

export const getCategoryCssClass = (categoryName: string): string => {
  return categoryCssNameMap[categoryName] || categoryCssNameMap["default"];
};
