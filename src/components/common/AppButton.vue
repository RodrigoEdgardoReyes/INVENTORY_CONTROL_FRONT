<!-- <template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
  size: 'md'
});

defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`;
});
</script> -->

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