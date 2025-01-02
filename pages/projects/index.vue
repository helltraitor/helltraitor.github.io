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
 * PROJECTS QUERIES AND PARSING
 */

const projectsPostsLatestQuery = useLazyAsyncData(
  'projects-posts-latest-data',
  () => queryContent('projects')
    // Selects only two kinds of paths:
    //   /posts/**
    //   /posts/**/index
    .where({ _path: /^\/projects(?:\/[^\/]+){2}$/ })
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
    .where({ _path: /^\/projects(?:\/[^\/]+){2}$/ })
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

const projectsSortedData = (projectsAll: ProjectData[], postAll: PostData[], selector: (post: PostData | undefined) => Date) => {
  const projectsSortedByPost: [ProjectData, PostData[]][] = []
  for (const project of projectsAll) {
    const sortedPosts = postAll
      .filter(({ route }) => route.startsWith(`${project.route}/`))
      .sort((leftPost, rightPost) => +selector(rightPost) - +selector(leftPost))
      .slice(0, 4)

      projectsSortedByPost.push([project, sortedPosts])
  }
  return projectsSortedByPost.sort(([leftProject, leftPosts], [rightProject, rightPosts]) => {
    const postKey = +selector(rightPosts.at(0)) - +selector(leftPosts.at(0))
    if (postKey === 0)
      return +new Date(rightProject.model.created) - +new Date(leftProject.model.created)
    return postKey
  })
}

const projectsLatestData = computed(() => {
  const projectsPostsLatest = projectsPostsLatestQuery.data.value?.map(intoPostData) ?? []
  const projectsAll = projectsAllQuery.data.value?.map(intoProjectData) ?? []

  return projectsSortedData(projectsAll, projectsPostsLatest, post => new Date(post?.model?.modified ?? 0))
})

const projectsCreatedData = computed(() => {
  const projectsPostsLatest = projectsPostsCreatedQuery.data.value?.map(intoPostData) ?? []
  const projectsAll = projectsAllQuery.data.value?.map(intoProjectData) ?? []

  return projectsSortedData(projectsAll, projectsPostsLatest, post => new Date(post?.model?.created ?? 0))
})

const projectsPending = computed(() =>
  projectsPostsLatestQuery.status.value === 'pending'
  || projectsPostsCreatedQuery.status.value === 'pending')

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
    <section
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
            <ProjectCard :project="pair[0].model" :route="pair[0].route" :prefer-details="pair[0].model.details !== undefined">
              <template #item>
                <div flex flex-col gap-2>
                  <div
                    v-for="(post, index) of pair[1].slice(0, 4 - (pair[0].model.details ? 1 : 0))" :key="index"
                    class="linked"
                    p-2 border="~ solid rounded gray-200 dark:gray-700"
                  >
                    <NuxtLink :to="post.route">
                      <PostCard v-bind="post.model" />
                    </NuxtLink>
                  </div>
                </div>
              </template>
            </ProjectCard>
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
