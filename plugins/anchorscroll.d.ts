interface AnchorScrollInjection {
  $anchorScroll?: {
    behavior?: MaybeRefOrGetter<ScrollBehavior>
    hash?: MaybeRefOrGetter<string>
    offsetTop?: MaybeRefOrGetter<number>
    offsetLeft?: MaybeRefOrGetter<number>
  }

  $topScroll?: {
    behavior?: MaybeRefOrGetter<ScrollBehavior>
    offsetTop?: MaybeRefOrGetter<number>
    offsetLeft?: MaybeRefOrGetter<number>
  }
}

interface AnchorScrollPageMetaInjection {
  /**
   * Scrolls to anchor if hash provided and element exist on page. Otherwise does nothing
   */
  scrollToAnchor?: boolean

  /**
   * Scrolls to top when [`scrollToAnchor`](AnchorScrollPageMetaInjection.scrollToAnchor) is not provided.
   * When it is and scroll to anchor failed (when element is not exist or hash is incorrect), then scrolls to top.
   */
  scrollToTop?: boolean
}

declare module '#app' {
  interface NuxtApp extends AnchorScrollInjection {}

  interface PageMeta extends AnchorScrollPageMetaInjection {
    // Note: This re-overriding requires for JSDoc support

    /**
     *
     * Scrolls to top when [`scrollToAnchor`](AnchorScrollPageMetaInjection.scrollToAnchor) is not provided.
     * When it is and scroll to anchor failed (when element is not exist or hash is incorrect), then scrolls to top.
     */
    scrollToTop?: boolean
  }
}

export {}
