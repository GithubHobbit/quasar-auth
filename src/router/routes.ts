import { RouteRecordRaw } from 'vue-router';
import VueJwtDecode from 'vue-jwt-decode';

function isAuthenticate(): boolean {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return false;
  }
  const payload = VueJwtDecode.decode(token);
  if (payload.exp < Math.round(Date.now() / 1000)) {
    return false;
  }

  return true;
}

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
    children: [
      {
        name: 'profile',
        path: '',
        component: () => import('pages/ProfilePage.vue'),
      },
    ],
    props: { isLogin: isAuthenticate() },
  },
  {
    name: '',
    path: '/auth/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'signup',
        path: '',
        component: () => import('pages/SignUpPage.vue'),
      },
    ],
    props: { isLogin: isAuthenticate() },
  },
  {
    name: '',
    path: '/auth/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
    props: { isLogin: isAuthenticate() },
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
