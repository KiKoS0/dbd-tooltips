import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  envDir: './env',
  build: {
    rollupOptions: {
      input: {
        web: resolve(__dirname, 'video_overlay.html'),
        mobile: resolve(__dirname, 'mobile.html'),
        config: resolve(__dirname, 'config.html')
      }
    }
  }
})
