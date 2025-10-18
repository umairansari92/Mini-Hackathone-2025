// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Optimized configuration for Tailwind + Firebase + Gemini + Vercel
export default defineConfig({
  plugins: [react()],
  css: {
    // Disable lightningcss to avoid build error on Vercel (Linux env)
    lightningcss: false,
  },
  build: {
    // Improve performance and avoid large chunk warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth", "firebase/firestore"],
  },
  server: {
    port: 5173,
    open: true,
  },
});
