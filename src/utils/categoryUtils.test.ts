import { categoryCssNameMap } from "./categoryUtils";

describe("categoryCssNameMap", () => {
  it("should contain expected category to CSS name mappings", () => {
    expect(categoryCssNameMap).toEqual({
      "Audio & Musik": "category-audio",
      "Bisnis & Profesional": "category-business",
      "Edukasi & Pembelajaran": "category-education",
      "Gambar & Desain": "category-image",
      "Game & Narasi": "category-game",
      "Koleksi & Inovasi": "category-collection",
      Programming: "category-code",
      "Prompt Proyek": "category-project",
      "Prompt Ringkas": "category-concise",
      "Teks & Konten": "category-text",
      default: "category-default",
    });
  });

  it("should return undefined for unknown categories", () => {
    expect(categoryCssNameMap["Unknown Category"]).toBeUndefined();
  });

  it("should have a consistent number of entries", () => {
    const expectedNumberOfEntries = 11; // Based on the current map
    expect(Object.keys(categoryCssNameMap).length).toBe(
      expectedNumberOfEntries,
    );
  });
});
