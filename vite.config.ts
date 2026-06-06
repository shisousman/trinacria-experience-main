import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"; // 🌟 Fixed casing to match library specifications
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite(), // 🌟 Uses correct capitalized export function name
    react(),
  ],
});
