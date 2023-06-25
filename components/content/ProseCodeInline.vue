<script setup lang="ts">
import '@/assets/css/linked.sass'

const codeInlineElement: Ref<HTMLElement | undefined> = ref()

const copyCode = () => {
  if (codeInlineElement.value)
    navigator?.clipboard?.writeText(codeInlineElement.value.innerText)
}
</script>

<template>
  <code
    ref="codeInlineElement"
    class="code-inline"
    cursor-pointer border-rounded p-1 text-sm
    @click="copyCode"
  >
    <slot />
  </code>
</template>

<style scoped lang="sass">
.code-inline
  background-color: var(--c-bg-code-inline)
  opacity: 0.8
  transition: 200ms opacity ease-in-out

.code-inline:hover
  opacity: 1.0
</style>
