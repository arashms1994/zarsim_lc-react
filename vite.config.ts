import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // آدرس ریشه در SharePoint
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

  plugins: [react()],
});