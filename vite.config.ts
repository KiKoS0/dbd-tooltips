import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import { webpackStats } from 'rollup-plugin-webpack-stats'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), webpackStats()],
  envDir: './env',
  build: {
    rollupOptions: {
      input: {
        web: resolve(__dirname, 'video_overlay.html'),
        mobile: resolve(__dirname, 'mobile.html'),
        config: resolve(__dirname, 'config.html')
      },
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
})
