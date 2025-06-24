import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '宝宝日记',
        short_name: '宝宝日记',
        description: '只属于我们俩的专属情侣日记本',
        theme_color: '#6fffd1',
        background_color: '#222',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: '/icon2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
