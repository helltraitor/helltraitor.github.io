// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],
  // Modules
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
