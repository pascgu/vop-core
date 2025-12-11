import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Ensure public directory is set correctly
  build: {
    outDir: '../dist/ui', // To generate output in the root/dist/ui directory
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html') // Specify the build entry (in src)
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
