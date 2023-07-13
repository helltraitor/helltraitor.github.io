<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

const currentPath = useRoute().path
const currentPost = await useAsyncData(`post-[${currentPath}]`, () => queryContent(currentPath).findOne())

const currentError = currentPost.error.value
if (currentError)
  throw currentError

const currentParsedContent = currentPost.data.value
if (!currentParsedContent) {
  throw createError({
    statusCode: 404,
    message: `Post not found at location '${currentPath}'`,
  })
}

const hydrateMeta = (meta: Record<string, unknown>): Record<string, string> => {
  const replaceTags = (value: unknown): string => {
    const runtimeConfig = useRuntimeConfig()
    const urlPath = `${runtimeConfig.public.urlSchema}://${runtimeConfig.public.urlBase}`

    return (
      `${value}`
        .replace('%URL_PATH%', urlPath)
    )
  }

  return Object.fromEntries(Object.entries(meta).map(([key, value]) => [key, replaceTags(value)]))
}

const postMeta = (
  Object
    .entries(currentParsedContent)
    .filter(([key, _]) => key.match(/^override$/))
    .flatMap(([_, packed]) => Array.isArray(packed) ? packed : [])
    .map(hydrateMeta)
)

useHeadSafe({
  meta: postMeta,
})

useSeoMetaHelper({
  title: currentParsedContent.title || 'No title provided',
  description: currentParsedContent.description || 'No description provided',
  // Meta could have not only name, but property too
  //   Note: undefined values being ignored by seo helper
  excluded: postMeta.flatMap(record => [record.name, record.property]),
})

const postRootElement: Ref<HTMLElement | undefined> = ref()

const startSlideEnterAnimation = () => {
  if (!postRootElement.value)
    return

  const markdownElements = postRootElement.value.children.item(0)?.children ?? []
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
    ref="postRootElement"
    m-a text-base line-height-relaxed lt-md:w-90vw md:w-65ch
  >
    <ContentRendererMarkdown :value="currentParsedContent" tag="div" />
  </div>
</template>
