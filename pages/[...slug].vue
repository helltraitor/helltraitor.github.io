<script setup lang="ts">
const currentPathValue = useRouter().currentRoute.value.path

definePageMeta({
  scrollToAnchor: true,
  scrollToTop: true,
})

throw createError({
  statusCode: 404,
  message: `Page not found at location '${currentPathValue}'`,
})
</script>

<template>
  <div />
</template>
