import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      // On intercepte tous les appels commençant par /api-ps
      '/api-glpi': {
        target: 'http://localhost:8081/api.php/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-glpi/, ''),
      },
    }
  }
})
