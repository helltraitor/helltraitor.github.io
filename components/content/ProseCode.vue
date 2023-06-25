<script setup lang="ts">
interface ProseCodeProperties {
  class: string
  code: string
  filename?: string
  highlights?: number[]
  language: string
  meta: string
}

const props = defineProps<ProseCodeProperties>()

const copyAllowed = navigator.clipboard !== undefined

const codeCopied = ref(false)
watch(codeCopied, () => {
  navigator?.clipboard?.writeText(props.code)
  setTimeout(() => codeCopied.value = false, 2000)
})

/// Match any non space symbols divided by `=` expect `\=` case
/// In key value pairs
const parsedMeta = props.meta.matchAll(/(?<key>\S+)(?<!\\)=(?<value>\S+)/gu)

const parsedMetaFilename = [...parsedMeta].find(regex => regex?.groups?.key === 'filename')
// parsedMeta has higher priority then standard filename
const filename = parsedMetaFilename?.groups?.value ?? props.filename
const copyFilename = () => {
  navigator?.clipboard?.writeText(filename ?? '')
}
</script>

<template>
  <div
    class="box"
    relative mb-4 mt-4 border-rounded-2
  >
    <div
      :class="props.class"
      overflow-x-auto text-sm
    >
      <slot />
    </div>
    <span
      v-show="filename"
      class="filename"
      absolute right-2 top-2 cursor-pointer
      @click="copyFilename"
    >
      <code text-sm>
        {{ filename }}
      </code>
    </span>
    <div
      class="copy"
      absolute bottom-2 right-2 cursor-pointer
      @click="codeCopied = true"
    >
      <div v-if="codeCopied && copyAllowed" i-carbon-checkmark />
      <div v-else-if="codeCopied && !copyAllowed" i-carbon-close />
      <div v-else i-carbon-copy />
    </div>
  </div>
</template>

<style scoped lang="sass">
.box
  background-color: var(--c-bg-code)
  line-height: 1rem

  &:hover
    .filename
      opacity: 0.8

    .copy
      opacity: 0.6

:slotted(pre)
  display: flex

  code
    display: flex
    flex-direction: column
    flex-grow: 1
    padding: 1rem

    .line.highlight:first-child,
    // Note: select NEXT highlight after not
    .line:not(.highlight) + .line.highlight
      border-top-left-radius: 0.25rem
      border-top-right-radius: 0.25rem

    .line.highlight:last-child,
    // Note: select CURRENT highlight where next is not
    .line.highlight:has(+ .line:not(.highlight))
      border-bottom-left-radius: 0.25rem
      border-bottom-right-radius: 0.25rem

    .line
      padding-inline: 0.10rem

    .line.highlight
      background-color: var(--c-bg-code-highlight)

.filename
  opacity: 0.6
  transition: 200ms opacity ease-in-out

.filename:hover
  opacity: 1.0 !important

.copy
  opacity: 0
  transition: 300ms opacity ease-in-out

  &:hover
    opacity: 1.0 !important
</style>
