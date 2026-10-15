<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="groups" @click="toggleChannelDrawer" />
        <q-toolbar-title> Hejju </q-toolbar-title>

        <!-- Profile -->
        <q-btn flat round dense class="q-ml-sm">
          <q-avatar size="36px" color="grey-4" text-color="grey-8">
            <q-icon name="person_outline" size="24px" />
          </q-avatar>

          <!-- Menu -->
          <q-menu class="q-pa-xs" style="min-width: 220px">
            <q-list style="min-width: 200px">
              
              <!-- info about user -->
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="40px" color="grey-3" text-color="grey-8">
                    <q-icon name="person_outline" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ authStore.username || 'User' }}
                  </q-item-label>
                  <q-item-label caption>
                    @{{ nickname }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <!-- status, will need to implement later the function..-->
              <q-item>
                <q-item-section>
                  <q-item-label>Status</q-item-label>
                  <q-item-label caption class="text-capitalize">
                    {{ isOnline ? 'Online' : 'Offline' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle 
                    v-model="isOnline" 
                    color="positive" 
                    keep-color
                  />
                </q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <!-- Logout Button -->
              <q-item clickable v-close-popup @click="handleLogout" class="text-negative">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-weight-bold">
                  Logout
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>


      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="channelDrawerOpen" side="left" bordered :width="280">
      <!-- drawer content -->
      <channel-list />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <input-bar />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue';
import InputBar from '@/components/InputBar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const channelDrawerOpen = ref(false);
const toggleChannelDrawer = () => {
  channelDrawerOpen.value = !channelDrawerOpen.value;
};

const router = useRouter();
const authStore = useAuthStore();

const isOnline = ref(true);
const nickname = ref(authStore.username ? `${authStore.username}_dev` : 'user_nick');

async function handleLogout() {
  authStore.logout();
  await router.push('/auth/login');
}

</script>
