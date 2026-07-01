<!-- <template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div v-if="title" class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else class="px-6 py-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  loading?: boolean;
}>();
</script> -->

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