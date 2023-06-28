<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/modules/models/post'

const postsLatestCreated = await useLazyAsyncData(
  'posts-latest-created-data-4',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ created: -1 })
    .limit(4)
    .find(),
)

const postsLatestModified = await useLazyAsyncData(
  'posts-latest-modified-data-4',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ modified: -1, created: -1 })
    .limit(4)
    .find(),
)

const postsLatestPending = computed(() =>
  postsLatestCreated.pending.value || postsLatestModified.pending.value)

const packPostData = (raw: Record<string, string>) => ({ route: raw._path, model: intoPostModelAsserted(raw) })

useSeoMetaHelper({
  title: 'Blog',
  description: 'Helltraitor blog',
})

definePageMeta({
  scrollToTop: true,
})
</script>

<template>
  <div
    m-a flex flex-row justify-center
    lt-md:w-90vw md:w-80ch
  >
    <section
      :class="{ 'slide-enter': !postsLatestPending, 'invisible': postsLatestPending }"
      flex flex-col
    >
      <TierList
        :default-option="1"
        :available-options="['Created', 'Modified']"
        :available-groups="[
          postsLatestCreated.data.value?.map(packPostData) ?? [],
          postsLatestModified.data.value?.map(packPostData) ?? [],
        ]"
      >
        <template #title>
          <NuxtLink text-2xl class="linked" to="/posts">
            Posts
          </NuxtLink>
        </template>
        <template #item="{ route, model }">
          <div
            class="linked"
            p-2 border="~ solid rounded gray-200 dark:gray-700"
          >
            <NuxtLink :to="route">
              <PostCard v-bind="model" />
            </NuxtLink>
          </div>
        </template>
      </TierList>
    </section>
  </div>
</template>

<style scoped lang="sass">
.invisible
  opacity: 0
</style>
