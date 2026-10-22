import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Note: We use plain CSS for styling (no Tailwind needed)
export default defineConfig({
  plugins: [
    react(),
  ],
})