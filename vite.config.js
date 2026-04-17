import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isElectron = process.env.ELECTRON === 'true';

export default defineConfig({
  plugins: [react()],
  base: isElectron ? './' : '/fish-tycoon-2/',
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
