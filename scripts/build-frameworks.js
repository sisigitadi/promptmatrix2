import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frameworksDir = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "frameworks",
);
const outputFilePath = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "frameworks.ts",
);

// The static type definitions that need to be at the top of the generated file.
const staticTypeDefinitions = `
// Import types from the central type definition file
import { PromptFrameworksType, Framework, FrameworkComponent, DynamicSubcomponents, KomponenPromptType } from '../types';

// Re-export types for backward compatibility if needed, or just rely on the import in the consumer files.
// Ideally, consumers should import from '../types' directly, but for now we keep the structure similar.
export type { PromptFrameworksType, Framework, FrameworkComponent, DynamicSubcomponents, KomponenPromptType };

export const CATEGORY_ORDER = [
  "Teks & Konten",
  "Gambar & Desain",
  "Audio & Musik",
  "Prompt Ringkas",
  "Prompt Proyek",
  "Koleksi & Inovasi",
];
`;

const CATEGORY_MAPPING = {
  TeksKonten: "Teks & Konten",
  GambarDesain: "Gambar & Desain",
  AudioMusik: "Audio & Musik",
  PromptRingkas: "Prompt Ringkas",
  PromptProyek: "Prompt Proyek",
  KoleksiInovasi: "Koleksi & Inovasi",
};

async function buildFrameworks() {
  try {
    const frameworks = {};
    const categories = fs.readdirSync(frameworksDir);

    for (const categoryDir of categories) {
      const categoryPath = path.join(frameworksDir, categoryDir);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const categoryName = CATEGORY_MAPPING[categoryDir] || categoryDir;
      frameworks[categoryName] = {};
      const subcategories = fs.readdirSync(categoryPath);

      for (const subcategory of subcategories) {
        const subcategoryPath = path.join(categoryPath, subcategory);
        if (!fs.statSync(subcategoryPath).isDirectory()) continue;

        frameworks[categoryName][subcategory] = {};
        const frameworkFiles = fs
          .readdirSync(subcategoryPath)
          .filter((file) => file.endsWith(".json"));

        for (const frameworkFile of frameworkFiles) {
          const frameworkPath = path.join(subcategoryPath, frameworkFile);
          const content = fs.readFileSync(frameworkPath, "utf8");
          const framework = JSON.parse(content);
          // Use nama_kerangka as the key if available, to show descriptive titles in the UI.
          // Fallback to id_kerangka, then filename.
          const frameworkKey =
            framework.nama_kerangka ||
            framework.id_kerangka ||
            path.basename(frameworkFile, ".json");

          // Ensure category in framework object matches the mapped name
          framework.kategori = [categoryName, subcategory];

          frameworks[categoryName][subcategory][frameworkKey] = framework;
        }
      }
    }

    const finalObjectString = JSON.stringify(frameworks, null, 2);
    const finalFileContent = `${staticTypeDefinitions}
export const PROMPT_FRAMEWORKS: PromptFrameworksType = ${finalObjectString};
`;

    fs.writeFileSync(outputFilePath, finalFileContent, "utf8");
    console.log(`Successfully built frameworks.ts file at ${outputFilePath}`);
  } catch (error) {
    console.error("Error building frameworks.ts:", error);
    process.exit(1);
  }
}

buildFrameworks();
