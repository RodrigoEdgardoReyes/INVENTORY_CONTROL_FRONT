<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/store/service.store';
import { useAuthStore } from '@/store/authStore';
import ServiceButton from '@/components/common/ServiceButton.vue';
import TicketPanel from '@/components/common/TicketPanel.vue';
import type { Service, TicketItem } from '@/types/service.types';

const router = useRouter();
const serviceStore = useServiceStore();
const authStore = useAuthStore();

const ticketItems = ref<TicketItem[]>([]);
const employeeId = ref('current-user');
const clientName = ref('');
const isProcessing = ref(false);

onMounted(() => serviceStore.fetchServices());

const addToTicket = (service: Service) => {
  const existing = ticketItems.value.find(i => i.service.id === service.id);
  if (existing) {
    existing.quantity++;
  } else {
    ticketItems.value.push({ service, quantity: 1 });
  }
};

const removeItem = (index: number) => {
  ticketItems.value.splice(index, 1);
};

const handleCheckout = async () => {
  if (ticketItems.value.length === 0) return;
  
  const businessId = authStore.user?.businessId;
  const realEmployeeId = employeeId.value === 'current-user' ? authStore.user?.id : employeeId.value;

  if (!businessId || !realEmployeeId) {
    alert('Error de sesión');
    return;
  }

  isProcessing.value = true;
  try {
    // Registramos cada item del ticket
    for (const item of ticketItems.value) {
      for (let i = 0; i < item.quantity; i++) {
        await serviceStore.registerService({
          businessId,
          serviceId: item.service.id,
          employeeId: realEmployeeId,
          clientName: clientName.value || undefined,
          price: Number(item.service.price)
        });
      }
    }
    
    // Limpiamos
    ticketItems.value = [];
    clientName.value = '';
    alert('✅ Servicios registrados y cobrados exitosamente');
    
  } catch (error) {
    console.error(error);
    alert('Error al registrar servicios');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="h-[calc(100vh-8rem)] flex gap-6">
    <!-- Catálogo de Servicios (Izquierda) -->
    <div class="flex-1 overflow-y-auto pr-2">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Modo Barbería ⚡</h1>
        <p class="text-gray-500">Selecciona los servicios realizados</p>
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

    <!-- Ticket (Derecha) -->
    <div class="w-80 flex-shrink-0">
      <TicketPanel 
        v-model:employee-id="employeeId"
        v-model:client-name="clientName"
        :items="ticketItems"
        @remove="removeItem"
        @checkout="handleCheckout"
      />
    </div>
  </div>
</template>