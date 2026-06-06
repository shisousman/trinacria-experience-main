#!/usr/bin/env node
/**
 * Analyze unused assets in src/assets directory.
 * Checks which image files are actually imported or referenced in the codebase.
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
      // Look for asset imports and references
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
      console.warn(`Warning: Could not read ${file}: ${error.message}`);
    }
  }

  return references;
}

async function main() {
  console.log("🔍 Scanning assets...\n");
  
  const allAssets = await getAllAssets();
  const usedAssets = await getCodeReferences();

  const unusedAssets = allAssets.filter(
    (asset) => !usedAssets.has(asset.toLowerCase())
  );

  console.log("📊 ASSET AUDIT REPORT\n");
  console.log(`Total assets: ${allAssets.length}`);
  console.log(`Used assets: ${usedAssets.size}`);
  console.log(`Unused assets: ${unusedAssets.length}\n`);

  if (usedAssets.size > 0) {
    console.log("✅ USED ASSETS:");
    Array.from(usedAssets)
      .sort()
      .forEach((asset) => {
        console.log(`   - ${asset}`);
      });
  }

  if (unusedAssets.length > 0) {
    console.log("\n❌ UNUSED ASSETS (safe to delete):");
    unusedAssets.forEach((asset) => {
      console.log(`   - ${asset}`);
    });

    console.log("\n💡 To delete unused assets, run:");
    console.log("   node delete-unused-assets.js");
  } else {
    console.log("\n✨ All assets are in use! No cleanup needed.");
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
