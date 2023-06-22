<script setup lang="ts">
const { message } = defineProps<{ message: string }>()
</script>

<template>
  <div p-2 border="~ solid rounded gray-200 dark:gray-700">
    <div class="reason" p-1>
      {{ message }}
    </div>
    <p m-block-0 p-1>
      In case if you have some time, you can
      <NuxtLink href="https://github.com/Helltraitor/helltraitor.github.io/issues/new" target="_blank">
        report issue
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped lang="sass">
.reason
  background-color: var(--c-bg-code)
  border-radius: 0.25rem
  padding: 0.10rem

a
  border-bottom: 1px solid rgba(125,125,125,.3)
  transition: border .3s ease-in-out

a:hover
  border-bottom: 1px solid rgba(125,125,125, 1)
  transition: border .3s ease-in-out
</style>
