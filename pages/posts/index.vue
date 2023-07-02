<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import type { PostModel } from '~/modules/models/post'
import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/modules/models/post'

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

const getYear = (date?: Date | string | number): number =>
  new Date(date ?? '').getFullYear()

const isFuture = (date?: Date | string | number): boolean =>
  new Date(date ?? '') > new Date()

interface Group<T> {
  name: string
  values: T[]
}

const groupByFirst = <T>(groups: Group<T>[], [label, routed]: [string, T]): Group<T>[] => {
  if (groups[groups.length - 1]?.name === label)
    groups[groups.length - 1]?.values.push(routed)
  else
    groups.push({ name: label, values: [routed] })

  return groups
}

interface RoutedPost {
  route: string
  model: PostModel
}

type RawRoutedPost = { _path: string } & PostModel
const intoRoutedPostAsserted = (raw: RawRoutedPost): RoutedPost => {
  return { route: raw._path, model: intoPostModelAsserted(raw as Pick<RawRoutedPost, keyof PostModel>) }
}

const { data: contentPosts, pending: contentPostsPending } = useLazyAsyncData(
  'posts-data',
  async () => queryContent<RoutedPost>('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .find()
    .then(values => values.map(raw => intoRoutedPostAsserted(raw as Pick<RawRoutedPost, keyof RawRoutedPost>))))

const postsLatestCreated = computed(() =>
  [...contentPosts.value ?? []]
    .sort((lhs, rhs) => +new Date(rhs.model.created) - +new Date(lhs.model.created))
    .map((routed, index) => [
      isFuture(routed.model.created) ? 'Upcoming' : getYear(routed.model.created).toString(),
      [
        index,
        routed,
      ],
    ] as [string, [number, RoutedPost]])
    .reduce(groupByFirst, [] as Group<[number, RoutedPost]>[]))

const postsLatestModified = computed(() =>
  [...contentPosts.value ?? []]
    .sort((lhs, rhs) => {
      const compared = +new Date(rhs.model.modified) - +new Date(lhs.model.modified)
      if (compared !== 0)
        return compared
      return +new Date(rhs.model.created) - +new Date(lhs.model.created)
    })
    .map((routed, index) => [
      isFuture(routed.model.modified) ? 'Upcoming' : getYear(routed.model.modified).toString(),
      [
        index,
        routed,
      ],
    ] as [string, [number, RoutedPost]])
    .reduce(groupByFirst, [] as Group<[number, RoutedPost]>[]))

const currentPostsSelected = computed(() =>
  [postsLatestCreated.value, postsLatestModified.value][currentOrdering.value])

useSeoMetaHelper({
  title: 'Posts',
  description: 'Helltraitor posts',
})

definePageMeta({
  scrollToAnchor: true,
  scrollToTop: true,
})
</script>

<template>
  <div
    ml-a mr-a flex lt-md="mt-10 mb-20 w-90vw" md="mt-30 mb-30 w-60ch"
  >
    <div flex flex-grow flex-col gap-2 p-0>
      <div
        :class="{ 'slide-enter': !contentPostsPending, 'invisible': contentPostsPending }"
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
      <div v-for="({ name: groupName, values: routedPosts }) of currentPostsSelected" :key="groupName">
        <div
          ref="animatedElements"
          class="slide-enter"
          pointer-events-none relative h20 select-none
          :style="{
            '--enter-stage': routedPosts[0][0],
            '--enter-step': '60ms',
          }"
        >
          <span
            absolute
            font-bold font-inter color-transparent
            text-stroke-hex-aaa opacity-10
            md="left--3rem top--2rem text-8em text-stroke-2"
            lt-md="text-4em text-stroke-1.75"
          >
            {{ groupName }}
          </span>
        </div>
        <div
          v-for="([order, { route, model }]) of routedPosts" :key="route"
          flex flex-col p-2
        >
          <div
            ref="animatedElements"
            class="slide-enter"
            :style="{
              '--enter-stage': order + 2,
              '--enter-step': '60ms',
            }"
          >
            <NuxtLink
              class="linked"
              :to="route"
            >
              <PostCard v-bind="model" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.invisible
  opacity: 0
</style>
