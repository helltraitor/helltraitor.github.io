<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

const router = useRouter()
const currentPathValue = router.currentRoute.value.path

const { data } = await useAsyncData(`post-[${currentPathValue}]`, () => queryContent(currentPathValue).findOne())

if (data.value === null) {
  throw createError({
    statusCode: 404,
    message: `Post not found at location '${currentPathValue}'`,
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
    .entries(data.value)
    .filter(([key, _]) => key.match(/^override$/))
    .flatMap(([_, packed]) => Array.isArray(packed) ? packed : [])
    .map(hydrateMeta)
)

useHeadSafe({
  meta: postMeta,
})

useSeoMetaHelper({
  title: data.value.title || 'No title provided',
  description: data.value.description || 'No description provided',
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
    <ContentRendererMarkdown :value="data ?? {}" tag="div" />
  </div>
</template>
