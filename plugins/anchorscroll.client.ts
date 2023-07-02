export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const currentRoute = useRoute()

    if (toValue(currentRoute.meta.scrollToAnchor)) {
      let anchorElement: HTMLElement | null = null

      try {
        anchorElement = document.querySelector(toValue(useNuxtApp().$anchorScroll?.hash ?? currentRoute.hash))
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
