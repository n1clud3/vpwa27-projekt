<template>
  <q-layout>
      <q-page-container>
        <q-page class="flex flex-center">
          <div class="q-pa-md" style="width: 100%; max-width: 400px">

            <q-card>

              <q-card-section>
                <q-input outlined v-model="username" label="Username" class="q-mb-md" />
                <q-input outlined v-model="password" label="Password" type="password" class="q-mb-md" />
              </q-card-section>

              <q-card-actions align="center">
                <q-btn label="Login" color="primary" class="full-width" no-caps to="/homepage"/>
              </q-card-actions>

            </q-card>

            <div class="q-mt-md flex justify-center items-center">
                <span class="text-grey-7">Don't have an account?</span>
                <q-btn flat color="primary" to="/register" label="Register here" no-caps />
              </div>

          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const username = ref('');
const password = ref('');
</script>