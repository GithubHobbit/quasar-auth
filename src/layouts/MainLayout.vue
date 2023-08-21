<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Auth App </q-toolbar-title>
        <template v-if="isLogin">
          <q-btn flat :to="{ name: 'profile' }">Profile</q-btn>
          <q-btn flat @click="logout()">Logout</q-btn>
        </template>
        <div v-else>
          <q-btn flat :to="{ name: 'signup' }">Sign Up</q-btn>
          <q-btn flat :to="{ name: 'login' }">Sign In</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isLogin: Boolean,
});

const router = useRouter();
const $q = useQuasar();
const { isLogin } = toRefs(props);

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Saved',
  });
  router.push({ name: 'login' });
}
</script>
