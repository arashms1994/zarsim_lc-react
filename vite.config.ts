// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/SitePages/lcdocuments.aspx",
  build: {
    outDir: "dist",
    assetsDir: ".",
    minify: false,
    sourcemap: true,
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
