#!/usr/bin/env node
/**
 * SAFELY delete unused assets from src/assets directory.
 * Always run audit-assets.js first to see what will be deleted!
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, "src/assets");
const srcDir = path.resolve(__dirname, "src");

async function getAllAssets() {
  const files = await fs.readdir(assetsDir);
  return files.filter(
    (f) =>
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f) &&
      !f.startsWith(".")
  );
}

async function getCodeReferences() {
  const codeFiles = globSync("**/*.{ts,tsx,js,jsx,css}", {
    cwd: srcDir,
    ignore: ["**/dist/**", "**/build/**"],
  });

  const references = new Set();

  for (const file of codeFiles) {
    const filePath = path.join(srcDir, file);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const matches = content.match(
        /[@/]assets\/([a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp|svg))/gi
      );
      if (matches) {
        matches.forEach((m) => {
          const filename = m.split("/").pop();
          if (filename) references.add(filename.toLowerCase());
        });
      }
    } catch (error) {
      // Silently skip unreadable files
    }
  }

  return references;
}

async function main() {
  console.log("⚠️  UNUSED ASSET DELETION TOOL\n");
  console.log("This will DELETE unused assets from src/assets/\n");

  const allAssets = await getAllAssets();
  const usedAssets = await getCodeReferences();
  const unusedAssets = allAssets.filter(
    (asset) => !usedAssets.has(asset.toLowerCase())
  );

  if (unusedAssets.length === 0) {
    console.log("✨ All assets are in use! Nothing to delete.\n");
    process.exit(0);
  }

  console.log("Assets to be DELETED:\n");
  unusedAssets.forEach((asset, i) => {
    console.log(`  ${i + 1}. ${asset}`);
  });

  console.log(`\n⚠️  This will permanently delete ${unusedAssets.length} file(s).\n`);

  // Simple confirmation: check for --force flag
  const forceDelete = process.argv.includes("--force");

  if (!forceDelete) {
    console.log("To proceed, run:\n");
    console.log("   node delete-unused-assets.js --force\n");
    console.log("To review assets first, run:\n");
    console.log("   node audit-assets.js\n");
    process.exit(0);
  }

  console.log("🗑️  Deleting unused assets...\n");
  let deleted = 0;

  for (const asset of unusedAssets) {
    const filePath = path.join(assetsDir, asset);
    try {
      await fs.unlink(filePath);
      console.log(`   ✓ Deleted: ${asset}`);
      deleted++;
    } catch (error) {
      console.log(`   ✗ Failed to delete ${asset}: ${error.message}`);
    }
  }

  console.log(`\n✅ Cleanup complete! Deleted ${deleted}/${unusedAssets.length} files.\n`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
