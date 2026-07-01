import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true);
  const toasts = ref<Array<{
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>>([]);

  let toastId = 0;

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function addToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  return {
    sidebarOpen,
    toasts,
    toggleSidebar,
    addToast,
    removeToast
  };
});