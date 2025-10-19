import { categoryCssNameMap } from "./categoryUtils";

describe("categoryCssNameMap", () => {
  it("should contain expected category to CSS name mappings", () => {
    expect(categoryCssNameMap).toEqual({
      "Audio & Musik": "audio",
      "Gambar & Desain": "gambar",
      "Teks & Konten": "teks",
      "Prompt Ringkas": "ringkas",
      "Prompt Proyek": "proyek",
      "Koleksi & Inovasi": "koleksi",
    });
  });

  it("should return undefined for unknown categories", () => {
    expect(categoryCssNameMap["Unknown Category"]).toBeUndefined();
  });

  it("should have a consistent number of entries", () => {
    const expectedNumberOfEntries = 6; // Based on the current map
    expect(Object.keys(categoryCssNameMap).length).toBe(
      expectedNumberOfEntries,
    );
  });
});
