import { defineConfig } from "vite";
import { tanstackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackRouterVite(), // 🌟 Handles the TanStack application routing generation natively
    react(),              // 🌟 Evaluates and compiles code structures
  ],
});
