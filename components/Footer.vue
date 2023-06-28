<script setup lang="ts">
import '@/assets/css/slide-enter.sass'
import '@/assets/css/underlined.sass'

const MIT_LICENSE_HREF = 'https://github.com/Helltraitor/helltraitor.github.io/blob/main/LICENSE'
const CC_BY_SA_40_HREF = 'https://github.com/Helltraitor/helltraitor.github.io/blob/main/CC-BY-SA-4.0'

const router = useRouter()
const footerElement: Ref<HTMLElement | undefined> = ref()

const restartFooterAnimation = () => {
  if (!footerElement.value)
    return

  for (const animation of footerElement.value.getAnimations()) {
    animation.cancel()
    animation.play()
  }
}

watch(router.currentRoute, ({ path: oldPath }, { path: newPath }) => {
  if (oldPath !== newPath)
    restartFooterAnimation()
})
</script>

<template>
  <footer
    ref="footerElement"
    class="slide-enter"
    style="--enter-initial: 200ms"
    mb-0 ml-a mr-a flex
    flex-col p-4 text-sm opacity-50
  >
    <span>
      The source code of this site is under
      <NuxtLink
        :href="MIT_LICENSE_HREF"
        class="underlined"
        target="_blank"
      >
        MIT License
      </NuxtLink>
      , while its content is under
      <NuxtLink
        :href="CC_BY_SA_40_HREF"
        class="underlined"
        target="_blank"
      >
        CC BY-SA 4.0
      </NuxtLink>
      license.
    </span>
    <span>
      This site is powered by
      <NuxtLink
        href="https://nuxt.com"
        class="underlined"
        target="_blank"
      >
        Nuxt
      </NuxtLink>
      ,
      <NuxtLink
        class="underlined"
        href="https://vuejs.org"
        target="_blank"
      >
        Vue
      </NuxtLink>
      and other technologies.
    </span>
  </footer>
</template>
