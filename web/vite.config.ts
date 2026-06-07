import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// EPGStation のサーバー (config.yml の port)
const API_TARGET = process.env.EPG_SERVER ?? 'http://localhost:8890'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // tanstackRouter は react プラグインより前に置く
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/socket.io': { target: API_TARGET, changeOrigin: true, ws: true },
      '/streamfiles': { target: API_TARGET, changeOrigin: true },
      '/thumbnail': { target: API_TARGET, changeOrigin: true },
    },
  },
})
