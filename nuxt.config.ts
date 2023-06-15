// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  modules: [
    '@unocss/nuxt',
  ],
  unocss: {
    configFile: 'unocss.config.ts',
  },
})
