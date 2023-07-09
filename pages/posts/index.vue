<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import type { PostModel } from '~/code/models/post'
import { POST_MODEL_FIELDS, intoPostModelAsserted } from '~/code/models/post'

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

const intoPostData = (raw: Record<string, string>) => ({ route: raw._path, model: intoPostModelAsserted(raw) })

const groupByKey = <T, U>(values: T[], key: (value: T) => U): { key: U; values: T[] }[] => {
  const collection: { key: U; values: T[] }[] = []

  for (const value of values) {
    const valueKey = key(value)

    if (collection[collection.length - 1]?.key === valueKey) {
      collection[collection.length - 1]!.values.push(value)
      continue
    }

    collection.push({ key: valueKey, values: [value] })
  }

  return collection
}

const postsUnorderedQuery = useLazyAsyncData(
  'posts-data',
  async () => queryContent('posts')
    .only(['_path', ...POST_MODEL_FIELDS])
    .find()
    .then(records => records.map(intoPostData)),
)

const postsLatestGrouped = computed(() => {
  const getLatestGroupName = ({ created, modified }: PostModel): string => {
    const latestDate = Math.max(+new Date(created), +new Date(modified))
    return isFuture(latestDate) ? 'Upcoming' : getYear(latestDate).toString()
  }

  const postsLatest = [...postsUnorderedQuery.data.value ?? []]
    .sort(({ model: lhs }, { model: rhs }) => (
      Math.max(+new Date(lhs.created), +new Date(lhs.modified))
      > Math.max(+new Date(rhs.created), +new Date(rhs.modified))
        ? -1
        : 1
    ))
    .map(({ route, model }, order) => ({ order, route, model }))

  return groupByKey(postsLatest, ({ model }) => getLatestGroupName(model))
})

const postsCreatedGrouped = computed(() => {
  const getCreatedGroupName = ({ created }: PostModel): string => {
    return isFuture(created) ? 'Upcoming' : getYear(created).toString()
  }

  const postsCreated = [...postsUnorderedQuery.data.value ?? []]
    .sort(({ model: lhs }, { model: rhs }) => (
      +new Date(lhs.created) > +new Date(rhs.created) ? -1 : 1
    ))
    .map(({ route, model }, order) => ({ order, route, model }))

  return groupByKey(postsCreated, ({ model }) => getCreatedGroupName(model))
})

const postsModifiedGrouped = computed(() => {
  const getModifiedGroupName = ({ modified }: PostModel): string => {
    return isFuture(modified) ? 'Upcoming' : getYear(modified).toString()
  }

  const postsModified = [...postsUnorderedQuery.data.value ?? []]
    .sort(({ model: lhs }, { model: rhs }) => (
      +new Date(lhs.modified) > +new Date(rhs.modified) ? -1 : 1
    ))
    .map(({ route, model }, order) => ({ order, route, model }))

  return groupByKey(postsModified, ({ model }) => getModifiedGroupName(model))
})

const currentPostsSelected = computed(() =>
  [
    postsLatestGrouped.value,
    postsCreatedGrouped.value,
    postsModifiedGrouped.value,
  ][currentOrdering.value],
)

useSeoMetaHelper({
  title: 'Posts',
  description: 'Helltraitor posts',
})
</script>

<template>
  <div
    ml-a mr-a flex lt-md="mt-10 mb-20 w-90vw" md="mt-30 mb-30 w-60ch"
  >
    <div flex flex-grow flex-col gap-2 p-0>
      <div
        :class="{ 'slide-enter': !postsUnorderedQuery.pending.value, 'invisible': postsUnorderedQuery.pending.value }"
        flex flex-row lt-md:w-90vw md:w-60ch
      >
        <div text-2xl opacity-80>
          Ordering
        </div>
        <div ml-a />
        <Switcher
          :default-option="0"
          :available-options="['Latest', 'Created', 'Modified']"
          @updated="chosen => currentOrdering = chosen"
        />
      </div>
      <div v-for="({ key, values }) of currentPostsSelected" :key="key">
        <div
          ref="animatedElements"
          class="slide-enter"
          pointer-events-none relative h20 select-none
          :style="{
            '--enter-stage': values[0].order,
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
            {{ key }}
          </span>
        </div>
        <div
          v-for="({ order, route, model }) of values" :key="route"
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
