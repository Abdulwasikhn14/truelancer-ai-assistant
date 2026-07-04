import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5200,
    strictPort: true, // fail instead of silently picking another port (e.g. 5174)
  },
})
