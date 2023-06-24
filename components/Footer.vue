<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

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

watch(router.currentRoute, restartFooterAnimation)
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
      <NuxtLink :href="MIT_LICENSE_HREF" target="_blank">
        MIT License
      </NuxtLink>
      , while its content is under
      <NuxtLink :href="CC_BY_SA_40_HREF" target="_blank">
        CC BY-SA 4.0
      </NuxtLink>
      license.
    </span>
    <span>
      This site is powered by
      <NuxtLink href="https://nuxt.com" target="_blank">
        Nuxt
      </NuxtLink>
      ,
      <NuxtLink href="https://vuejs.org" target="_blank">
        Vue
      </NuxtLink>
      and other technologies.
    </span>
  </footer>
</template>

<style scoped lang="sass">
a
  border-bottom: 1px solid rgba(125,125,125,.3)
  transition: border .3s ease-in-out

a:hover
  border-bottom: 1px solid rgba(125,125,125, 1)
  transition: border .3s ease-in-out
</style>
