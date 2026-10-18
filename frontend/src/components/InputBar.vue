<template>
  <q-list v-if="isCommand">
    <q-item v-for="command in commands.list" :key="command.name" class="command-entry">
      <span class="text-bold name">/{{ command.name }}</span>
      <span v-for="param in command.params" :key="param.name" class="param"> {{ param.name }}</span>
      <span class="desc">{{ command.description }}</span>
    </q-item>
  </q-list>

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
import { useCommandsStore } from '@/stores/commands';

const commands = useCommandsStore();

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

<style lang="scss" scoped>
.command-entry {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: start;
  gap: 0.5rem;

  font-family: 'Roboto Mono', monospace;

  .param,
  .name,
  .desc {
    padding: 5px 10px;
  }

  .param {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>
