<!-- <template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')" />
        
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  title: string;
}>();

defineEmits<{
  close: [];
}>();
</script> -->

<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </div>
        
        <div class="px-6 py-4">
          <slot />
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <slot name="footer">
            <button
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cerrar
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>