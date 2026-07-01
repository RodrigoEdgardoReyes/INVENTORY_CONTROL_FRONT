<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Registrar Salida</h2>
    </div>

    <AppCard title="Nueva Salida de Producto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
          <select
            v-model="form.productId"
            @change="updateStockInfo"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar producto...</option>
            <option v-for="product in productsStore.products" :key="product.id" :value="product.id">
              {{ product.name }} (Stock disponible: {{ product.stock }})
            </option>
          </select>
          
          <!-- Mostrar stock disponible -->
          <div v-if="selectedProduct" class="mt-2 p-3 bg-blue-50 rounded-lg">
            <div class="text-sm">
              <span class="font-medium">Stock disponible:</span>
              <span :class="selectedProduct.stock <= selectedProduct.minStock ? 'text-red-600 ml-1' : 'text-green-600 ml-1'">
                {{ selectedProduct.stock }} unidades
              </span>
            </div>
            <div v-if="selectedProduct.stock <= selectedProduct.minStock" class="text-xs text-red-600 mt-1">
              ⚠️ Producto con stock bajo
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput
            v-model.number="form.quantity"
            label="Cantidad *"
            type="number"
            required
            min="1"
            :max="selectedProduct?.stock || 0"
          />
          <AppInput
            v-model.number="form.unitPrice"
            label="Precio de Venta *"
            type="number"
            required
            min="0"
            step="0.01"
          />
        </div>

        <!-- Validación de stock -->
        <div v-if="form.quantity > (selectedProduct?.stock || 0)" class="text-red-600 text-sm">
          ❌ La cantidad excede el stock disponible
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-lg font-semibold">
            Total: ${{ (form.quantity * form.unitPrice).toFixed(2) }}
          </div>
        </div>

        <AppInput
          v-model="form.reason"
          label="Motivo *"
          placeholder="Venta, Merma, Uso interno..."
          required
        />

        <AppInput
          v-model="form.reference"
          label="Cliente / Referencia"
          placeholder="Opcional"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Notas adicionales..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <AppButton variant="secondary" @click="resetForm">
            Limpiar
          </AppButton>
          <AppButton
            type="submit"
            variant="danger"
            :loading="loading"
            :disabled="form.quantity > (selectedProduct?.stock || 0)"
          >
            Registrar Salida
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useProductsStore } from '../../store/productStore';
import apiClient from '../../config/axios';
import AppCard from '../../components/common/AppCard.vue';
import AppButton from '../../components/common/AppButton.vue';
import AppInput from '../../components/common/AppInput.vue';

const productsStore = useProductsStore();
const loading = ref(false);

const form = reactive({
  productId: '',
  quantity: 0,
  unitPrice: 0,
  reason: '',
  reference: '',
  notes: ''
});

const selectedProduct = computed(() => {
  return productsStore.products.find(p => p.id === form.productId);
});

function updateStockInfo() {
  // Reset quantity when product changes
  form.quantity = 0;
}

function resetForm() {
  form.productId = '';
  form.quantity = 0;
  form.unitPrice = 0;
  form.reason = '';
  form.reference = '';
  form.notes = '';
}

async function handleSubmit() {
  if (!form.productId || form.quantity <= 0) {
    alert('Complete los campos requeridos');
    return;
  }

  if (form.quantity > (selectedProduct.value?.stock || 0)) {
    alert('No hay suficiente stock disponible');
    return;
  }

  loading.value = true;
  try {
    await apiClient.post('/movements/exit', {
      ...form,
      total: form.quantity * form.unitPrice
    });
    
    alert('Salida registrada exitosamente');
    resetForm();
    productsStore.fetchProducts(); // Actualizar stock
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al registrar salida');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  productsStore.fetchProducts();
});
</script>