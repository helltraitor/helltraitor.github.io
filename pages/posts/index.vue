<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import type { PostModel } from '~/modules/models/post'
import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/modules/models/post'

const queryPostsFields = ['_path', ...POST_MODEL_FIELDS]

const postsLatestCreated = await useLazyAsyncData(
  'posts-latest-created-data',
  async () => queryContent('posts').only(queryPostsFields).sort({ created: -1 }).find(),
)

const postsLatestModified = await useLazyAsyncData(
  'posts-latest-modified-data',
  async () => queryContent('posts').only(queryPostsFields).sort({ modified: -1 }).find(),
)

const animatedElements: Ref<HTMLElement[]> = ref([])

const currentOrdering = ref(0)
watch(currentOrdering, () => {
  if (!animatedElements)
    return

  for (const animation of animatedElements.value.flatMap(element => element.getAnimations())) {
    animation.cancel()
    animation.play()
  }
})

const postsLatestReady = computed(
  () => !postsLatestCreated.pending.value && !postsLatestModified.pending.value)

const postsLatestComputed = computed(
  () => [postsLatestCreated, postsLatestModified].at(currentOrdering.value)?.data?.value ?? [])

const getYear = (date?: Date | string | number): number => new Date(date ?? '').getFullYear()
const isFuture = (date?: Date | string | number): boolean => new Date(date ?? '') > new Date()
const isSameYear = (lhsDate?: Date | string | number, rhsDate?: Date | string | number) => getYear(lhsDate) === getYear(rhsDate)

const isSameGroup = (lhsPost?: PostModel, rhsPost?: PostModel): boolean => (
  isFuture(lhsPost?.created) === isFuture(rhsPost?.created)
  && isSameYear(lhsPost?.created, rhsPost?.created)
)

const getGroupName = (post?: PostModel): string => {
  if (!post)
    return 'Unknown'
  return isFuture(post.created) ? 'Upcoming' : getYear(post.created).toString()
}

useSeoMetaHelper({
  title: 'Posts',
  description: 'Helltraitor posts',
})

definePageMeta({
  scrollToTop: true,
})
</script>

<template>
  <div
    ml-a mr-a flex lt-md="mt-10 w-90vw" md="mt-30 w-60ch"
  >
    <div flex flex-grow flex-col gap-2 p-0>
      <div
        :class="{ 'slide-enter': postsLatestReady, 'invisible': !postsLatestReady }"
        flex flex-row lt-md:w-90vw md:w-60ch
      >
        <div text-2xl opacity-80>
          Ordering
        </div>
        <div ml-a />
        <Switcher
          :default-option="0"
          :available-options="['Created', 'Modified']"
          @updated="chosen => currentOrdering = chosen"
        />
      </div>
      <div
        v-for="(post, index) of postsLatestComputed" :key="index"
        flex flex-col p-2
      >
        <div
          v-if="(
            currentOrdering === 0
            && (
              // Posts flows top to bottom: checks if previous one in different group
              !isSameGroup(post as PostModel, postsLatestComputed.at(index - 1) as (PostModel | undefined))
              // Or it comes first, then it always must have group, especially in case when group is only one
              || index === 0
            )
          )"
          ref="animatedElements"
          class="slide-enter"
          pointer-events-none relative h20 select-none
          lt-md:hidden
          :style="{
            '--enter-stage': index,
            '--enter-step': '60ms',
          }"
        >
          <span
            class="group-label"
            absolute
            left--3rem top--2rem
            text-8em font-bold color-transparent
            text-stroke-2 text-stroke-hex-aaa opacity-10
          >
            {{ getGroupName(post as PostModel) }}
          </span>
        </div>
        <div
          ref="animatedElements"
          class="slide-enter" :style="{ '--enter-stage': index + 2, '--enter-step': '60ms' }"
        >
          <NuxtLink
            class="linked"
            :to="post._path"
          >
            <PostCard v-bind="intoPostModelAsserted(post)" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <div lt-md:mt-10 md:mt-30 />
</template>

<style scoped lang="sass">
.invisible
  opacity: 0

.group-label
  font-family: ui-sans-serif,system-ui,-apple-system, BlinkMacSystemFont,Segoe UI,Roboto, Helvetica Neue,Arial,Noto Sans,sans-serif, "Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji" !important
</style>
