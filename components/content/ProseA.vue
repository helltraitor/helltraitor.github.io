<script setup lang="ts">
import '@/assets/css/underlined.sass'

interface ProseAProperties {
  href?: string
  rel?: string
  target?: string
  title?: string
}

const props = defineProps<ProseAProperties>()

const LOCAL_PATTERN = /^[/#].*/
const relativeTarget = props.href?.match(LOCAL_PATTERN) ? '_self' : '_blank'
</script>

<template>
  <NuxtLink
    class="underlined"
    :rel="props.rel ?? ''"
    :target="props.target ?? relativeTarget"
    :title="props.title"
    :to="props.href"
  >
    <slot />
  </NuxtLink>
</template>

<style scoped lang="sass">
a:deep(code)
  @apply pb-0
</style>
