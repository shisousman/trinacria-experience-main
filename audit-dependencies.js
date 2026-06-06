#!/usr/bin/env node
/**
 * Analyze unused npm dependencies in package.json
 * Checks which imports are actually used in the src codebase.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgJsonPath = path.resolve(__dirname, "package.json");
const srcDir = path.resolve(__dirname, "src");

async function getPackageJson() {
  const content = await fs.readFile(pkgJsonPath, "utf-8");
  return JSON.parse(content);
}

async function getCodeImports() {
  const codeFiles = globSync("**/*.{ts,tsx,js,jsx}", {
    cwd: srcDir,
    ignore: ["**/dist/**", "**/build/**"],
  });

  const imports = new Set();

  for (const file of codeFiles) {
    const filePath = path.join(srcDir, file);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      
      // Match: import ... from "package-name"
      const importMatches = content.match(/from\s+["']([^"']+)["']/g);
      if (importMatches) {
        importMatches.forEach((match) => {
          const pkg = match.match(/["']([^"']+)["']/)[1];
          // Handle scoped packages (@org/package) and subpaths
          const basePkg = pkg.split("/")[0].startsWith("@")
            ? pkg.split("/").slice(0, 2).join("/")
            : pkg.split("/")[0];
          if (basePkg) imports.add(basePkg);
        });
      }

      // Match: require("package-name")
      const requireMatches = content.match(/require\s*\(\s*["']([^"']+)["']\s*\)/g);
      if (requireMatches) {
        requireMatches.forEach((match) => {
          const pkg = match.match(/["']([^"']+)["']/)[1];
          const basePkg = pkg.split("/")[0].startsWith("@")
            ? pkg.split("/").slice(0, 2).join("/")
            : pkg.split("/")[0];
          if (basePkg) imports.add(basePkg);
        });
      }
    } catch (error) {
      // Silently skip unreadable files
    }
  }

  return imports;
}

async function main() {
  console.log("📦 NPM DEPENDENCY AUDIT\n");

  const pkg = await getPackageJson();
  const usedImports = await getCodeImports();

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const depNames = Object.keys(deps);
  const unusedDeps = depNames.filter((dep) => !usedImports.has(dep));
  const usedDeps = depNames.filter((dep) => usedImports.has(dep));

  console.log(`Total dependencies: ${depNames.length}`);
  console.log(`Used: ${usedDeps.length}`);
  console.log(`Potentially unused: ${unusedDeps.length}\n`);

  if (usedDeps.length > 0) {
    console.log("✅ USED DEPENDENCIES:\n");
    usedDeps.sort().forEach((dep) => {
      const version = deps[dep];
      console.log(`   ${dep}@${version}`);
    });
  }

  if (unusedDeps.length > 0) {
    console.log("\n⚠️  POTENTIALLY UNUSED DEPENDENCIES:\n");
    unusedDeps.forEach((dep) => {
      const version = deps[dep];
      const isDev = pkg.devDependencies[dep] ? "(dev)" : "";
      console.log(`   ${dep}@${version} ${isDev}`);
    });

    console.log("\n💡 Note: Some packages (e.g., types, CLI tools) may not appear in imports.");
    console.log("   Review carefully before removing!");
    console.log("\n   To remove, run:");
    unusedDeps.forEach((dep) => {
      console.log(`     pnpm remove ${dep}`);
    });
  } else {
    console.log("\n✨ All dependencies appear to be in use!");
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
