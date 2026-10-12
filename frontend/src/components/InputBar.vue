<!-- src/components/InputBar.vue -->
<template>
  <q-input
    v-model="text"
    standout="bg-primary text-white"
    dense
    autofocus
    placeholder="Message or /command"
    :disable="disable"
    @keydown.enter.exact.prevent="submit"
  >
    <template #prepend>
      <q-icon :name="isCommand ? 'terminal' : 'chat'" />
    </template>

    <template #append>
      <q-btn round flat dense icon="send" :disable="!text.trim() || disable" @click="submit" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineProps<{ disable?: boolean }>();

const emit = defineEmits<{
  (e: 'send', message: string): void;
  (e: 'command', name: string, args: string[]): void;
}>();

const text = ref('');
const isCommand = computed(() => text.value.startsWith('/'));

function submit() {
  const value = text.value.trim();
  if (!value) return;

  if (value.startsWith('/')) {
    const [name, ...args] = value.slice(1).split(/\s+/);
    emit('command', name!.toLowerCase(), args);
  } else {
    emit('send', value);
  }
  text.value = '';
}
</script>
