import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Ensure public directory is set correctly
  build: {
    outDir: '../dist/ui', // To generate output in the root/dist/ui directory
    emptyOutDir: true,
    rollupOptions: {
      input: {
        pico: resolve(__dirname, 'index-pico.html'),
        vscode: resolve(__dirname, 'index-vscode.html'),
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
