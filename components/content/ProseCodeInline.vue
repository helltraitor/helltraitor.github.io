<script setup lang="ts">
import '@/assets/css/linked.sass'

import { useClipboard } from '@vueuse/core'

const { copy } = useClipboard()
</script>

<template>
  <code
    cursor-pointer border-rounded p-1 text-sm
    @click="copy(($event.currentTarget as HTMLElement)?.innerText)"
  >
    <slot />
  </code>
</template>

<style scoped lang="sass">
code
  @apply font-code

  background-color: var(--c-bg-code-inline)
  opacity: 0.8
  transition: 200ms opacity ease-in-out

code:hover
  opacity: 1.0
</style>
