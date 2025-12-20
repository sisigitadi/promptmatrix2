import Ajv from "ajv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { execSync } from "child_process"; // Import execSync for running shell commands
import addFormats from "ajv-formats";

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Initialize AJV
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);

  // Load the schema
  const schemaPath = path.resolve(
    __dirname,
    "../src/schemas/framework.schema.json",
  );
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = ajv.compile(schema);

  // --- Compile frameworks.ts to a temporary JS file ---
  const frameworksTsPath = path.resolve(__dirname, "../src/data/frameworks.ts");
  const tempJsPath = path.resolve(__dirname, "./temp_frameworks.js"); // Temporary JS file

  try {
    // Run tsc to compile frameworks.ts to temp_frameworks.js
    // Ensure tsconfig.json is configured to allow this, or provide inline options
    execSync(
      `tsc --module commonjs --outDir \"${path.dirname(tempJsPath)}\" \"${frameworksTsPath}\"`,
    );
    console.log(`Successfully compiled ${frameworksTsPath} to ${tempJsPath}`);
    // await new Promise(resolve => setTimeout(resolve, 100)); // Re-add if timing issues persist
  } catch (error) {
    console.error(`Error compiling frameworks.ts: ${error.message}`);
    if (error.stderr) {
      console.error(`TSC Stderr: ${error.stderr.toString()}`);
    }
    if (error.stdout) {
      console.error(`TSC Stdout: ${error.stdout.toString()}`);
    }
    process.exit(1);
  }

  let PROMPT_FRAMEWORKS;
  try {
    // Import the compiled JavaScript file
    const frameworksModule = await import(pathToFileURL(tempJsPath).toString()); // Convert to file:// URL
    PROMPT_FRAMEWORKS = frameworksModule.PROMPT_FRAMEWORKS;
  } catch (e) {
    console.error("Error loading compiled frameworks.js:", e);
    process.exit(1);
  }
  // --- End of compilation and import ---

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

  // Clean up the temporary file after validation
  try {
    fs.unlinkSync(tempJsPath);
    console.log(`Cleaned up temporary file: ${tempJsPath}`);
  } catch (unlinkError) {
    console.warn(
      `Could not delete temporary file ${tempJsPath}: ${unlinkError.message}`,
    );
  }

  if (hasErrors) {
    console.error("\nFramework validation FAILED!");
    process.exit(1);
  } else {
    console.log("\nFramework validation PASSED!");
    process.exit(0);
  }
})();
