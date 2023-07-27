---
title: Nuxt the scrollToTop issue solution
description: Solution for the issue with scrollToTop option in definePageMeta that is ignored in 3.5 - 3.6.0
language: English
created: 2023-06-24
modified: 2023-06-24
---

# The scroll to top issue

The tracking issue [#19239][#19239] and my original comment available [here][#19239_comment].

## Problem

As for Nuxt 3.5 - 3.6.0 (and maybe later), scroll to top feature is not working:

```ts
definePageMeta({
  scrollToTop: true,
})
```

This article describes temporary solution which allows to return this functionally without changing page code.

## Solution

All is you need is to add next plugin in Nuxt:

```ts
export default defineNuxtPlugin({
  name: 'scroll-client',
  hooks: {
    'page:finish': () => {
      if (!useRouter().currentRoute.value.meta.scrollToTop)
        return

      document.scrollingElement?.scrollTo({ left: 0, top: 0 })
      document.body?.scrollTo({ left: 0, top: 0 })
    },
  },
})
```

As for this website `page:transition:finish` hook is working incorrectly and cause to some animations fail
(e.g. `slide-enter` animation for a blog post is incorrect on this hook).
But it seems to be fine working solution (`page:finish` hook) with the transitions.

Anyway, you free to experiment with this in your project

<!-- LABELS -->
[#19239]: https://github.com/nuxt/nuxt/issues/19239 "Issue #19239"
[#19239_comment]: https://github.com/nuxt/nuxt/issues/19239#issuecomment-1604300731 "Issue #19239 on my comment"
