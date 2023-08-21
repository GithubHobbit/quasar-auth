<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Auth App
        </q-toolbar-title>
        <template v-if="isAuthenticate()">
          <q-btn flat :to="{name: 'signup'}">Sign Up</q-btn>
          <q-btn flat :to="{name: 'login'}">Sign In</q-btn>
        </template>
        <div v-else>
          <q-btn flat :to="{name: 'profile'}">Profile</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueJwtDecode from "vue-jwt-decode";

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {
      isAuthenticate(): boolean {
        const token = localStorage.getItem('access_token');
        if (!token) 
          return false;
        const payload = VueJwtDecode.decode(token)
        if (payload.exp > Math.round(Date.now() / 1000)) {
          return false;
        }

        return true;
      }
    }
  }

});
</script>
