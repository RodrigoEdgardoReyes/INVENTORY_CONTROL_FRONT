import { createRouter, createWebHistory } from 'vue-router';
import { setupRouterGuards } from './guard';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { public: true },
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('../views/auth/RegisterView.vue'),
  //   meta: { public: true },
  // },
  // {
  //   path: '/onboarding',
  //   name: 'Onboarding',
  //   component: () => import('../views/auth/OnboardingView.vue'),
  //   meta: { requiresAuth: true },
  // },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // component: () => import('../views/dashboard/Dashboard.vue'),
    component: () => import('../views/auth/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
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
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: () => import('../views/settings/Settings.vue'),
  //   meta: { 
  //     requiresAuth: true, 
  //     role: ['OWNER'],
  //   },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupRouterGuards(router);

export default router;