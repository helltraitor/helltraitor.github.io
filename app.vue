<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: '%s - Helltraitor',
})

useNuxtApp().$anchorScroll!.defaults.toAnchor = () => ({
  behavior: 'smooth',
  // headerHeight + 20%
  offsetTop: -toValue(useNuxtApp().$headerHeight ?? 0) * 1.2,
})
</script>

<template>
  <div class="nuxt-layout" flex flex-grow>
    <NuxtLayout>
      <div class="nuxt-page" flex flex-grow>
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
