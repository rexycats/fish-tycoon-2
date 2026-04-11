import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isElectron = process.env.ELECTRON === 'true';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages needs the repo name as base; Electron needs relative paths
  base: isElectron ? './' : '/fish-tycoon-2/',
})
