import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import webpackStatsPlugin from 'rollup-plugin-webpack-stats'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const productionPlugins =
    mode === 'production'
      ? [
          sentryVitePlugin({
            org: 'kikos0',
            project: 'dbd-tooltips',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            telemetry: false
          })
        ]
      : []

  return {
    base: './',
    plugins: [svelte({}), webpackStatsPlugin(), [...productionPlugins]],
    envDir: './env',
    build: {
      sourcemap: mode !== 'development' ? 'hidden' : true,
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
  }
})
