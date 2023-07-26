<script setup lang="ts">
interface ProseH1Properties {
  id: string
}

defineProps<ProseH1Properties>()

const runtimeConfig = useRuntimeConfig()

const ANCHOR_LINK_LEVEL = 6

const { depth: anchorDepth, exclude: anchorExcluded } = runtimeConfig.public.content.anchorLinks
const anchorLinkEnabled = ANCHOR_LINK_LEVEL <= anchorDepth && !anchorExcluded.includes(ANCHOR_LINK_LEVEL)

const { scrollToAnchor } = useAnchorScroll()
</script>

<template>
  <div
    class="box"
    mt-12
    flex flex-row gap-4 align-baseline
  >
    <h6
      :id="id"
      text-lg font-500 font-inter
    >
      <slot />
    </h6>
    <NuxtLink
      v-if="anchorLinkEnabled"
      :href="`#${id}`"
      mb-a mt-a
      text-sm
      @click="scrollToAnchor(id)"
    >
      #
    </NuxtLink>
  </div>
</template>

<style scoped lang="sass">
h6:deep(code)
  @apply text-sm font-bold

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
