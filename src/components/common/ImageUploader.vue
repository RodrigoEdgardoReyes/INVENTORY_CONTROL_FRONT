<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const fileInput = ref<HTMLInputElement | null>(null);

// Simulamos la subida mostrando la URL base64 localmente
const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      emit('update:modelValue', ev.target?.result as string);
    };
    reader.readAsDataURL(target.files[0]);
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-full bg-gray-50 hover:bg-gray-100 transition cursor-pointer" @click="fileInput?.click()">
    <img v-if="modelValue" :src="modelValue" class="w-full h-32 object-cover rounded-md mb-2" />
    <div v-else class="text-center">
      <span class="text-4xl">📸</span>
      <p class="mt-2 text-sm text-gray-500">Subir imagen</p>
    </div>
    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFile" />
  </div>
</template>

<!-- NOTA : A futuro usar un servicio externo como cloudinary o firebase en lugar de enviar el Base64 al backend para almacenar imágenes localmente de esa manera se envia al servicio externo y me devuelve una url corta -->