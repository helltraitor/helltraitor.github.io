<script setup lang="ts">
import { type PostModel } from '~/modules/models/post'

const { title, created, modified, language, description } = defineProps<PostModel>()
</script>

<template>
  <div>
    <p m-0 p-0 text-xl>
      {{ title }}
    </p>
    <p m-0 p-0 text-sm text-gray-400 dark:text-gray-500>
      {{ new Date(modified).toDateString() }} / {{ new Date(created).toDateString() }} - {{ language }}
    </p>
    <p m-0 p-0 text-gray-500 dark:text-gray-400>
      {{ description }}
    </p>
  </div>
</template>
