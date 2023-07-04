export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const currentRoute = useRoute()
    const currentHash = toValue(useNuxtApp().$anchorScroll?.hash || currentRoute.hash)

    if (toValue(currentRoute.meta.scrollToAnchor) && currentHash) {
      let anchorElement: HTMLElement | null = null

      try {
        anchorElement = document.querySelector(currentHash)
      }
      catch (error) {
        console.error('[AnchorScroll]: While select element from document, next error occurred:', error)
      }

      if (anchorElement) {
        const { left: elementLeft, top: elementTop } = anchorElement.getBoundingClientRect()
        const { behavior, offsetTop, offsetLeft } = useNuxtApp().$anchorScroll ?? {}

        document.scrollingElement?.scrollBy({
          behavior: toValue(behavior),
          left: elementLeft + toValue(offsetLeft ?? 0),
          top: elementTop + toValue(offsetTop ?? 0),
        })

        document.body.scrollBy({
          behavior: toValue(behavior),
          left: elementLeft + toValue(offsetLeft ?? 0),
          top: elementTop + toValue(offsetTop ?? 0),
        })

        // Return only if anchor is worked
        return
      }
    }

    if (toValue(currentRoute.meta.scrollToTop)) {
      const { behavior, offsetTop, offsetLeft } = useNuxtApp().$topScroll ?? {}

      document.scrollingElement?.scrollTo({
        behavior: toValue(behavior),
        left: toValue(offsetLeft ?? 0),
        top: toValue(offsetTop ?? 0),
      })

      document.body.scrollTo({
        behavior: toValue(behavior),
        left: toValue(offsetLeft ?? 0),
        top: toValue(offsetTop ?? 0),
      })
    }
  })
})
