<script setup lang="ts">
import { type ProjectModel, getProjectName } from '~/code/models/projects'

const { project, route, preferDetails } = defineProps<{ project: ProjectModel; route: string; preferDetails?: boolean }>()
</script>

<template>
  <div>
    <!-- TODO: Make find by hashtag (project always have hashtag by their name) -->
    <p m-0 p-0 text-sm>
      #{{ getProjectName(route, project) }}
    </p>
    <NuxtLink :to="route">
      <p m-0 p-0 text-xl>
        {{ project.title }}
      </p>
      <p m-0 p-0 text-sm text-gray-400 dark:text-gray-500>
        <span>
          {{ new Date(project.created).toDateString() }}
        </span>
        <span v-if="project.completed">
          / {{ new Date(project.completed).toDateString() }}
        </span>
        <span>
          - {{ project.language }}
        </span>
      </p>
      <p m-0 p-0 text-gray-500 dark:text-gray-400>
        {{ preferDetails ? project.details : project.description }}
      </p>
    </NuxtLink>
    <div class="margin-on-item">
      <slot name="item" />
    </div>
  </div>
</template>

<style scoped lang="sass">
.margin-on-item:has(*)
  margin-top: 0.5rem
</style>
