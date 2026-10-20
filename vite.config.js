import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // En développement, l'API de l'administration (Payload) tourne sur le port 3012.
  server: { proxy: { '/api': 'http://127.0.0.1:3012' } },
})
