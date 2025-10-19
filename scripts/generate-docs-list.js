import fs from "fs";
import path from "path";

const docsDir = path.join(process.cwd(), "public", "docs");
const manifestPath = path.join(process.cwd(), "public", "docs-manifest.json");

// Recursive function to find all .md files and return their paths relative to the base directory
const findMdFilesRecursive = (dir, baseDir) => {
  let mdFiles = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      mdFiles = mdFiles.concat(findMdFilesRecursive(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // Return path relative to the base (docs) directory, using forward slashes
      mdFiles.push(path.relative(baseDir, fullPath).split(path.sep).join("/"));
    }
  }
  return mdFiles;
};

// Function to convert filename to a more readable title
const toTitleCase = (filepath) => {
  const filename = path.basename(filepath);
  // Special cases for known files to make them more readable
  const specialCases = {
    "FAQ.md": "FAQ",
    "README.md": "README",
    "CONTRIBUTING.md": "Panduan Kontribusi",
    "DaftarKerangkaKerja.md": "Daftar Kerangka Kerja",
    "FAQ_Troubleshooting.md": "FAQ & Troubleshooting",
    "PanduanPenggunaanInteraktif.md": "Panduan Penggunaan Interaktif",
    "release.md": "Catatan Rilis",
  };

  if (specialCases[filename]) {
    return specialCases[filename];
  }

  // Generic conversion for other files
  return filename
    .replace(/\.md$/, "") // remove .md extension
    .replace(/([a-z])([A-Z])/g, "$1 $2") // add space before capital letters
    .replace(/[_-]/g, " ") // replace underscores and hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize first letter of each word
    .trim();
};

try {
  const mdFiles = findMdFilesRecursive(docsDir, docsDir);

  const manifest = mdFiles
    .map((file) => ({
      title: toTitleCase(file),
      file: file,
    }))
    .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(
    `Successfully generated docs manifest at ${manifestPath} (${manifest.length} files found).`,
  );
} catch (error) {
  console.error("Failed to generate docs manifest:", error);
  process.exit(1);
}
