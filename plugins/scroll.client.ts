export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    if (!useRouter().currentRoute.value.meta.scrollToTop)
      return

    document.scrollingElement?.scrollTo({ left: 0, top: 0 })
    document.body?.scrollTo({ left: 0, top: 0 })
  })
})
