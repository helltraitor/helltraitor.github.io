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
    // Must be included before content module
    'nuxt-content-assets',
    '@nuxt/content',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-anchorscroll',
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
  // ContentAssets: https://nuxt.com/modules/content-assets#configuration
  contentAssets: {
    imageSize: 'src',
  },
  // Content: https://content.nuxtjs.org/api/configuration/
  content: {
    highlight: {
      preload: [
        'js',
        'ts',
      ],
      theme: {
        default: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    },
    markdown: {
      remarkPlugins: [
        'remark-heading-id',
      ],
    },
  },
  typescript: {
    strict: true,
  },
  // UnoCSS: See file
  unocss: {
    configFile: 'unocss.config.ts',
  },
})
