import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import type { Command } from '@/types/commands';

export const useCommandsStore = defineStore('commands', () => {
  const list = ref<Command[]>([]);
  const byName = ref<Record<string, Command>>({});

  function add(cmd: Command) {
    list.value.push(cmd);
    byName.value[cmd.name] = cmd;
  }

  return {
    byName,
    list,
    add,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommandsStore, import.meta.hot));
}
