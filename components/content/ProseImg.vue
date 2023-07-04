<script setup lang="ts">
import { type PlainMeta, clean, parse } from '~/code/plainmeta'

interface ProseImgProperties {
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}

const { alt, src, title } = defineProps<ProseImgProperties>()

class DynamicComponent {
  constructor(
    public comp: any,
    public prop: object = {},
    public even: object = {},
  ) {}

  public static from(meta: PlainMeta): DynamicComponent {
    meta.alt ??= alt
    meta.src ??= src
    meta.title ??= clean(title ?? '')

    if (meta.unsafe === true && typeof meta.type === 'string') {
      const { unsafe: _, type: __, ...strippedMeta } = meta
      return new DynamicComponent(meta.type, strippedMeta)
    }

    if (meta.video === true) {
      const { video: _, ...strippedMeta } = meta
      return new DynamicComponent('video', strippedMeta)
    }

    if (meta.audio === true) {
      const { audio: _, ...strippedMeta } = meta
      return new DynamicComponent('audio', strippedMeta)
    }

    const { image: _, ...strippedMeta } = meta
    return new DynamicComponent('img', strippedMeta)
  }
}

const dynamic = computed(() => DynamicComponent.from(parse(title ?? '') ?? {}))
</script>

<template>
  <div
    mb-2
    mt-2
    w-full
    flex
  >
    <component
      :is="dynamic.comp"

      m-a
      max-w-full
      border-rounded-2

      v-bind="dynamic.prop"
      v-on="dynamic.even"
    />
  </div>
</template>
