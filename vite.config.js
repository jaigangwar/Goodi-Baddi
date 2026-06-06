import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons.svg', 'pwa-icon.svg'],
        manifest: {
          name: 'Goodi Baddi',
          short_name: 'Goodi Baddi',
          description: 'Trusted HR hiring ecosystem for companies',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/pwa-icon.svg',
              sizes: 'any',
              type: 'image/svg+xml'
            },
            {
              src: '/favicon.svg',
              sizes: '48x48',
              type: 'image/svg+xml'
            }
          ]
        },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  }
})
