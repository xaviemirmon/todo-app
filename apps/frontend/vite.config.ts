import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from "dotenv";
import path from "path";

// Load environment variables from one level up
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
