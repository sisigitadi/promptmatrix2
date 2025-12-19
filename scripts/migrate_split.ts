import fs from "fs";
import path from "path";
import { PROMPT_FRAMEWORKS } from "../src/data/frameworks";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_BASE_DIR = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "frameworks",
);

// Helper to sanitize filenames
function sanitizeFilename(name: string) {
  return name.replace(/[^a-z0-9\-_]/gi, "_").replace(/_+/g, "_");
}

async function migrate() {
  console.log("Starting migration...");

  if (!fs.existsSync(TARGET_BASE_DIR)) {
    console.log(`Creating base directory: ${TARGET_BASE_DIR}`);
    fs.mkdirSync(TARGET_BASE_DIR, { recursive: true });
  }

  let count = 0;

  for (const [category, subcategories] of Object.entries(PROMPT_FRAMEWORKS)) {
    // Create Category Directory
    const categoryDir = path.join(TARGET_BASE_DIR, sanitizeFilename(category));
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    for (const [subcategory, frameworks] of Object.entries(subcategories)) {
      // Create Subcategory Directory
      const subcategoryDir = path.join(
        categoryDir,
        sanitizeFilename(subcategory),
      );
      if (!fs.existsSync(subcategoryDir)) {
        fs.mkdirSync(subcategoryDir, { recursive: true });
      }

      for (const [frameworkKey, framework] of Object.entries(frameworks)) {
        // Determine filename: Use ID if available, otherwise use the object key or name
        let filename = framework.id_kerangka || frameworkKey;

        // Ensure filename is safe
        filename = sanitizeFilename(filename);

        const filePath = path.join(subcategoryDir, `${filename}.json`);

        // Write the file
        fs.writeFileSync(filePath, JSON.stringify(framework, null, 2));
        console.log(`Migrated: ${category} -> ${subcategory} -> ${filename}`);
        count++;
      }
    }
  }

  console.log(
    `\nMigration complete! Successfully created ${count} framework files.`,
  );
}

migrate().catch(console.error);
