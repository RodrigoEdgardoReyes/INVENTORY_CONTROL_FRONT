<!-- src/views/auth/Onboarding.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-8">Configura tu negocio</h1>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tipo de negocio
          </label>
          <select 
            v-model="businessType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecciona...</option>
            <option value="RETAIL">Tienda minorista</option>
            <option value="BARBER">Barbería</option>
            <option value="RESTAURANT">Restaurante</option>
            <option value="WHOLESALE">Mayorista</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Nombre del negocio
          </label>
          <input 
            v-model="businessName"
            type="text"
            placeholder="Mi Negocio"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <button
          @click="completeOnboarding"
          :disabled="!businessType || !businessName"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Completar configuración
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const businessType = ref('');
const businessName = ref('');

const completeOnboarding = () => {
  // Simular la actualización del usuario con businessId
  if (authStore.user) {
    authStore.user.businessId = 'demo-business-123';
    authStore.user.business = {
      id: 'demo-business-123',
      name: businessName.value,
      businessType: businessType.value,
    };
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(authStore.user));
    
    // Redirigir al dashboard
    router.push('/dashboard');
  }
};
</script>