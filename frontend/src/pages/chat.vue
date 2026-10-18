<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="groups" @click="toggleChannelDrawer" />
        <q-toolbar-title> Hejju </q-toolbar-title>

        <q-btn dense flat round icon="notifications" :to="`/chat/notifications`" />

        <!-- Profile Dropdown -->
        <q-btn flat round dense class="q-ml-sm">
          <q-avatar size="36px" color="grey-4" text-color="grey-8">
            <q-icon name="person_outline" size="24px" />
          </q-avatar>

          <!-- Profile Menu -->
          <q-menu class="q-pa-xs" style="min-width: 220px">
            <q-list style="min-width: 200px">
              <!-- User Info Header -->
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
                  <q-item-label caption> @{{ nickname }} </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <!-- Single-Line Status Selection Dropdown -->
              <q-item dense class="q-py-xs">
                <q-item-section avatar min-width="28px">
                  <q-badge rounded :color="statusColor" class="q-pa-xs" />
                </q-item-section>

                <q-item-section>
                  <q-select
                    v-model="userStatus"
                    :options="statusOptions"
                    dense
                    borderless
                    emit-value
                    map-options
                    options-dense
                    style="min-width: 130px"
                  >
                    <!-- Custom option styling inside the dropdown menu -->
                    <template #option="scope">
                      <q-item v-bind="scope.itemProps" dense>
                        <q-item-section avatar min-width="24px">
                          <q-badge rounded :color="scope.opt.color" class="q-pa-xs" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>

              <q-separator class="q-my-xs" />

              <!-- Logout Button -->
              <q-item clickable v-close-popup @click="handleLogout" class="text-negative">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-weight-bold"> Logout </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer: Channels List -->
    <q-drawer show-if-above v-model="channelDrawerOpen" side="left" bordered :width="280">
      <channel-list @toggle-user-drawer="toggleUserDrawer" />
    </q-drawer>

    <!-- Right Drawer: Chat Users Component -->
    <q-drawer v-model="userDrawerOpen" side="right" bordered :width="240">
      <user-list :status="userStatus" :nickname="nickname" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue';
import UserList from '@/components/UserList.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const channelDrawerOpen = ref(false);
const toggleChannelDrawer = () => {
  channelDrawerOpen.value = !channelDrawerOpen.value;
};

const userDrawerOpen = ref(false);
const toggleUserDrawer = () => {
  userDrawerOpen.value = !userDrawerOpen.value;
};

const router = useRouter();
const authStore = useAuthStore();

// Status definitions
export type UserStatus = 'online' | 'dnd' | 'offline';
const userStatus = ref<UserStatus>('online');

const statusOptions = [
  { label: 'Online', value: 'online', color: 'positive' },
  { label: 'Do Not Disturb', value: 'dnd', color: 'negative' },
  { label: 'Offline', value: 'offline', color: 'grey-6' },
];

// Dynamically matches badge color to active status
const statusColor = computed(() => {
  const found = statusOptions.find((opt) => opt.value === userStatus.value);
  return found ? found.color : 'positive';
});

const nickname = ref(authStore.username ? `${authStore.username}_dev` : 'user_nick');

async function handleLogout() {
  authStore.logout();
  await router.push('/auth/login');
}
</script>
