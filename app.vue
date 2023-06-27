<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: '%s - Helltraitor',
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
