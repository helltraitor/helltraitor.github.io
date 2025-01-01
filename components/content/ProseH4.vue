<script setup lang="ts">
interface ProseH4Properties {
  id: string
}

const { id } = defineProps<{ id: string }>()

const runtimeConfig = useRuntimeConfig()

const ANCHOR_LINK_LEVEL = 4

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
    <h4
      :id="fixedId"
      text-xl font-bold font-inter
    >
      <slot />
    </h4>
    <NuxtLink
      v-if="anchorLinkEnabled"
      :href="`#${id}`"
      mb-a mt-a
      @click="scrollToAnchor(fixedId)"
    >
      #
    </NuxtLink>
  </div>
</template>

<style scoped lang="sass">
h4:deep(code)
  @apply text-lg font-extrabold

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
