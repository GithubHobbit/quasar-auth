import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({ baseURL: 'https://nest-auth-production.up.railway.app' });
api.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`;
      config.headers['cache-control'] = 'no-cache';
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

async function refreshToken() {
  console.log('refresh');
  return api.post('/auth/refresh_token', {
    refreshToken: localStorage.getItem('refresh_token'),
  });
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const originalConfig = err.config;

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const rs = await refreshToken();
        const { accessToken } = rs.data;
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['x-access-token'] = accessToken;

        return api(originalConfig);
      } catch (_error) {
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data);
        }

        return Promise.reject(_error);
      }
    }
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
