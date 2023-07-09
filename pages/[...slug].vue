<script setup lang="ts">
const currentPathValue = useRouter().currentRoute.value.path

throw createError({
  statusCode: 404,
  message: `Page not found at location '${currentPathValue}'`,
})
</script>

<template>
  <div />
</template>
