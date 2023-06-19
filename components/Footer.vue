<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

const MIT_LICENSE_HREF = 'https://github.com/Helltraitor/helltraitor.github.io/blob/main/LICENSE'
const CC_BY_SA_40_HREF = 'https://github.com/Helltraitor/helltraitor.github.io/blob/main/CC-BY-SA-4.0'

const Footer: Ref<HTMLElement | undefined> = ref()

const startLatestEnterAnimation = (target: HTMLElement) => {
  const latestEnter = document.querySelectorAll('.slide-enter').length
  target.style.setProperty('--enter-step', '60ms')
  target.style.setProperty('--enter-stage', `${latestEnter + 1}`)

  for (const animation of target.getAnimations()) {
    animation.cancel()
    animation.play()
  }
}

onMounted(() => {
  if (!Footer.value)
    return

  Footer.value.classList.remove('invisible')
  startLatestEnterAnimation(Footer.value)
})

watch(useRouter().currentRoute, () => {
  if (!Footer.value)
    return

  startLatestEnterAnimation(Footer.value)
})
</script>

<template>
  <footer ref="Footer" class="slide-enter invisible" m-a flex flex-col p-4 text-sm opacity-50>
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
      <NuxtLink href="https://vitejs.dev" target="_blank">
        Vite
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
.invisible
  opacity: 0

a
  border-bottom: 1px solid rgba(125,125,125,.3)
  transition: border .3s ease-in-out

a:hover
  border-bottom: 1px solid rgba(125,125,125, 1)
  transition: border .3s ease-in-out
</style>
