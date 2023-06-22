<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

useSeoMetaHelper({
  title: 'Helltraitor',
  description: 'Helltraitor personal website',
})

// Overrides default template
useHead({
  titleTemplate: '%s',
})
</script>

<template>
  <div
    class="slide-enter"
    m-a text-gray-700 dark:text-gray-200
  >
    <p m-block-0 text-10>
      Welcome to my personal site!
    </p>
    <p m-block-0>
      <span text-yellow>
        TODO:
      </span>
      Fill me :D
    </p>
  </div>
</template>
