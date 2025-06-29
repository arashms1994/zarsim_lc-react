import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: '/lc_vite/',
  build: {
    outDir: "dist",
    assetsDir: ".",
    rollupOptions: {
      output: {
        entryFileNames: `index.js`,
        chunkFileNames: `chunk.js`,
        assetFileNames: `index.css`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
});
