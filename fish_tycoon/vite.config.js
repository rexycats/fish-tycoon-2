import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fish-tycoon-2/', // Change this to your GitHub repo name
})
