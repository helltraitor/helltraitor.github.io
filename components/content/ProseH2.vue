<script setup lang="ts">
interface ProseH2Properties {
  id: string
}

defineProps<ProseH2Properties>()

const runtimeConfig = useRuntimeConfig()

const ANCHOR_LINK_LEVEL = 2

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
    <h2
      :id="id"
      text-3xl font-extrabold font-inter
    >
      <slot />
    </h2>
    <NuxtLink
      v-if="anchorLinkEnabled"
      :href="`#${id}`"
      mb-a mt-a
      text-xl
      @click="scrollToAnchor(id)"
    >
      #
    </NuxtLink>
  </div>
</template>

<style scoped lang="sass">
h2:deep(code)
  @apply text-2xl font-extrabold

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
