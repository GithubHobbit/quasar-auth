import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    redirect: '/user/profile',
  },
  {
    name: '',
    path: '/user/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'profile', path: '', component: () => import('pages/ProfilePage.vue') }],
  },
  {
    name: '',
    path: '/auth/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'signup', path: '', component: () => import('pages/SignUpPage.vue') }],
  },
  {
    name: '',
    path: '/auth/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'login', path: '', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
