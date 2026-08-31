<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div v-if="loading" class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  value?: string | number
  colorClass?: string
  subtitle?: string
  loading?: boolean
}>()
</script>