import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const themeInit = readFileSync(
  fileURLToPath(new URL('./app/assets/theme-init.js', import.meta.url)),
  'utf-8',
)


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],


  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      script: [{ innerHTML: themeInit, tagPosition: 'head' }],
    },
  },
})
