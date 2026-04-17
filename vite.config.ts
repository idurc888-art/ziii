import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 56'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  base: './',
  build: {
    target: ['es2015', 'chrome56'],
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: { ecma: 2015 },
      output: { ecma: 2015 },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      clientPort: 5173,
    }
  }
})
