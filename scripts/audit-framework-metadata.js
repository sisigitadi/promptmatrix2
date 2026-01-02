import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRAMEWORKS_DIR = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "frameworks",
);

const REQUIRED_METADATA = {
  examples: [],
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
};

const TARGET_VERSION_PREFIX = "2.7.";

const auditResults = [];

function auditFrameworkFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  const missingKeys = Object.keys(REQUIRED_METADATA).filter(
    (key) => !(key in data),
  );

  if (missingKeys.length === 0) {
    return;
  }

  const patched = { ...data };
  missingKeys.forEach((key) => {
    patched[key] = REQUIRED_METADATA[key];
  });

  const previousVersion = patched.version;
  if (!patched.version || !patched.version.startsWith(TARGET_VERSION_PREFIX)) {
    patched.version = `${TARGET_VERSION_PREFIX}0`;
  }

  const newTimestamp = new Date().toISOString();
  const previousUpdatedAt = patched.updated_at;
  patched.updated_at = newTimestamp;

  fs.writeFileSync(filePath, `${JSON.stringify(patched, null, 2)}\n`, "utf8");

  auditResults.push({
    file: filePath,
    added: missingKeys,
    version: { from: previousVersion, to: patched.version },
    updated_at: { from: previousUpdatedAt, to: newTimestamp },
  });
}

function walkFrameworks(dir) {
  fs.readdirSync(dir).forEach((entry) => {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      walkFrameworks(fullPath);
    } else if (stats.isFile() && fullPath.endsWith(".json")) {
      auditFrameworkFile(fullPath);
    }
  });
}

function run() {
  walkFrameworks(FRAMEWORKS_DIR);

  if (auditResults.length === 0) {
    console.log("Audit complete: no metadata gaps found.");
    return;
  }

  console.log(
    "Audit complete: applied metadata defaults to the following frameworks:",
  );
  auditResults.forEach((result) => {
    console.log(`- ${result.file}`);
    console.log(`  added: ${result.added.join(", ")}`);
    console.log(
      `  version: ${result.version.from || "N/A"} -> ${result.version.to}`,
    );
    console.log(
      `  updated_at: ${result.updated_at.from || "N/A"} -> ${result.updated_at.to}`,
    );
  });
}

run();
