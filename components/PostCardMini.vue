<script setup lang="ts">
import { type PostModel } from '~/code/models/post'

const { title, created, modified, language, description } = defineProps<PostModel>()
</script>

<template>
  <div>
    <p text-l m-0 p-0>
      {{ title }}
    </p>
    <p m-0 p-0 text-xs text-gray-400 dark:text-gray-500>
      <span>
        {{ new Date(created).toDateString() }}
      </span>
      <span v-if="created !== modified">
        / {{ new Date(modified).toDateString() }}
      </span>
      <span>
        - {{ language }}
      </span>
    </p>
    <p m-0 p-0 text-xs text-gray-500 dark:text-gray-400>
      {{ description }}
    </p>
  </div>
</template>
