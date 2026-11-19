<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="buttonClasses"
    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
  >
    <div v-if="loading" class="mr-2">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
    </div>
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  variant: 'primary',
  type: 'button',
  loading: false,
  disabled: false,
  size: 'md'
})

const buttonClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
}[props.variant]
</script>