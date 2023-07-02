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
        const { left, top } = anchorElement.getBoundingClientRect()
        const { behavior, offsetTop, offsetLeft } = useNuxtApp().$anchorScroll ?? {}

        document.body.scrollTo({
          behavior: toValue(behavior),
          left: left + document.body.scrollLeft + toValue(offsetLeft ?? 0),
          top: top + document.body.scrollTop + toValue(offsetTop ?? 0),
        })

        // Return only if anchor is worked
        return
      }
    }

    if (toValue(currentRoute.meta.scrollToTop)) {
      const { behavior, offsetTop, offsetLeft } = useNuxtApp().$topScroll ?? {}

      document.body.scrollTo({
        behavior: toValue(behavior),
        left: toValue(offsetLeft ?? 0),
        top: toValue(offsetTop ?? 0),
      })
    }
  })
})
