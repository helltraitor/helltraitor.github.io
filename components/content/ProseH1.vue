<script setup lang="ts">
interface ProseH1Properties {
  id: string
}

const { id } = defineProps<{ id: string }>()

const runtimeConfig = useRuntimeConfig()

const ANCHOR_LINK_LEVEL = 1

const { depth: anchorDepth, exclude: anchorExcluded } = runtimeConfig.public.content.anchorLinks
const anchorLinkEnabled = ANCHOR_LINK_LEVEL <= anchorDepth && !anchorExcluded.includes(ANCHOR_LINK_LEVEL)

const { scrollToAnchor } = useAnchorScroll()

const fixedId = `real-${id}`
</script>

<template>
  <div
    class="box"
    mt-12
    flex flex-row gap-4 align-baseline
  >
    <h1
      :id="fixedId"
      text-4xl font-extrabold font-inter
    >
      <slot />
    </h1>
    <NuxtLink
      v-if="anchorLinkEnabled"
      :href="`#${id}`"
      mb-a mt-a
      text-2xl
      @click="scrollToAnchor(fixedId)"
    >
      #
    </NuxtLink>
  </div>
</template>

<style scoped lang="sass">
h1:deep(code)
  @apply text-3xl font-extrabold

.box
  &:hover
    a
      opacity: 0.4

a
  opacity: 0.2
  transition: 300ms opacity ease-in-out

a:hover
  opacity: 0.6 !important
</style>
