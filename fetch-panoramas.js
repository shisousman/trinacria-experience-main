import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, "src/assets");

const panoramas = [
  {
    key: "etna",
    url: "https://pannellum.org/images/alma.jpg",
  },
  {
    key: "taormina",
    url: "https://pannellum.org/images/cerro-toco-0.jpg",
  },
  {
    key: "stromboli",
    url: "https://pannellum.org/images/jfk.jpg",
  },
  {
    key: "tree",
    url: "https://pannellum.org/images/from-tree.jpg",
  },
  {
    key: "bma",
    url: "https://pannellum.org/images/bma-1.jpg",
  },
  {
    key: "toco",
    url: "https://pannellum.org/images/tocopilla.jpg",
  },
];

function getFilename(key, url) {
  const urlName = new URL(url).pathname.split("/").pop() || key;
  return `pano-${key}-${urlName}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadFile(url, destination) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Unexpected content type for ${url}: ${contentType}`);
  }

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength === 0) {
    throw new Error(`Downloaded file is empty: ${url}`);
  }

  await fs.writeFile(destination, Buffer.from(buffer));
}

async function main() {
  console.log("Checking panorama asset downloads for src/assets...");
  await fs.mkdir(assetsDir, { recursive: true });

  const results = [];

  for (const panorama of panoramas) {
    const filename = getFilename(panorama.key, panorama.url);
    const destination = path.join(assetsDir, filename);
    const exists = await fileExists(destination);

    if (exists) {
      console.log(`Skipping existing file: ${filename}`);
      results.push({ filename, status: "skipped" });
      continue;
    }

    process.stdout.write(`Downloading ${filename}... `);
    try {
      await downloadFile(panorama.url, destination);
      console.log("done");
      results.push({ filename, status: "downloaded" });
    } catch (error) {
      console.log("failed");
      results.push({ filename, status: "error", error: error.message });
    }
  }

  console.log("\nPanorama download summary:");
  for (const result of results) {
    if (result.status === "downloaded" || result.status === "skipped") {
      console.log(`  - ${result.filename}: ${result.status}`);
    } else {
      console.log(`  - ${result.filename}: ${result.status} (${result.error})`);
    }
  }

  console.log(`\nAssets saved to: ${assetsDir}`);
  console.log("If you want to use these files in the app, replace the remote URLs in src/data/pois.ts with the local asset paths.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
