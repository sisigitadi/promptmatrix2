const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");
const addFormats = require("ajv-formats");

(async () => {
  // Wrap in async IIFE
  // Initialize AJV with all errors to get detailed reports
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);

  // Load the schema
  const schemaPath = path.resolve(
    __dirname,
    "../src/schemas/framework.schema.json",
  );
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = ajv.compile(schema);

  // Load the frameworks data directly using import()
  const { PROMPT_FRAMEWORKS } = await import("../src/data/frameworks.ts");

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
})(); // End of IIFE
