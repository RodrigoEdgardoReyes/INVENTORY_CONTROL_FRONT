<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServiceStore } from '@/store/service.store';
import { useAuthStore } from '@/store/authStore';
import ServiceButton from '@/components/common/ServiceButton.vue';
import TicketPanel from '@/components/common/TicketPanel.vue';
import type { Service, TicketItem } from '@/types/service.types';

const serviceStore = useServiceStore();
const authStore = useAuthStore();

const ticketItems = ref<TicketItem[]>([]);
// ✅ Inicializamos con el UUID real
const employeeId = ref(authStore.user?.id || '');
const clientName = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');

onMounted(() => serviceStore.fetchServices());

const addToTicket = (service: Service) => {
  const existing = ticketItems.value.find(i => i.service.id === service.id);
  if (existing) {
    existing.quantity++;
  } else {
    ticketItems.value.push({ service, quantity: 1 });
  }
};

const removeItem = (index: number) => ticketItems.value.splice(index, 1);

const handleCheckout = async () => {
  if (ticketItems.value.length === 0) return;
  
  const businessId = authStore.user?.businessId;

  if (!businessId || !employeeId.value) {
    alert('Error: No se pudo identificar el negocio o el empleado.');
    return;
  }

  isProcessing.value = true;
  errorMessage.value = '';

  try {
    const response = await serviceStore.registerTicketBatch({
      businessId,
      employeeId: employeeId.value,
      clientName: clientName.value.trim() || 'Cliente Genérico',
      items: ticketItems.value.map(item => ({
        serviceId: item.service.id,
        quantity: item.quantity
      }))
    });

    const receipt = response.receipt;
    
    // ✅ CORREGIDO: Usamos totalQuantity en lugar de itemsCount
    alert(
      `✅ Cobro registrado exitosamente\n` +
      `Cliente: ${receipt.clientName}\n` +
      `Servicios realizados: ${receipt.totalQuantity}\n` + 
      `Total a cobrar: $${Number(receipt.total).toFixed(2)}`
    );

    ticketItems.value = [];
    clientName.value = '';

  } catch (error: unknown) {
    console.error(error);
    errorMessage.value = 'No se pudo cobrar el ticket. Verifica los servicios e intenta de nuevo.';
    alert(errorMessage.value);
  } finally {
    // ✅ CORREGIDO: Siempre liberamos el estado de procesamiento
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="h-[calc(100vh-8rem)] flex gap-6">
    <div class="flex-1 overflow-y-auto pr-2">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Modo Barbería ⚡</h1>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ServiceButton 
          v-for="service in serviceStore.services" 
          :key="service.id" 
          :service="service" 
          @select="addToTicket" 
        />
      </div>
    </div>

    <div class="w-80 flex-shrink-0">
      <!-- ✅ Le pasamos el currentUser -->
      <TicketPanel 
        v-model:employee-id="employeeId" 
        v-model:client-name="clientName" 
        :items="ticketItems" 
        :is-processing="isProcessing"
        :current-user="authStore.user"
        @remove="removeItem" 
        @checkout="handleCheckout" 
      />
    </div>
  </div>
</template>