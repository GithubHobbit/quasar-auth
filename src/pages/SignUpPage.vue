<template>
  <q-page class="">
    <div class="row justify-center q-pa-md">
      <div class="col-5">
        <h5>Sign Up</h5>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
          <q-input
            filled
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please, type email']"
          />

          <q-input
            filled
            v-model="password"
            label="Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please, type password',
            ]"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            ></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default {
  setup() {
    const $q = useQuasar();
    const email = ref(null);
    const password = ref(null);
    const router = useRouter();

    return {
      email,
      password,

      onSubmit() {
        console.log('touched');
        api
          .post('/auth/signup', {
            email: email.value,
            password: password.value,
          })
          .then(() => {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Signup successfull',
            });
            router.push({ name: 'login' });
          });
      },

      onReset() {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>
