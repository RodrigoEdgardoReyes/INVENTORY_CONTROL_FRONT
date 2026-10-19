<script setup lang="ts">
import { computed } from 'vue';

interface Step {
  id: string;
  label: string;
}

interface Props {
  currentStep: number; // 1, 2, 3
  steps: Step[];
}

const props = defineProps<Props>();

const progressWidth = computed(() => {
  const total = props.steps.length;
  if (total <= 1) return '0%';
  const progress = ((props.currentStep - 1) / (total - 1)) * 100;
  return `${progress}%`;
});
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="relative">
      <!-- Línea base (gris) -->
      <div
        class="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"
        aria-hidden="true"
      ></div>

      <!-- Línea de progreso (azul) -->
      <div
        class="absolute top-5 left-0 h-0.5 bg-indigo-600 transition-all duration-300"
        :style="{ width: progressWidth }"
        aria-hidden="true"
      ></div>

      <!-- Círculos numerados -->
      <div class="relative flex justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex flex-col items-center"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300"
            :class="{
              'bg-indigo-600 border-indigo-600 text-white':
                index + 1 <= currentStep,
              'bg-white border-gray-300 text-gray-500':
                index + 1 > currentStep,
            }"
          >
            <span v-if="index + 1 < currentStep">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            class="mt-2 text-xs font-medium transition-colors"
            :class="{
              'text-indigo-600': index + 1 === currentStep,
              'text-gray-500': index + 1 !== currentStep,
            }"
          >
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>