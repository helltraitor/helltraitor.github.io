const urlSchema = process.env.URL_SCHEMA || 'http'
const urlDomain = process.env.URL_DOMAIN || 'localhost:3000'
const urlBase = `${urlSchema}://${urlDomain}`

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
    'nuxt-feedme',
  ],
  runtimeConfig: {
    public: {
      urlSchema,
      urlDomain,
      urlBase,
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
  feedme: {
    feeds: {
      '/feed.atom': { content: true },
      '/feed.json': { content: true },
      '/feed.xml': { content: true },
    },
    content: {
      feed: {
        defaults: {
          title: 'Helltraitor',
          description: 'Personal blog site',
          copyright: 'CC BY-NC-SA 4.0 2023 by Helltraitor',
          link: urlBase,
          id: urlBase,
          author: { email: 'helltraitor@hotmail.com', name: 'Helltraitor' },
        },
      },
      item: {
        defaults: {
          author: [
            { email: 'helltraitor@hotmail.com', name: 'Helltraitor' },
          ],
        },
        mapping: [
          ['date', 'modified', value => value ? new Date(value) : value],
          ['date', 'created', value => value ? new Date(value) : value],
          ['date', '', () => new Date()],
          ['link', '_path'],
        ],
        query: {
          limit: 100,
          where: [
            { _path: /^\/posts\/[^\/]+$/ },
          ],
        },
      },
      tags: [
        [/^(?=\/)/, urlBase],
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
