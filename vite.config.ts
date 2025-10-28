import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- SWITCHED TO DEDICATED VITE PLUGIN

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- INCLUDED AS A TOP-LEVEL PLUGIN
  ],
})
