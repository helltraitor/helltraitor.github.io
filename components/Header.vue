<script setup lang="ts">
import '@/assets/css/linked.sass'

const toggleDark = () => {
  const colorMode = useColorMode()
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header sticky right-6px top-0 z-10 block flex flex-row p-8 font-inter backdrop-blur-sm>
    <div m-inline-s-5p lt-md:hidden />
    <div m-inline-s-1p md:hidden />

    <div class="label">
      <NuxtLink class="linked" to="/">
        <span lt-md:hidden>helltraitor</span>
        <span md:hidden>h_</span>
      </NuxtLink>
    </div>
    <div style="margin-inline: auto;" />
    <nav text-base>
      <NuxtLink class="linked" to="/blog">
        <span lt-md:hidden>Blog</span>
        <div i-carbon:blog md:hidden title="Blog" />
      </NuxtLink>
      <NuxtLink class="linked" href="https://github.com/helltraitor" target="_blank">
        <span lt-md:hidden>GitHub</span>
        <div i-carbon:logo-github md:hidden title="GitHub" />
      </NuxtLink>
      <NuxtLink class="linked" href="mailto: helltraitor@hotmail.com">
        <span lt-md:hidden>Mail</span>
        <div i-carbon:email md:hidden title="Mail" />
      </NuxtLink>
      <div cursor-pointer class="linked" title="Toggle dark mode" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </div>
    </nav>

    <div m-inline-e-5p lt-md:hidden />
    <div m-inline-e-1p md:hidden />
  </header>
</template>

<style scoped lang="sass">
.label
  font-family: 'Courier New', Courier, monospace
  font-size: 22px

nav
  display: grid
  grid-auto-flow: column
  grid-template-columns: auto max-content
  gap: 1.2rem
  box-sizing: border-box

  *
    align-self: center
    margin: auto
</style>
