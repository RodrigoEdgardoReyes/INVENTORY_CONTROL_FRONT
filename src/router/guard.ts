// // src/router/guards.ts
// import type { Router, RouteLocationNormalized } from 'vue-router';
// import { useAuthStore } from '../store/authStore';

// export function setupRouterGuards(router: Router) {
//   router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
//     const authStore = useAuthStore();
//     const isAuthenticated = authStore.isAuthenticated;
    
//     // Public routes (no auth required)
//     if (to.meta.public) {
//       if (isAuthenticated && to.path === '/login') {
//         next('/dashboard');
//       } else {
//         next();
//       }
//       return;
//     }
    
//     // Protected routes
//     if (!isAuthenticated) {
//       next('/login');
//       return;
//     }
    
//     // Check if user has completed onboarding
//     // Usamos optional chaining para evitar errores si user es null
//     if (!authStore.user?.businessId && to.path !== '/onboarding') {
//       next('/onboarding');
//       return;
//     }
    
//     // Check permissions based on role
//     const requiredRole = to.meta.role as string | string[];
//     if (requiredRole) {
//       const userRole = authStore.user?.role;
      
//       if (Array.isArray(requiredRole)) {
//         if (!requiredRole.includes(userRole || '')) {
//           next('/dashboard');
//           return;
//         }
//       } else {
//         if (userRole !== requiredRole) {
//           next('/dashboard');
//           return;
//         }
//       }
//     }
    
//     // Check if user has access to the module (subscription)
//     const requiredModule = to.meta.module as string;
//     if (requiredModule) {
//       const hasModule = authStore.hasModule(requiredModule);
//       if (!hasModule) {
//         next('/dashboard');
//         return;
//       }
//     }
    
//     next();
//   });
// }

// src/router/guards.ts
import type { Router, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/authStore';

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    
    // 🔴 IMPORTANTE: Verificar si estamos en onboarding
    const isOnboardingRoute = to.path === '/onboarding';
    const isLoginRoute = to.path === '/login';
    const isRegisterRoute = to.path === '/register';
    
    // 1️⃣ Rutas públicas (login, register)
    if (to.meta.public) {
      if (isAuthenticated && (isLoginRoute || isRegisterRoute)) {
        // Si está autenticado y va a login/register, redirigir a dashboard u onboarding
        if (!authStore.user?.businessId) {
          next('/onboarding');
        } else {
          next('/dashboard');
        }
      } else {
        next();
      }
      return;
    }
    
    // 2️⃣ Verificar autenticación para rutas protegidas
    if (!isAuthenticated) {
      next('/login');
      return;
    }
    
    // 3️⃣ Verificar onboarding (SOLO para rutas que NO son onboarding)
    if (!isOnboardingRoute && !authStore.user?.businessId) {
      next('/onboarding');
      return;
    }
    
    // 4️⃣ Si está en onboarding pero ya tiene businessId, redirigir a dashboard
    if (isOnboardingRoute && authStore.user?.businessId) {
      next('/dashboard');
      return;
    }
    
    // 5️⃣ Verificar roles
    const requiredRole = to.meta.role as string | string[];
    if (requiredRole) {
      const userRole = authStore.user?.role;
      
      if (Array.isArray(requiredRole)) {
        if (!requiredRole.includes(userRole || '')) {
          next('/dashboard');
          return;
        }
      } else {
        if (userRole !== requiredRole) {
          next('/dashboard');
          return;
        }
      }
    }
    
    // 6️⃣ Verificar módulos
    const requiredModule = to.meta.module as string;
    if (requiredModule) {
      const hasModule = authStore.hasModule(requiredModule);
      if (!hasModule) {
        next('/dashboard');
        return;
      }
    }
    
    // ✅ Todo correcto, permitir acceso
    next();
  });
}