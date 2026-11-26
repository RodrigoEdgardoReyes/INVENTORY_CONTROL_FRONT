import { createRouter, createWebHistory } from "vue-router";
import { setupRouterGuards } from "./guard";
import { ROUTES } from "@/config/constants";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  // ─────────────────────────────────────────
  // 1. REDIRECCIÓN PRINCIPAL
  // ─────────────────────────────────────────
  {
    path: "/",
    redirect: ROUTES.DASHBOARD,
  },

  // ─────────────────────────────────────────
  // 2. AUTH LAYOUT (Login y Register)
  // ─────────────────────────────────────────
  {
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
  // 3. MAIN LAYOUT (Dashboard, Productos, Settings, etc.)
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
        meta: { requiresAuth: true, role: ["OWNER"] },
      },
      // ─── MÓDULO DE PRODUCTOS ───
      {
        path: ROUTES.PRODUCTS, // Asegúrate que en constants.ts esto sea '/products'
        name: "ProductList",
        component: () => import("@/views/products/ProductList.vue"),
        meta: { requiresAuth: true, module: "hasProducts" },
      },
      {
        path: "/products/create",
        name: "ProductCreate",
        component: () => import("@/views/products/ProductCreate.vue"),
        meta: {
          requiresAuth: true,
          module: "hasProducts",
          role: ["OWNER", "MANAGER"],
        },
      },
      {
        path: "/products/:id/edit",
        name: "ProductEdit",
        component: () => import("@/views/products/ProductEdit.vue"),
        meta: {
          requiresAuth: true,
          module: "hasProducts",
          role: ["OWNER", "MANAGER"],
        },
      },
      {
        path: "/services",
        name: "ServiceList",
        component: () => import("@/views/services/ServiceList.vue"),
        meta: { requiresAuth: true, module: "hasServices" },
      },
      {
        path: "/services/register",
        name: "ServiceRegister",
        component: () => import("@/views/services/ServiceRegister.vue"),
        meta: { requiresAuth: true, module: "hasServices" },
      },
      {
        path: "/services/history",
        name: "ServiceHistory",
        component: () => import("@/views/services/ServiceHistory.vue"),
        meta: { requiresAuth: true, module: "hasServices" },
      },
      {
        path: "/services/create",
        name: "ServiceCreate",
        component: () => import("@/views/services/ServiceCreate.vue"),
        meta: {
          requiresAuth: true,
          module: "hasServices",
          role: ["OWNER", "MANAGER"],
        },
      },
      {
        path: "/services/:id/edit",
        name: "ServiceEdit",
        component: () => import("@/views/services/ServiceEdit.vue"),
        meta: {
          requiresAuth: true,
          module: "hasServices",
          role: ["OWNER", "MANAGER"],
        },
      },
      {
        path: "/sales",
        name: "SaleList",
        component: () => import("@/views/sales/SaleList.vue"),
        meta: { requiresAuth: true, module: "hasExits" },
      },
      {
        path: "/sales/create",
        name: "SaleCreate",
        component: () => import("@/views/sales/SaleCreate.vue"),
        meta: { requiresAuth: true, module: "hasExits" },
      },
    ],
  },

  // ─────────────────────────────────────────
  // 4. ONBOARDING (Sin layout, pantalla completa)9
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupRouterGuards(router);

export default router;
