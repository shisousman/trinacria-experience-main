import { defineConfig } from "vite";
import { tanstackViteStart } from "@tanstack/start/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackViteStart(),
  ],
});
