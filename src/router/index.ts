import { createRouter, createWebHistory } from "vue-router";
import { setupRouterGuards } from "./guard";
import { ROUTES } from "@/config/constants";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: ROUTES.DASHBOARD,
  },

  // ─────────────────────────────────────────
  // RUTAS PÚBLICAS CON AUTH LAYOUT
  // ─────────────────────────────────────────
  {
    // name: 'Login',
    path: "/",
    component: () => import("@/components/layout/AuthLayout.vue"),
    children: [
      {
        path: ROUTES.LOGIN,
        name: "Login",
        component: () => import("@/views/auth/Login.vue"),
        meta: { public: true },
      },
      {
        path: ROUTES.REGISTER,
        name: "Register",
        component: () => import("@/views/auth/Register.vue"),
        meta: { public: true },
      },
    ],
  },

  // ─────────────────────────────────────────
  //  RUTAS CON MAIN LAYOUT (App)
  // ─────────────────────────────────────────
  {
    path: "/",
    component: () => import("@/components/layout/MainLayout.vue"),
    children: [
      {
        path: ROUTES.DASHBOARD,
        name: "Dashboard",
        component: () => import("@/views/dashboard/Dashboard.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: ROUTES.SETTINGS,
        name: "Settings",
        component: () => import("@/views/settings/Settings.vue"),
        meta: { requiresAuth: true, role: "OWNER" },
      },
      // Aquí irán Productos, Ventas, etc.
    ],
  },

  // ─────────────────────────────────────────
  // ONBOARDING (4 pasos)
  // ─────────────────────────────────────────
  // {
  //   path: ROUTES.ONBOARDING_BUSINESS_TYPE,
  //   name: "OnboardingBusinessType",
  //   component: () => import("@/views/onboarding/BusinessTypeSelector.vue"),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: ROUTES.ONBOARDING_PLANS,
  //   name: "OnboardingPlans",
  //   component: () => import("@/views/onboarding/PricingPlans.vue"),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: ROUTES.ONBOARDING_PAYMENT,
  //   name: "OnboardingPayment",
  //   component: () => import("@/views/onboarding/PaymentCheckout.vue"),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: ROUTES.ONBOARDING_BUSINESS_NAME,
  //   name: "OnboardingBusinessName",
  //   component: () => import("@/views/onboarding/BusinessNameSetup.vue"),
  //   meta: { requiresAuth: true },
  // },

  // ─────────────────────────────────────────
  //  ONBOARDING (Pantalla completa, sin layout)
  // ─────────────────────────────────────────
  {
    path: ROUTES.ONBOARDING_BUSINESS_TYPE,
    name: "OnboardingBusinessType",
    component: () => import("@/views/onboarding/BusinessTypeSelector.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.ONBOARDING_PLANS,
    name: "OnboardingPlans",
    component: () => import("@/views/onboarding/PricingPlans.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.ONBOARDING_PAYMENT,
    name: "OnboardingPayment",
    component: () => import("@/views/onboarding/PaymentCheckout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.ONBOARDING_BUSINESS_NAME,
    name: "OnboardingBusinessName",
    component: () => import("@/views/onboarding/BusinessNameSetup.vue"),
    meta: { requiresAuth: true },
  },


// ─────────────────────────────────────────
// APP (requiere negocio)
// ─────────────────────────────────────────
// {
//   path: ROUTES.DASHBOARD,
//   name: "Dashboard",
//   component: () => import("@/views/dashboard/Dashboard.vue"),
//   meta: { requiresAuth: true },
// },

// Rutas pendientes (descomenta cuando existan los componentes):
// {
//   path: ROUTES.PRODUCTS,
//   name: 'Products',
//   component: () => import('@/views/products/ProductList.vue'),
//   meta: { requiresAuth: true, module: 'hasProducts' },
// },
// {
//   path: '/',
//   redirect: '/dashboard',
// },

// {
//   path: '/products',
//   name: 'Products',
//   component: () => import('../views/products/ProductList.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_products',
//     role: ['OWNER', 'MANAGER'],
//   },
// },
// {
//   path: '/products/create',
//   name: 'ProductCreate',
//   component: () => import('../views/products/ProductCreate.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_products',
//     role: ['OWNER', 'MANAGER'],
//   },
// },
// {
//   path: '/services',
//   name: 'Services',
//   component: () => import('../views/services/ServiceList.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_services',
//     role: ['OWNER', 'MANAGER', 'EMPLOYEE'],
//   },
// },
// {
//   path: '/services/register',
//   name: 'ServiceRegister',
//   component: () => import('../views/services/ServiceRegister.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_services',
//     role: ['OWNER', 'MANAGER', 'EMPLOYEE'],
//   },
// },
// {
//   path: '/sales',
//   name: 'Sales',
//   component: () => import('../views/sales/SaleList.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_exits',
//     role: ['OWNER', 'MANAGER', 'EMPLOYEE'],
//   },
// },
// {
//   path: '/sales/create',
//   name: 'SaleCreate',
//   component: () => import('../views/sales/SaleCreate.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_exits',
//     role: ['OWNER', 'MANAGER', 'EMPLOYEE'],
//   },
// },
// {
//   path: '/purchases/create',
//   name: 'PurchaseCreate',
//   component: () => import('../views/purchases/PurchaseCreate.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_entries',
//     role: ['OWNER', 'MANAGER'],
//   },
// },
// {
//   path: '/reports',
//   name: 'Reports',
//   component: () => import('../views/reports/FinancialReports.vue'),
//   meta: {
//     requiresAuth: true,
//     module: 'has_finance',
//     role: ['OWNER', 'MANAGER', 'VIEWER'],
//   },
// },
{
  path: '/settings',
  name: 'Settings',
  component: () => import('../views/settings/Settings.vue'),
  meta: {
    requiresAuth: true,
    role: ['OWNER'],
  },
},
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupRouterGuards(router);

export default router;
