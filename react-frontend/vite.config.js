import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All /api calls → render backend (server-side, no CORS)
      '/api': {
        target: 'https://glc-1.onrender.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
      // Uploaded images
      '/uploads': {
        target: 'https://glc-1.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
