<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleChannelsDrawer" />
        <q-toolbar-title>
          Hejju
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="channelDrawerOpen" side="left" bordered :width="280">
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <div class="text-subtitle2 text-grey-7 text-uppercase q-mb-sm">
            Channels
          </div>

          <q-list>
            <q-item v-for="channel in channels" :key="channel.id" :to="`/chat/${channel.id}`" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="tag" />
              </q-item-section>
              <q-item-section>{{ channel.name }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const channelDrawerOpen = ref(false)
const toggleChannelsDrawer = () => {
  channelDrawerOpen.value = !channelDrawerOpen.value
}

interface Channel {
  id: number,
  name: string,
}

const channels: Channel[] = reactive([
  {
    id: 1,
    name: "goober 1"
  },
  {
    id: 2,
    name: "goober 2"
  },
  {
    id: 3,
    name: "goober 3"
  },
])
</script>
