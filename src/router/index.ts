import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { guest: true }
    },
    {
      path: '/',
      component: () => import('../components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/auth/dashboard/DashboardView.vue')
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('../views/auth/ProductView.vue')
        },
        {
          path: 'entries',
          name: 'Entries',
          component: () => import('../views/auth/EntriesView.vue')
        },
        {
          path: 'exits',
          name: 'Exits',
          component: () => import('../views/auth/ExitsView.vue')
        },
        {
          path: 'kardex',
          name: 'Kardex',
          component: () => import('../views/auth/KardexView.vue')
        },
        {
          path: 'alerts',
          name: 'Alerts',
          component: () => import('../views/auth/AlertsView.vue')
        }
      ]
    }
  ]
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;