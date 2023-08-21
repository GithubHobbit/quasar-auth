<template>
  <q-page class="">
    <div class="row justify-center q-pa-md">
      <div class="col-5">
        <h5>Profile</h5>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
          <q-input filled v-model="name" label="Name" />

          <q-input filled v-model="email" label="Email" />

          <q-input filled v-model="phone" label="Phone" />

          <q-input filled v-model="address" label="Address" />

          <q-list bordered separator danse class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label>DISCLAMER</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn class="col-auto" icon="more_horiz" />
                <q-menu touch-position>
                  <q-item v-close-popup style="max-width: 400px">
                    <q-item-section
                      >Не знал как на странице профиля реализовать полноценный
                      CRUD, т.к. информация о юзере после регистрации уже
                      создана (запись в таблице есть, но поля не заполнены). В
                      таком случае заполнение или очистка полей таблицы users
                      больше подходит под update. Поэтому, для полноценного CRUD
                      я сделал секцию со списком информации "о себе", где
                      реализованы полноценные create и delete</q-item-section
                    >
                  </q-item>
                </q-menu>
              </q-item-section>
            </q-item>

            <q-item v-for="info in arr_info" :key="info.id">
              <q-item-section>
                <q-item-label>{{ info.info }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  color="deep-orange"
                  icon="delete"
                  @click="deleteInfo(info.id)"
                />
              </q-item-section>
            </q-item>

            <q-separator inset />

            <q-item>
              <q-item-section>
                <q-input
                  borderless
                  v-model="new_info"
                  label="-> Input here new info about YOU"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn color="primary" label="ADD" @click="addInfo" />
              </q-item-section>
            </q-item>
          </q-list>

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';

type Info = {
  id: number;
  info: string;
};

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const address = ref('');
    const phone = ref('');
    const arr_info = ref<Info[]>([]);
    const new_info = ref('');
    const $q = useQuasar();

    onBeforeMount(() => {
      api.get('/users/profile').then((result) => {
        email.value = result.data.email;
        name.value = result.data.name;
        phone.value = result.data.phone;
        address.value = result.data.address;
        arr_info.value = result.data.info;
      });
    });

    return {
      name,
      email,
      address,
      phone,
      new_info,
      arr_info,

      addInfo() {
        api
          .post('/users/create_info', { new_info: new_info.value })
          .then((result) => {
            const new_info_obj: Info = {
              id: result.data.id,
              info: result.data.info,
            };
            arr_info.value.push(new_info_obj);
            new_info.value = '';
          });
      },

      deleteInfo(id: number) {
        api.delete('/users/delete_info', { data: { id_info: id } }).then(() => {
          arr_info.value.find((info, i) => {
            if (info.id === id) {
              arr_info.value.splice(i, 1);
              return true;
            }
            return false;
          });
        });
      },

      onSubmit() {
        api
          .put('/users/profile', {
            email: email.value,
            name: name.value,
            address: address.value,
            phone: phone.value,
          })
          .then(() => {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Saved',
            });
          });
      },

      onReset() {
        email.value = '';
        name.value = '';
        phone.value = '';
        address.value = '';
      },
    };
  },
};
</script>
