<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="groups" @click="toggleChannelDrawer" />
        <q-toolbar-title> Hejju </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="channelDrawerOpen" side="left" bordered :width="280">
      <!-- drawer content -->
      <channel-list />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue';
import { ref } from 'vue';

const channelDrawerOpen = ref(false);
const toggleChannelDrawer = () => {
  channelDrawerOpen.value = !channelDrawerOpen.value;
};
</script>
