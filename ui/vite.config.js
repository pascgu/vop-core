import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist/web-assets', // Pour garder votre structure de sortie actuelle
    emptyOutDir: true
  }
})
