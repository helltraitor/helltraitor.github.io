<script setup lang="ts">
interface SwitcherProperties {
  defaultOption: number
  availableOptions: string[]
}

const { defaultOption, availableOptions } = defineProps<SwitcherProperties>()
const emit = defineEmits<{ (event: 'updated', chosen: number): void }>()

const currentOption = ref(defaultOption)
watch(currentOption, chosen => emit('updated', chosen))
</script>

<template>
  <div flex flex-row>
    <div
      v-for="(name, index) of availableOptions" :key="index"
      class="switcher"
      border="~ solid rounded-0"
      flex flex-grow cursor-pointer p-1
      :class="{ chosen: index === currentOption }"
      @click="currentOption = index"
    >
      {{ name }}
    </div>
  </div>
</template>

<style scoped lang="sass">
.switcher
  opacity: 0.6
  transition: 200ms opacify ease-out

.switcher:hover
  opacity: 0.8

.switcher.chosen
  opacity: 1.0

.switcher.chosen:hover
  opacity: 1.0

div
  .switcher:first-child
    @apply rounded-s

  .switcher:last-child
    @apply rounded-e
</style>
