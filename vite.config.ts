import { defineConfig } from "vite";
import { tanstackViteStart } from "@tanstack/start/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackViteStart({
      deployment: {
        target: "vercel-serverless" // 🌟 Forces TanStack to output Vercel native functions instead of workerd binaries
      }
    }),
  ],
});
