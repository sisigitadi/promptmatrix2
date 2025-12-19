const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const frameworkSchema = require("../src/schemas/framework.schema.json");

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(frameworkSchema);

const frameworksFilePath = path.resolve(__dirname, "../src/data/frameworks.ts");

function validateFramework(framework) {
  const isValid = validate(framework);
  if (!isValid) {
    return { isValid: false, errors: validate.errors };
  }
  return { isValid: true, errors: null };
}

function readFrameworks() {
  const fileContent = fs.readFileSync(frameworksFilePath, "utf8");
  const jsonString = fileContent
    .replace("export const PROMPT_FRAMEWORKS: PromptFrameworksType = ", "")
    .replace(/;\n$/, ""); // Remove trailing semicolon and newline
  // This is a bit fragile. A better solution would be to use a proper parser.
  // For now, we'll assume the structure is consistent.
  // A more robust way would be to handle the exports and types properly.
  // This is a temporary solution to avoid introducing a TS parser.
  try {
    // The file is not a valid JSON, so we need to use eval.
    // This is a security risk, but we are in a controlled environment.
    const frameworks = eval("(" + jsonString + ")");
    return frameworks;
  } catch (e) {
    console.error("Error parsing frameworks.ts:", e);
    return null;
  }
}

function writeFrameworks(frameworks) {
  const frameworkString = JSON.stringify(frameworks, null, 2);
  const fileContent = `import { PromptFrameworksType } from './types'; // Assuming types are in a separate file

export const PROMPT_FRAMEWORKS: PromptFrameworksType = ${frameworkString};
`;
  // We need to fix the import statement and type definitions.
  // This is a placeholder for the final implementation.
  fs.writeFileSync(frameworksFilePath, fileContent, "utf8");
}

function addFramework(newFrameworkPath) {
  if (!fs.existsSync(newFrameworkPath)) {
    console.error(`Error: File not found at ${newFrameworkPath}`);
    return;
  }

  const newFrameworkContent = fs.readFileSync(newFrameworkPath, "utf8");
  const newFramework = JSON.parse(newFrameworkContent);

  const validationResult = validateFramework(newFramework);
  if (!validationResult.isValid) {
    console.error(
      "Framework validation failed:",
      JSON.stringify(validationResult.errors, null, 2),
    );
    return;
  }

  const frameworks = readFrameworks();
  if (!frameworks) {
    return;
  }

  const [category, subcategory] = newFramework.kategori;
  const frameworkName = newFramework.nama_kerangka;

  if (!frameworks[category]) {
    frameworks[category] = {};
  }
  if (!frameworks[category][subcategory]) {
    frameworks[category][subcategory] = {};
  }

  if (frameworks[category][subcategory][frameworkName]) {
    console.warn(
      `Warning: Framework '${frameworkName}' already exists in '${category} -> ${subcategory}'. It will be overwritten.`,
    );
  }

  frameworks[category][subcategory][frameworkName] = newFramework;

  // This is where we would write the file back.
  // The writeFrameworks function needs to be implemented correctly.
  console.log(
    "Framework would be added. Writing back to file is not yet implemented.",
  );
  // writeFrameworks(frameworks);

  console.log(
    `Successfully added framework '${frameworkName}' to '${category} -> ${subcategory}'.`,
  );
}

const [, , newFrameworkPath] = process.argv;

if (!newFrameworkPath) {
  console.error("Please provide the path to the new framework JSON file.");
  process.exit(1);
}

// addFramework(newFrameworkPath);
console.log(
  "Script is not fully implemented yet. Please review and complete the script.",
);
