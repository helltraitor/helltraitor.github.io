// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  devtools: {
    enabled: process.env.DEVTOOLS !== '0',
  },
  css: [
    '@/assets/css/main.sass',
    '@/assets/css/common.sass',
  ],
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@unocss/nuxt',
  ],
  plugins: [
    '~/plugins/scroll.client.ts',
  ],
  runtimeConfig: {
    public: {
      urlSchema: process.env.URL_SCHEMA || 'http',
      urlBase: process.env.URL_BASE || 'localhost:3000',
    },
  },
  // Modules
  colorMode: {
    classSuffix: '',
    classPrefix: '',
    fallback: 'light',
    preference: 'system',
  },
  // Content: https://content.nuxtjs.org/api/configuration/
  content: {
  },
  typescript: {
    strict: true,
  },
  // UnoCSS: See file
  unocss: {
    configFile: 'unocss.config.ts',
  },
})
