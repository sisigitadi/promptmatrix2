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

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const failOnWarn = args.includes("--fail-on-warn");

const getNumericArg = (flag, fallback) => {
  const entry = args.find((arg) => arg.startsWith(`${flag}=`));
  if (!entry) return fallback;
  const [, raw] = entry.split("=");
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const maxFilesToShow = getNumericArg("--max-files", 15);
const maxMessagesPerFile = getNumericArg("--max-messages", 6);

const REQUIRED_METADATA = {
  examples: [],
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
  version: "2.7.0",
  updated_at: "2025-12-23T07:00:00.000000",
};

const isHybridCandidate = (value) => {
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  if (!normalized || normalized.toLowerCase().includes("lainnya")) return false;

  const hasParentheses = normalized.includes("(") && normalized.includes(")");
  const multiWord = normalized.split(/\s+/).length >= 2;
  const hasEnglishWord = /[A-Za-z]{4,}/.test(normalized);

  return hasEnglishWord && multiWord && !hasParentheses;
};

const collectDynamicComponentNames = (dynamicSubcomponents) => {
  const names = new Set();

  const addFromOption = (optionValue) => {
    if (Array.isArray(optionValue)) {
      optionValue.forEach((comp) => comp?.name && names.add(comp.name));
    } else if (optionValue && typeof optionValue === "object") {
      if (Array.isArray(optionValue.components)) {
        optionValue.components.forEach(
          (comp) => comp?.name && names.add(comp.name),
        );
      }
    }
  };

  if (!dynamicSubcomponents) return names;

  if (Array.isArray(dynamicSubcomponents)) {
    dynamicSubcomponents.forEach((sub) => {
      Object.values(sub.options || {}).forEach(addFromOption);
    });
  } else {
    Object.values(dynamicSubcomponents.options || {}).forEach(addFromOption);
  }

  return names;
};

const extractPlaceholders = (text = "") => {
  const placeholders = [];
  const regex = /\{([A-Za-z0-9_]+)\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    placeholders.push(match[1]);
  }
  return placeholders;
};

const auditFramework = (filePath, framework) => {
  const errors = [];
  const warnings = [];

  // Critical: required metadata presence
  const missingMetadata = Object.keys(REQUIRED_METADATA).filter(
    (key) => framework[key] === undefined || framework[key] === null,
  );

  if (missingMetadata.length) {
    errors.push(
      `Missing required metadata fields: ${missingMetadata.join(", ")}`,
    );
  }

  // Critical: ensure "Lainnya..." options have dynamic subcomponents
  const components = Array.isArray(framework.components)
    ? framework.components
    : [];
  const dynamicSubcomponents = framework.dynamicSubcomponents;
  const dynamicTriggers = new Map();

  if (Array.isArray(dynamicSubcomponents)) {
    dynamicSubcomponents.forEach((sub) => {
      dynamicTriggers.set(sub.trigger, sub);
    });
  } else if (dynamicSubcomponents?.trigger) {
    dynamicTriggers.set(dynamicSubcomponents.trigger, dynamicSubcomponents);
  }

  components.forEach((comp) => {
    if (Array.isArray(comp.options) && comp.options.includes("Lainnya...")) {
      const dynamic = dynamicTriggers.get(comp.name);
      const hasLainnyaOption =
        dynamic && dynamic.options && dynamic.options["Lainnya..."];

      if (!hasLainnyaOption) {
        warnings.push(
          `Component "${comp.name}" exposes "Lainnya..." but lacks matching dynamicSubcomponents configuration.`,
        );
      }
    }
  });

  // Template hygiene: placeholder vs component coverage (warnings only)
  const promptBlocks = [
    framework.komponen_prompt?.PERAN,
    framework.komponen_prompt?.KONTEKS,
    framework.komponen_prompt?.TUGAS,
    framework.komponen_prompt?.FORMAT_OUTPUT,
    framework.komponen_prompt?.["FORMAT OUTPUT"],
    framework.konteks_tambahan_instruksi_khusus,
  ].filter(Boolean);

  const placeholders = new Set(
    promptBlocks.flatMap((block) => extractPlaceholders(block)),
  );

  const componentNames = new Set(components.map((c) => c.name));
  collectDynamicComponentNames(dynamicSubcomponents).forEach((name) =>
    componentNames.add(name),
  );

  const unusedComponents = [...componentNames].filter(
    (name) => !placeholders.has(name),
  );
  if (unusedComponents.length) {
    warnings.push(
      `Components not referenced in prompts: ${unusedComponents
        .slice(0, 5)
        .join(", ")}${unusedComponents.length > 5 ? ", ..." : ""}`,
    );
  }

  const unknownPlaceholders = [...placeholders].filter(
    (ph) => !componentNames.has(ph),
  );
  if (unknownPlaceholders.length) {
    warnings.push(
      `Placeholders without components: ${unknownPlaceholders
        .slice(0, 5)
        .join(", ")}${unknownPlaceholders.length > 5 ? ", ..." : ""}`,
    );
  }

  // Hybrid localization nudges (warnings)
  const hybridCandidates = [];
  components.forEach((comp) => {
    if (!Array.isArray(comp.options)) return;
    comp.options.forEach((opt) => {
      const optionValue = typeof opt === "string" ? opt : opt?.label || "";
      if (isHybridCandidate(optionValue)) {
        hybridCandidates.push(optionValue);
      }
    });
  });

  if (hybridCandidates.length) {
    warnings.push(
      `Consider hybrid EN-ID formatting for options: ${[
        ...new Set(hybridCandidates.slice(0, 5)),
      ].join(", ")}${hybridCandidates.length > 5 ? ", ..." : ""}`,
    );
  }

  return { errors, warnings };
};

const auditAllFrameworks = () => {
  let errorCount = 0;
  let warningCount = 0;
  const filesWithFindings = [];

  const walk = (dir) => {
    fs.readdirSync(dir).forEach((entry) => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith(".json")) {
        const framework = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        const { errors, warnings } = auditFramework(fullPath, framework);
        if (errors.length || warnings.length) {
          filesWithFindings.push({
            file: fullPath,
            errors,
            warnings,
          });
        }
        errorCount += errors.length;
        warningCount += warnings.length;
      }
    });
  };

  walk(frameworksDir);

  const filesToShow = filesWithFindings.slice(0, maxFilesToShow);

  if (verbose) {
    filesToShow.forEach(({ file, errors, warnings }) => {
      console.log(`\n• Audit: ${file.replace(`${process.cwd()}/`, "")}`);
      errors.forEach((err) => console.error(`  ✖ ${err}`));
      warnings
        .slice(0, maxMessagesPerFile)
        .forEach((warn) => console.warn(`  ⚠️ ${warn}`));
      if (warnings.length > maxMessagesPerFile) {
        console.warn(
          `  ⚠️ ... ${warnings.length - maxMessagesPerFile} more warning(s)`,
        );
      }
    });
    if (filesWithFindings.length > filesToShow.length) {
      console.log(
        `\n(Truncated) ${filesToShow.length} of ${filesWithFindings.length} files shown. Use --max-files or --verbose for full output.`,
      );
    }
  }

  console.log(
    `\nSOP audit completed with ${errorCount} error(s) and ${warningCount} warning(s) across ${filesWithFindings.length} file(s).`,
  );

  if (errorCount > 0 || (failOnWarn && warningCount > 0)) {
    process.exit(1);
  }
};

auditAllFrameworks();
