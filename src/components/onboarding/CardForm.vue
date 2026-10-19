<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  isValidCardNumber,
  isValidExpiryDate,
  isValidCVV,
  isValidCardHolder,
  formatCardNumber,
  formatExpiryDate,
  getCardType,
} from '@/utils/validators';

export interface CardFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const props = defineProps<{
  modelValue: CardFormData;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: CardFormData];
  'update:isValid': [value: boolean];
}>();

// ─────────────────────────────────────────
// LOCAL STATE
// ─────────────────────────────────────────
const form = ref<CardFormData>({ ...props.modelValue });
const touched = ref({
  cardNumber: false,
  cardHolder: false,
  expiryDate: false,
  cvv: false,
});

// ─────────────────────────────────────────
// CARD NUMBER
// ─────────────────────────────────────────
function onCardNumberInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const formatted = formatCardNumber(input.value);
  form.value.cardNumber = formatted;
  touched.value.cardNumber = true;
  emitUpdate();
}

const cardNumberError = computed(() => {
  if (!touched.value.cardNumber) return '';
  if (!form.value.cardNumber) return 'Ingresa el número de tarjeta';
  if (!isValidCardNumber(form.value.cardNumber)) {
    return 'Número de tarjeta inválido';
  }
  return '';
});

const cardType = computed(() => getCardType(form.value.cardNumber));

// ─────────────────────────────────────────
// CARD HOLDER
// ─────────────────────────────────────────
function onCardHolderInput(e: Event) {
  const input = e.target as HTMLInputElement;
  form.value.cardHolder = input.value.toUpperCase();
  touched.value.cardHolder = true;
  emitUpdate();
}

const cardHolderError = computed(() => {
  if (!touched.value.cardHolder) return '';
  if (!form.value.cardHolder) return 'Ingresa el nombre del titular';
  if (!isValidCardHolder(form.value.cardHolder)) {
    return 'Nombre inválido (nombre y apellido)';
  }
  return '';
});

// ─────────────────────────────────────────
// EXPIRY DATE
// ─────────────────────────────────────────
function onExpiryInput(e: Event) {
  const input = e.target as HTMLInputElement;
  form.value.expiryDate = formatExpiryDate(input.value);
  touched.value.expiryDate = true;
  emitUpdate();
}

const expiryError = computed(() => {
  if (!touched.value.expiryDate) return '';
  if (!form.value.expiryDate) return 'Ingresa la fecha de vencimiento';
  if (!isValidExpiryDate(form.value.expiryDate)) {
    return 'Fecha inválida o expirada';
  }
  return '';
});

// ─────────────────────────────────────────
// CVV
// ─────────────────────────────────────────
function onCVVInput(e: Event) {
  const input = e.target as HTMLInputElement;
  form.value.cvv = input.value.replace(/\D/g, '').slice(0, 4);
  touched.value.cvv = true;
  emitUpdate();
}

const cvvError = computed(() => {
  if (!touched.value.cvv) return '';
  if (!form.value.cvv) return 'Ingresa el CVV';
  if (!isValidCVV(form.value.cvv)) return 'CVV inválido (3-4 dígitos)';
  return '';
});

// ─────────────────────────────────────────
// VALIDACIÓN GLOBAL
// ─────────────────────────────────────────
const isFormValid = computed(() => {
  return (
    isValidCardNumber(form.value.cardNumber) &&
    isValidCardHolder(form.value.cardHolder) &&
    isValidExpiryDate(form.value.expiryDate) &&
    isValidCVV(form.value.cvv)
  );
});

// ─────────────────────────────────────────
// EMIT UPDATES
// ─────────────────────────────────────────
function emitUpdate() {
  emit('update:modelValue', { ...form.value });
  emit('update:isValid', isFormValid.value);
}

watch(isFormValid, (valid) => {
  emit('update:isValid', valid);
});

// ─────────────────────────────────────────
// MÉTODO PÚBLICO: marcar todo como tocado
// ─────────────────────────────────────────
function touchAll() {
  touched.value = {
    cardNumber: true,
    cardHolder: true,
    expiryDate: true,
    cvv: true,
  };
}

defineExpose({ touchAll, isFormValid });
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Datos de pago</h3>
      <span class="text-sm text-gray-500">{{ cardType }}</span>
    </div>

    <div class="space-y-5">
      <!-- NÚMERO DE TARJETA -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta
        </label>
        <input
          :value="form.cardNumber"
          @input="onCardNumberInput"
          type="text"
          inputmode="numeric"
          placeholder="4242 4242 4242 4242"
          maxlength="23"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
          :class="{ 'border-red-500': cardNumberError }"
        />
        <p v-if="cardNumberError" class="mt-1 text-xs text-red-600">
          {{ cardNumberError }}
        </p>
      </div>

      <!-- TITULAR -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Titular de la tarjeta
        </label>
        <input
          :value="form.cardHolder"
          @input="onCardHolderInput"
          type="text"
          placeholder="JUAN PEREZ"
          maxlength="50"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :class="{ 'border-red-500': cardHolderError }"
        />
        <p v-if="cardHolderError" class="mt-1 text-xs text-red-600">
          {{ cardHolderError }}
        </p>
      </div>

      <!-- EXPIRY + CVV -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Vencimiento
          </label>
          <input
            :value="form.expiryDate"
            @input="onExpiryInput"
            type="text"
            inputmode="numeric"
            placeholder="MM/YY"
            maxlength="5"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            :class="{ 'border-red-500': expiryError }"
          />
          <p v-if="expiryError" class="mt-1 text-xs text-red-600">
            {{ expiryError }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            :value="form.cvv"
            @input="onCVVInput"
            type="text"
            inputmode="numeric"
            placeholder="123"
            maxlength="4"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            :class="{ 'border-red-500': cvvError }"
          />
          <p v-if="cvvError" class="mt-1 text-xs text-red-600">
            {{ cvvError }}
          </p>
        </div>
      </div>

      <!-- HINT DE PRUEBA -->
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p class="text-xs text-amber-800">
          💡 <strong>Modo prueba:</strong> usa la tarjeta
          <code class="bg-amber-100 px-1 rounded">4242 4242 4242 4242</code>,
          fecha futura <code class="bg-amber-100 px-1 rounded">12/30</code> y
          CVV <code class="bg-amber-100 px-1 rounded">123</code>
        </p>
      </div>
    </div>
  </div>
</template>