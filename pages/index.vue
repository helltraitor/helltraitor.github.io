<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

useSeoMetaHelper({
  title: 'Helltraitor',
  description: 'Helltraitor personal website',
})

const currentPath = useRoute().path
const indexContent = await useAsyncData(`content-[${currentPath}]`, () => queryContent(currentPath).findOne())

const currentError = indexContent.error.value
if (currentError)
  throw currentError

const currentParsedContent = indexContent.data.value
if (!currentParsedContent) {
  throw createError({
    statusCode: 404,
    message: `Post not found at location '${currentPath}'`,
  })
}

// Overrides default template
useHead({
  titleTemplate: '%s',
})
</script>

<template>
  <div
    class="slide-enter"
    m-a text-base line-height-relaxed lt-md:w-90vw md:w-60ch
  >
    <ContentRendererMarkdown :value="currentParsedContent" tag="div" />
  </div>
</template>
