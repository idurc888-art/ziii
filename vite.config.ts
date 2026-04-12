import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          '@babel/plugin-transform-optional-chaining',
          '@babel/plugin-transform-nullish-coalescing-operator'
        ]
      }
    }), 
    viteSingleFile()
  ],
  base: './',
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    proxy: {
      '/proxy': 'http://localhost:3000'
    }
  },
  build: {
    target: 'chrome69',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      ecma: 5,
      compress: { arrows: false, drop_console: false },
      format: { ecma: 5 }
    }
  }
})
