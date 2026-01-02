import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRAMEWORK_ROOT = path.resolve(__dirname, "../src/data/frameworks");
const PLACEHOLDER_REGEX = /\{([a-zA-Z0-9_]+)\}/g;
const CONDITIONAL_BLOCK_REGEX = /\[[^\]]*\{[^}]+}[^\]]*]/;

const args = process.argv.slice(2);
const checkAll = args.includes("--all") || args.includes("--all-files");
const explicitFiles = args.filter((arg) => !arg.startsWith("--"));

const toAbsolutePath = (p) => path.resolve(process.cwd(), p);

const listAllFrameworkFiles = () => {
  const results = [];
  const traverse = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && fullPath.endsWith(".json")) {
        results.push(fullPath);
      }
    });
  };
  traverse(FRAMEWORK_ROOT);
  return results;
};

const getChangedFrameworkFiles = () => {
  if (explicitFiles.length > 0) {
    return explicitFiles.map(toAbsolutePath);
  }

  if (checkAll) {
    return listAllFrameworkFiles();
  }

  const candidateCommands = [
    "git diff --name-only --cached --diff-filter=ACMRTUXB -- 'src/data/frameworks'",
    "git diff --name-only --diff-filter=ACMRTUXB HEAD -- 'src/data/frameworks'",
  ];

  for (const cmd of candidateCommands) {
    try {
      const output = execSync(cmd, { encoding: "utf8" }).trim();
      if (output) {
        return output
          .split("\n")
          .filter((filePath) => filePath.endsWith(".json"))
          .map(toAbsolutePath);
      }
    } catch (err) {
      // If git is unavailable or the command fails, continue to the next approach.
    }
  }

  return [];
};

const extractPlaceholders = (text) => {
  if (!text || typeof text !== "string") return new Set();
  const matches = Array.from(text.matchAll(PLACEHOLDER_REGEX)).map((m) => m[1]);
  return new Set(matches);
};

const hasConditionalBlock = (text) =>
  typeof text === "string" && CONDITIONAL_BLOCK_REGEX.test(text);

const buildPreviewSnapshot = (komponenPrompt) => {
  const cleanSection = (text) =>
    (text || "")
      .replace(/\*\*/g, "")
      .replace(/\[[^\]]*]/g, (block) => block.slice(1, -1))
      .replace(PLACEHOLDER_REGEX, "value");

  return ["PERAN", "KONTEKS", "TUGAS", "FORMAT_OUTPUT", "FORMAT OUTPUT"]
    .map((section) => cleanSection(komponenPrompt?.[section]))
    .filter(Boolean)
    .join("\n");
};

const validateKomponenPrompt = (filePath) => {
  const errors = [];
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const komponenPrompt = data.komponen_prompt;

  if (!komponenPrompt) {
    return errors;
  }

  ["PERAN", "KONTEKS", "TUGAS"].forEach((section) => {
    const content = komponenPrompt[section];
    if (typeof content === "string" && content.trim().length > 0) {
      if (!hasConditionalBlock(content)) {
        errors.push(
          `[${section}] perlu menyertakan blok kondisional [...] dengan placeholder di dalamnya.`,
        );
      }
    }
  });

  const placeholders = {
    PERAN: extractPlaceholders(komponenPrompt.PERAN),
    KONTEKS: extractPlaceholders(komponenPrompt.KONTEKS),
    TUGAS: extractPlaceholders(komponenPrompt.TUGAS),
  };

  const duplicateAcrossSections = new Set();
  ["PERAN", "KONTEKS"].forEach((section, idx, arr) => {
    for (let i = idx + 1; i < arr.length; i++) {
      placeholders[section].forEach((ph) => {
        if (placeholders[arr[i]].has(ph)) duplicateAcrossSections.add(ph);
      });
    }
  });

  placeholders.PERAN.forEach((ph) => {
    if (placeholders.TUGAS.has(ph)) duplicateAcrossSections.add(ph);
  });
  placeholders.KONTEKS.forEach((ph) => {
    if (placeholders.TUGAS.has(ph)) duplicateAcrossSections.add(ph);
  });

  if (duplicateAcrossSections.size > 0) {
    errors.push(
      `Placeholder duplikat ditemukan antara PERAN/KONTEKS/TUGAS: ${[
        ...duplicateAcrossSections,
      ].join(", ")}`,
    );
  }

  const narrativePlaceholders = new Set([
    ...placeholders.PERAN,
    ...placeholders.KONTEKS,
  ]);
  const detailPlaceholders = new Set([
    ...placeholders.TUGAS,
    ...extractPlaceholders(komponenPrompt.FORMAT_OUTPUT),
    ...extractPlaceholders(komponenPrompt["FORMAT OUTPUT"]),
  ]);

  const overlap = [...detailPlaceholders].filter((ph) =>
    narrativePlaceholders.has(ph),
  );
  if (overlap.length > 0) {
    errors.push(
      `Placeholder sudah disebut di narasi (PERAN/KONTEKS) tidak boleh diulang di detail (TUGAS/FORMAT_OUTPUT): ${overlap.join(
        ", ",
      )}`,
    );
  }

  const preview = buildPreviewSnapshot(komponenPrompt);
  if (preview.includes("**")) {
    errors.push("Preview masih mengandung markdown tebal (**).");
  }

  return errors;
};

const main = () => {
  const targetFiles = getChangedFrameworkFiles();
  if (targetFiles.length === 0) {
    console.log(
      "Tidak ada berkas framework (.json) yang perlu divalidasi komponen_prompt.",
    );
    return;
  }

  const failures = [];

  targetFiles.forEach((filePath) => {
    const errors = validateKomponenPrompt(filePath);
    if (errors.length > 0) {
      failures.push({ filePath, errors });
    }
  });

  if (failures.length > 0) {
    console.error("Validasi komponen_prompt gagal:");
    failures.forEach(({ filePath, errors }) => {
      console.error(`- ${path.relative(process.cwd(), filePath)}`);
      errors.forEach((err) => console.error(`  • ${err}`));
    });
    process.exit(1);
  } else {
    console.log(
      `Komponen_prompt valid untuk ${targetFiles.length} kerangka kerja yang diperiksa.`,
    );
  }
};

main();
