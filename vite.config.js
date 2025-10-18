import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
})
