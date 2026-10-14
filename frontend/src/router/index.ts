import { defineRouter } from '#q-app';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useAuthStore } from '../stores/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.path.startsWith('/chat') && !authStore.isAuthenticated) {
      next('/auth/login');
    } else if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
      next('/chat');
    } else {
      next();
    }
  });

  // enable HMR for it
  if (import.meta.hot) {
    handleHotUpdate(Router);
  }

  return Router;
});
