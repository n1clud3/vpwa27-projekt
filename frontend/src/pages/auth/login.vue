<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 100%; max-width: 400px">

      <q-avatar size="90px" class="q-mb-sm shadow-2 block q-mx-auto">
          <img src="../../assets/hejju_logo.jpg" alt="Hejju Logo" style="object-fit: cover;" />
        </q-avatar>

      <q-card>

        
          
        <q-card-section class="text-center q-pb-none">
          
          
          <div class="text-h3 text-weight-bolder text-primary q-mb-xs">
            Hejju
          </div>
        </q-card-section>

        <q-card-section>
          <q-input outlined v-model="inputUsername" label="Username" class="q-mb-md" />
          <q-input outlined v-model="inputPassword" label="Password" type="password" class="q-mb-md" />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Login" color="primary" class="full-width" no-caps @click="handleLogin" />
        </q-card-actions>
      </q-card>
      <div class="q-mt-md flex justify-center items-center">
        <span class="text-grey-7">Don't have an account?</span>
        <q-btn flat color="primary" to="register" label="Register here" no-caps />
      </div>
    </div>
  </q-page>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const inputUsername = ref('');
const inputPassword = ref('');

const router = useRouter();
const authStore = useAuthStore();

async function handleLogin() {
  if (inputUsername.value.trim() === '') return;

  authStore.login(inputUsername.value);

  await router.push('/chat');
}
</script>