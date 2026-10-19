// src/router/guards.ts
import type { Router } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';
import type { PlanFeatures } from '@/store/authStore';

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    const isPublicRoute = to.meta.public === true;
    const isOnboardingRoute = to.path.startsWith('/onboarding');
    const isBusinessNameRoute = to.path === ROUTES.ONBOARDING_BUSINESS_NAME;

    // const isBusinessTypeRoute = to.path === ROUTES.ONBOARDING_BUSINESS_TYPE;

    // ─────────────────────────────────────────
    // 1. Rutas públicas (login, register)
    // ─────────────────────────────────────────
    if (isPublicRoute) {
      if (isAuthenticated) {
        // Ya autenticado → redirigir según tenga negocio o no
        if (authStore.hasBusiness) {
          return next(ROUTES.DASHBOARD);
        }
        return next(ROUTES.ONBOARDING_BUSINESS_TYPE);
      }
      return next();
    }

    // ─────────────────────────────────────────
    // 2. Rutas protegidas → requiere autenticación
    // ─────────────────────────────────────────
    if (!isAuthenticated) {
      return next(ROUTES.LOGIN);
    }

    // ─────────────────────────────────────────
    // 3. Onboarding: usuario autenticado SIN negocio
    // ─────────────────────────────────────────
    if (!authStore.hasBusiness) {
      // Si NO está en onboarding → mandarlo a onboarding
      if (!isOnboardingRoute) {
        return next(ROUTES.ONBOARDING_BUSINESS_TYPE);
      }
      // Si ya está en onboarding → dejar pasar
      return next();
    }

    // ─────────────────────────────────────────
    // 4. Usuario CON negocio intentando entrar a onboarding
    // ─────────────────────────────────────────
    if (authStore.hasBusiness && isOnboardingRoute && !isBusinessNameRoute) {
      return next(ROUTES.DASHBOARD);
    }

    // ─────────────────────────────────────────
    // 5. Verificar rol requerido
    // ─────────────────────────────────────────
    const requiredRole = to.meta.role as string | string[] | undefined;
    if (requiredRole && !authStore.hasRole(requiredRole as any)) {
      return next(ROUTES.DASHBOARD);
    }

    // ─────────────────────────────────────────
    // 6. Verificar módulo requerido (según plan)
    // ─────────────────────────────────────────
    const requiredModule = to.meta.module as keyof PlanFeatures | undefined;
    if (requiredModule && !authStore.hasModule(requiredModule)) {
      return next(ROUTES.DASHBOARD);
    }

    return next();
  });
}