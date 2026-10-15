<template>
  <q-page padding class="page">
    <div class="messages text-subtitle2 text-grey-7">Select a channel to begin chatting.</div>
    <input-bar />
  </q-page>
</template>

<style lang="css" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>

<script setup lang="ts">
import InputBar from '@/components/InputBar.vue';
</script>
