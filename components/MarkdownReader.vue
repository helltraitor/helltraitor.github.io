<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

const currentPath = useRoute().path
const currentItem = await useAsyncData(`item-[${currentPath}]`, () => queryContent(currentPath).findOne())

const currentError = currentItem.error.value
if (currentError)
  throw currentError

const currentParsedContent = currentItem.data.value
if (!currentParsedContent) {
  throw createError({
    statusCode: 404,
    message: `Item not found at location '${currentPath}'`,
    fatal: true,
  })
}

if ((currentParsedContent.body?.children?.length ?? 0) === 0) {
  throw createError({
    statusCode: 500,
    message: 'Item exist, but not contains the body, probably its a draft',
    fatal: true,
  })
}

const hydrateMeta = (meta: Record<string, unknown>): Record<string, string> => {
  const replaceTags = (value: unknown): string => {
    const runtimeConfig = useRuntimeConfig()

    return (
      `${value}`
        .replace('%URL_BASE%', `${runtimeConfig.public.urlBase}`)
    )
  }

  return Object.fromEntries(Object.entries(meta).map(([key, value]) => [key, replaceTags(value)]))
}

const itemMeta = (
  Object
    .entries(currentParsedContent)
    .filter(([key, _]) => key.match(/^override$/))
    .flatMap(([_, packed]) => Array.isArray(packed) ? packed : [])
    .map(hydrateMeta)
)

useHeadSafe({
  meta: itemMeta,
})

useSeoMetaHelper({
  title: currentParsedContent.title || 'No title provided',
  description: currentParsedContent.description || 'No description provided',
  // Meta could have not only name, but property too
  //   Note: undefined values being ignored by seo helper
  excluded: itemMeta.flatMap(record => [record.name, record.property]),
})

const itemRootElement: Ref<HTMLElement | undefined> = ref()

const startSlideEnterAnimation = () => {
  if (!itemRootElement.value)
    return

  const markdownElements = itemRootElement.value.children.item(0)?.children ?? []
  for (let index = 0; index < markdownElements.length; index += 1) {
    const markdownElement = markdownElements[index] as HTMLElement

    markdownElement.style.setProperty('--enter-step', '60ms')
    markdownElement.style.setProperty('--enter-stage', `${index + 1}`)
    markdownElement.classList.add('slide-enter')
  }
}

onMounted(startSlideEnterAnimation)
</script>

<template>
  <div
    ref="itemRootElement"
    m-a text-base line-height-relaxed lt-md:w-90vw md:w-65ch
  >
    <ContentRendererMarkdown :value="currentParsedContent ?? {}" tag="div" />
  </div>
</template>
