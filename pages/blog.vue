<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/modules/models/post'

const queryPostsFields = ['_path', ...POST_MODEL_FIELDS]

const postsLatestCreated = await useLazyAsyncData(
  'posts-latest-created-data-4',
  async () => queryContent('posts').only(queryPostsFields).sort({ created: -1 }).limit(4).find(),
)

const postsLatestModified = await useLazyAsyncData(
  'posts-latest-modified-data-4',
  async () => queryContent('posts').only(queryPostsFields).sort({ modified: -1 }).limit(4).find(),
)

const packPostData = (raw: Record<string, string>) => ({ path: raw._path, post: intoPostModelAsserted(raw) })

useSeoMetaHelper({
  title: 'Blog',
  description: 'Helltraitor blog',
})
</script>

<template>
  <div class="root" m-a flex flex-row justify-center>
    <section class="slide-enter" flex flex-col>
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
        <template #item="data">
          <div
            class="linked"
            p-2 border="~ solid rounded gray-200 dark:gray-700"
          >
            <NuxtLink :to="data.path">
              <PostCard v-bind="data.post" />
            </NuxtLink>
          </div>
        </template>
      </TierList>
    </section>
  </div>
</template>

<style scoped lang="sass">
.root
  width: min(80ch, 90vw)
</style>
