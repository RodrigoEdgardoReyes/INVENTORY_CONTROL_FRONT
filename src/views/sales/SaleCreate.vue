<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSaleStore } from "@/store/sale.store";
import { useAuthStore } from "@/store/authStore";
import ProductSelectModal from "@/components/modals/ProductSelectModal.vue";
import { formatCurrency } from "@/utils/formatters";
import type { Product } from "@/types/product.types";
import type { PaymentMethod } from "@/types/sale.types";

const router = useRouter();
const saleStore = useSaleStore();
const authStore = useAuthStore();

const isModalOpen = ref(false);
const isProcessing = ref(false);
const form = ref({
  clientName: "Cliente General",
  clientNit: "",
  invoiceNumber: "",
  paymentMethod: "CASH" as PaymentMethod,
});

function handleProductSelect(product: Product, quantity: number) {
  try {
    saleStore.addToCart(product, quantity);
    isModalOpen.value = false;
  } catch (error: any) {
    alert(error.message); // Maneja el error de stock
  }
}

async function handleSubmit() {
  if (saleStore.cart.length === 0) return alert("Agrega productos al carrito");

  // Imprimimos la ganancia ANTES de guardar (mientras el carrito tiene datos)
  console.log("Ganancia calculada en el carrito:", saleStore.cartProfit);

  isProcessing.value = true;
  try {
    const sale = await saleStore.createSale(form.value);

    // Calculamos la referencia correcta (Factura del form, del back o ID corto)
    const referencia =
      sale.invoiceNumber || form.value.invoiceNumber || sale.id.slice(0, 8);

    // Una sola alerta con la referencia arreglada
    alert(`✅ Venta registrada. Ref: ${referencia}`);

    // (Opcional) Si el backend devuelve la ganancia calculada, la mostramos:
    // console.log("Ganancia confirmada por el backend:", sale.profit);

    router.push("/sales");
  } catch (error: any) {
    alert(error.response?.data?.message || "Error al registrar la venta");
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Nueva Venta</h1>
      <button
        @click="router.push('/sales')"
        class="text-gray-600 hover:text-gray-900"
      >
        ← Volver
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Datos del Cliente -->
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 md:col-span-2 space-y-4"
      >
        <h2 class="text-lg font-semibold border-b pb-2">Datos del Cliente</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nombre</label
            >
            <input
              v-model="form.clientName"
              type="text"
              class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >NIT / Documento</label
            >
            <input
              v-model="form.clientNit"
              type="text"
              class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >N° Factura (Opcional)</label
            >
            <input
              v-model="form.invoiceNumber"
              type="text"
              class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Método de Pago</label
            >
            <select
              v-model="form.paymentMethod"
              class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="CASH">Efectivo</option>
              <option value="CARD">Tarjeta</option>
              <option value="TRANSFER">Transferencia</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Resumen de Totales -->
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3"
      >
        <h2 class="text-lg font-semibold border-b pb-2">Resumen</h2>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal:</span>
          <span class="font-medium">{{
            formatCurrency(saleStore.cartSubtotal)
          }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600"
            >IVA ({{ authStore.user?.business?.taxPercentage || 13 }}%):</span
          >
          <span class="font-medium">{{
            formatCurrency(saleStore.cartTax)
          }}</span>
        </div>
        <div
          class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2"
        >
          <span>Total:</span>
          <span>{{ formatCurrency(saleStore.cartTotal) }}</span>
        </div>
        <button
          @click="handleSubmit"
          :disabled="saleStore.cart.length === 0 || isProcessing"
          class="w-full mt-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {{ isProcessing ? "Procesando..." : "Confirmar Venta" }}
        </button>
      </div>
    </div>

    <!-- Detalle del Carrito -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-lg font-semibold">Productos en la Venta</h2>
        <button
          @click="isModalOpen = true"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
        >
          + Agregar Producto
        </button>
      </div>

      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b text-sm text-gray-500">
          <tr>
            <th class="p-4 font-medium">Producto</th>
            <th class="p-4 font-medium">Precio</th>
            <th class="p-4 font-medium text-center">Cantidad</th>
            <th class="p-4 font-medium">Total</th>
            <th class="p-4 font-medium">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="saleStore.cart.length === 0">
            <td colspan="5" class="p-8 text-center text-gray-500">
              No hay productos agregados.
            </td>
          </tr>
          <tr
            v-for="item in saleStore.cart"
            :key="item.product.id"
            class="hover:bg-gray-50"
          >
            <td class="p-4 font-medium text-gray-900">
              {{ item.product.name }}
            </td>
            <td class="p-4 text-sm text-gray-600">
              {{ formatCurrency(item.product.salePrice) }}
            </td>
            <td class="p-4 text-center">{{ item.quantity }}</td>
            <td class="p-4 text-sm font-bold">
              {{
                formatCurrency(Number(item.product.salePrice) * item.quantity)
              }}
            </td>
            <td class="p-4">
              <button
                @click="saleStore.removeFromCart(item.product.id)"
                class="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Quitar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <ProductSelectModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @select="handleProductSelect"
    />
  </div>
</template>
