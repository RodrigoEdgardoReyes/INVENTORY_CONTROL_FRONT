<template>
  <div class="mb-4">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur')"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}>(), {
  type: 'text',
  required: false,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [];
}>();

const inputId = `input-${Math.random().toString(36).slice(2, 9)}`;

const inputClasses = computed(() => {
  const base = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
  const error = props.error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  return `${base} ${error} ${disabled}`;
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = props.type === 'number' ? parseFloat(target.value) || 0 : target.value;
  emit('update:modelValue', value);
}
</script>