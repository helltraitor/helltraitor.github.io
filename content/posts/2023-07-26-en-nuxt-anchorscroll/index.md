---
title: The nuxt-anchorscroll package
description: The usage examples and explanations about my nuxt-anchorscroll package
language: English
created: 2023-07-30
modified: 2023-07-30
---

# The `nuxt-anchorscroll` package

To begin with, the original problem and its solution have been [described already][en-nuxt-scroll-to-top-solution].
So here we will talk about what this solution became later - module if be more accurate.

As you may already note, my blog site have `#` symbol at the end of headings (1-4 for now).
Which scrolls to anchor element and allows to skip unnecessary parts at page loading.

But this functionality is little bit tricky...

## The two layouts types

First of all, there is only two ways to layout entire page:

1. The inheriting of `html` element and extending it when needed.
2. The fixing of `html` element, cropping it and extending it child when needed.

In the first case we can also put some minimal size for having bottom footer and centered items,
when its total size is much less then available on client page which depends on window size.

### The standard layout

In first order, the standard layout is the historical way to layout the html pages.
The only thing, that is required for its implementation, is to pass size directly to the target element.

```scss
html {
  // Minimal sizes sets on html page to center item when their size is small
  min-height: 100%;
  min-width: 100%;

  body {
    // Allowing body to have 100% of parent sizes
    height: 100%;
    width: 100%;

    margin: 0;

    div#__nuxt {
      // Allowing target to have 100% of parent sizes
      height: 100%;
      width: 100%;

      display: flex;
    }
  }
}
```

If you already using that kind of layout (and mostly are) with anchor elements,
then you may note the instant animation on click like showed under.

![Standard layout (broken)][standard_broken]

But there is the some problems:

1. The `html` tag requires `scroll-behavior: smooth` in case when you want to have fine looking scroll to anchor.
2. The possible offset (like in this blog) is not respected.

The first one solution will affect entire page which can be undesirable.
But the second one can be solved tricky via hidden shifted elements.

Sounds overcomplicated, isn't?

So, the solution provided by module is to scroll over surfaces (html and body by default).
This allows to not make any changes in current layouts and behavior except modification for anchor link.

The thing is, browser handles scroll to anchor when we use standard layout.
And we need to trick it with the false anchor name:
the fake but user friendly hash in url and its mangled version for the real anchor element.

The `nuxt-anchorscroll` provides ability to setup application in `app.vue`:

```ts []{} { filename=app.vue }
import { toValue, useNuxtApp } from '#imports'

const nuxtApp = useNuxtApp()

// Set custom anchor for Y axis with dynamic header support
nuxtApp.$anchorScroll!.defaults.toAnchor = () => ({
  behavior: 'smooth',
  offsetTop: -(toValue(useNuxtApp().$headerHeight) ?? 0) * 1.2,
})

// Add route specialization for fixed solution
// See docs for explanation
nuxtApp.$anchorScroll!.matched.push(({ path, hash }) => {
  // The undefined value means: try another match
  if (!hash)
    return undefined

  // All anchor elements on website must be mangled
  // It's possible to sync prefixes \ postfixes on different routes if needed
  const targetSelector = `#real-${hash.slice(1)}`
  const targetElement = document.querySelector(targetSelector)

  // When no anchor found - try another match
  if (!targetElement)
    return undefined

  return {
    toAnchor: {
      target: targetElement as HTMLElement,
      // Using default anchor setting which can be dynamic by design
      scrollOptions: toValue(
        useNuxtApp().$anchorScroll?.defaults?.toAnchor ?? {}
      ),
    },
  }
})
```

And then an anchor element just used mangled id:

```vue []{} { filename=component.vue }
<script setup lang="ts">
import { useAnchorScroll } from '#imports'

const { id } = defineProps<{ id: string }>()

// scrollToAnchor uses default anchor settings and can be used
//   for smooth scrolling
const { scrollToAnchor } = useAnchorScroll()

const fixedId = `real-${id}`
</script>

<template>
  <div>
    <div :id="fixedId">
      <slot />
    </div>
    <NuxtLink
      :href="`#${id}`"
      @click="scrollToAnchor(fixedId)"
    >
      #
    </NuxtLink>
  </div>
</template>
```

And as a result we can see the next:

![Standard layout (fixed)][standard_fixed]

### The preferred layout

In contrast to the first layout kind, this one relays on cropped parent tag,
which usually is `html`.

```scss
html {
  // Fix html sizes and crop all
  height: 100vh;
  width: 100vw;

  overflow: hidden;

  // Body is used as surface
  body {
    // Inherit parent sizes and disable crop for desired axis
    height: 100%;
    width: 100%;

    margin: 0;

    overflow-y: scroll;
    overflow-x: hidden;

    div#__nuxt {
      // Target element must have 100% as minimum size for keeping
      //   the elements on the page center when needed
      min-width: 100%;
      min-height: 100%;

      display: flex;
    }
  }
}
```

And the only thing that we need to setup is the header size if needed:

```ts []{} { filename=app.vue }
import { toValue, useNuxtApp } from '#imports'

const nuxtApp = useNuxtApp()

useNuxtApp().$anchorScroll!.defaults.toAnchor = () => ({
  behavior: 'smooth',
  // headerHeight + 20%
  offsetTop: -toValue(useNuxtApp().$headerHeight ?? 0) * 1.2,
})
```

And that's all you need! Easy as pie!

## Playground

In case if you want to explore the live example, you can try [playground][playground]
or checkout my blog [source code][blog_source].

## Quick setup

1. Add `nuxt-anchorscroll` dependency to your project

    You can use your favorite package manager (I prefer yarn)

    ```bash
    yarn add -D nuxt-anchorscroll

    pnpm add -D nuxt-anchorscroll

    npm install --save-dev nuxt-anchorscroll
    ```

2. Add `nuxt-anchorscroll` to the `modules` section of `nuxt.config.ts`

    ```ts
    export default defineNuxtConfig({
      modules: [
        'nuxt-anchorscroll',
      ]
    })
    ```

3. Additionally, if you are using transitions, probably you also want to scroll on different hook

    ```ts
    export default defineNuxtConfig({
      modules: [
        'nuxt-anchorscroll',
      ],

      anchorscroll: {
        hooks: [
          // Or any valid hook if needed
          // Default is `page:finish`
          'page:transition:finish',
        ],
      },
    })
    ```

<!-- LABELS -->
[en-nuxt-scroll-to-top-solution]: /posts/2023-06-24-en-nuxt-scroll-top-solution "Nuxt the scrollToTop issue solution"
[standard_broken]: media/broken.gif "Standard layout (broken)"
[standard_fixed]: media/fixed.gif "Standard layout (fixed)"
[playground]: <https://stackblitz.com/github/helltraitor/nuxt-anchorscroll> "The nuxt-anchorscroll playground"
[blog_source]: <https://github.com/helltraitor/helltraitor.github.io> "The source code of helltraitor.github.io"
