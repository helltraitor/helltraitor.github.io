interface AnchorScrollOptions {
  behavior?: MaybeRefOrGetter<ScrollBehavior>
  offsetLeft?: MaybeRefOrGetter<number>
  offsetTop?: MaybeRefOrGetter<number>
}

interface ScrollToAnchorOptions {
  /**
   * Id of the element on page. First # is stripped
   */
  id?: MaybeRefOrGetter<string>
  /**
   * Selector of element on page
   */
  sr?: MaybeRefOrGetter<string>
}

interface AnchorScrollComposables {
  /**
   * The function for scroll to anchor. The anchor can be reactive element or its id.
   * The function can be used within the [`scrollToTop`](AnchorScrollComposables.scrollToTop)
   * ```html
   * <div @click="scrollToAnchor(id) || scrollToTop()">
   *   <!-- Scroll to anchor or to top when its not found -->
   * </div>
   * ```
   *
   * @param id Reactive element or id value. First # is stripped. Can be reactive [`ScrollToAnchorOptions`](ScrollToAnchorOptions)
   * @returns [`true`](true) when scroll to anchor succeed, otherwise [`false`](false)
   */
  scrollToAnchor: (id: MaybeRefOrGetter<ScrollToAnchorOptions | HTMLElement | string>) => boolean

  /**
   * The function for scroll to top. Can be used as shortcut
   */
  scrollToTop: () => void
}

/**
 * Produce composables with provided settings (can be reactive).
 */
export const useAnchorScroll = ({ behavior, offsetLeft, offsetTop }: AnchorScrollOptions = {}): AnchorScrollComposables => {
  return {
    scrollToAnchor(target) {
      const maybeElement = toValue(target)

      let anchorElement: HTMLElement | null = null

      if (typeof maybeElement === 'string') {
        anchorElement = document.getElementById(maybeElement.replace(/^#/, ''))
      }
      else if (maybeElement instanceof HTMLElement) {
        anchorElement = maybeElement
      }
      else {
        const elementId = toValue(maybeElement.id)
        const elementSelector = toValue(maybeElement.sr)

        if (elementId) {
          anchorElement = document.getElementById(elementId.replace(/^#/, ''))
        }
        else if (elementSelector) {
          try {
            anchorElement = document.querySelector(elementSelector)
          }
          catch (error) {
            console.error('[useAnchorScroll]: While select element from document, next error occurred:', error)
          }
        }
        else {
          console.error(
            '[useAnchorScroll]: Wrong object provided to scrollToAnchor composable:',
            'either \'id\' and \'sr\' (selector) are not provided in object',
            maybeElement,
          )
        }
      }

      if (!anchorElement)
        return false

      const { top: elementTop, left: elementLeft } = anchorElement.getBoundingClientRect()

      document.body.scrollTo({
        behavior: toValue(behavior),
        left: elementLeft + document.body.scrollLeft + toValue(offsetLeft ?? 0),
        top: elementTop + document.body.scrollTop + toValue(offsetTop ?? 0),
      })

      return true
    },

    scrollToTop() {
      document.body.scrollTo({
        behavior: toValue(behavior),
        left: toValue(offsetLeft ?? 0),
        top: toValue(offsetTop ?? 0),
      })
    },
  }
}
