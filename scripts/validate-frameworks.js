import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize AJV with all errors to get detailed reports
// Note: ajv exports a default class in some versions/configs, or named export in others.
// Depending on how ajv is installed/bundled. Adjusting for typical ESM usage.
const AjvClass = Ajv.default || Ajv;
const ajv = new AjvClass({ allErrors: true, verbose: true });
addFormats(ajv); // Apply formats plugin

// Load the schema
const schemaPath = path.resolve(
  __dirname,
  "../src/schemas/framework.schema.json",
);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validate = ajv.compile(schema);

// Load the frameworks data
const frameworksPath = path.resolve(__dirname, "../src/data/frameworks.ts");
// Read as text and extract the PROMPT_FRAMEWORKS object
const frameworksContent = fs.readFileSync(frameworksPath, "utf8");

// A simple regex to extract the PROMPT_FRAMEWORKS object.
// This is a bit fragile but avoids needing a full TypeScript parser for a simple validation script.
const frameworksMatch = frameworksContent.match(
  /export const PROMPT_FRAMEWORKS: PromptFrameworksType = (\{[\s\S]*\});\s*$/,
);

if (!frameworksMatch || !frameworksMatch[1]) {
  console.error(
    "Error: Could not extract PROMPT_FRAMEWORKS from frameworks.ts",
  );
  process.exit(1);
}

// Safely evaluate the extracted string as a JavaScript object
let PROMPT_FRAMEWORKS;
try {
  // Use a function to safely evaluate the string as an object
  // This is generally risky, but for a controlled internal file, it's acceptable.
  // Ensure no malicious code can be injected.
  PROMPT_FRAMEWORKS = eval("(" + frameworksMatch[1] + ")");
} catch (e) {
  console.error("Error parsing PROMPT_FRAMEWORKS:", e);
  process.exit(1);
}

let hasErrors = false;

// Iterate through the nested structure and validate each framework
for (const categoryKey in PROMPT_FRAMEWORKS) {
  const category = PROMPT_FRAMEWORKS[categoryKey];
  for (const subcategoryKey in category) {
    const subcategory = category[subcategoryKey];
    for (const frameworkKey in subcategory) {
      const framework = subcategory[frameworkKey];

      const isValid = validate(framework);
      if (!isValid) {
        console.error(
          `Validation errors for framework: ${categoryKey} > ${subcategoryKey} > ${frameworkKey}`,
        );
        validate.errors.forEach((err) => {
          console.error(`  - ${err.instancePath}: ${err.message}`);
        });
        hasErrors = true;
      }
    }
  }
}

if (hasErrors) {
  console.error("\nFramework validation FAILED!");
  process.exit(1);
} else {
  console.log("\nFramework validation PASSED!");
  process.exit(0);
}
