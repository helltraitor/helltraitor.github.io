<!-- eslint-disable @typescript-eslint/indent -->
<script setup lang="ts">
import '@/assets/css/linked.sass'
import '@/assets/css/slide-enter.sass'

import { POST_MODEL_FIELDS, type PostModel, intoPostModelAsserted } from '~/code/models/post'
import { PROJECT_MODEL_FIELDS, type ProjectModel, intoProjectModelAsserted } from '~/code/models/projects'

interface PostData {
  route: string
  model: PostModel
}

interface ProjectData {
  route: string
  model: ProjectModel
}

const intoPostData = (raw: Record<string, string>): PostData => ({ route: raw._path, model: intoPostModelAsserted(raw) })
const intoProjectData = (raw: Record<string, string>): ProjectData => ({ route: raw._path, model: intoProjectModelAsserted(raw) })

/**
 * POSTS QUERIES AND PARSING
 */

const postsLatestQuery = useLazyAsyncData(
  'posts-latest-data-4',
  () => queryContent('posts')
    // Selects only two kinds of paths:
    //   /posts/**
    //   /posts/**/index
    .where({ _path: /^(?:\/[^\/]+){2}$/ })
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ modified: -1 })
    .limit(4)
    .find(),
)

const postsLatestIntoPostData = computed(() => postsLatestQuery.data.value?.map(intoPostData) ?? [])

const postsCreatedQuery = useLazyAsyncData(
  'posts-created-data-4',
  () => queryContent('posts')
    // Selects only two kinds of paths:
    //   /posts/**
    //   /posts/**/index
    .where({ _path: /^(?:\/[^\/]+){2}$/ })
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ created: -1 })
    .limit(4)
    .find(),
)

const postsCreatedIntoPostData = computed(() => postsCreatedQuery.data.value?.map(intoPostData) ?? [])

const postsPending = computed(() =>
  [postsCreatedQuery.status.value, postsLatestQuery.status.value].includes('pending'))

/**
 * PROJECTS QUERIES AND PARSING
 */

const projectsPostsLatestQuery = useLazyAsyncData(
  'projects-posts-latest-data',
  () => queryContent('projects')
    // Selects only two kinds of paths:
    //   /posts/**
    //   /posts/**/index
    .where({ _path: /^(?:\/[^\/]+){3}$/ })
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ modified: -1 })
    .find(),
)

const projectsPostsCreatedQuery = useLazyAsyncData(
  'projects-posts-created-data',
  () => queryContent('projects')
    // Selects only two kinds of paths:
    //   /posts/**
    //   /posts/**/index
    .where({ _path: /^(?:\/[^\/]+){3}$/ })
    .only(['_path', ...POST_MODEL_FIELDS])
    .sort({ created: -1 })
    .find(),
)

const projectsAllQuery = useLazyAsyncData(
  'projects-all-data',
  () => queryContent('projects')
    // Selects only two kinds of paths:
    //   /posts/**
    //   /posts/**/index
    .where({ _path: /^(?:\/[^\/]+){2}$/ })
    .only(['_path', ...PROJECT_MODEL_FIELDS])
    .sort({ created: -1 })
    .find(),
)

const projectsSortedData = (projectsAll: ProjectData[], postAll: PostData[], selector: (post: PostData) => Date) => {
  const projectsLatestByPost = []
  for (const project of projectsAll) {
    let latestModifiedPost
    let latestModifiedPostDate = new Date(0)

    for (const post of postAll.filter(({ route }) => route.startsWith(`${project.route}/`))) {
      const postModifiedPostDate = selector(post)
      if (latestModifiedPostDate > postModifiedPostDate)
        break

      latestModifiedPostDate = postModifiedPostDate
      latestModifiedPost = post
    }

    projectsLatestByPost.push([project, latestModifiedPost])
  }

  const projectsLatestByPostChecked = projectsLatestByPost.filter(([_, post]) => post !== undefined) as [ProjectData, PostData][]
  return projectsLatestByPostChecked.sort(([_left, leftPost], [_right, rightPost]) => +selector(rightPost) - +selector(leftPost)).slice(0, 2)
}

const projectsLatestData = computed(() => {
  const projectsPostsLatest = projectsPostsLatestQuery.data.value?.map(intoPostData) ?? []
  const projectsAll = projectsAllQuery.data.value?.map(intoProjectData) ?? []

  return projectsSortedData(projectsAll, projectsPostsLatest, post => new Date(post.model.modified))
})

const projectsCreatedData = computed(() => {
  const projectsPostsLatest = projectsPostsCreatedQuery.data.value?.map(intoPostData) ?? []
  const projectsAll = projectsAllQuery.data.value?.map(intoProjectData) ?? []

  return projectsSortedData(projectsAll, projectsPostsLatest, post => new Date(post.model.created))
})

const projectsPending = computed(() => projectsAllQuery.status.value === 'pending')

useSeoMetaHelper({
  title: 'Blog',
  description: 'Helltraitor blog',
})
</script>

<template>
  <div
    m-a flex flex-col justify-center gap-8
    lt-md:w-90vw md:w-80ch
  >
    <div
      flex flex-row justify-center
      lt-md:w-90vw md:w-80ch
    >
      <section
        :class="postsPending ? 'invisible' : 'slide-enter'"
        flex flex-col
      >
        <TierList
          :default-option="0"
          :available-options="['Latest', 'Created']"
          :available-groups="[
            postsLatestIntoPostData,
            postsCreatedIntoPostData,
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
    <div
      flex flex-row justify-center
      lt-md:w-90vw md:w-80ch
    >
      <section
        v-if="projectsLatestData.length !== 0"
        :class="projectsPending ? 'invisible' : 'slide-enter'"
        flex flex-col
      >
        <TierList
          :default-option="0"
          :available-options="['Latest', 'Created']"
          :available-groups="[
            projectsLatestData,
            projectsCreatedData,
          ]"
        >
          <template #title>
            <NuxtLink text-2xl class="linked" to="/projects">
              Projects
            </NuxtLink>
          </template>
          <template #item="pair">
            <div
              class="linked"
              p-2 border="~ solid rounded gray-200 dark:gray-700"
            >
              <ProjectCard :project="pair[0].model" :route="pair[0].route">
                <template #item>
                  <div
                    class="linked"
                    p-2 border="~ solid rounded gray-200 dark:gray-700"
                  >
                    <NuxtLink :to="pair[1].route">
                      <PostCard v-bind="pair[1].model" />
                    </NuxtLink>
                  </div>
                </template>
              </ProjectCard>
            </div>
          </template>
        </TierList>
      </section>
    </div>
  </div>
</template>

<style scoped lang="sass">
.invisible
  opacity: 0
</style>
