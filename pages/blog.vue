<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/code/models/post'

const intoPostData = (raw: Record<string, string>) => ({ route: raw._path, model: intoPostModelAsserted(raw) })

const postsCreatedQuery = await useLazyAsyncData(
  'posts-latest-created-data-4',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ created: -1 })
    .limit(4)
    .find()
    .then(records => records.map(intoPostData)),
)

const postsLatestQuery = await useLazyAsyncData(
  'posts-latest-modified-data-4',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ modified: -1 })
    .limit(4)
    .find()
    .then(records => records.map(intoPostData)),
)

const postsLatestPending = computed(() =>
  postsCreatedQuery.pending.value || postsLatestQuery.pending.value)

const postsCreated = computed(() => postsCreatedQuery.data.value ?? [])
const postsLatest = computed(() => postsLatestQuery.data.value ?? [])

useSeoMetaHelper({
  title: 'Blog',
  description: 'Helltraitor blog',
})
</script>

<template>
  <div
    m-a flex flex-row justify-center
    lt-md:w-90vw md:w-80ch
  >
    <section
      :class="postsLatestPending ? 'invisible' : 'slide-enter'"
      flex flex-col
    >
      <TierList
        :default-option="0"
        :available-options="['Latest', 'Created']"
        :available-groups="[
          postsLatest,
          postsCreated,
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
