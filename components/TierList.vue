<script setup lang="ts" generic="T">
import '@/assets/css/slide-enter.sass'

interface TierListProperties<T> {
  defaultOption: number
  availableOptions: string[]
  availableGroups: T[][]
}

const { defaultOption, availableOptions, availableGroups } = defineProps<TierListProperties<T>>()

const currentOption = ref(defaultOption)
const slideEnterElements: Ref<HTMLElement[]> = ref([])

watch(currentOption, () => {
  if (!slideEnterElements.value)
    return

  for (const animation of slideEnterElements.value.flatMap(element => element.getAnimations())) {
    animation.cancel()
    animation.play()
  }
})
</script>

<template>
  <div flex flex-row>
    <slot name="title" />
    <div ml-a />
    <Switcher
      :default-option="defaultOption"
      :available-options="availableOptions"
      @updated="chosen => currentOption = chosen"
    />
  </div>
  <div grid grid-flow-row grid-cols-1 mt-6 gap-4 p-0 md:grid-cols-2>
    <div
      v-for="(data, index) of availableGroups[currentOption]" :key="index"
    >
      <div
        ref="slideEnterElements"
        class="slide-enter"
        :style="{ '--enter-stage': index, '--enter-step': '60ms' }"
      >
        <slot name="item" v-bind="data">
          <Error message="The item slot wasn't filled by parent component" />
        </slot>
      </div>
    </div>
  </div>
</template>
