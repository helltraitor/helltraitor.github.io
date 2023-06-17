// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@unocss/nuxt',
  ],
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
