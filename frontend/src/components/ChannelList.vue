<template>
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
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface Channel {
  id: number,
  name: string,
}

const channels = reactive<Channel[]>([
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
