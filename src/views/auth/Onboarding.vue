<!-- src/views/auth/Onboarding.vue
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
</script> -->

<!-- src/views/auth/Onboarding.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-8">
        🚀 Configura tu negocio
      </h1>
      
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Guardando configuración...</p>
      </div>
      
      <div v-else class="space-y-6">
        <!-- Mensaje de depuración -->
        <div class="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p>📋 Usuario: <strong>{{ authStore.user?.email || 'No autenticado' }}</strong></p>
          <p>🏢 Negocio: <strong>{{ authStore.user?.businessId || 'No configurado' }}</strong></p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tipo de negocio
          </label>
          <select 
            v-model="form.businessType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">Selecciona...</option>
            <option value="RETAIL">🛍️ Tienda minorista</option>
            <option value="BARBER">✂️ Barbería</option>
            <option value="RESTAURANT">🍽️ Restaurante</option>
            <option value="WHOLESALE">📦 Mayorista</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Nombre del negocio
          </label>
          <input 
            v-model="form.businessName"
            type="text"
            placeholder="Ej: Mi Barbería"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        
        <button
          @click="completeOnboarding"
          :disabled="!form.businessType || !form.businessName"
          class="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ✅ Completar configuración
        </button>
        
        <button
          @click="skipOnboarding"
          type="button"
          class="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800"
        >
          ⏭️ Omitir (modo desarrollo)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const form = ref({
  businessType: '',
  businessName: '',
});

// LOG de depuración al montar el componente
onMounted(() => {
  console.log('🟢 COMPONENTE ONBOARDING MONTADO');
  console.log('📋 Usuario:', authStore.user);
  console.log('🏢 BusinessId:', authStore.user?.businessId);
  console.log('🔑 Autenticado:', authStore.isAuthenticated);
  
  // Si ya tiene businessId, redirigir al dashboard
  if (authStore.user?.businessId) {
    console.log('🔄 Usuario ya tiene negocio, redirigiendo a dashboard...');
    router.push('/dashboard');
  }
});

const completeOnboarding = async () => {
  console.log('📝 Completando onboarding...');
  loading.value = true;
  
  try {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (authStore.user) {
      const businessId = 'demo-' + Date.now();
      
      // Crear objeto business
      const business = {
        id: businessId,
        name: form.value.businessName,
        businessType: form.value.businessType,
      };
      
      // Actualizar usuario
      authStore.user.businessId = businessId;
      authStore.user.business = business;
      
      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(authStore.user));
      
      console.log('✅ Onboarding completado:', authStore.user);
      
      // Redirigir al dashboard
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('❌ Error en onboarding:', error);
    alert('Error al guardar la configuración');
  } finally {
    loading.value = false;
  }
};

const skipOnboarding = () => {
  console.log('⏭️ Omitiendo onboarding...');
  
  if (authStore.user) {
    const businessId = 'demo-skip-' + Date.now();
    authStore.user.businessId = businessId;
    authStore.user.business = {
      id: businessId,
      name: 'Negocio Demo',
      businessType: 'RETAIL',
    };
    localStorage.setItem('user', JSON.stringify(authStore.user));
    router.push('/dashboard');
  }
};
</script>