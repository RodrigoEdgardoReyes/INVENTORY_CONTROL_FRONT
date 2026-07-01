<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Registrar Entrada</h2>
      <router-link to="/kardex" class="text-blue-600 hover:text-blue-800 text-sm">
        Ver Historial de Movimientos →
      </router-link>
    </div>

    <AppCard title="Nueva Entrada de Producto">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
          <select
            v-model="form.productId"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar producto...</option>
            <option v-for="product in productsStore.products" :key="product.id" :value="product.id">
              {{ product.name }} (SKU: {{ product.sku }} - Stock: {{ product.stock }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AppInput
            v-model.number="form.quantity"
            label="Cantidad *"
            type="number"
            required
            min="1"
          />
          <AppInput
            v-model.number="form.unitPrice"
            label="Precio Unitario *"
            type="number"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Total:</span>
            <span class="text-lg font-bold text-blue-600">
              ${{ (form.quantity * form.unitPrice).toFixed(2) }}
            </span>
          </div>
        </div>

        <AppInput
          v-model="form.reason"
          label="Motivo *"
          placeholder="Compra, Devolución, Ajuste..."
          required
        />

        <AppInput
          v-model="form.reference"
          label="Proveedor / Referencia"
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

        <div class="flex justify-end space-x-3 pt-4">
          <AppButton variant="secondary" @click="resetForm" type="button">
            Limpiar Formulario
          </AppButton>
          <AppButton type="submit" variant="success" :loading="loading">
            Registrar Entrada
          </AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
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

function resetForm() {
  form.productId = '';
  form.quantity = 0;
  form.unitPrice = 0;
  form.reason = '';
  form.reference = '';
  form.notes = '';
  // Limpiar el producto pre-seleccionado
  sessionStorage.removeItem('selectedProductForEntry');
}

async function handleSubmit() {
  if (!form.productId || form.quantity <= 0) {
    alert('Complete los campos requeridos (Producto y Cantidad)');
    return;
  }

  loading.value = true;
  try {
    await apiClient.post('/movements/entry', {
      ...form,
      total: form.quantity * form.unitPrice
    });
    
    alert('✅ Entrada registrada exitosamente');
    resetForm();
    productsStore.fetchProducts(); // Actualizar stock
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al registrar entrada');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await productsStore.fetchProducts();
  
  // Si hay un producto pre-seleccionado (desde alertas)
  const preSelectedProduct = sessionStorage.getItem('selectedProductForEntry');
  if (preSelectedProduct) {
    form.productId = preSelectedProduct;
    // Opcional: auto-seleccionar precio de compra del producto
    const product = productsStore.products.find(p => p.id === preSelectedProduct);
    if (product) {
      form.unitPrice = product.purchasePrice;
    }
  }
});
</script>