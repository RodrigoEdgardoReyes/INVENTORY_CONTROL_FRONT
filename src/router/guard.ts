// // src/router/guards.ts
// import type { Router, RouteLocationNormalized } from 'vue-router';
// import { useAuthStore } from '../store/authStore';

// export function setupRouterGuards(router: Router) {
//   router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
//     const authStore = useAuthStore();
//     const isAuthenticated = authStore.isAuthenticated;
    
//     // 🔴 IMPORTANTE: Verificar si estamos en onboarding
//     const isOnboardingRoute = to.path === '/onboarding';
//     const isLoginRoute = to.path === '/login';
//     const isRegisterRoute = to.path === '/register';
    
//     // 1️⃣ Rutas públicas (login, register)
//     if (to.meta.public) {
//       if (isAuthenticated && (isLoginRoute || isRegisterRoute)) {
//         // Si está autenticado y va a login/register, redirigir a dashboard u onboarding
//         if (!authStore.user?.businessId) {
//           next('/onboarding');
//         } else {
//           next('/dashboard');
//         }
//       } else {
//         next();
//       }
//       return;
//     }
    
//     // 2️⃣ Verificar autenticación para rutas protegidas
//     if (!isAuthenticated) {
//       next('/login');
//       return;
//     }
    
//     // 3️⃣ Verificar onboarding (SOLO para rutas que NO son onboarding)
//     if (!isOnboardingRoute && !authStore.user?.businessId) {
//       next('/onboarding');
//       return;
//     }
    
//     // 4️⃣ Si está en onboarding pero ya tiene businessId, redirigir a dashboard
//     if (isOnboardingRoute && authStore.user?.businessId) {
//       next('/dashboard');
//       return;
//     }
    
//     // 5️⃣ Verificar roles
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
    
//     // 6️⃣ Verificar módulos
//     const requiredModule = to.meta.module as string;
//     if (requiredModule) {
//       const hasModule = authStore.hasModule(requiredModule);
//       if (!hasModule) {
//         next('/dashboard');
//         return;
//       }
//     }
    
//     // ✅ Todo correcto, permitir acceso
//     next();
//   });
// }


// PARA PRUEBAS
// import type { Router } from 'vue-router';
// import { useAuthStore } from '../store/authStore';

// export function setupRouterGuards(router: Router) {
//   router.beforeEach(async (to, from, next) => {
//     const authStore = useAuthStore();
    
//     console.log('🔒 GUARD:', {
//       to: to.path,
//       from: from.path,
//       isAuthenticated: authStore.isAuthenticated,
//       user: authStore.user?.email,
//       businessId: authStore.user?.businessId
//     });
    
//     // 1️⃣ RUTAS PÚBLICAS (login, register)
//     if (to.meta.public) {
//       console.log('✅ Ruta pública');
//       next();
//       return;
//     }
    
//     // 2️⃣ VERIFICAR AUTENTICACIÓN
//     if (!authStore.isAuthenticated) {
//       console.log('🔴 No autenticado -> login');
//       next('/login');
//       return;
//     }
    
//     // 3️⃣ VERIFICAR ONBOARDING (SOLO para rutas protegidas que NO son onboarding)
//     if (to.path !== '/onboarding' && !authStore.user?.businessId) {
//       console.log('🔄 Sin negocio -> onboarding');
//       next('/onboarding');
//       return;
//     }
    
//     // 4️⃣ Si está en onboarding y tiene negocio -> dashboard
//     if (to.path === '/onboarding' && authStore.user?.businessId) {
//       console.log('✅ Con negocio en onboarding -> dashboard');
//       next('/dashboard');
//       return;
//     }
    
//     // 5️⃣ PERMITIR ACCESO
//     console.log('✅ Acceso permitido a:', to.path);
//     next();
//   });
// }





// src/router/guards.ts
import type { Router } from 'vue-router';
import { useAuthStore } from '../store/authStore';

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    const isPublicRoute = to.meta.public === true;
    const isOnboardingRoute = to.path === '/onboarding';

    // 1. Rutas públicas (login, register)
    if (isPublicRoute) {
      if (isAuthenticated) {
        // Ya autenticado → no tiene sentido ver login/register
        if (authStore.hasBusiness) {
          return next('/dashboard');
        }
        return next('/onboarding');
      }
      return next();
    }

    // 2. Rutas protegidas → requiere autenticación
    if (!isAuthenticated) {
      return next('/login');
    }

    // 3. Verificar onboarding (solo si NO está ya en onboarding)
    if (!isOnboardingRoute && !authStore.hasBusiness) {
      return next('/onboarding');
    }

    // 4. Si está en onboarding pero ya tiene negocio → dashboard
    if (isOnboardingRoute && authStore.hasBusiness) {
      return next('/dashboard');
    }

    // 5. Verificar roles
    const requiredRole = to.meta.role as string | string[] | undefined;
    if (requiredRole && !authStore.hasRole(requiredRole as any)) {
      return next('/dashboard');
    }

    // 6. Verificar módulos
    const requiredModule = to.meta.module as string | undefined;
    if (requiredModule && !authStore.hasModule(requiredModule)) {
      return next('/dashboard');
    }

    next();
  });
}