<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Alertas de Stock Bajo</h2>
      <AppBadge variant="danger" class="text-lg">
        {{ lowStockProducts.length }} productos
      </AppBadge>
    </div>

    <AppCard v-if="lowStockProducts.length === 0 && !productsStore.loading">
      <div class="text-center py-12">
        <div class="text-6xl mb-4">✅</div>
        <h3 class="text-lg font-medium text-gray-900">¡Todo en orden!</h3>
        <p class="mt-2 text-sm text-gray-500">
          No hay productos con stock bajo en este momento.
        </p>
      </div>
    </AppCard>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AppCard
        v-for="product in lowStockProducts"
        :key="product.id"
        class="border-l-4 border-red-500"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-500">SKU: {{ product.sku }}</p>
            </div>
            <AppBadge variant="danger">URGENTE</AppBadge>
          </div>

          <div class="bg-red-50 p-3 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stock Actual:</span>
              <span class="text-lg font-bold text-red-600">{{
                product.stock
              }}</span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <span class="text-sm text-gray-600">Stock Mínimo:</span>
              <span class="text-sm font-medium text-gray-900">{{
                product.minStock
              }}</span>
            </div>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-red-600 h-2 rounded-full"
                :style="{
                  width: `${(product.stock / product.minStock) * 100}%`,
                }"
              ></div>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <p>Categoría: {{ product.category }}</p>
            <p v-if="product.updatedAt">
              Última actualización: {{ product.updatedAt || "N/A" }}
            </p>
            <!-- <p>Última actualización: {{ formatDate(product.updatedAt) || 'N/A' }}</p> -->

            <p v-else class="text-yellow-600">Sin fecha de actualización</p>
          </div>

          <div class="flex space-x-2">
            <AppButton
              variant="primary"
              size="sm"
              @click="goToEntry(product.id)"
            >
              Registrar Entrada
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              @click="viewHistory(product.id)"
            >
              Ver Historial
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProductsStore } from "../../store/productStore";
import AppCard from "../../components/common/AppCard.vue";
import AppButton from "../../components/common/AppButton.vue";
import AppBadge from "../../components/common/AppBadge.vue";

const router = useRouter();
const productsStore = useProductsStore();

const lowStockProducts = computed(() => {
  return productsStore.products.filter((p) => p.stock <= p.minStock);
});

function goToEntry(productId: string) {
  // Guardar el ID del producto en sessionStorage para pre-seleccionarlo
  sessionStorage.setItem("selectedProductForEntry", productId);
  router.push("/entries");
}

function viewHistory(productId: string) {
  router.push(`/kardex?product=${productId}`);
}

onMounted(() => {
  productsStore.fetchProducts();
});
</script>
