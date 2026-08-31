<!-- src/views/auth/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center mb-8">Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="credentials.email"
            type="email"
            placeholder="admin@inventario.com"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            v-model="credentials.password"
            type="password"
            placeholder="••••••••"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
        
        
        <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
      </form>
    </div>
  </div>
  <!-- En Login.vue, dentro del template -->
<button 
  @click="skipOnboarding" 
  type="button"
  class="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
>
  Saltar onboarding (modo prueba)
</button
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  email: 'admin@inventario.com',
  password: 'admin123'
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 🔴 TEMPORAL: Simular login para pruebas
    // Reemplazar con llamada real a la API
    if (credentials.value.email === 'admin@inventario.com' && credentials.value.password === 'admin123') {
      // Crear usuario de prueba
      authStore.user = {
        id: '1',
        name: 'Administrador',
        email: 'admin@inventario.com',
        role: 'OWNER',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // businessId: 'demo-123', // ← Descomentar para saltar onboarding
      };
      authStore.token = 'fake-token-123';
      localStorage.setItem('token', 'fake-token-123');
      localStorage.setItem('user', JSON.stringify(authStore.user));
      
      // Redirigir según tenga o no businessId
      if (authStore.user.businessId) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } else {
      error.value = 'Credenciales inválidas';
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};

const skipOnboarding = () => {
  // Simular que el usuario tiene un businessId para pruebas
  if (authStore.user) {
    authStore.user.businessId = 'demo-business-123';
    authStore.user.business = {
      id: 'demo-business-123',
      name: 'Mi Negocio de Prueba',
      businessType: 'RETAIL',
    };
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(authStore.user));
    
    // Redirigir al dashboard
    router.push('/dashboard');
  }
};
</script>