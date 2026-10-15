<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 100%; max-width: 400px">

      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Register</div>
        </q-card-section>

        <q-card-section>
          <q-input dense outlined v-model="firstName" label="First Name" class="q-mb-md" :rules="[val =>(val && val.length >= 3) || 'First Name must be at least 3 characters']"/>
          <q-input dense outlined v-model="lastName" label="Last Name" class="q-mb-md" :rules="[val =>(val && val.length >= 3) || 'Last Name must be at least 3 characters']"/> 
          <q-input dense outlined v-model="nickname" label="Nickname" class="q-mb-md" :rules="[val =>(val && val.length >= 3) || 'Nickname must be at least 3 characters']"/> 
          <q-input dense outlined v-model="email" type="email" label="Email" class="q-mb-md" />
          <q-input dense outlined v-model="password" type="password" label="Password" class="q-mb-md" :rules="[val =>(val && val.length >= 8) || 'Password must be at least 8 characters']" />
          <q-input dense outlined v-model="confirmPassword" type="password" label="Confirm Password" class="q-mb-md" :rules="[val => val === password || 'Passwords do not match']"/>
        </q-card-section>


        <q-card-actions align="center">
          <q-btn label="Register" color="primary" class="full-width" no-caps to="/auth/login" />
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

const firstName = ref('');
const lastName = ref('');
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
</script>