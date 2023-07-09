<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/code/models/post'

const intoPostData = (raw: Record<string, string>) => ({ route: raw._path, model: intoPostModelAsserted(raw) })

const postsLatestCreatedQuery = await useLazyAsyncData(
  'posts-latest-created-data-4',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ created: -1 })
    .limit(4)
    .find()
    .then(records => records.map(intoPostData)),
)

const postsLatestModifiedQuery = await useLazyAsyncData(
  'posts-latest-modified-data-4',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ modified: -1, created: -1 })
    .limit(4)
    .find()
    .then(records => records.map(intoPostData)),
)

const postsLatestPending = computed(() =>
  postsLatestCreatedQuery.pending.value || postsLatestModifiedQuery.pending.value)

const postsLatestCreated = computed(() => postsLatestCreatedQuery.data.value ?? [])
const postsLatestModified = computed(() => postsLatestModifiedQuery.data.value ?? [])

const postsLatest = computed(() => {
  const postsLatestMerged = [...postsLatestCreated.value, ...postsLatestModified.value]
  const postsUniqueRoutes = new Set(postsLatestMerged.map(({ route }) => route))

  return (
    postsLatestMerged
      .filter(({ route }) => postsUniqueRoutes.delete(route))
      .sort(({ model: lhs }, { model: rhs }) => (
        Math.max(+new Date(lhs.created), +new Date(lhs.modified))
        > Math.max(+new Date(rhs.created), +new Date(rhs.modified))
          ? -1
          : 1
      ))
      .slice(0, 4)
  )
})

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
      :class="{ 'slide-enter': !postsLatestPending, 'invisible': postsLatestPending }"
      flex flex-col
    >
      <TierList
        :default-option="0"
        :available-options="['Latest', 'Created', 'Modified']"
        :available-groups="[
          postsLatest,
          postsLatestCreated,
          postsLatestModified,
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
