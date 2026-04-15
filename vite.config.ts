import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function tizenCompatPlugin() {
  return {
    name: 'tizen-compat',
    closeBundle() {
      const htmlPath = resolve(__dirname, 'dist/index.html')
      const html = readFileSync(htmlPath, 'utf-8')
        .replace(/ type="module"/g, '')
        .replace(/ crossorigin/g, '')
      writeFileSync(htmlPath, html)
      console.log('✅ tizen-compat: type="module" removido')
    },
  }
}

export default defineConfig({
  plugins: [react(), viteSingleFile(), tizenCompatPlugin()],
  base: './',
  build: {
    target: ['es2015', 'chrome56'],
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    minify: 'terser',
  },
})
