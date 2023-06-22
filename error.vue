<script setup lang="ts">
import '@/assets/css/slide-enter.sass'

interface RootError {
  statusCode?: number
  statusMessage?: string
  message?: string
}

const { error } = defineProps<{ error: RootError }>()

useSeoMetaHelper({
  title: error.statusMessage || `Error ${error.statusCode}`,
  description: error.message || 'Undefined error',
})
</script>

<template>
  <div>
    <NuxtLayout>
      <div m-a class="slide-enter" text-gray-700 dark:text-gray-200>
        <p m-block-0 text-10>
          {{ error?.statusMessage || `Error ${error.statusCode}` }}
        </p>
        <p m-block-0>
          At location: <span font-mono text-sm class="location">{{ useRouter().currentRoute.value.path }}</span>
        </p>
        <p m-block-0 text-sm>
          Note: The current location maybe different from the error one
        </p>
        <div mt-2 :if="error.message">
          With message:
          <div font-mono text-sm class="reason">
            {{ error.message || '<undefined>' }}
          </div>
        </div>
        <p m-block-0>
          In case if you have some time, you can
          <NuxtLink href="https://github.com/Helltraitor/helltraitor.github.io/issues/new" target="_blank">
            report issue
          </NuxtLink>
        </p>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="sass">
main
  width: min(60ch, 90vw)

.location,
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
