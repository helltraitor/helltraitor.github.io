<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

const MIT_LICENSE_HREF = 'https://github.com/Helltraitor/helltraitor.github.io/blob/main/LICENSE'
const CC_BY_SA_40_HREF = 'https://github.com/Helltraitor/helltraitor.github.io/blob/main/CC-BY-SA-4.0'

const Footer: Ref<HTMLElement | undefined> = ref()

onMounted(() => {
  if (!Footer.value)
    return

  const latestEnter = document.querySelectorAll('.slide-enter').length
  Footer.value.style.setProperty('--enter-step', '60ms')
  Footer.value.style.setProperty('--enter-stage', `${latestEnter + 1}`)
  Footer.value.classList.add('slide-enter')
})
</script>

<template>
  <footer ref="Footer" :style="{ opacity: Footer ? 0.5 : 0 }" m-a flex flex-col p-4 text-sm>
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
a
  color: inherit
  font-weight: inherit
  text-decoration: none
  border-bottom: 1px solid rgba(125,125,125,.3)
  transition: border .3s ease-in-out

a:hover
  border-bottom: 1px solid rgba(125,125,125, 1)
  transition: border .3s ease-in-out
</style>
