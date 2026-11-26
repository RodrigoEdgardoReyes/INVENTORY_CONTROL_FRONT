import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { saleApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { Sale, SaleFormData, CartItem } from '@/types/sale.types';
import type { Product } from '@/types/product.types';

export const useSaleStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([]);
  const cart = ref<CartItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ─────────────────────────────────────────
  // GETTERS DEL CARRITO
  // ─────────────────────────────────────────
  const cartSubtotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + (Number(item.product.salePrice) * item.quantity), 0);
  });

  const cartTax = computed(() => {
    const authStore = useAuthStore();
    const taxPercentage = Number(authStore.user?.business?.taxPercentage || 13);
    return cartSubtotal.value * (taxPercentage / 100);
  });

  const cartTotal = computed(() => cartSubtotal.value + cartTax.value);

  const cartProfit = computed(() => {
    return cart.value.reduce((sum, item) => {
      const profitPerUnit = Number(item.product.salePrice) - Number(item.product.purchasePrice);
      return sum + (profitPerUnit * item.quantity);
    }, 0);
  });

  // ─────────────────────────────────────────
  // ACCIONES
  // ─────────────────────────────────────────
  function addToCart(product: Product, quantity: number) {
    const existing = cart.value.find(i => i.product.id === product.id);
    
    if (existing) {
      // Validar que no supere el stock
      if (existing.quantity + quantity > product.stock) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
      }
      existing.quantity += quantity;
    } else {
      if (quantity > product.stock) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`);
      }
      cart.value.push({ product, quantity });
    }
  }

  function removeFromCart(productId: string) {
    cart.value = cart.value.filter(i => i.product.id !== productId);
  }

  function clearCart() {
    cart.value = [];
  }

  async function fetchSales() {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;
    if (!businessId) return;

    isLoading.value = true;
    try {
      sales.value = await saleApi.getSales(businessId);
    } catch (e: any) {
      error.value = e.message || 'Error al cargar ventas';
    } finally {
      isLoading.value = false;
    }
  }

  async function createSale(clientData: { clientName: string; clientNit?: string; invoiceNumber?: string; paymentMethod: any }) {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;
    if (!businessId) throw new Error('No hay negocio activo');
    if (cart.value.length === 0) throw new Error('El carrito está vacío');

    const payload: SaleFormData = {
      businessId,
      ...clientData,
      items: cart.value.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: Number(item.product.salePrice)
      })),
      subtotal: cartSubtotal.value,
      tax: cartTax.value,
      total: cartTotal.value,
      profit: cartProfit.value
    };

    const newSale = await saleApi.createSale(payload);
    
    // Refrescamos historial y limpiamos carrito
    await fetchSales();
    clearCart();
    
    return newSale;
  }

  return {
    sales, cart, isLoading, error,
    cartSubtotal, cartTax, cartTotal, cartProfit,
    addToCart, removeFromCart, clearCart, fetchSales, createSale
  };
});