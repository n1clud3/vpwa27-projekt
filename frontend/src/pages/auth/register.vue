<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 100%; max-width: 400px">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Register</div>
        </q-card-section>

        <q-card-section>
          <q-input
            dense
            outlined
            v-model="firstName"
            label="First Name"
            class="q-mb-md"
            :rules="[
              (val) => (val && val.length >= 3) || 'First Name must be at least 3 characters',
            ]"
          />
          <q-input
            dense
            outlined
            v-model="lastName"
            label="Last Name"
            class="q-mb-md"
            :rules="[
              (val) => (val && val.length >= 3) || 'Last Name must be at least 3 characters',
            ]"
          />
          <q-input
            dense
            outlined
            v-model="nickname"
            label="Nickname"
            class="q-mb-md"
            :rules="[
              (val) =>
                /^[a-zA-Z0-9_]{3,30}$/.test(val || '') ||
                'Nickname: 3-30 characters, letters, digits and _ only',
            ]"
          />
          <q-input
            dense
            outlined
            v-model="email"
            type="email"
            label="Email"
            class="q-mb-md"
            :rules="[(val) => (val && val.includes('@')) || 'Email must contain an @ character']"
          />
          <q-input
            dense
            outlined
            v-model="password"
            type="password"
            label="Password"
            class="q-mb-md"
            :rules="[(val) => (val && val.length >= 8) || 'Password must be at least 8 characters']"
          />
          <q-input
            dense
            outlined
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            class="q-mb-md"
            :rules="[(val) => val === password || 'Passwords do not match']"
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            no-caps
            :loading="loading"
            @click="handleRegister"
          />
        </q-card-actions>
      </q-card>

      <div class="q-mt-md flex justify-center items-center">
        <span class="text-grey-7">Already have an account?</span>
        <q-btn flat color="primary" to="login" label="Login here" no-caps />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth';
import { errorMessage } from '../../api/client';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Passwords do not match' });
    return;
  }

  loading.value = true;
  try {
    await authStore.register({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      nickName: nickname.value.trim(),
      email: email.value.trim(),
      password: password.value,
      passwordConfirmation: confirmPassword.value,
    });
    await router.push('/chat');
  } catch (error) {
    $q.notify({ type: 'negative', message: errorMessage(error) });
  } finally {
    loading.value = false;
  }
}
</script>
