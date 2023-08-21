import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import jwt_decode from 'jwt-decode';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

interface Token {
  email: string,
  exp: number
}

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    console.log(to.path)
    const publicPages = ['/auth/login', '/auth/signup'];
    const authRequired = !publicPages.includes(to.path);
    if (authRequired) {
      const token = localStorage.getItem('access_token')
      if (!token) {
        return next({name: 'login'})
      }
      const payload = jwt_decode<Token>(token);
      const expTime = payload.exp * 1000;
      const curTime = new Date().getTime();
      
      if (expTime < curTime) {
        return next({name: 'login'})  
      }
    }
    next()
  });

  return Router;
});
